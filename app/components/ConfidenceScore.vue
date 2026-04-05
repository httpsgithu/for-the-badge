<template>
    <div class="confidence-score">
        <div class="score-header">
            <h3>🛡️ For the Badge Confidence Score</h3>
            <div
                class="score-value"
                :class="scoreClass"
            >
                {{ score }}/100
            </div>
        </div>

        <div class="score-meter">
            <div class="meter-track">
                <div
                    class="meter-fill"
                    :style="{ width: score + '%' }"
                    :class="scoreClass"
                />
            </div>
            <div class="meter-labels">
                <span>Risky</span>
                <span>Caution</span>
                <span>Safe</span>
            </div>
        </div>

        <div class="score-breakdown">
            <h4>Risk Factors</h4>
            <div
                v-for="factor in riskFactors"
                :key="factor.name"
                class="risk-factor"
            >
                <div class="factor-content">
                    <span class="factor-name">{{ factor.name }}</span>
                </div>
                <span
                    class="risk-badge"
                    :class="factor.severity"
                >{{ factor.impact }}</span>
            </div>
        </div>

        <div class="score-breakdown-section">
            <h4>Score Breakdown</h4>
            <div class="breakdown-items">
                <div class="breakdown-item">
                    <div class="breakdown-label">
                        <span class="breakdown-icon">📝</span>
                        Analysis Quality
                    </div>
                    <div class="breakdown-value positive">+{{ getQualityScore() }}</div>
                </div>
                <div class="breakdown-item">
                    <div class="breakdown-label">
                        <span class="breakdown-icon">🔍</span>
                        Key Points Found
                    </div>
                    <div class="breakdown-value positive">+{{ getKeyPointsScore() }}</div>
                </div>
                <div class="breakdown-item" v-if="getRiskPenalty() > 0">
                    <div class="breakdown-label">
                        <span class="breakdown-icon">⚠️</span>
                        Risk Factors
                    </div>
                    <div class="breakdown-value negative">-{{ getRiskPenalty() }}</div>
                </div>
                <div class="breakdown-item">
                    <div class="breakdown-label">
                        <span class="breakdown-icon">📋</span>
                        Document Type
                    </div>
                    <div class="breakdown-value" :class="getTypeAdjustment() >= 0 ? 'positive' : 'negative'">
                        {{ getTypeAdjustment() >= 0 ? '+' : '' }}{{ getTypeAdjustment() }}
                    </div>
                </div>
            </div>
        </div>

        <div class="recommendation">
            <h4>Recommendation</h4>
            <p>{{ recommendation }}</p>
        </div>
    </div>
</template>

<script setup>
import { calculateConfidenceScore, analyzeRiskFactors, generateRecommendation } from "~/utils/confidenceCalculation";

const props = defineProps({
    analysis: { type: Object, required: true },
    documentType: { type: String, default: "general" },
});

const score = computed(() => {
    // Use server-calculated score if available, otherwise calculate on client
    const serverScore = props.analysis?.confidenceScore?.score;
    if (typeof serverScore === 'number') {
        return Math.round(serverScore);
    }
    
    // Fallback to client-side calculation
    return calculateConfidenceScore(props.analysis, props.documentType);
});
const scoreClass = computed(() =>
{
    if (score.value >= 80)
    {
        return "safe";
    }
    if (score.value >= 60)
    {
        return "caution";
    }

    return "risky";
});

const riskFactors = computed(() => analyzeRiskFactors(props.analysis));
const recommendation = computed(() => generateRecommendation(score.value, props.documentType));

// Score breakdown calculation methods
const getQualityScore = () => {
    const summaryLength = props.analysis.summary?.length || 0;
    const keyPointsCount = props.analysis.keyPoints?.length || 0;
    
    let score = 0;
    if (summaryLength > 200) score += 12;
    else if (summaryLength > 100) score += 8;
    else if (summaryLength >= 50) score += 3;
    
    if (keyPointsCount > 8) score += 5;
    else if (keyPointsCount > 5) score += 3;
    
    return Math.max(0, score);
};

const getKeyPointsScore = () => {
    const keyPoints = props.analysis.keyPoints || [];
    if (keyPoints.length === 0) return 0;
    
    let score = Math.min(keyPoints.length * 2.5, 18);
    const structuredPoints = keyPoints.filter(point => typeof point === 'object' && point.rawText);
    if (structuredPoints.length > 0) {
        score += Math.min(structuredPoints.length * 1.5, 8);
    }
    
    if (keyPoints.length >= 10) score += 4;
    else if (keyPoints.length >= 6) score += 2;
    
    return Math.round(Math.max(0, score));
};

const getRiskPenalty = () => {
    const redFlags = props.analysis.redFlags || [];
    if (redFlags.length === 0) return 0;
    
    let penalty = 0;
    const severityPenalties = {
        critical: 20, dangerous: 15, unfair: 12, illegal: 25,
        concerning: 10, unusual: 6, avoid: 18, risky: 8
    };
    
    redFlags.forEach(flag => {
        const flagText = typeof flag === 'string' ? flag : flag.summary;
        const flagLower = flagText?.toLowerCase() || '';
        
        let maxPenalty = 5;
        Object.entries(severityPenalties).forEach(([keyword, penaltyValue]) => {
            if (flagLower.includes(keyword)) {
                maxPenalty = Math.max(maxPenalty, penaltyValue);
            }
        });
        penalty += maxPenalty;
    });
    
    return Math.min(penalty, 40);
};

const getTypeAdjustment = () => {
    const typeAdjustments = {
        employment: -5,
        lease: 0,
        purchase: 5,
        general: 0
    };
    
    const docType = props.documentType?.toLowerCase() || 'general';
    return typeAdjustments[docType] || 0;
};
</script>

<style scoped>
.confidence-score { background: white; border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem; }
.score-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.score-value { font-size: 2rem; font-weight: 700; }
.score-value.safe { color: #10b981; }
.score-value.caution { color: #f59e0b; }
.score-value.risky { color: #ef4444; }
.meter-track { height: 12px; background: #e5e7eb; border-radius: 6px; position: relative; }
.meter-fill { height: 100%; border-radius: 6px; transition: width 0.5s ease; }
.meter-fill.safe { background: linear-gradient(90deg, #10b981, #34d399); }
.meter-fill.caution { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
.meter-fill.risky { background: linear-gradient(90deg, #ef4444, #f87171); }
.meter-labels { display: flex; justify-content: space-between; margin-top: 0.5rem; font-size: 0.8rem; color: #6b7280; }
.risk-factor { display: flex; justify-content: space-between; align-items: flex-start; padding: 0.5rem 0; border-bottom: 1px solid #f3f4f6; }
.factor-content { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.factor-name { word-wrap: break-word; overflow-wrap: break-word; }
.risk-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}
.risk-badge.high {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}
.risk-badge.medium {
  background: #fffbeb;
  color: #d97706;
  border: 1px solid #fed7aa;
}
.risk-badge.low {
  background: #f0f9ff;
  color: #0369a1;
  border: 1px solid #bae6fd;
}

.score-breakdown-section {
  margin-top: 1.5rem;
  background: #f8fafc;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #e2e8f0;
}

.score-breakdown-section h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #374151;
}

.breakdown-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.breakdown-item:hover {
  transform: translateX(2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.breakdown-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
}

.breakdown-icon {
  font-size: 1rem;
}

.breakdown-value {
  font-weight: 600;
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  min-width: 40px;
  text-align: center;
}

.breakdown-value.positive {
  background: #dcfce7;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.breakdown-value.negative {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.breakdown-value:not(.positive):not(.negative) {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
}
</style>