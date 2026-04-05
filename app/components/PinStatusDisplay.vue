<template>
    <div class="pin-status-display" :class="{ 'mobile-pin': isMobile }">
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
                Your PIN has been set up successfully! Your account is now protected with PIN authentication.
            </p>
            <p
                v-else
                class="pin-description"
            >
                Add an optional PIN for extra security. You can skip this and set it up later if you prefer.
            </p>

            <div class="pin-actions" v-if="!account?.pinEnabled">
                <button
                    class="btn-primary"
                    @click="$emit('setup-pin')"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/>
                    </svg>
                    Set up PIN (Optional)
                </button>
            </div>

            <div v-if="account?.pinEnabled" class="management-note">
                <p>
                    You can change or disable your PIN from your account management page.
                </p>
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
]);
</script>

<style scoped>
.pin-status-display {
  margin-bottom: 2rem;
}

.mobile-pin.pin-status-display {
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
  margin-bottom: 1rem;
}

.btn-primary {
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
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  color: white;
}

.mobile-pin .btn-primary {
  width: 100%;
  padding: 0.875rem 1.25rem;
  font-size: 0.9375rem;
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

.management-note {
  background: #e6fffa;
  border: 1px solid #b2f5ea;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
}

.mobile-pin .management-note {
  padding: 0.875rem;
  border-radius: 6px;
}

.management-note p {
  margin: 0;
  color: #234e52;
  font-size: 0.9rem;
  text-align: center;
}

.mobile-pin .management-note p {
  font-size: 0.875rem;
}

.mobile-pin .pin-header {
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.mobile-pin .pin-actions {
  flex-direction: column;
  width: 100%;
}
</style>