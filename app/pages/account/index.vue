<template>
    <div class="account-page">
        <!-- Animated particles background -->
        <div class="particles-container">
            <div v-for="(particle, index) in particles" :key="index" 
                 class="particle" 
                 :style="{ left: particle.x + '%', bottom: particle.bottom + 'vh', animationDelay: particle.delay + 'ms' }">
            </div>
        </div>
        
        <!-- Desktop Navigation -->
        <NavBar v-if="!isMobile" />
        
        <!-- Mobile Navigation -->
        <MobileNavBar v-if="isMobile" />
        
        <div class="account-container" :class="{ 'mobile-view': isMobile }">
            <div class="account-header">
                <h1>Get Your Account</h1>
                <p>No email, no hassle, no regrets. Just a number and you're good to go.</p>

                <div class="free-badges-message">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M16.31,7.71L10.41,13.61L7.7,10.9L6.29,12.31L10.41,16.43L17.71,9.12L16.31,7.71Z"/>
                    </svg>
                    <span>Create your badge account - it's free</span>
                </div>
            </div>

            <AccountFlow />
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import AccountFlow from "~/components/AccountFlow.vue";
import NavBar from "~/components/NavBar.vue";
import MobileNavBar from "~/components/MobileNavBar.vue";
import { isMobileDevice } from '~/utils/deviceDetection';

// Redirect logged-in users to their account page
// But only if they're not in the middle of the account generation flow
const { loggedIn, accountId } = useAuth();
const isInGenerationFlow = ref(false);

// Use watchEffect to redirect when authentication state is ready
if (import.meta.client) {
    watch([loggedIn, accountId], ([isLoggedIn, id]) => {
        // Don't redirect if user is in the middle of account generation
        if (isLoggedIn && id && !isInGenerationFlow.value) {
            navigateTo(`/account/${id}`);
        }
    }, { immediate: true });
    
    // Set flag when component mounts - indicates user is in generation flow
    onMounted(() => {
        isInGenerationFlow.value = true;
    });
}

const particles = ref([]);

// Generate particles for the background
const generateParticles = () => {
    const particleCount = 60;
    const newParticles = [];
    
    for (let i = 0; i < particleCount; i++) {
        newParticles.push({
            x: Math.random() * 100,
            bottom: Math.random() * 100,
            delay: Math.random() * 15000
        });
    }
    
    particles.value = newParticles;
};

const route = useRoute();

// Mobile detection based on user agent
const isMobile = computed(() => {
    if (import.meta.client) {
        return isMobileDevice();
    }
    return false;
});

// Check if user came via referral link
const hasReferrer = computed(() => !!route.query.referrer);

onMounted(() => {
    generateParticles();
});
</script>

<style scoped>
.account-page {
  min-height: 100vh;
  background: #f8fafb;
  position: relative;
  overflow-x: hidden;
}

/* Particles background */
.particles-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.particle {
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.06);
  animation: float-up 15s infinite linear;
}

@keyframes float-up {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
}

.account-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 8rem 2rem 4rem;
  color: #1f2937;
  position: relative;
  z-index: 1;
}

.account-container.mobile-view {
  padding: 1rem;
  padding-top: 72px; /* Account for top nav */
  padding-bottom: 80px; /* Account for bottom nav */
}

.account-header {
  text-align: center;
  margin-bottom: 3rem;
}

.account-header.referral-header {
  animation: slideDown 0.6s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.referral-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 215, 0, 0.2);
  border: 2px solid rgba(255, 215, 0, 0.4);
  padding: 0.5rem 1.25rem;
  border-radius: 25px;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
  animation: pulse 2s ease-in-out infinite;
}

.badge-icon {
  font-size: 1.25rem;
}

.badge-text {
  font-weight: 700;
  font-size: 0.95rem;
  color: #ffd700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.account-header h1 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.referral-header h1 {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.account-header p {
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
}

.free-badges-message {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.free-badges-message svg {
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .account-header h1 {
    font-size: 2rem;
  }
  
  .referral-badge {
    padding: 0.4rem 1rem;
  }
  
  .badge-icon {
    font-size: 1.125rem;
  }
  
  .badge-text {
    font-size: 0.85rem;
  }
}
</style>