<template>
    <div class="pin-setup">
        <div class="pin-header">
            <h2>🔐 Account Security</h2>
            <p>Add an optional PIN for extra security on your account</p>
        </div>

        <div
            v-if="!account.pinEnabled"
            class="pin-setup-form"
        >
            <h3>Set Up PIN (Optional)</h3>
            <p>Choose a 4-8 digit PIN to add extra security to your account. PINs are completely optional.</p>

            <div class="form-group">
                <label for="new-pin">New PIN</label>
                <input
                    id="new-pin"
                    v-model="newPin"
                    type="password"
                    maxlength="8"
                    placeholder="Enter 4-8 digits"
                    @input="validatePin"
                >
                <span
                    v-if="pinError"
                    class="error-text"
                >{{ pinError }}</span>
            </div>

            <div class="form-group">
                <label for="confirm-pin">Confirm PIN</label>
                <input
                    id="confirm-pin"
                    v-model="confirmPin"
                    type="password"
                    maxlength="8"
                    placeholder="Confirm your PIN"
                >
            </div>

            <button
                :disabled="!canSetupPin || processing"
                class="btn-primary"
                @click="setupPin"
            >
                <span v-if="processing">Setting up...</span>
                <span v-else>Set Up PIN</span>
            </button>
        </div>

        <div
            v-else
            class="pin-management"
        >
            <div class="pin-status">
                <span class="status-icon">✅</span>
                <span>PIN protection is enabled</span>
            </div>

            <div class="pin-actions">
                <button
                    class="btn-secondary"
                    @click="showDisableForm = true"
                >
                    Disable PIN
                </button>
            </div>

            <div
                v-if="showDisableForm"
                class="disable-form"
            >
                <h3>Disable PIN Protection</h3>
                <p>Enter your current PIN to disable protection</p>

                <div class="form-group">
                    <label for="current-pin">Current PIN</label>
                    <input
                        id="current-pin"
                        v-model="currentPin"
                        type="password"
                        maxlength="8"
                        placeholder="Enter current PIN"
                    >
                </div>

                <div class="form-actions">
                    <button
                        :disabled="!currentPin || processing"
                        class="btn-danger"
                        @click="disablePin"
                    >
                        <span v-if="processing">Disabling...</span>
                        <span v-else>Disable PIN</span>
                    </button>
                    <button
                        class="btn-secondary"
                        @click="showDisableForm = false"
                    >
                        Cancel
                    </button>
                </div>
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
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

import ConfirmationModal from "~/components/ConfirmationModal.vue";

const { $csrfFetch } = useNuxtApp();

const route = useRoute();
const accountId = route.params.id;

// Use useFetch for initial account data loading
const { data: account, error: accountError, refresh: refreshAccount } = await useCsrfFetch(`/api/account/${accountId}`);

const newPin = ref("");
const confirmPin = ref("");
const currentPin = ref("");
const pinError = ref("");
const processing = ref(false);
const showDisableForm = ref(false);
const showModal = ref(false);
const modalConfig = ref({});

const canSetupPin = computed(() =>
{
    return newPin.value.length >= 4
        && newPin.value === confirmPin.value
        && !pinError.value;
});

function validatePin()
{
    if (newPin.value.length > 0 && (newPin.value.length < 4 || newPin.value.length > 8))
    {
        pinError.value = "PIN must be 4-8 digits";
    }
    else if (newPin.value && !/^\d+$/.test(newPin.value))
    {
        pinError.value = "PIN must contain only numbers";
    }
    else
    {
        pinError.value = "";
    }
}

async function setupPin()
{
    processing.value = true;

    try
    {
        await $csrfFetch(`/api/account/${accountId}/pin`, {
            method: "PUT",
            body: { pin: newPin.value },
        });

        await refreshAccount();
        newPin.value = "";
        confirmPin.value = "";
        showModal.value = true;
        modalConfig.value = {
            title: "🔐 PIN Set Up Successfully!",
            message: "Your PIN has been set up successfully. Your account is now protected with PIN authentication.",
            confirmText: "Great",
        };
    }
    catch (error)
    {
        console.error("PIN setup failed:", error);
        showModal.value = true;
        modalConfig.value = {
            title: "PIN Setup Failed",
            message: "Failed to set up PIN. Please try again or contact support if the issue persists.",
            confirmText: "OK",
        };
    }
    finally
    {
        processing.value = false;
    }
}

async function disablePin()
{
    processing.value = true;

    try
    {
        console.log("[PIN] Attempting to disable PIN via legacy page");
        await $csrfFetch(`/api/account/${accountId}/pin`, {
            method: "DELETE",
            body: { pin: currentPin.value },
        });
        console.log("[PIN] Legacy PIN disable completed successfully");

        // Only proceed if we get here (200 OK response)
        await refreshAccount();
        currentPin.value = "";
        showDisableForm.value = false;
        showModal.value = true;
        modalConfig.value = {
            title: "PIN Disabled Successfully",
            message: "PIN protection has been disabled for your account. You can re-enable it at any time.",
            confirmText: "OK",
        };
    }
    catch (error)
    {
        console.error("[PIN] Legacy PIN disable failed:", error);
        // Any non-200 response means the PIN was invalid - block the operation
        showModal.value = true;
        modalConfig.value = {
            title: "PIN Disable Failed",
            message: "Current PIN is incorrect. Please check your PIN and try again.",
            confirmText: "OK",
        };
        // Do NOT clear the form or close the disable form
    }
    finally
    {
        processing.value = false;
    }
}

const handleModalConfirm = () =>
{
    showModal.value = false;
    modalConfig.value = {};
};

const handleModalClose = () =>
{
    showModal.value = false;
    modalConfig.value = {};
};

useHead({
    title: "Account Security - For the Badge",
    meta: [{ name: "description", content: "Manage your account security settings and PIN protection." }],
});
</script>

<style scoped>
.pin-setup {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
}

.pin-header {
  text-align: center;
  margin-bottom: 2rem;
}

.pin-header h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1a202c;
}

.pin-setup-form, .pin-management {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #4a5568;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
}

.error-text {
  color: #e53e3e;
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

.pin-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #d1fae5;
  border-radius: 8px;
  color: #065f46;
  margin-bottom: 1.5rem;
}

.status-icon {
  font-size: 1.2rem;
}

.btn-primary, .btn-secondary, .btn-danger {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  color: white;
  width: 100%;
}

.btn-secondary {
  background: #e2e8f0;
  color: #4a5568;
  margin-right: 1rem;
}

.btn-danger {
  background: #e53e3e;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.disable-form {
  border-top: 1px solid #e2e8f0;
  padding-top: 1.5rem;
  margin-top: 1.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
}

@media (max-width: 768px) {
  .pin-setup {
    padding: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-secondary {
    margin-right: 0;
  }
}
</style>