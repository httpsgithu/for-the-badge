<template>
    <div
        v-if="show"
        class="modal-overlay"
        @click="handleOverlayClick"
    >
        <div
            class="modal-content feedback-modal"
            @click.stop
        >
            <!-- Modal Header -->
            <div class="modal-header">
                <div class="header-content">
                    <div class="chat-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92176 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.60573 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <h3>{{ modalTitle }}</h3>
                </div>
                <button
                    class="close-btn"
                    @click="handleClose"
                    aria-label="Close feedback modal"
                >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>

            <!-- Feedback Info -->
            <div class="feedback-info">
                <p>This is an <strong>anonymous</strong> way to share feedback, report bugs, or ask questions.</p>
                <div class="privacy-notice">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
                        <path d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>Please don't include personal information, account numbers, or sensitive data. Feedback data is only stored for 30 days and then deleted from our database.</span>
                </div>
                <div class="support-notice">
                    For more advanced support or account-specific issues, please visit our <NuxtLink to="/company/contact" class="contact-link">Contact us</NuxtLink> page.
                </div>
            </div>

            <!-- Success State -->
            <div v-if="isSubmitted" class="success-state">
                <div class="success-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7089 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.76489 14.1003 1.98234 16.07 2.86" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h4>Feedback Submitted!</h4>
                <p>Thank you for your feedback. We appreciate you taking the time to help us improve.</p>
                <button class="btn-primary" @click="handleClose">
                    Close
                </button>
            </div>

            <!-- Feedback Form -->
            <div v-else class="feedback-form">
                <form @submit.prevent="submitFeedback">
                    <div class="input-group">
                        <textarea
                            ref="feedbackInput"
                            v-model="feedbackText"
                            class="feedback-textarea"
                            :class="{ 'error': showError }"
                            placeholder="Examples: Dark mode support, Upload button doesn't work on Safari, Love the new design! Keep it up"
                            rows="4"
                            maxlength="1000"
                            required
                        />
                        <div class="char-counter" :class="{ 'warning': feedbackText.length > 900 }">
                            {{ feedbackText.length }}/1000
                        </div>
                        <div v-if="showError" class="error-message">
                            Please enter your feedback before sending.
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button
                            type="button"
                            class="btn-secondary"
                            :disabled="loading"
                            @click="handleClose"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            class="btn-primary"
                            :disabled="loading || !feedbackText.trim()"
                        >
                            <span v-if="loading" class="loading-spinner" />
                            <svg v-if="!loading" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            {{ loading ? 'Sending...' : 'Send Message' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits([
    'close',
    'submit',
]);

const feedbackText = ref('');
const loading = ref(false);
const showError = ref(false);
const isSubmitted = ref(false);
const feedbackInput = ref(null);

const modalTitle = 'Send Feedback';

// Focus textarea when modal opens
watch(() => props.show, (isVisible) => {
    if (isVisible) {
        nextTick(() => {
            feedbackInput.value?.focus();
        });
    } else {
        // Reset form when modal closes
        resetForm();
    }
});

const resetForm = () => {
    feedbackText.value = '';
    loading.value = false;
    showError.value = false;
    isSubmitted.value = false;
};

const handleClose = () => {
    if (!loading.value) {
        emit('close');
    }
};

const handleOverlayClick = () => {
    handleClose();
};

const submitFeedback = async () => {
    if (!feedbackText.value.trim()) {
        showError.value = true;
        return;
    }

    loading.value = true;
    showError.value = false;

    try {
        const feedbackData = {
            message: feedbackText.value.trim(),
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
        };

        emit('submit', feedbackData);
        
        // Show success state
        await new Promise(resolve => setTimeout(resolve, 500));
        isSubmitted.value = true;
        
    } catch (error) {
        console.error('Error submitting feedback:', error);
        showError.value = true;
        // Handle error appropriately
    } finally {
        loading.value = false;
    }
};

// Handle Escape key
onMounted(() => {
    const handleEscape = (e) => {
        if (e.key === 'Escape' && props.show) {
            handleClose();
        }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    onUnmounted(() => {
        document.removeEventListener('keydown', handleEscape);
    });
});
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: 1rem;
}

.modal-content {
    background: white;
    border-radius: 16px;
    padding: 0;
    max-width: 480px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
    from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.modal-header {
    padding: 1.5rem 1.5rem 1rem;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.header-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.chat-icon {
    width: 24px;
    height: 24px;
    color: #1f2937;
    flex-shrink: 0;
}

.modal-header h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a202c;
}

.close-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    color: #718096;
    cursor: pointer;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.close-btn:hover {
    background: #f7fafc;
    color: #4a5568;
}

.close-btn svg {
    width: 18px;
    height: 18px;
}

.feedback-info {
    padding: 1rem 1.5rem;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
}

.feedback-info p {
    margin: 0 0 1rem 0;
    color: #4a5568;
    line-height: 1.5;
    font-size: 0.9rem;
}

.privacy-notice {
    background: #f7fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 0.75rem;
    margin-top: 0.75rem;
    display: flex;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #4a5568;
}

.privacy-notice svg {
    width: 16px;
    height: 16px;
    color: #1f2937;
    flex-shrink: 0;
    margin-top: 0.125rem;
}

.support-notice {
    margin-top: 0.75rem;
    font-size: 0.875rem;
    color: #4a5568;
}

.contact-link {
    color: #1f2937;
    text-decoration: none;
    font-weight: 600;
}

.contact-link:hover {
    text-decoration: underline;
}

.success-state {
    padding: 2rem 1.5rem;
    text-align: center;
}

.success-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 1.5rem;
    color: #10b981;
}

.success-icon svg {
    width: 100%;
    height: 100%;
}

.success-state h4 {
    margin: 0 0 0.75rem 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #1a202c;
}

.success-state p {
    margin: 0 0 2rem 0;
    color: #4a5568;
    line-height: 1.5;
}

.success-state .btn-primary {
    min-width: 120px;
}

.feedback-form {
    padding: 0 1.5rem 1.5rem;
}

.input-group {
    margin-bottom: 1rem;
    position: relative;
}

.feedback-textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.875rem;
    line-height: 1.5;
    resize: vertical;
    min-height: 100px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.feedback-textarea:focus {
    outline: none;
    border-color: #1f2937;
    box-shadow: 0 0 0 3px rgba(31, 41, 55, 0.1);
}

.feedback-textarea.error {
    border-color: #e53e3e;
}

.feedback-textarea.error:focus {
    box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
}

.char-counter {
    position: absolute;
    bottom: 0.5rem;
    right: 0.75rem;
    font-size: 0.75rem;
    color: #718096;
    background: white;
    padding: 0 0.25rem;
}

.char-counter.warning {
    color: #d69e2e;
    font-weight: 600;
}

.error-message {
    color: #e53e3e;
    font-size: 0.875rem;
    margin-top: 0.5rem;
}

.form-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
}

.btn-primary, .btn-secondary {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    min-width: 100px;
    font-size: 0.875rem;
}

.btn-primary {
    background: #1f2937;
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background: #111827;
    transform: translateY(-1px);
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.btn-primary svg {
    width: 16px;
    height: 16px;
}

.btn-secondary {
    background: #e2e8f0;
    color: #4a5568;
}

.btn-secondary:hover:not(:disabled) {
    background: #cbd5e0;
    transform: translateY(-1px);
}

.btn-secondary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.loading-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Mobile responsiveness */
@media (max-width: 768px) {
    .modal-content {
        margin: 0.5rem;
        width: calc(100% - 1rem);
        max-height: 95vh;
    }
    
    .modal-header {
        padding: 1rem;
    }
    
    .feedback-info {
        padding: 0.75rem 1rem;
    }
    
    .feedback-form {
        padding: 0 1rem 1rem;
    }
    
    .form-actions {
        flex-direction: column-reverse;
    }
    
    .btn-primary, .btn-secondary {
        width: 100%;
        justify-content: center;
    }
}

@media (max-width: 480px) {
    .modal-content {
        border-radius: 12px;
    }
    
    .modal-header h3 {
        font-size: 1.125rem;
    }
    
    .feedback-textarea {
        font-size: 16px; /* Prevent zoom on iOS */
    }
}
</style>