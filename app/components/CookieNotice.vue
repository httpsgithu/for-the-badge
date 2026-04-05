<template>
    <div v-if="showNotice" class="cookie-notice">
        <div class="cookie-content">
            <div class="cookie-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm4 7.5c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1zm-3 3c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1zm-3-6c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1z" fill="currentColor"/>
                </svg>
            </div>
            
            <div class="cookie-text">
                <p><strong>Essential Cookies Notice</strong></p>
                <p>This website uses only essential cookies required for authentication and security. No tracking or analytics cookies are used. <NuxtLink to="/legal/cookies" class="cookie-link">Learn more</NuxtLink></p>
            </div>
            
            <button @click="dismissNotice" class="cookie-dismiss" aria-label="Dismiss cookie notice">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const STORAGE_KEY = 'ftb_cookie_notice_dismissed'
const showNotice = ref(false)

const dismissNotice = () => {
    showNotice.value = false
    if (import.meta.client) {
        try {
            localStorage.setItem(STORAGE_KEY, 'true')
        } catch (error) {
            // Ignore localStorage errors
        }
    }
}

onMounted(() => {
    if (!import.meta.client) return
    
    try {
        const dismissed = localStorage.getItem(STORAGE_KEY)
        if (!dismissed) {
            // Show notice after a brief delay for better UX
            setTimeout(() => {
                showNotice.value = true
            }, 2000)
        }
    } catch (error) {
        // If localStorage is blocked, show the notice anyway
        setTimeout(() => {
            showNotice.value = true
        }, 2000)
    }
})
</script>

<style scoped>
.cookie-notice {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  right: 2rem;
  max-width: 600px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  z-index: 1000;
  animation: slideInUp 0.6s ease-out;
}

.cookie-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.cookie-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.cookie-text {
  flex: 1;
}

.cookie-text p:first-child {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.cookie-text p:last-child {
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}

.cookie-link {
  color: #000000;
  text-decoration: none;
  font-weight: 500;
}

.cookie-link:hover {
  text-decoration: underline;
}

.cookie-dismiss {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cookie-dismiss:hover {
  background: #f3f4f6;
  color: #6b7280;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .cookie-notice {
    bottom: 1rem;
    left: 1rem;
    right: 1rem;
    padding: 1rem;
  }
  
  .cookie-content {
    gap: 0.75rem;
  }
  
  .cookie-icon {
    width: 40px;
    height: 40px;
  }
  
  .cookie-text p:last-child {
    font-size: 0.85rem;
  }
}
</style>