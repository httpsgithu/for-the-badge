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
                <h3>{{ title }}</h3>
            </div>

            <div class="modal-body">
                <p>{{ message }}</p>
            </div>

            <div class="modal-actions">
                <button
                    v-if="showCancel"
                    class="btn-secondary"
                    :disabled="loading"
                    @click="handleCancel"
                >
                    {{ cancelText }}
                </button>
                <button
                    class="btn-primary"
                    :disabled="loading"
                    @click="handleConfirm"
                >
                    <span
                        v-if="loading"
                        class="loading-spinner"
                    />
                    {{ confirmText }}
                </button>
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
    title: {
        type: String,
        default: "Confirmation",
    },
    message: {
        type: String,
        required: true,
    },
    confirmText: {
        type: String,
        default: "OK",
    },
    cancelText: {
        type: String,
        default: "Cancel",
    },
    showCancel: {
        type: Boolean,
        default: false,
    },
    loading: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits([
    "confirm",
    "cancel",
    "close",
]);

const handleConfirm = () =>
{
    emit("confirm");
};

const handleCancel = () =>
{
    emit("cancel");
};

const handleOverlayClick = () =>
{
    if (!props.loading)
    {
        emit("close");
    }
};
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
  max-width: 400px;
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
  padding: 1.5rem 1.5rem 0;
  border-bottom: none;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  text-align: center;
}

.modal-body {
  padding: 1rem 1.5rem;
}

.modal-body p {
  margin: 0;
  color: #4a5568;
  line-height: 1.5;
  text-align: center;
}

.modal-actions {
  padding: 0 1.5rem 1.5rem;
  display: flex;
  gap: 0.75rem;
  justify-content: center;
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
  min-width: 80px;
}

.btn-primary {
  background: #000000;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #333333;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
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

@media (max-width: 768px) {
  .modal-content {
    margin: 1rem;
    width: calc(100% - 2rem);
  }

  .modal-actions {
    flex-direction: column;
  }

  .btn-primary, .btn-secondary {
    width: 100%;
  }
}
</style>