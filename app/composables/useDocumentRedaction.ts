import { ref, reactive } from "vue";
import { 
    detectAndRedactSensitiveData, 
    getRedactionSummary, 
    SENSITIVE_DATA_PATTERNS, 
    CONTEXTUAL_PATTERNS,
    type RedactionResult, 
    type SensitiveDataPattern 
} from "~/utils/sensitiveDataDetection";

export interface RedactionSettings
{
    enabled: boolean;
    autoRedact: boolean;
    confidenceThreshold: number;
    enabledPatterns: string[];
    useContextualPatterns: boolean;
    showPreview: boolean;
}

export interface DocumentRedactionState
{
    isRedacting: boolean;
    lastRedactionResult: RedactionResult | null;
    settings: RedactionSettings;
    previewText: string;
    showRedactionModal: boolean;
}

const DEFAULT_REDACTION_SETTINGS: RedactionSettings = {
    enabled: true,
    autoRedact: false, // User must confirm redactions
    confidenceThreshold: 0.7,
    enabledPatterns: [
        "ssn",
        "credit_card", 
        "email",
        "phone",
        "tax_id",
        "bank_account",
    ],
    useContextualPatterns: false,
    showPreview: true,
};

export const useDocumentRedaction = () =>
{
    const state = reactive<DocumentRedactionState>({
        isRedacting: false,
        lastRedactionResult: null,
        settings: { ...DEFAULT_REDACTION_SETTINGS },
        previewText: "",
        showRedactionModal: false,
    });

    /**
     * Process a document for redaction before upload
     */
    const processDocumentForRedaction = async (
        text: string, 
        pageCount: number = 1,
        fileName: string = "document"
    ): Promise<{
        shouldRedact: boolean;
        redactionResult: RedactionResult | null;
        processedText: string;
    }> =>
    {
        if (!state.settings.enabled)
        {
            return {
                shouldRedact: false,
                redactionResult: null,
                processedText: text,
            };
        }

        state.isRedacting = true;

        try
        {
            // Filter patterns based on user settings
            const enabledCustomPatterns = [
                ...SENSITIVE_DATA_PATTERNS,
                ...(state.settings.useContextualPatterns ? CONTEXTUAL_PATTERNS : []),
            ].filter(pattern => state.settings.enabledPatterns.includes(pattern.name));

            const redactionResult = detectAndRedactSensitiveData(text, {
                pageCount,
                useContextualPatterns: state.settings.useContextualPatterns,
                confidenceThreshold: state.settings.confidenceThreshold,
                customPatterns: enabledCustomPatterns,
            });

            state.lastRedactionResult = redactionResult;

            // If no sensitive data found, proceed normally
            if (!redactionResult || redactionResult.totalRedactions === 0)
            {
                return {
                    shouldRedact: false,
                    redactionResult: redactionResult || null,
                    processedText: text,
                };
            }

            // If auto-redact is enabled, return redacted text immediately
            if (state.settings.autoRedact)
            {
                return {
                    shouldRedact: true,
                    redactionResult,
                    processedText: redactionResult.redactedText,
                };
            }

            // Otherwise, show preview and require user confirmation
            state.previewText = redactionResult.redactedText;
            state.showRedactionModal = state.settings.showPreview;

            return {
                shouldRedact: true,
                redactionResult,
                processedText: text, // Return original text for now, user will decide
            };
        }
        finally
        {
            state.isRedacting = false;
        }
    };

    /**
     * Apply redactions after user confirmation
     */
    const applyRedactions = (): string =>
    {
        if (!state.lastRedactionResult)
        {
            throw new Error("No redaction result available");
        }

        return state.lastRedactionResult.redactedText;
    };

    /**
     * Cancel redactions and return original text
     */
    const cancelRedactions = (): void =>
    {
        state.lastRedactionResult = null;
        state.previewText = "";
        state.showRedactionModal = false;
    };

    /**
     * Update redaction settings
     */
    const updateSettings = (newSettings: Partial<RedactionSettings>): void =>
    {
        Object.assign(state.settings, newSettings);
    };

    /**
     * Get available patterns for user configuration
     */
    const getAvailablePatterns = (): Array<{ name: string; description: string; category: string }> =>
    {
        return [
            ...SENSITIVE_DATA_PATTERNS.map(p => ({ ...p, category: "standard" })),
            ...CONTEXTUAL_PATTERNS.map(p => ({ ...p, category: "contextual" })),
        ];
    };

    /**
     * Test redaction on sample text
     */
    const testRedaction = (sampleText: string): RedactionResult =>
    {
        const enabledCustomPatterns = [
            ...SENSITIVE_DATA_PATTERNS,
            ...(state.settings.useContextualPatterns ? CONTEXTUAL_PATTERNS : []),
        ].filter(pattern => state.settings.enabledPatterns.includes(pattern.name));

        return detectAndRedactSensitiveData(sampleText, {
            pageCount: 1,
            useContextualPatterns: state.settings.useContextualPatterns,
            confidenceThreshold: state.settings.confidenceThreshold,
            customPatterns: enabledCustomPatterns,
        });
    };

    /**
     * Get redaction statistics
     */
    const getRedactionStats = () =>
    {
        if (!state.lastRedactionResult)
        {
            return null;
        }

        return {
            totalRedactions: state.lastRedactionResult.totalRedactions,
            summary: getRedactionSummary(state.lastRedactionResult),
            detectedItems: state.lastRedactionResult.detectedItems,
        };
    };

    /**
     * Reset redaction state
     */
    const resetRedactionState = (): void =>
    {
        state.lastRedactionResult = null;
        state.previewText = "";
        state.showRedactionModal = false;
        state.isRedacting = false;
    };

    /**
     * Save settings to localStorage
     */
    const saveSettings = (): void =>
    {
        // Only access localStorage on client-side
        if (import.meta.client && typeof window !== 'undefined' && window.localStorage)
        {
            try
            {
                localStorage.setItem("ftb_redaction_settings", JSON.stringify(state.settings));
            }
            catch (error)
            {
                // Settings save failed silently
            }
        }
    };

    /**
     * Load settings from localStorage
     */
    const loadSettings = (): void =>
    {
        // Only access localStorage on client-side
        if (import.meta.client && typeof window !== 'undefined' && window.localStorage)
        {
            try
            {
                const saved = localStorage.getItem("ftb_redaction_settings");
                if (saved)
                {
                    const parsedSettings = JSON.parse(saved) as Partial<RedactionSettings>;
                    Object.assign(state.settings, parsedSettings);
                }
            }
            catch (error)
            {
                // Reset to defaults on error
                Object.assign(state.settings, DEFAULT_REDACTION_SETTINGS);
            }
        }
    };

    /**
     * Get redaction warning message for user
     */
    const getRedactionWarning = (): string | null =>
    {
        if (!state.lastRedactionResult || state.lastRedactionResult.totalRedactions === 0)
        {
            return null;
        }

        const stats = getRedactionStats();
        return `⚠️ Sensitive information detected: ${stats?.summary}\n\nWould you like to redact this information before uploading?`;
    };

    // Load settings on composable creation (client-side only)
    if (import.meta.client)
    {
        loadSettings();
    }

    return {
        // State
        state: readonly(state),
        
        // Core functions
        processDocumentForRedaction,
        applyRedactions,
        cancelRedactions,
        resetRedactionState,
        
        // Settings management
        updateSettings,
        saveSettings,
        loadSettings,
        getAvailablePatterns,
        
        // Utilities
        testRedaction,
        getRedactionStats,
        getRedactionWarning,
    };
};