/**
 * Confidence score calculation utilities - Server-side version
 * Mirrors the client-side functionality for server-side analysis
 */

export function calculateConfidenceScore(analysis: any, documentType: string = "general"): number {
    // Start with a more optimistic base score
    let baseScore = 65;

    const textQualityBonus = calculateTextQualityScore(analysis);
    baseScore += textQualityBonus;

    const keyPointsBonus = calculateKeyPointsScore(analysis.keyPoints);
    baseScore += keyPointsBonus;

    const confidenceBonus = calculateConfidenceFactorsScore(analysis.confidenceFactors || []);
    baseScore += confidenceBonus;

    const redFlagPenalty = calculateRedFlagPenalty(analysis.redFlags);
    baseScore -= redFlagPenalty;

    const typeAdjustment = calculateTypeAdjustment(documentType, analysis);
    baseScore += typeAdjustment;

    // Add randomness to make scores more realistic and varied (±3 points)
    const randomVariation = Math.floor(Math.random() * 7) - 3;
    baseScore += randomVariation;

    return Math.max(15, Math.min(92, Math.round(baseScore)));
}

function calculateTextQualityScore(analysis: any): number {
    const summaryLength = analysis.summary?.length || 0;
    const keyPointsCount = analysis.keyPoints?.length || 0;
    
    let score = 0;
    
    // Summary quality bonus
    if (summaryLength < 50) {
        score -= 8;
    } else if (summaryLength > 200) {
        score += 12;
    } else if (summaryLength > 100) {
        score += 8;
    } else {
        score += 3;
    }
    
    // Content richness bonus (more analysis = higher confidence)
    if (keyPointsCount > 8) {
        score += 5;
    } else if (keyPointsCount > 5) {
        score += 3;
    }
    
    return score;
}

function calculateKeyPointsScore(keyPoints: any[]): number {
    if (!keyPoints || keyPoints.length === 0) {
        return -12;
    }

    let score = Math.min(keyPoints.length * 2.5, 18);

    // Bonus for well-structured points with raw text evidence
    const structuredPoints = keyPoints.filter((point: any) => typeof point === "object" && point.rawText);
    if (structuredPoints.length > 0) {
        score += Math.min(structuredPoints.length * 1.5, 8);
    }
    
    // Bonus for comprehensive analysis (more key points generally means more thorough)
    if (keyPoints.length >= 10) {
        score += 4;
    } else if (keyPoints.length >= 6) {
        score += 2;
    }

    return Math.round(score);
}

function calculateConfidenceFactorsScore(confidenceFactors: string[]): number {
    if (!confidenceFactors || confidenceFactors.length === 0) {
        return -5;
    }

    let score = 0;
    confidenceFactors.forEach((factor: string) => {
        const factorLower = factor.toLowerCase();
        if (factorLower.includes("clear") || factorLower.includes("standard") || factorLower.includes("complete")) {
            score += 5;
        } else if (factorLower.includes("unclear") || factorLower.includes("incomplete") || factorLower.includes("error")) {
            score -= 8;
        }
    });

    return Math.max(-15, Math.min(15, score));
}

function calculateRedFlagPenalty(redFlags: any[]): number {
    if (!redFlags || redFlags.length === 0) {
        return 0;
    }

    let penalty = 0;
    const severityPenalties: { [key: string]: number } = {
        critical: 20,
        dangerous: 15,
        unfair: 12,
        illegal: 25,
        concerning: 10,
        unusual: 6,
        avoid: 18,
        risky: 8,
    };

    redFlags.forEach((flag: any) => {
        const flagText = typeof flag === "string" ? flag : flag.summary;
        const flagLower = flagText?.toLowerCase() || "";

        let maxPenalty = 5;
        Object.entries(severityPenalties).forEach(([keyword, penaltyValue]) => {
            if (flagLower.includes(keyword)) {
                maxPenalty = Math.max(maxPenalty, penaltyValue);
            }
        });
        penalty += maxPenalty;
    });

    return Math.min(penalty, 40);
}

function calculateTypeAdjustment(documentType: string, analysis: any): number {
    const typeAdjustments: { [key: string]: { baseAdjustment: number; riskFactors: string[] } } = {
        employment: { baseAdjustment: -5, riskFactors: ["termination", "non-compete"] },
        lease: { baseAdjustment: 0, riskFactors: ["deposit", "maintenance"] },
        purchase: { baseAdjustment: 5, riskFactors: ["warranty", "return"] },
    };

    const adjustment = typeAdjustments[documentType.toLowerCase()];
    if (!adjustment) {
        return 0;
    }

    let score = adjustment.baseAdjustment;

    const allText = ((analysis.summary || "") + " " + (analysis.redFlags || []).join(" ")).toLowerCase();
    adjustment.riskFactors.forEach((riskFactor: string) => {
        if (allText.includes(riskFactor)) {
            score -= 3;
        }
    });

    return score;
}

export function analyzeRiskFactors(analysis: any): Array<{ name: string; impact: string; severity: string }> {
    const factors: Array<{ name: string; impact: string; severity: string }> = [];
    if (!analysis.redFlags) {
        return factors;
    }

    analysis.redFlags.forEach((flag: any) => {
        const flagText = typeof flag === "string" ? flag : flag.summary;
        const severity = flagText?.toLowerCase().includes("critical")
            ? "high"
            : flagText?.toLowerCase().includes("concerning") ? "medium" : "low";
        factors.push({
            name: flagText || "Unknown risk factor",
            impact: severity === "high" ? "High Risk" : severity === "medium" ? "Medium Risk" : "Low Risk",
            severity,
        });
    });

    return factors;
}

export function generateRecommendation(score: number, documentType: string): string {
    if (score >= 80) {
        return `This ${documentType} document appears relatively safe with standard precautions.`;
    }
    if (score >= 60) {
        return `Exercise caution with this ${documentType} document. Review highlighted concerns carefully.`;
    }

    return `High risk detected. Consider professional consultation regarding this ${documentType} document.`;
}

export function calculateComplexityScore(analysis: any): number {
    const keyPointsCount = analysis.keyPoints?.length || 0;
    const redFlagsCount = analysis.redFlags?.length || 0;
    const baseScore = Math.min(90, (keyPointsCount * 5) + (redFlagsCount * 8) + 20);

    return Math.round(baseScore);
}

export function calculateRiskLevel(analysis: any): string {
    const redFlagsCount = analysis.redFlags?.length || 0;
    if (redFlagsCount >= 5) {
        return "High";
    }
    if (redFlagsCount >= 2) {
        return "Medium";
    }

    return "Low";
}

export function calculateReadingTime(analysis: any): number {
    const avgWordsPerMinute = 200;
    const estimatedWords = (analysis.keyPoints?.length || 0) * 15
        + (analysis.redFlags?.length || 0) * 20 + 500;

    return Math.max(1, Math.round(estimatedWords / avgWordsPerMinute));
}

export function detectDocumentType(analysis: any): string {
    const keyPoints = analysis.keyPoints || [];
    const redFlags = analysis.redFlags || [];
    const allText = [...keyPoints, ...redFlags].map((item: any) => 
        (typeof item === "string" ? item : (item.text || item.summary || ""))
    ).join(" ").toLowerCase();

    if (allText.includes("service") || allText.includes("consulting")) {
        return "Service Agreement";
    }
    if (allText.includes("employment") || allText.includes("employee")) {
        return "Employment Contract";
    }
    if (allText.includes("lease") || allText.includes("rent")) {
        return "Lease Agreement";
    }
    if (allText.includes("purchase") || allText.includes("sale")) {
        return "Purchase Agreement";
    }

    return "General Contract";
}