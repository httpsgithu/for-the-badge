<template>
    <div
        v-if="show"
        class="modal-overlay"
        @click="handleOverlayClick"
    >
        <div
            class="modal-content"
            @click.stop
        >
            <div class="modal-header">
                <h2>
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        style="vertical-align: text-bottom; margin-right: 6px;"
                    >
                        <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.1,7 14,7.9 14,9C14,10.1 13.1,11 12,11C10.9,11 10,10.1 10,9C10,7.9 10.9,7 12,7M12,14C13.65,14 15,14.9 15,16V17H9V16C9,14.9 10.35,14 12,14Z" />
                    </svg>
                    Change PIN
                </h2>
                <button
                    class="close-btn"
                    @click="$emit('modal-cancelled')"
                >
                    ×
                </button>
            </div>

            <div class="modal-body">
                <p class="description">
                    Enter your current PIN and create a new one
                </p>

                <div class="pin-inputs">
                    <input
                        ref="currentPinInputRef"
                        v-model="changePin.currentPin"
                        type="password"
                        inputmode="numeric"
                        pattern="[0-9]*"
                        maxlength="8"
                        placeholder="Current PIN"
                        class="pin-input"
                        autocomplete="off"
                        :aria-invalid="changePin.error ? 'true' : 'false'"
                        :aria-describedby="changePin.error ? 'pin-error' : undefined"
                    >
                    <input
                        v-model="changePin.newPin"
                        type="password"
                        inputmode="numeric"
                        pattern="[0-9]*"
                        maxlength="8"
                        placeholder="New PIN"
                        class="pin-input"
                        autocomplete="off"
                        :aria-invalid="changePin.error ? 'true' : 'false'"
                        :aria-describedby="changePin.error ? 'pin-error' : undefined"
                        @input="validateChangePin"
                    >
                    <input
                        v-model="changePin.confirmPin"
                        type="password"
                        inputmode="numeric"
                        pattern="[0-9]*"
                        maxlength="8"
                        placeholder="Confirm new PIN"
                        class="pin-input"
                        autocomplete="off"
                        :aria-invalid="changePin.error ? 'true' : 'false'"
                        :aria-describedby="changePin.error ? 'pin-error' : undefined"
                        @input="validateChangePin"
                    >
                    <div
                        v-if="changePin.error"
                        id="pin-error"
                        class="error-message"
                        role="alert"
                        aria-live="assertive"
                    >
                        {{ changePin.error }}
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button
                    class="cancel-btn"
                    @click="$emit('modal-cancelled')"
                >
                    Cancel
                </button>
                <button
                    :disabled="!changePin.isValid || changePin.loading"
                    class="confirm-btn"
                    @click="updatePin"
                >
                    <span v-if="changePin.loading">Updating...</span>
                    <span v-else>Update PIN</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";

const props = defineProps({
    show: Boolean,
    account: Object,
});

const emit = defineEmits(["pin-updated", "modal-cancelled"]);

const { updatePin: updatePinService } = usePinService();
const { getErrorMessage } = useErrorHandler();

const changePin = ref({
    currentPin: "",
    newPin: "",
    confirmPin: "",
    error: "",
    loading: false,
    isValid: false,
});

const currentPinInputRef = ref(null);

const validateChangePin = () =>
{
    changePin.value.error = "";
    changePin.value.isValid = false;

    const newPin = changePin.value.newPin.replace(/\D/g, "");
    const confirmPin = changePin.value.confirmPin.replace(/\D/g, "");

    changePin.value.newPin = newPin;
    changePin.value.confirmPin = confirmPin;

    if (newPin && newPin.length < 4)
    {
        changePin.value.error = "PIN must be at least 4 digits";

        return;
    }

    if (newPin && newPin.length > 8)
    {
        changePin.value.error = "PIN must be no more than 8 digits";

        return;
    }

    if (confirmPin && newPin !== confirmPin)
    {
        changePin.value.error = "PINs do not match";

        return;
    }

    if (changePin.value.currentPin && newPin && confirmPin && newPin === confirmPin && newPin.length >= 4)
    {
        changePin.value.isValid = true;
    }
};

const updatePin = async () =>
{
  if (!changePin.value.isValid)
  {
    return;
  }

  changePin.value.loading = true;
  changePin.value.error = "";

  try
  {
    console.log("[PIN] Attempting to update PIN");
    await updatePinService(props.account.id, {
      currentPin: changePin.value.currentPin,
      newPin: changePin.value.newPin,
    });
    console.log("[PIN] PIN update completed successfully");

    emit("pin-updated");
    resetForm();
    emit("modal-cancelled"); // close modal only on success
  }
  catch (error)
  {
    console.error("[PIN] PIN update failed:", error);
    changePin.value.error = "Current PIN is incorrect. Please check and try again.";
    // modal stays open so user can retry
  }
  finally
  {
    changePin.value.loading = false;
  }
};


const resetForm = () =>
{
    changePin.value.currentPin = "";
    changePin.value.newPin = "";
    changePin.value.confirmPin = "";
    changePin.value.error = "";
    changePin.value.isValid = false;
};

const handleOverlayClick = () =>
{
    emit("modal-cancelled");
};

watch(() => props.show, async (newShow) =>
{
    if (newShow)
    {
        resetForm();
        await nextTick();
        currentPinInputRef.value?.focus();
    }
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
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: 1rem;
}

.modal-content {
    background: white;
    border-radius: 16px;
    max-width: 400px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem 0;
    margin-bottom: 1rem;
}

.modal-header h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    color: #1a202c;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #4a5568;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s ease;
}

.close-btn:hover {
    background: #f7fafc;
    color: #2d3748;
}

.modal-body {
    padding: 0 2rem;
}

.description {
    color: #4a5568;
    font-size: 0.95rem;
    text-align: center;
    margin-bottom: 2rem;
}

.pin-inputs {
    margin-bottom: 2rem;
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
    margin-bottom: 1rem;
}

.pin-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.error-message {
    color: #e53e3e;
    font-size: 0.9rem;
    text-align: center;
    margin-top: -0.5rem;
}

.modal-footer {
    padding: 2rem;
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}

.cancel-btn, .confirm-btn {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
}

.cancel-btn {
    background: #e2e8f0;
    color: #4a5568;
}

.cancel-btn:hover {
    background: #cbd5e0;
}

.confirm-btn {
    background: #667eea;
    color: white;
}

.confirm-btn:hover:not(:disabled) {
    background: #5a67d8;
    transform: translateY(-1px);
}

.confirm-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

@media (max-width: 768px) {
    .modal-content {
        margin: 0 1rem;
    }

    .modal-header {
        padding: 1rem 1.5rem 0;
    }

    .modal-body {
        padding: 0 1.5rem;
    }

    .modal-footer {
        padding: 1.5rem;
        flex-direction: column;
    }
}
</style>