<template>
    <div
        v-if="showPinPrompt"
        class="pin-prompt-overlay"
        @click="handleOverlayClick"
    >
        <div
            class="pin-prompt-modal"
            @click.stop
        >
            <div class="pin-prompt-header">
                <h3>🔐 Enter Your PIN</h3>
                <p>This account is secured with a PIN. Please enter your PIN to continue.</p>
            </div>

            <div class="pin-input-section">
                <div class="pin-input-group">
                    <label for="account-pin">Account PIN</label>
                    <input
                        id="account-pin"
                        v-model="enteredPin"
                        type="password"
                        inputmode="numeric"
                        pattern="[0-9]*"
                        maxlength="8"
                        placeholder="Enter your PIN"
                        class="pin-input"
                        @keyup.enter="verifyPin"
                        @input="validatePinInput"
                    >
                    <div
                        v-if="pinError"
                        class="error-message"
                    >
                        {{ pinError }}
                    </div>
                </div>
            </div>

            <div class="pin-prompt-actions">
                <button
                    class="btn-cancel"
                    @click="cancelPinPrompt"
                >
                    Cancel
                </button>
                <button
                    :disabled="!isValidPin || verifying"
                    class="btn-verify"
                    @click="verifyPin"
                >
                    <span v-if="verifying">Verifying...</span>
                    <span v-else>🔓 Verify PIN</span>
                </button>
            </div>
        </div>
    </div>

    <!-- Error Modal for Invalid PIN -->
    <ConfirmationModal
        :show="showErrorModal"
        title="Invalid PIN"
        :message="errorModalMessage"
        confirmText="OK"
        :showCancel="false"
        @confirm="closeErrorModal"
        @close="closeErrorModal"
    />
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
    accountId: {
        type: String,
        required: true,
    },
    show: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["pin-verified", "pin-cancelled"]);

const { challengePin } = usePinService();
const { clearClientSession } = useAuth();

const showPinPrompt = computed(() => props.show);
const enteredPin = ref("");
const pinError = ref("");
const verifying = ref(false);
const showErrorModal = ref(false);
const errorModalMessage = ref("");

const isValidPin = computed(() =>
{
    return enteredPin.value.length >= 4 && enteredPin.value.length <= 8 && /^\d+$/.test(enteredPin.value);
});

const validatePinInput = () =>
{
    enteredPin.value = enteredPin.value.replace(/\D/g, "");
    pinError.value = "";
};

const verifyPin = async () =>
{
    if (!isValidPin.value)
    {
        return;
    }

    verifying.value = true;
    pinError.value = "";

    try
    {
        await challengePin({ pin: enteredPin.value });
        // Only emit pin-verified if we reach this line (no error thrown)
        emit("pin-verified");
        enteredPin.value = "";
        console.log("[PIN] Verification successful");
    }
    catch (error)
    {
        // Log the error for debugging but show generic message to user
        console.error("[PIN] Verification failed:", error);

        // Clear client-side session since backend has already cleared it on failed challenge
        console.log("[PIN] Clearing frontend session due to failed challenge");
        await clearClientSession();

        // Handle specific error cases while maintaining security
        if (error?.statusCode === 429)
        {
            errorModalMessage.value = "Too many failed attempts. Please wait 15 minutes before trying again.";
        }
        else
        {
            // Always show generic message for other errors (401, 500, etc) to prevent brute forcing
            errorModalMessage.value = "The PIN you entered was invalid. Please try again.";
        }

        // Show error modal immediately
        showErrorModal.value = true;
        
        // Ensure we do NOT emit pin-verified on any error
        // The error could be 401 (invalid PIN), 429 (rate limited), 500 (server error), or network issues
        // In ALL cases, we must block authentication
    }
    finally
    {
        verifying.value = false;
    }
};

const handleOverlayClick = () =>
{
    cancelPinPrompt();
};

const cancelPinPrompt = () =>
{
    enteredPin.value = "";
    pinError.value = "";
    emit("pin-cancelled");
};

const closeErrorModal = () =>
{
    showErrorModal.value = false;
    errorModalMessage.value = "";
    // Now close the PIN modal after user acknowledges the error
    emit("pin-cancelled");
};
</script>

<style scoped>
.pin-prompt-overlay {
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

.pin-prompt-modal {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.pin-prompt-header {
  text-align: center;
  margin-bottom: 2rem;
}

.pin-prompt-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1a202c;
}

.pin-prompt-header p {
  color: #4a5568;
  font-size: 0.95rem;
}

.pin-input-section {
  margin-bottom: 2rem;
}

.pin-input-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #4a5568;
}

.pin-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1.1rem;
  text-align: center;
  letter-spacing: 2px;
  font-family: monospace;
  transition: border-color 0.3s ease;
}

.pin-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.error-message {
  color: #e53e3e;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  text-align: center;
}

.pin-prompt-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-cancel, .btn-verify {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-cancel:hover {
  background: #cbd5e0;
}

.btn-verify {
  background: #667eea;
  color: white;
}

.btn-verify:hover:not(:disabled) {
  background: #5a67d8;
  transform: translateY(-1px);
}

.btn-verify:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .pin-prompt-modal {
    padding: 1.5rem;
  }

  .pin-prompt-actions {
    flex-direction: column;
  }

  .btn-cancel, .btn-verify {
    width: 100%;
  }
}
</style>