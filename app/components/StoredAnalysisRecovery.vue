<template>
    <div v-if="hasStoredAnalysis()" class="stored-analysis-card">
        <div class="card-content">
            <!-- Icon -->
            <div class="icon-container">
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="recovery-icon"
                >
                    <path d="M12,3A9,9 0 0,0 3,12H0L4,16L8,12H5A7,7 0 0,1 12,5A7,7 0 0,1 19,12A7,7 0 0,1 12,19C10.5,19 9.09,18.5 7.94,17.7L6.5,19.14C8.04,20.3 9.94,21 12,21A9,9 0 0,0 21,12A9,9 0 0,0 12,3M14,12V7.5H12.5V13H17V11.5H14Z" />
                </svg>
            </div>

            <!-- Text Content -->
            <div class="text-content">
                <h3 class="card-title">
                    Previous Analysis Available
                </h3>
                <p class="card-description">
                    Your last analysis is temporarily stored and can be restored.
                </p>

                <!-- Expiry Timer -->
                <div class="expiry-info">
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="clock-icon"
                    >
                        <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
                    </svg>
                    <span class="timer" :class="{ 'low-time': timeRemaining < 3 * 60 * 1000 }">
                        Expires in {{ formatTimeRemaining() }}
                    </span>
                </div>

                <!-- Info Notice -->
                <div class="info-notice">
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="info-icon"
                    >
                        <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                    </svg>
                    <p>
                        Your analysis is stored securely in your browser's session memory.
                        It will automatically expire after 15 minutes for your security.
                        <strong>Note:</strong> Logging out or closing your browser will immediately clear this stored analysis.
                        Support cannot extend or recover expired analyses.
                    </p>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
                <button class="restore-btn" @click="handleRestore">
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z" />
                    </svg>
                    Restore Analysis
                </button>
                <button class="dismiss-btn" @click="handleDismiss">
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                    </svg>
                    Dismiss
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineEmits } from "vue";

defineProps({
    hasStoredAnalysis: {
        type: Function,
        required: true,
    },
    timeRemaining: {
        type: Number,
        required: true,
    },
    formatTimeRemaining: {
        type: Function,
        required: true,
    },
});

const emit = defineEmits(["restore", "dismiss"]);

function handleRestore() {
    emit("restore");
}

function handleDismiss() {
    emit("dismiss");
}
</script>

<style scoped>
.stored-analysis-card {
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    border: 2px solid #0ea5e9;
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.1);
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.card-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.icon-container {
    display: flex;
    justify-content: center;
}

.recovery-icon {
    color: #0ea5e9;
    animation: rotate 2s linear infinite;
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.text-content {
    text-align: center;
}

.card-title {
    color: #075985;
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
}

.card-description {
    color: #0c4a6e;
    font-size: 0.95rem;
    margin-bottom: 1rem;
    line-height: 1.5;
}

.expiry-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 8px;
    margin-bottom: 1rem;
}

.clock-icon {
    color: #0284c7;
    flex-shrink: 0;
}

.timer {
    font-family: monospace;
    font-size: 1rem;
    font-weight: 600;
    color: #0369a1;
    transition: color 0.3s ease;
}

.timer.low-time {
    color: #dc2626;
    animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.6;
    }
}

.info-notice {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.9);
    border-left: 3px solid #0ea5e9;
    border-radius: 8px;
    padding: 0.875rem;
    margin-top: 1rem;
}

.info-icon {
    color: #0284c7;
    flex-shrink: 0;
    margin-top: 0.1rem;
}

.info-notice p {
    color: #0c4a6e;
    font-size: 0.85rem;
    line-height: 1.5;
    margin: 0;
}

.action-buttons {
    display: flex;
    gap: 0.75rem;
    margin-top: 0.5rem;
}

.restore-btn,
.dismiss-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.875rem 1.25rem;
    border: none;
    border-radius: 10px;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.restore-btn {
    background: #0ea5e9;
    color: white;
}

.restore-btn:hover {
    background: #0284c7;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(14, 165, 233, 0.3);
}

.restore-btn:active {
    transform: translateY(0);
}

.dismiss-btn {
    background: white;
    color: #64748b;
    border: 1px solid #cbd5e1;
}

.dismiss-btn:hover {
    background: #f8fafc;
    color: #475569;
    border-color: #94a3b8;
}

@media (max-width: 768px) {
    .stored-analysis-card {
        padding: 1.25rem;
    }

    .card-title {
        font-size: 1.1rem;
    }

    .card-description {
        font-size: 0.9rem;
    }

    .action-buttons {
        flex-direction: column;
    }

    .restore-btn,
    .dismiss-btn {
        width: 100%;
    }
}
</style>