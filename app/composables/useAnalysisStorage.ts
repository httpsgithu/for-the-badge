import { ref, onMounted, onUnmounted } from "vue";

const STORAGE_KEY = "ftb_analysis_backup";
const EXPIRY_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

export interface StoredAnalysis {
    analysisResult: Record<string, unknown>;
    documentUrl: string;
    documentText: string;
    fileName: string;
    documentType: string;
    pricingInfo: Record<string, unknown> | null;
    expiresAt: number;
    storedAt: number;
}

export function useAnalysisStorage()
{
    const storedAnalysis = ref<StoredAnalysis | null>(null);
    const timeRemaining = ref<number>(0);
    const isExpired = ref<boolean>(false);

    let intervalId : ReturnType<typeof setInterval> | null = null;

    /**
     * Save analysis data to sessionStorage with expiry timestamp
     */
    function saveAnalysis(data : Omit<StoredAnalysis, "expiresAt" | "storedAt">) : void
    {
        if (!import.meta.client)
        {
            return;
        }

        const now = Date.now();
        const storage : StoredAnalysis = {
            ...data,
            storedAt: now,
            expiresAt: now + EXPIRY_DURATION,
        };

        try
        {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
            storedAnalysis.value = storage;
            updateTimeRemaining();
        }
        catch (error)
        {
            console.error("[AnalysisStorage] Failed to save analysis:", error);
        }
    }

    /**
     * Load analysis data from sessionStorage if it exists and hasn't expired
     */
    function loadAnalysis() : StoredAnalysis | null
    {
        if (!import.meta.client)
        {
            return null;
        }

        try
        {
            const stored = sessionStorage.getItem(STORAGE_KEY);
            if (!stored)
            {
                return null;
            }

            const data : StoredAnalysis = JSON.parse(stored);
            const now = Date.now();

            // Check if expired
            if (now >= data.expiresAt)
            {
                clearAnalysis();
                isExpired.value = true;

                return null;
            }

            storedAnalysis.value = data;
            updateTimeRemaining();

            return data;
        }
        catch (error)
        {
            console.error("[AnalysisStorage] Failed to load analysis:", error);
            clearAnalysis();

            return null;
        }
    }

    /**
     * Clear stored analysis from sessionStorage
     */
    function clearAnalysis() : void
    {
        if (!import.meta.client)
        {
            return;
        }

        try
        {
            sessionStorage.removeItem(STORAGE_KEY);
            storedAnalysis.value = null;
            timeRemaining.value = 0;
            isExpired.value = false;
        }
        catch (error)
        {
            console.error("[AnalysisStorage] Failed to clear analysis:", error);
        }
    }

    /**
     * Update the time remaining until expiry
     */
    function updateTimeRemaining() : void
    {
        if (!storedAnalysis.value)
        {
            timeRemaining.value = 0;

            return;
        }

        const now = Date.now();
        const remaining = storedAnalysis.value.expiresAt - now;

        if (remaining <= 0)
        {
            clearAnalysis();
            isExpired.value = true;
            timeRemaining.value = 0;
        }
        else
        {
            timeRemaining.value = remaining;
            isExpired.value = false;
        }
    }

    /**
     * Format time remaining as MM:SS
     */
    function formatTimeRemaining() : string
    {
        const seconds = Math.floor(timeRemaining.value / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }

    /**
     * Check if there's a stored analysis available
     */
    function hasStoredAnalysis() : boolean
    {
        return storedAnalysis.value != null && !isExpired.value;
    }

    /**
     * Start the countdown timer
     */
    function startTimer() : void
    {
        if (intervalId)
        {
            return;
        }

        // Update immediately
        updateTimeRemaining();

        // Then update every second
        intervalId = setInterval(() =>
        {
            updateTimeRemaining();
        }, 1000);
    }

    /**
     * Stop the countdown timer
     */
    function stopTimer() : void
    {
        if (intervalId)
        {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    onMounted(() =>
    {
        if (import.meta.client)
        {
            loadAnalysis();
            if (hasStoredAnalysis())
            {
                startTimer();
            }
        }
    });

    onUnmounted(() =>
    {
        stopTimer();
    });

    return {
        // State
        storedAnalysis,
        timeRemaining,
        isExpired,

        // Methods
        saveAnalysis,
        loadAnalysis,
        clearAnalysis,
        hasStoredAnalysis,
        formatTimeRemaining,
        startTimer,
        stopTimer,
    };
}