/**
 * Utility for detecting and redacting sensitive information from documents
 * Uses regex patterns for small documents (1-5 pages) and more sophisticated
 * analysis for larger documents.
 */

export interface SensitiveDataPattern
{
    name: string;
    description: string;
    pattern: RegExp;
    replacement: string;
    confidence: number; // 0-1, higher means more confident it's actually sensitive
}

export interface RedactionResult
{
    redactedText: string;
    originalText?: string; // Store original text for PDF processing
    detectedItems: Array<{
        type: string;
        description: string;
        originalValue: string;
        redactedValue: string;
        position: { start: number; end: number };
        confidence: number;
    }>;
    totalRedactions: number;
}

// Common sensitive data patterns
export const SENSITIVE_DATA_PATTERNS: SensitiveDataPattern[] = [
    // Social Security Numbers (improved pattern)
    {
        name: "ssn",
        description: "Social Security Number",
        pattern: /\b(?:SSN:?\s*)?\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/gi,
        replacement: "***-**-****",
        confidence: 0.9,
    },
    
    // Credit Card Numbers (basic pattern - 13-19 digits)
    {
        name: "credit_card",
        description: "Credit Card Number", 
        pattern: /\b(?:\d{4}[-.\s]?){3,4}\d{1,4}\b/g,
        replacement: "****-****-****-****",
        confidence: 0.8,
    },
    
    // Phone Numbers (US format)
    {
        name: "phone",
        description: "Phone Number",
        pattern: /\b(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/g,
        replacement: "(***) ***-****",
        confidence: 0.7,
    },
    
    // Email Addresses
    {
        name: "email",
        description: "Email Address",
        pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        replacement: "****@****.***",
        confidence: 0.9,
    },
    
    // Driver's License Numbers (varies by state, general pattern)
    {
        name: "drivers_license",
        description: "Driver's License Number",
        pattern: /\b(?:[A-Z]{1,2}\d{6,8}|\d{8,9}|[A-Z]\d{7})\b/g,
        replacement: "********",
        confidence: 0.6,
    },
    
    // Bank Account Numbers (8-17 digits)
    {
        name: "bank_account",
        description: "Bank Account Number",
        pattern: /\b\d{8,17}\b/g,
        replacement: "************",
        confidence: 0.5,
    },
    
    // Passport Numbers (US format)
    {
        name: "passport",
        description: "Passport Number",
        pattern: /\b[0-9]{9}\b/g,
        replacement: "*********",
        confidence: 0.6,
    },
    
    // Tax ID / EIN Numbers
    {
        name: "tax_id",
        description: "Tax ID/EIN Number",
        pattern: /\b\d{2}[-.\s]?\d{7}\b/g,
        replacement: "**-*******",
        confidence: 0.8,
    },
    
    // IP Addresses
    {
        name: "ip_address",
        description: "IP Address",
        pattern: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g,
        replacement: "***.***.***.***",
        confidence: 0.7,
    },
    
    // MAC Addresses
    {
        name: "mac_address", 
        description: "MAC Address",
        pattern: /\b(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}\b/g,
        replacement: "**:**:**:**:**:**",
        confidence: 0.8,
    },
    
    // Account Numbers (more specific pattern)
    {
        name: "account_number",
        description: "Account Number",
        pattern: /\b(?:Account(?:\s+(?:Number|No\.?|#))?:?\s*)?\d{10,16}\b/gi,
        replacement: "************",
        confidence: 0.7,
    },
    
    // Date patterns that could be sensitive
    {
        name: "date_pattern",
        description: "Potential Date",
        pattern: /\b(?:0?[1-9]|1[0-2])[-/.](?:0?[1-9]|[12]\d|3[01])[-/.](?:19|20)?\d{2}\b/g,
        replacement: "**/**/****",
        confidence: 0.4,
    },
];

/**
 * Enhanced patterns that require more context or validation
 */
export const CONTEXTUAL_PATTERNS: SensitiveDataPattern[] = [
    // Addresses (basic pattern - needs more context)
    {
        name: "address",
        description: "Street Address",
        pattern: /\b\d+\s+[A-Za-z\s,.-]+(?:Street|St|Avenue|Ave|Road|Rd|Lane|Ln|Drive|Dr|Boulevard|Blvd|Court|Ct|Place|Pl)\b/gi,
        replacement: "[ADDRESS REDACTED]",
        confidence: 0.6,
    },
    
    // Date of Birth patterns
    {
        name: "date_of_birth",
        description: "Date of Birth",
        pattern: /\b(?:DOB|Date of Birth|Born)[:\s]*(?:0?[1-9]|1[0-2])[-/.](?:0?[1-9]|[12]\d|3[01])[-/.](?:19|20)\d{2}\b/gi,
        replacement: "DOB: **/**/****",
        confidence: 0.8,
    },
];

/**
 * Detect and redact sensitive information from text
 */
export function detectAndRedactSensitiveData(
    text: string, 
    options: {
        pageCount?: number;
        useContextualPatterns?: boolean;
        confidenceThreshold?: number;
        customPatterns?: SensitiveDataPattern[];
    } = {}
): RedactionResult
{
    const {
        pageCount = 1,
        useContextualPatterns = false,
        confidenceThreshold = 0.6,
        customPatterns = [],
    } = options;

    // For small documents (1-5 pages), use regex-based approach
    if (pageCount <= 5)
    {
        return regexBasedRedaction(text, {
            useContextualPatterns,
            confidenceThreshold,
            customPatterns,
        });
    }
    
    // For larger documents, use more sophisticated approach
    return vectorBasedRedaction(text, {
        confidenceThreshold,
        customPatterns,
    });
}

/**
 * Regex-based redaction for smaller documents
 */
function regexBasedRedaction(
    text: string,
    options: {
        useContextualPatterns?: boolean;
        confidenceThreshold?: number;
        customPatterns?: SensitiveDataPattern[];
    }
): RedactionResult
{
    const { useContextualPatterns = false, confidenceThreshold = 0.6, customPatterns = [] } = options;
    
    const detectedItems: RedactionResult["detectedItems"] = [];
    const seenItems = new Set<string>(); // Track unique items to avoid duplicates
    
    // Combine all patterns to use
    const patterns = [
        ...SENSITIVE_DATA_PATTERNS,
        ...(useContextualPatterns ? CONTEXTUAL_PATTERNS : []),
        ...customPatterns,
    ].filter(pattern => pattern.confidence >= confidenceThreshold);
    
    // Collect all matches first
    for (const pattern of patterns)
    {
        const matches = Array.from(text.matchAll(pattern.pattern));
        
        for (const match of matches)
        {
            if (match[0] && match.index !== undefined)
            {
                // Create unique key for this match (pattern + value + position)
                const uniqueKey = `${pattern.name}:${match[0]}:${match.index}`;
                
                // Skip if we've already seen this exact match
                if (seenItems.has(uniqueKey)) {
                    continue;
                }
                
                // Additional validation for certain patterns
                if (shouldRedactMatch(match[0], pattern))
                {
                    seenItems.add(uniqueKey);
                    detectedItems.push({
                        type: pattern.name,
                        description: pattern.description,
                        originalValue: match[0],
                        redactedValue: pattern.replacement,
                        position: { start: match.index, end: match.index + match[0].length },
                        confidence: pattern.confidence,
                    });
                }
            }
        }
    }
    
    // Sort detectedItems by position (descending) so we replace from end to start
    // This prevents position shifts from affecting later replacements
    detectedItems.sort((a, b) => b.position.start - a.position.start);
    
    // Apply replacements to create redacted text
    let redactedText = text;
    for (const item of detectedItems) {
        const before = redactedText.substring(0, item.position.start);
        const after = redactedText.substring(item.position.end);
        redactedText = before + item.redactedValue + after;
    }
    
    return {
        redactedText,
        originalText: text, // Store original text for reference
        detectedItems,
        totalRedactions: detectedItems.length,
    };
}

/**
 * Vector/ML-based redaction for larger documents
 * This is a placeholder for more sophisticated analysis that could use:
 * - Named Entity Recognition (NER)
 * - Context analysis
 * - Machine learning models for better accuracy
 */
function vectorBasedRedaction(
    text: string,
    options: {
        confidenceThreshold?: number;
        customPatterns?: SensitiveDataPattern[];
    }
): RedactionResult
{
    // For now, fall back to regex-based approach with enhanced patterns
    // In a real implementation, this could use:
    // - Web Workers for performance
    // - WASM-based ML models
    // - More sophisticated NLP libraries
    
    console.log("[Redaction] Using enhanced pattern matching for large document");
    
    return regexBasedRedaction(text, {
        useContextualPatterns: true,
        ...options,
    });
}

/**
 * Additional validation for certain matches to reduce false positives
 */
function shouldRedactMatch(match: string, pattern: SensitiveDataPattern): boolean
{
    switch (pattern.name)
    {
        case "ssn":
            // Validate SSN format and reject common invalid patterns
            const ssnDigits = match.replace(/\D/g, "");
            if (ssnDigits === "000000000" || ssnDigits === "123456789")
            {
                return false;
            }
            // Reject if first 3 digits are 000, 666, or 900-999
            const area = parseInt(ssnDigits.substring(0, 3));
            if (area === 0 || area === 666 || area >= 900)
            {
                return false;
            }
            return true;
            
        case "credit_card":
            // Use Luhn algorithm to validate credit card numbers
            const cardDigits = match.replace(/\D/g, "");
            return isValidCreditCard(cardDigits);
            
        case "phone":
            // Reject common invalid phone patterns
            const phoneDigits = match.replace(/\D/g, "");
            if (phoneDigits === "0000000000" || phoneDigits === "1234567890")
            {
                return false;
            }
            return true;
            
        case "email":
            // Basic email validation beyond regex
            return match.includes(".") && !match.startsWith(".") && !match.endsWith(".");
            
        default:
            return true;
    }
}

/**
 * Luhn algorithm for credit card validation
 */
function isValidCreditCard(cardNumber: string): boolean
{
    if (!/^\d+$/.test(cardNumber) || cardNumber.length < 13 || cardNumber.length > 19)
    {
        return false;
    }
    
    let sum = 0;
    let alternate = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--)
    {
        let n = parseInt(cardNumber.charAt(i));
        
        if (alternate)
        {
            n *= 2;
            if (n > 9)
            {
                n = (n % 10) + 1;
            }
        }
        
        sum += n;
        alternate = !alternate;
    }
    
    return sum % 10 === 0;
}

/**
 * Get redaction statistics and summary
 */
export function getRedactionSummary(result: RedactionResult): string
{
    if (result.totalRedactions === 0)
    {
        return "No sensitive information detected.";
    }
    
    const typeCount = result.detectedItems.reduce((acc, item) =>
    {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    
    const summaryParts = Object.entries(typeCount).map(([type, count]) =>
    {
        const pattern = SENSITIVE_DATA_PATTERNS.find(p => p.name === type) || 
                      CONTEXTUAL_PATTERNS.find(p => p.name === type);
        const description = pattern?.description || type;
        return `${count} ${description}${count > 1 ? "s" : ""}`;
    });
    
    return `Redacted ${result.totalRedactions} items: ${summaryParts.join(", ")}`;
}