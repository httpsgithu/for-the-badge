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
                        <path d="M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V10A2,2 0 0,1 6,8H7A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3M11,14V18H13V14H11Z" />
                    </svg>
                    Disable PIN Security
                </h2>
                <button
                    class="close-btn"
                    @click="$emit('modal-cancelled')"
                >
                    ×
                </button>
            </div>

            <div class="modal-body">
                <div class="warning-section">
                    <div class="warning-box">
                        <h3>⚠ Are you sure?</h3>
                        <p>
                            Disabling PIN security will remove the extra layer of protection from your account.
                            You'll only need your account number to sign in.
                        </p>
                    </div>
                </div>

                <p class="description">
                    Enter your current PIN to disable PIN security
                </p>

                <div class="pin-inputs">
                    <input
                        ref="pinInputRef"
                        v-model="disablePin.currentPin"
                        type="password"
                        inputmode="numeric"
                        pattern="[0-9]*"
                        maxlength="8"
                        placeholder="Current PIN"
                        class="pin-input"
                        autocomplete="off"
                        :aria-invalid="disablePin.error ? 'true' : 'false'"
                        :aria-describedby="disablePin.error ? 'pin-error' : undefined"
                    >
                    <div
                        v-if="disablePin.error"
                        id="pin-error"
                        class="error-message"
                        role="alert"
                        aria-live="assertive"
                    >
                        {{ disablePin.error }}
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
                    :disabled="!disablePin.currentPin || disablePin.loading"
                    class="disable-btn"
                    @click="disablePinSecurity"
                >
                    <span v-if="disablePin.loading">Disabling...</span>
                    <span v-else>Disable PIN</span>
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

const emit = defineEmits(["pin-disabled", "modal-cancelled"]);

const { deletePin } = usePinService();
const { getErrorMessage } = useErrorHandler();

const disablePin = ref({
    currentPin: "",
    error: "",
    loading: false,
});

const pinInputRef = ref(null);

const disablePinSecurity = async () =>
{
  if (!disablePin.value.currentPin)
  {
    return;
  }

  disablePin.value.loading = true;
  disablePin.value.error = "";

  try
  {
    console.log("[PIN] Attempting to disable PIN");
    await deletePin(props.account.id, { pin: disablePin.value.currentPin });
    console.log("[PIN] PIN disable completed successfully");

    emit("pin-disabled");
    resetForm();
    emit("modal-cancelled"); // close modal only on success
  }
  catch (error)
  {
    console.error("[PIN] PIN disable failed:", error);
    disablePin.value.error = "Current PIN is incorrect. Please check and try again.";
    // modal stays open so user can retry
  }
  finally
  {
    disablePin.value.loading = false;
  }
};


const resetForm = () =>
{
    disablePin.value.currentPin = "";
    disablePin.value.error = "";
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
        pinInputRef.value?.focus();
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

.warning-section {
    margin-bottom: 2rem;
}

.warning-box {
    background: #fef5e7;
    border: 1px solid #f6d55c;
    border-radius: 8px;
    padding: 1rem;
}

.warning-box h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #975a16;
    margin: 0 0 0.5rem 0;
}

.warning-box p {
    color: #975a16;
    font-size: 0.9rem;
    margin: 0;
    line-height: 1.4;
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

.cancel-btn, .disable-btn {
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

.disable-btn {
    background: #e53e3e;
    color: white;
}

.disable-btn:hover:not(:disabled) {
    background: #c53030;
    transform: translateY(-1px);
}

.disable-btn:disabled {
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