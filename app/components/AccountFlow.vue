<template>
    <div class="account-flow" :class="{ 'mobile-flow': isMobile }">
        <div class="steps-indicator" :class="{ 'mobile-steps': isMobile }">
            <div
                v-for="(step, index) in steps"
                :key="index"
                class="step"
                :class="{ active: currentStep === index, completed: currentStep > index, 'mobile-step': isMobile }"
            >
                <div class="step-number">
                    {{ index + 1 }}
                </div>
                <div class="step-title">
                    {{ step.title }}
                </div>
            </div>
        </div>

        <div class="step-content">
            <div
                v-if="currentStep === 0"
                class="step-panel"
            >
                <div v-if="hasReferrer" class="referral-welcome">
                    <div class="welcome-icon">🎉</div>
                    <h2>You've been invited!</h2>
                    <p class="welcome-message">
                        A friend has invited you to join For The Badge. Create your account now to unlock your referral benefits!
                    </p>
                </div>
                
                <div class="step-header" :class="{ 'with-referral': hasReferrer }">
                    <h2 v-if="!hasReferrer">{{ steps[0].title }}</h2>
                    <p>Click the button below to generate your unique account number. No personal info required!</p>
                </div>

                <div class="step-actions">
                    <button
                        :disabled="generating"
                        class="btn-primary"
                        :class="{ 'referral-cta': hasReferrer }"
                        @click="generateAccount"
                    >
                        <span v-if="generating">Generating...</span>
                        <span v-else-if="hasReferrer">🎁 Accept Invitation & Create Account</span>
                        <span v-else>🎲 Generate Account Number</span>
                    </button>
                </div>

                <div class="step-info">
                    <div class="info-item">
                        <span class="icon">🔒</span>
                        <span>No email or personal data required</span>
                    </div>
                    <div class="info-item">
                        <span class="icon">🎯</span>
                        <span>16-digit account number like the pros use</span>
                    </div>
                    <div class="info-item">
                        <span class="icon">⚡</span>
                        <span>Instant generation, no waiting around</span>
                    </div>
                </div>
            </div>

            <div
                v-else-if="currentStep === 1 && generatedAccount"
                class="step-panel"
            >
                <AccountGenerated
                    :account="generatedAccount"
                    @setup-pin="showPinSetupModal = true"
                    @show-leave-warning="handleContinueClick"
                    @account-copied="hascopied = true"
                />
            </div>

            <div
                v-else-if="currentStep === 2"
                class="step-panel"
            >
                <AppDownload />
            </div>
        </div>

        <ConfirmationModal
            :show="showModal"
            :title="modalConfig.title"
            :message="modalConfig.message"
            :confirmText="modalConfig.confirmText"
            :showCancel="false"
            @confirm="handleModalConfirm"
            @close="handleModalClose"
        />

        <!-- Leave warning modal -->
        <ConfirmationModal
            :show="showLeaveWarningModal"
            title="Save Your Account Number!"
            message="Make sure you've saved your account number somewhere safe. You won't be able to see it again after leaving this page."
            confirmText="Copy & Proceed"
            cancelText="Go Back"
            :showCancel="true"
            @confirm="handleCopyAndProceed"
            @cancel="showLeaveWarningModal = false"
            @close="showLeaveWarningModal = false"
        />

        <!-- PIN Setup Modal with full-page overlay -->
        <PinSetupModal
            v-if="showPinSetupModal && generatedAccount"
            :account="{ id: generatedAccount.id }"
            :show="showPinSetupModal"
            @pin-enabled="handlePinEnabled"
            @modal-cancelled="showPinSetupModal = false"
        />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { isMobileDevice } from '~/utils/deviceDetection';

import AccountGenerated from "./AccountGenerated.vue";
import AppDownload from "./AppDownload.vue";
import ConfirmationModal from "./ConfirmationModal.vue";
import PinSetupModal from "./PinSetupModal.vue";

// Mobile detection based on user agent
const isMobile = computed(() => {
    if (import.meta.client) {
        return isMobileDevice();
    }
    return false;
});

// Service composables
const accountService = useAccountService();
const errorHandler = useErrorHandler();
const scrollManager = useScrollManager();
const route = useRoute();
const { refresh: refreshSession } = useAuth();

// Check for referrer query parameter
const referrerParam = ref(null);
const hasReferrer = computed(() => !!referrerParam.value);

const currentStep = ref(0);
const generating = ref(false);
const generatedAccount = ref(null);
const showModal = ref(false);
const showPinSetupModal = ref(false);
const showLeaveWarningModal = ref(false);
const hascopied = ref(false);
const modalConfig = ref({
    title: "",
    message: "",
    confirmText: "OK",
});

onMounted(() => {
    // Capture referrer parameter from URL
    if (route.query.referrer) {
        referrerParam.value = route.query.referrer;
    }
});

const steps = [
    { title: "Generate Account" },
    { title: "Account Created" },
    { title: "Download App" },
];

const generateAccount = async () =>
{
    generating.value = true;

    try
    {
        // Pass referrer parameter if present
        const url = referrerParam.value 
            ? `/api/account/generate?referrer=${referrerParam.value}`
            : '/api/account/generate';
        
        const response = await accountService.generateAccount(url);
        generatedAccount.value = response;
        
        // Refresh session to update navbar to logged-in state
        // The redirect is prevented by isInGenerationFlow flag in account/index.vue
        await refreshSession();
    }
    catch (error)
    {
        console.error("Failed to generate account:", error);
        showModal.value = true;
        modalConfig.value = errorHandler.createErrorModal(error);
    }
    finally
    {
        generating.value = false;
    }

    // Only proceed to next step if account was successfully generated
    if (generatedAccount.value)
    {
        nextStep();
    }
};

const nextStep = () =>
{
    if (currentStep.value < steps.length - 1)
    {
        currentStep.value++;
        // Scroll to the new step content smoothly
        setTimeout(() => scrollManager.scrollToElement(".step-content", 80), 200);
    }
};

const handleModalConfirm = () =>
{
    showModal.value = false;
    modalConfig.value = {
        title: "",
        message: "",
        confirmText: "OK",
    };
};

const handleModalClose = () =>
{
    showModal.value = false;
    modalConfig.value = {
        title: "",
        message: "",
        confirmText: "OK",
    };
};

// Handle step continuation with smooth scrolling
const handleStepContinue = (stepIndex) =>
{
    currentStep.value = stepIndex;
    // Scroll to the new step content smoothly
    setTimeout(() => scrollManager.scrollToElement(".step-content", 80), 200);
};

// Handle PIN enabled from setup modal
const handlePinEnabled = () =>
{
    showPinSetupModal.value = false;
    // Update the generated account to reflect PIN is now enabled
    if (generatedAccount.value) {
        generatedAccount.value = {
            ...generatedAccount.value,
            pinEnabled: true
        };
    }
    // Don't auto-advance after PIN setup - let user decide when to continue
};

// Handle continue click - show modal only if user hasn't copied yet
const handleContinueClick = () =>
{
    if (hascopied.value) {
        nextStep();
    } else {
        showLeaveWarningModal.value = true;
    }
};

// Handle copy and proceed from leave warning modal
const handleCopyAndProceed = async () =>
{
    // Copy account number to clipboard
    if (generatedAccount.value) {
        const accountNumber = generatedAccount.value.id;
        if (accountNumber) {
            try {
                if (navigator.clipboard?.writeText) {
                    await navigator.clipboard.writeText(accountNumber);
                } else {
                    // Fallback copy method
                    const el = document.createElement("textarea");
                    el.value = accountNumber;
                    el.setAttribute("readonly", "");
                    el.style.position = "absolute";
                    el.style.left = "-9999px";
                    document.body.appendChild(el);
                    el.select();
                    document.execCommand("copy");
                    document.body.removeChild(el);
                }
            } catch (error) {
                // Silently fail - user can still manually copy from the card
            }
        }
    }
    
    // Close modal and proceed
    showLeaveWarningModal.value = false;
    nextStep();
};
</script>

<style scoped>
.account-flow {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  color: #333;
}

.account-flow.mobile-flow {
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.steps-indicator {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;
  position: relative;
}

.steps-indicator.mobile-steps {
  margin-bottom: 1.5rem;
  gap: 0.5rem;
}

.steps-indicator::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  height: 2px;
  background: #e2e8f0;
  z-index: 1;
}

.steps-indicator.mobile-steps::before {
  top: 16px;
  left: 16px;
  right: 16px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
}

.step.mobile-step {
  flex: 1;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #a0aec0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
}

.mobile-step .step-number {
  width: 32px;
  height: 32px;
  font-size: 0.875rem;
}

.step.active .step-number {
  background: #1f2937;
  color: white;
}

.step.completed .step-number {
  background: #48bb78;
  color: white;
}

.step-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #4a5568;
  text-align: center;
}

.mobile-step .step-title {
  font-size: 0.75rem;
}

.step.active .step-title {
  color: #1f2937;
}

.step.completed .step-title {
  color: #48bb78;
}

.step-content {
  min-height: 400px;
}

.mobile-flow .step-content {
  min-height: 300px;
}

.step-panel {
  text-align: center;
}

.referral-welcome {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  color: white;
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  text-align: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.mobile-flow .referral-welcome {
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.welcome-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  animation: bounce 1s ease-in-out;
}

.mobile-flow .welcome-icon {
  font-size: 3rem;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.referral-welcome h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: white;
  font-weight: 700;
}

.mobile-flow .referral-welcome h2 {
  font-size: 1.5rem;
}

.welcome-message {
  font-size: 1.125rem;
  opacity: 0.95;
  line-height: 1.6;
  margin: 0;
}

.mobile-flow .welcome-message {
  font-size: 1rem;
}

.referral-benefits {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.mobile-flow .referral-benefits {
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.25rem;
}

.benefit {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.15);
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.benefit:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.mobile-flow .benefit {
  padding: 0.625rem 1rem;
  border-radius: 10px;
}

.mobile-flow .benefit:hover {
  transform: none;
}

.benefit-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.mobile-flow .benefit-icon {
  font-size: 1.125rem;
}

.benefit-text {
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  white-space: nowrap;
}

.mobile-flow .benefit-text {
  font-size: 0.875rem;
  white-space: normal;
}

.step-header.with-referral {
  margin-top: 0;
}

.step-header h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #1a202c;
}

.mobile-flow .step-header h2 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
}

.step-header p {
  font-size: 1.1rem;
  color: #4a5568;
  margin-bottom: 2rem;
}

.mobile-flow .step-header p {
  font-size: 0.9375rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.step-actions {
  margin-bottom: 3rem;
}

.mobile-flow .step-actions {
  margin-bottom: 2rem;
}

.btn-primary {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 48px;
}

.mobile-flow .btn-primary {
  width: 100%;
  justify-content: center;
  padding: 1rem;
  font-size: 1rem;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.mobile-flow .btn-primary:hover:not(:disabled) {
  transform: none;
}

.mobile-flow .btn-primary:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary.referral-cta {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(72, 187, 120, 0); }
}

.btn-primary.referral-cta:hover:not(:disabled) {
  background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
}

.step-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto;
}

.mobile-flow .step-info {
  gap: 0.75rem;
  max-width: none;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  transition: all 0.2s;
}

.mobile-flow .info-item {
  padding: 0.875rem;
  border-radius: 12px;
  background: rgba(31, 41, 55, 0.05);
}

.info-item .icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.mobile-flow .info-item .icon {
  font-size: 1.25rem;
}

.info-item span:last-child {
  font-weight: 500;
  color: #4a5568;
  text-align: left;
}

.mobile-flow .info-item span:last-child {
  font-size: 0.875rem;
}

</style>