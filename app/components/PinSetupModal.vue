<template>
    <Teleport to="body">
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
                            <path d="M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V10A2,2 0 0,1 6,8H15V6A3,3 0 0,0 12,3A3,3 0 0,0 9,6H7A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,17A2,2 0 0,0 14,15A2,2 0 0,0 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17Z" />
                        </svg>
                        Enable PIN Security
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
                        Create a 4–8 digit PIN to secure your account (optional)
                    </p>

                    <div class="pin-inputs">
                        <input
                            ref="pinInputRef"
                            v-model="setupPin.pin"
                            type="password"
                            inputmode="numeric"
                            pattern="[0-9]*"
                            maxlength="8"
                            placeholder="Enter new PIN"
                            class="pin-input"
                            autocomplete="off"
                            :aria-invalid="setupPin.error ? 'true' : 'false'"
                            :aria-describedby="setupPin.error ? 'pin-error' : undefined"
                            @input="validateSetupPin"
                        >
                        <input
                            v-model="setupPin.confirmPin"
                            type="password"
                            inputmode="numeric"
                            pattern="[0-9]*"
                            maxlength="8"
                            placeholder="Confirm new PIN"
                            class="pin-input"
                            autocomplete="off"
                            :aria-invalid="setupPin.error ? 'true' : 'false'"
                            :aria-describedby="setupPin.error ? 'pin-error' : undefined"
                            @input="validateSetupPin"
                        >
                        <div
                            v-if="setupPin.error"
                            id="pin-error"
                            class="error-message"
                            role="alert"
                            aria-live="assertive"
                        >
                            {{ setupPin.error }}
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
                        :disabled="!setupPin.isValid || setupPin.loading"
                        class="confirm-btn"
                        @click="enablePin"
                    >
                        <span v-if="setupPin.loading">Enabling...</span>
                        <span v-else>Enable PIN</span>
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onUnmounted } from "vue";

const props = defineProps({
    show: Boolean,
    account: Object,
});

const emit = defineEmits(["pin-enabled", "modal-cancelled"]);

const { createPin } = usePinService();
const { getErrorMessage } = useErrorHandler();

const setupPin = ref({
    pin: "",
    confirmPin: "",
    error: "",
    loading: false,
    isValid: false,
});

const pinInputRef = ref(null);

const validateSetupPin = () =>
{
    setupPin.value.error = "";
    setupPin.value.isValid = false;

    const pin = setupPin.value.pin.replace(/\D/g, "");
    const confirmPin = setupPin.value.confirmPin.replace(/\D/g, "");

    setupPin.value.pin = pin;
    setupPin.value.confirmPin = confirmPin;

    if (pin && pin.length < 4)
    {
        setupPin.value.error = "PIN must be at least 4 digits";

        return;
    }

    if (pin && pin.length > 8)
    {
        setupPin.value.error = "PIN must be no more than 8 digits";

        return;
    }

    if (confirmPin && pin !== confirmPin)
    {
        setupPin.value.error = "PINs do not match";

        return;
    }

    if (pin && confirmPin && pin === confirmPin && pin.length >= 4)
    {
        setupPin.value.isValid = true;
    }
};

const enablePin = async () =>
{
    if (!setupPin.value.isValid)
    {
        return;
    }

    setupPin.value.loading = true;
    setupPin.value.error = "";

    try
    {
        await createPin(props.account.id, { pin: setupPin.value.pin });
        emit("pin-enabled");
        resetForm();
    }
    catch (error)
    {
        setupPin.value.error = getErrorMessage(error, "Failed to enable PIN. Please try again.");
    }
    finally
    {
        setupPin.value.loading = false;
    }
};

const resetForm = () =>
{
    setupPin.value.pin = "";
    setupPin.value.confirmPin = "";
    setupPin.value.error = "";
    setupPin.value.isValid = false;
};

const handleOverlayClick = () =>
{
    emit("modal-cancelled");
};

watch(() => props.show, async (newShow) =>
{
    if (newShow)
    {
        // Prevent body scroll when modal is open
        document.body.classList.add("modal-open");
        resetForm();
        await nextTick();
        pinInputRef.value?.focus();
    }
    else
    {
        // Re-enable body scroll when modal is closed
        document.body.classList.remove("modal-open");
    }
});

// Cleanup on component unmount
onUnmounted(() =>
{
    document.body.classList.remove("modal-open");
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
  /* Ensure the modal breaks out of any parent container constraints */
  margin: 0;
  /* Force viewport positioning */
  transform: translateZ(0);
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
    border-color: #1f2937;
    box-shadow: 0 0 0 3px rgba(31, 41, 55, 0.1);
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
    background: #1f2937;
    color: white;
}

.confirm-btn:hover:not(:disabled) {
    background: #111827;
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

<style>
/* Global styles for modal */
body.modal-open {
    overflow: hidden;
    position: fixed;
    width: 100%;
}
</style>