<template>
    <div class="pin-management" :class="{ 'mobile-pin': isMobile }">
        <div class="pin-status-card">
            <div class="pin-header">
                <h3>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.1 14.8,9.5V11C15.4,11 16,11.6 16,12.3V15.8C16,16.4 15.4,17 14.7,17H9.2C8.6,17 8,16.4 8,15.7V12.2C8,11.6 8.6,11 9.2,11V9.5C9.2,8.1 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,9.5V11H13.5V9.5C13.5,8.7 12.8,8.2 12,8.2Z"/>
                    </svg>
                    PIN Security
                </h3>
                <div class="pin-status">
                    <span
                        v-if="account?.pinEnabled"
                        class="status-enabled"
                    >Enabled</span>
                    <span
                        v-else
                        class="status-disabled"
                    >Disabled</span>
                </div>
            </div>

            <p
                v-if="account?.pinEnabled"
                class="pin-description"
            >
                Your account is secured with a PIN. You'll be prompted to enter your PIN when signing in.
            </p>
            <p
                v-else
                class="pin-description"
            >
                Add an optional PIN for extra security. You can skip this and set it up later if you prefer.
            </p>

            <div class="pin-actions">
                <button
                    v-if="!account?.pinEnabled"
                    class="btn-primary"
                    @click="$emit('setup-pin')"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/>
                    </svg>
                    Set up PIN (Optional)
                </button>
                <div
                    v-else
                    class="enabled-actions"
                >
                    <button
                        class="btn-secondary"
                        @click="$emit('change-pin')"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12,6V9L16,5L12,1V4A8,8 0 0,0 4,12C4,13.57 4.46,15.03 5.24,16.26L6.7,14.8C6.25,13.97 6,13 6,12A6,6 0 0,1 12,6M18.76,7.74L17.3,9.2C17.74,10.04 18,11 18,12A6,6 0 0,1 12,18V15L8,19L12,23V20A8,8 0 0,0 20,12C20,10.43 19.54,8.97 18.76,7.74Z"/>
                        </svg>
                        Change PIN
                    </button>
                    <button
                        class="btn-danger"
                        @click="$emit('disable-pin')"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18,20V10H6V20H18M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V10A2,2 0 0,1 6,8H15V6A3,3 0 0,0 12,3A3,3 0 0,0 9,6H7A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,17A2,2 0 0,1 10,15A2,2 0 0,1 12,13A2,2 0 0,1 14,15A2,2 0 0,1 12,17Z"/>
                        </svg>
                        Disable PIN
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { isMobileDevice } from '~/utils/deviceDetection';

// Mobile detection based on user agent
const isMobile = computed(() => {
    if (import.meta.client) {
        return isMobileDevice();
    }
    return false;
});

const props = defineProps({
    account: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits([
    "setup-pin",
    "change-pin",
    "disable-pin",
]);
</script>

<style scoped>
.pin-management {
  margin-bottom: 2rem;
}

.mobile-pin.pin-management {
  margin-bottom: 1.5rem;
}

.pin-status-card {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
}

.mobile-pin .pin-status-card {
  padding: 1.25rem;
  border-radius: 10px;
}

.pin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.pin-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.mobile-pin .pin-header h3 {
  font-size: 1rem;
}

.status-enabled {
  background: #c6f6d5;
  color: #22543d;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-disabled {
  background: #fed7d7;
  color: #742a2a;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.pin-description {
  color: #4a5568;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.mobile-pin .pin-description {
  font-size: 0.875rem;
  margin-bottom: 1.25rem;
}

.pin-actions {
  display: flex;
  gap: 1rem;
}

.enabled-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary, .btn-secondary, .btn-danger, .btn-cancel, .btn-confirm {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}

.mobile-pin .btn-primary,
.mobile-pin .btn-secondary,
.mobile-pin .btn-danger {
  width: 100%;
  padding: 0.875rem 1.25rem;
  font-size: 0.9375rem;
}

.btn-primary {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.mobile-pin .btn-primary:hover {
  transform: none;
}

.mobile-pin .btn-primary:active {
  transform: scale(0.98);
}

.btn-secondary {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-secondary:hover {
  background: #cbd5e0;
}

.mobile-pin .btn-secondary:hover {
  background: #e2e8f0;
}

.mobile-pin .btn-secondary:active {
  transform: scale(0.98);
  background: #cbd5e0;
}

.btn-danger {
  background: #fed7d7;
  color: #c53030;
}

.btn-danger:hover {
  background: #feb2b2;
}

.mobile-pin .btn-danger:hover {
  background: #fed7d7;
}

.mobile-pin .btn-danger:active {
  transform: scale(0.98);
  background: #feb2b2;
}

.mobile-pin .pin-header {
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.mobile-pin .pin-actions,
.mobile-pin .enabled-actions {
  flex-direction: column;
  width: 100%;
}
</style>