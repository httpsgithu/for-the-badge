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
                <h2>⚠ Delete Account</h2>
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
                        <h3>⚠ This action cannot be undone!</h3>
                        <ul class="warning-list">
                            <li>Your account will be permanently deleted</li>
                            <li>All remaining credits (${{ account.credits.toFixed(2) }}) will be lost</li>
                            <li>Credits are non-refundable and cannot be recovered</li>
                            <li>All account data will be permanently removed</li>
                        </ul>
                    </div>
                </div>

                <div class="confirmation-section">
                    <label for="confirmAccount">
                        To confirm deletion, please enter your account number:
                    </label>
                    <div class="account-reference">
                        {{ account.id }}
                    </div>
                    <input
                        id="confirmAccount"
                        v-model="confirmAccountNumber"
                        type="text"
                        placeholder="Enter account number to confirm"
                        class="confirm-input"
                        :class="{ error: showError }"
                    >

                    <!-- PIN input section - only show if account has PIN enabled -->
                    <div
                        v-if="account.pinEnabled"
                        class="pin-section"
                    >
                        <label for="confirmPin">
                            Enter your PIN to confirm deletion:
                        </label>
                        <input
                            id="confirmPin"
                            v-model="confirmPin"
                            type="password"
                            placeholder="Enter your PIN"
                            class="confirm-input pin-input"
                            :class="{ error: showError }"
                            maxlength="8"
                        >
                    </div>
                    <div
                        v-if="showError"
                        class="error-message"
                    >
                        {{ errorMessage }}
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
                    :disabled="!canDelete || deleting"
                    class="delete-btn"
                    :class="{ deleting: deleting }"
                    @click="deleteAccount"
                >
                    {{ deleting ? 'Deleting...' : 'Delete Account Forever' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    show: Boolean,
    account: Object,
});

const emit = defineEmits(["account-deleted", "modal-cancelled"]);

const { deleteAccount: deleteAccountService } = useAccountService();
const { getErrorMessage } = useErrorHandler();

const confirmAccountNumber = ref("");
const confirmPin = ref("");
const showError = ref(false);
const deleting = ref(false);
const errorMessage = ref("Account number does not match");

const canDelete = computed(() =>
{
    const accountMatches = confirmAccountNumber.value === props.account?.id;
    const pinProvided = !props.account?.pinEnabled || confirmPin.value.length >= 4;

    return accountMatches && pinProvided;
});

const handleOverlayClick = () =>
{
    emit("modal-cancelled");
};

const deleteAccount = async () =>
{
    if (!canDelete.value)
    {
        if (confirmAccountNumber.value !== props.account?.id)
        {
            errorMessage.value = "Account number does not match";
        }
        else if (props.account?.pinEnabled && confirmPin.value.length < 4)
        {
            errorMessage.value = "PIN must be at least 4 characters";
        }
        showError.value = true;

        return;
    }

    showError.value = false;
    deleting.value = true;

    try
    {
        const pin = props.account?.pinEnabled ? confirmPin.value : undefined;
        await deleteAccountService(props.account.id, confirmAccountNumber.value, pin);

        // Clear user session after successful account deletion
        console.log("[DeleteAccount] Account deleted successfully, refreshing page to clear session");

        emit("account-deleted");

        // Refresh the page to clear session data and redirect to login
        // This avoids CSRF token issues with API calls after account deletion
        setTimeout(() =>
        {
            window.location.href = "/account";
        }, 500);
    }
    catch (error)
    {
        console.error("Delete account error:", error);
        if (props.account?.pinEnabled && confirmPin.value)
        {
            errorMessage.value = "Invalid PIN. Please check your PIN and try again.";
        }
        else
        {
            errorMessage.value = "Failed to delete account. Please try again.";
        }
        showError.value = true;
    }
    finally
    {
        deleting.value = false;
    }
};

watch([() => confirmAccountNumber.value, () => confirmPin.value], () =>
{
    showError.value = false;
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
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  margin: 0;
  color: #e53e3e;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: #718096;
  cursor: pointer;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #4a5568;
}

.modal-body {
  padding: 1.5rem;
}

.warning-section {
  margin-bottom: 2rem;
}

.warning-box {
  background: #fed7d7;
  border: 2px solid #fc8181;
  border-radius: 12px;
  padding: 1.5rem;
}

.warning-box h3 {
  margin: 0 0 1rem 0;
  color: #c53030;
  font-size: 1.1rem;
}

.warning-list {
  margin: 0;
  padding-left: 1.5rem;
  color: #742a2a;
}

.warning-list li {
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.confirmation-section label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #4a5568;
}

.pin-section {
  margin-top: 1.5rem;
}

.pin-section label {
  color: #e53e3e;
  font-weight: 700;
}

.account-reference {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 1.1rem;
  font-weight: 700;
  background: #f7fafc;
  padding: 0.75rem;
  border-radius: 6px;
  text-align: center;
  letter-spacing: 1px;
  margin-bottom: 1rem;
  color: #2d3748;
}

.confirm-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Monaco', 'Menlo', monospace;
  letter-spacing: 1px;
  text-align: center;
}

.confirm-input:focus {
  outline: none;
  border-color: #667eea;
}

.confirm-input.error {
  border-color: #e53e3e;
  background: #fed7d7;
}

.error-message {
  color: #e53e3e;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  font-weight: 500;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.cancel-btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: 2px solid #e2e8f0;
  background: white;
  color: #4a5568;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  border-color: #cbd5e0;
  background: #f7fafc;
}

.delete-btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  background: #e53e3e;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.delete-btn:hover:not(:disabled) {
  background: #c53030;
}

.delete-btn:disabled {
  background: #a0aec0;
  cursor: not-allowed;
}

.delete-btn.deleting {
  background: #c53030;
}

@media (max-width: 768px) {
  .modal-content {
    margin: 1rem;
    max-width: none;
  }

  .modal-footer {
    flex-direction: column;
  }
}
</style>