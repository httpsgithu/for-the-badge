<template>
    <div class="referral-section" :class="{ 'mobile-view': isMobile }">
        <div class="referral-header">
            <h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5M10.5,7.5H11.5V9H13V10H11.5V11.5H10.5V10H9V9H10.5V7.5Z"/>
                </svg>
                Invite Friends
            </h3>
            <p>Share your referral link and earn rewards when friends join!</p>
        </div>
        
        <div v-if="loading" class="referral-loading">
            <div class="spinner" />
            <span>Loading referral link...</span>
        </div>
        
        <div v-else-if="error" class="referral-error">
            <svg class="error-icon" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
            </svg>
            <span>{{ error }}</span>
            <button class="retry-button" @click="fetchReferralUrl">Try Again</button>
        </div>
        
        <div v-else-if="!hasAttemptedFetch" class="referral-generate">
            <div class="generate-content">
                <svg class="generate-icon" width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16,13C15.71,13 15.38,13 15.03,13.05C16.19,13.89 17,15 17,16.5V19H23V16.5C23,14.17 18.33,13 16,13M8,13C5.67,13 1,14.17 1,16.5V19H15V16.5C15,14.17 10.33,13 8,13M8,11A3,3 0 0,0 11,8A3,3 0 0,0 8,5A3,3 0 0,0 5,8A3,3 0 0,0 8,11M16,11A3,3 0 0,0 19,8A3,3 0 0,0 16,5A3,3 0 0,0 13,8A3,3 0 0,0 16,11Z"/>
                </svg>
                <div class="generate-message">
                    <strong>Generate Your Referral Link</strong>
                    <p>Create your personal referral link to start inviting friends and earning rewards.</p>
                </div>
            </div>
            <button class="generate-button" :class="{ copied: copied }" @click="fetchReferralUrl" :disabled="loading">
                <svg v-if="copied" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
                </svg>
                <svg v-else-if="!loading" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                </svg>
                {{ copied ? 'Copied!' : (loading ? 'Getting...' : 'Get Referral Link') }}
            </button>
        </div>
        
        
        <div v-else class="referral-active">
            <div class="referral-url-container">
                <input
                    ref="urlInput"
                    type="text"
                    :value="fullReferralUrl"
                    readonly
                    class="referral-url-input"
                    @click="selectText"
                />
                <button
                    class="copy-button"
                    :class="{ copied: copied }"
                    @click="copyToClipboard"
                >
                    <svg v-if="copied" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
                    </svg>
                    <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"/>
                    </svg>
                    <span v-if="copied">Copied!</span>
                    <span v-else>Copy</span>
                </button>
            </div>
            
            <div class="referral-stats">
                <div class="stat-item">
                    <svg class="stat-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16,13C15.71,13 15.38,13 15.03,13.05C16.19,13.89 17,15 17,16.5V19H23V16.5C23,14.17 18.33,13 16,13M8,13C5.67,13 1,14.17 1,16.5V19H15V16.5C15,14.17 10.33,13 8,13M8,11A3,3 0 0,0 11,8A3,3 0 0,0 8,5A3,3 0 0,0 5,8A3,3 0 0,0 8,11M16,11A3,3 0 0,0 19,8A3,3 0 0,0 16,5A3,3 0 0,0 13,8A3,3 0 0,0 16,11Z"/>
                    </svg>
                    <span class="stat-text">Share this link to invite friends</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';

const props = defineProps({
    accountId: {
        type: String,
        required: true,
    },
    isMobile: {
        type: Boolean,
        default: false,
    },
});

const referralService = useReferralService();
const loading = ref(false);
const error = ref(null);
const referralUrl = ref(null);
const reason = ref(null);
const copied = ref(false);
const urlInput = ref(null);
const hasAttemptedFetch = ref(false);

const fullReferralUrl = computed(() => {
    if (!referralUrl.value) return '';
    // Get the full URL with protocol and domain
    if (import.meta.client) {
        const origin = window.location.origin;
        return `${origin}${referralUrl.value}`;
    }
    return referralUrl.value;
});

const fetchReferralUrl = async () => {
    loading.value = true;
    error.value = null;
    hasAttemptedFetch.value = true;
    
    try {
        const response = await referralService.getReferralUrl(props.accountId);
        
        if (response.url) {
            referralUrl.value = response.url;
            
            // Auto-copy the URL to clipboard
            await nextTick(); // Wait for fullReferralUrl to be computed
            const urlToCopy = fullReferralUrl.value;
            
            try {
                if (navigator.clipboard?.writeText) {
                    await navigator.clipboard.writeText(urlToCopy);
                    copied.value = true;
                } else if (fallbackCopy(urlToCopy)) {
                    copied.value = true;
                }
            } catch (_) {
                if (fallbackCopy(urlToCopy)) {
                    copied.value = true;
                }
            }
            
            if (copied.value) {
                setTimeout(() => (copied.value = false), 2000);
            }
        } else {
            reason.value = response.reason || 'Add credits to unlock referrals';
        }
    } catch (err) {
        console.error('Failed to fetch referral URL:', err);
        error.value = 'Failed to load referral link. Please try again.';
    } finally {
        loading.value = false;
    }
};

const selectText = () => {
    if (urlInput.value) {
        urlInput.value.select();
    }
};

const fallbackCopy = (text) => {
    try {
        const el = document.createElement("textarea");
        el.value = text;
        el.setAttribute("readonly", "");
        el.style.position = "absolute";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        return true;
    } catch (_) {
        return false;
    }
};

const copyToClipboard = async () => {
    const text = fullReferralUrl.value;
    
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
            copied.value = true;
        } else if (fallbackCopy(text)) {
            copied.value = true;
        }
    } catch (_) {
        if (fallbackCopy(text)) {
            copied.value = true;
        }
    } finally {
        if (copied.value) {
            setTimeout(() => (copied.value = false), 2000);
        }
    }
};

// Referral URL is now fetched on user request via button click
</script>

<style scoped>
.referral-section {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    border: 2px solid #cbd5e0;
}

.mobile-view.referral-section {
    padding: 1.25rem;
    border-radius: 10px;
    margin-bottom: 1.5rem;
}

.referral-header {
    margin-bottom: 1.25rem;
    text-align: left;
}

.referral-header h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a202c;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.mobile-view .referral-header h3 {
    font-size: 1.125rem;
}

.referral-header p {
    color: #4a5568;
    font-size: 0.9rem;
    margin: 0;
}

.mobile-view .referral-header p {
    font-size: 0.875rem;
}

.referral-loading,
.referral-error {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 1.5rem;
    color: #4a5568;
}

.spinner {
    width: 24px;
    height: 24px;
    border: 3px solid rgba(31, 41, 55, 0.3);
    border-top: 3px solid #1f2937;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.referral-error {
    color: #e53e3e;
    flex-direction: column;
}

.error-icon {
    width: 32px;
    height: 32px;
    color: #e53e3e;
}

.referral-locked {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 8px;
}

.mobile-view .referral-locked {
    flex-direction: column;
    text-align: center;
    padding: 1.25rem;
}

.lock-icon {
    width: 40px;
    height: 40px;
    color: #1f2937;
    flex-shrink: 0;
}

.mobile-view .lock-icon {
    width: 32px;
    height: 32px;
}

.lock-message strong {
    display: block;
    color: #2d3748;
    margin-bottom: 0.5rem;
    font-size: 1rem;
}

.mobile-view .lock-message strong {
    font-size: 0.9375rem;
}

.lock-message p {
    color: #4a5568;
    font-size: 0.875rem;
    margin: 0;
}

.mobile-view .lock-message p {
    font-size: 0.8125rem;
}

.referral-active {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.referral-url-container {
    display: flex;
    gap: 0.75rem;
    align-items: stretch;
}

.mobile-view .referral-url-container {
    flex-direction: column;
    gap: 0.5rem;
}

.referral-url-input {
    flex: 1;
    padding: 0.875rem 1rem;
    border: 2px solid #cbd5e0;
    border-radius: 8px;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.875rem;
    background: white;
    color: #2d3748;
    cursor: pointer;
    transition: all 0.2s;
}

.mobile-view .referral-url-input {
    font-size: 0.8125rem;
    padding: 0.75rem;
    border-radius: 6px;
}

.referral-url-input:focus {
    outline: none;
    border-color: #1f2937;
    box-shadow: 0 0 0 3px rgba(31, 41, 55, 0.1);
}

.copy-button {
    padding: 0.875rem 1.5rem;
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    min-width: 120px;
}

.mobile-view .copy-button {
    padding: 0.875rem 1rem;
    border-radius: 6px;
    width: 100%;
    min-height: 48px;
}

.copy-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.mobile-view .copy-button:hover {
    transform: none;
}

.mobile-view .copy-button:active {
    transform: scale(0.98);
}

.copy-button.copied {
    background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
}

.referral-stats {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 8px;
}

.mobile-view .stat-item {
    padding: 0.625rem;
    border-radius: 6px;
}

.stat-icon {
    width: 24px;
    height: 24px;
    color: #1f2937;
    flex-shrink: 0;
}

.mobile-view .stat-icon {
    width: 20px;
    height: 20px;
}

.stat-text {
    color: #4a5568;
    font-size: 0.875rem;
    font-weight: 500;
}

.mobile-view .stat-text {
    font-size: 0.8125rem;
}

.referral-generate {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 8px;
}

.mobile-view .referral-generate {
    padding: 1.25rem;
    gap: 1rem;
}

.generate-content {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.mobile-view .generate-content {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
}

.generate-icon {
    width: 40px;
    height: 40px;
    color: #1f2937;
    flex-shrink: 0;
}

.mobile-view .generate-icon {
    width: 32px;
    height: 32px;
}

.generate-message {
    flex: 1;
    text-align: left;
}

.mobile-view .generate-message {
    text-align: center;
}

.generate-message strong {
    display: block;
    color: #2d3748;
    margin-bottom: 0.5rem;
    font-size: 1rem;
}

.mobile-view .generate-message strong {
    font-size: 0.9375rem;
}

.generate-message p {
    color: #4a5568;
    font-size: 0.875rem;
    margin: 0;
}

.mobile-view .generate-message p {
    font-size: 0.8125rem;
    margin-bottom: 1rem;
}

.generate-button {
    padding: 0.875rem 1.5rem;
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 140px;
    justify-content: center;
}

.mobile-view .generate-button {
    width: 100%;
    min-height: 48px;
    border-radius: 6px;
    padding: 0.875rem 1rem;
}

.generate-button:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.mobile-view .generate-button:hover:not(:disabled) {
    transform: none;
}

.mobile-view .generate-button:active:not(:disabled) {
    transform: scale(0.98);
}

.generate-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.generate-button.copied {
    background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
}

.retry-button {
    margin-top: 1rem;
    padding: 0.75rem 1.25rem;
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.retry-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.mobile-view .retry-button:hover {
    transform: none;
}

.mobile-view .retry-button:active {
    transform: scale(0.98);
}
</style>
