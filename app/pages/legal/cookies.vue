<template>
    <div class="legal-background">
        <!-- Particle background -->
        <div class="particle-container">
            <div v-for="i in 60" :key="i" :class="`particle-${(i % 3) + 1}`"></div>
        </div>
        
        <!-- Desktop Navigation -->
        <NavBar v-if="!isMobile" />
        
        <!-- Mobile Navigation -->
        <MobileNavBar v-if="isMobile" />
        
        <div class="legal-page" :class="{ 'mobile-view': isMobile }">
            <!-- Hero Section -->
            <section class="hero-section">
                <div class="hero-container">
                    <div class="scanning-indicator" v-if="mounted">
                        <div class="scan-dot"></div>
                        <span class="scan-text">Analyzing cookie usage</span>
                        <span class="scan-status" :key="scanStatus">{{ scanStatus }}</span>
                    </div>
                    
                    <h1 class="hero-title">
                        <span class="highlight">Cookie Policy</span>
                    </h1>
                    <p class="hero-subtitle">
                        TL;DR: We use minimal essential cookies only. No tracking, no ads, no nonsense.
                    </p>
                    <p class="last-updated">
                        Last updated: October 13, 2025
                    </p>
                </div>
            </section>

            <div class="content-container">
                <div class="legal-content">
                    <div class="section">
                        <h2>What Are Cookies?</h2>
                        <p>Cookies are small text files that websites store on your device. They're like digital sticky notes that help websites remember things about you. Don't worry—they can't access your files or install viruses.</p>

                        <p>Think of cookies like a coat check ticket at a restaurant. The website gives your browser a little ticket (cookie), and when you come back, it knows who you are and what you were doing.</p>
                    </div>

                    <div class="section">
                        <h2>How We Use Cookies</h2>
                        <p>We use cookies sparingly because we believe in privacy. Here's exactly what we use them for:</p>

                        <h3>Session Cookies (Required)</h3>
                        <p>These cookies keep you logged into your account:</p>
                        <ul>
                            <li><strong>Authentication session:</strong> Remembers that you're logged in (expires after 15 minutes of inactivity)</li>
                            <li><strong>Account data:</strong> Stores your account ID and settings temporarily</li>
                        </ul>

                        <h3>Security Cookies (Required)</h3>
                        <p>These cookies protect you and our service from attacks:</p>
                        <ul>
                            <li><strong>CSRF tokens:</strong> Prevent cross-site request forgery attacks</li>
                            <li><strong>Rate limiting:</strong> Track request counts to prevent abuse and DDoS attacks</li>
                        </ul>
                        
                        <p><strong>All our cookies are essential.</strong> You can't disable them because the website won't work without them. We don't use any tracking, analytics, or advertising cookies.</p>
                    </div>

                    <div class="section">
                        <h2>What We DON'T Use Cookies For</h2>
                        <p>Unlike most websites, we don't use cookies for:</p>
                        <ul>
                            <li>Tracking you across other websites</li>
                            <li>Building advertising profiles</li>
                            <li>Selling your data to third parties</li>
                            <li>Social media tracking</li>
                            <li>Behavioral targeting</li>
                            <li>Any creepy surveillance stuff</li>
                        </ul>
                        <p>We're not like other companies. We don't want to know what you had for breakfast or which cat videos you watched.</p>
                    </div>

                    <div class="section">
                        <h2>Third-Party Services</h2>
                        <p>We don't use third-party services that set cookies. No payment processors, no analytics, no social media widgets.</p>

                        <h3>No Analytics or Tracking</h3>
                        <p>We don't use Google Analytics, Facebook Pixel, or any other tracking services. We don't embed social media widgets or third-party analytics tools that would set additional cookies. We don't track what badges you create or where you use them.</p>
                        
                        <p>The badge creation service is completely self-contained. We don't share data with any third parties.</p>
                    </div>

                    <div class="section">
                        <h2>Managing Your Cookies</h2>
                        <h3>Browser Settings</h3>
                        <p>You can control cookies through your browser settings:</p>
                        <ul>
                            <li><strong>Block all cookies:</strong> This will prevent you from logging in if you create an account</li>
                            <li><strong>Block third-party cookies:</strong> This won't affect For The Badge's core functionality</li>
                            <li><strong>Delete cookies:</strong> You'll be logged out if you have an account</li>
                            <li><strong>Incognito/Private mode:</strong> Badge creation works fine, but saved badges require login each time</li>
                        </ul>

                        <h3>No Cookie Banner Needed</h3>
                        <p>Since all our cookies are essential for the service to function, we don't show a cookie consent banner. There's nothing optional to opt into or out of.</p>
                        
                        <p>The badge generator works without cookies - they're only needed if you want to save badges to your account.</p>
                    </div>

                    <div class="section">
                        <h2>Cookie Details</h2>
                        <p>For the technically curious, here are the specific cookies we use:</p>

                        <div class="cookie-table">
                            <div class="cookie-row">
                                <div class="cookie-name">
                                    nuxt-session
                                </div>
                                <div class="cookie-purpose">
                                    Authentication session (account login, saved badges, settings)
                                </div>
                                <div class="cookie-duration">
                                    15 minutes (refreshed on activity)
                                </div>
                            </div>

                            <div class="cookie-row">
                                <div class="cookie-name">
                                    nuxt-security.csrf
                                </div>
                                <div class="cookie-purpose">
                                    CSRF protection token
                                </div>
                                <div class="cookie-duration">
                                    Session (deleted when you close browser)
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="section">
                        <h2>Mobile Apps</h2>
                        <p>Our mobile apps (coming soon) will use minimal technologies:</p>
                        <ul>
                            <li><strong>Local storage:</strong> Saves your preferences and account info</li>
                            <li><strong>Device identifiers:</strong> For security only</li>
                            <li><strong>No analytics SDKs:</strong> We don't track your app usage</li>
                        </ul>
                        <p>You'll be able to control these through your device's privacy settings.</p>
                    </div>

                    <div class="section">
                        <h2>Updates to This Policy</h2>
                        <p>If we change how we use cookies, we'll:</p>
                        <ul>
                            <li>Update this page with the new information</li>
                            <li>Change the "Last updated" date</li>
                            <li>Ask for your consent again if required</li>
                        </ul>
                        <p>We'll try not to make changes unless we really need to.</p>
                    </div>

                    <div class="section">
                        <h2>Questions?</h2>
                        <p>If you have questions about our use of cookies, email us at <a href="mailto:hello@forthebadge.com">hello@forthebadge.com</a> or use our <NuxtLink to="/company/contact">contact page</NuxtLink>.</p>

                        <p>We're happy to explain anything that's not clear. Privacy policies shouldn't require a law degree to understand.</p>
                    </div>
                </div>
            </div>
        </div>
        <Footer v-if="!isMobile" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Footer from "~/components/Footer.vue";
import NavBar from "~/components/NavBar.vue";
import MobileNavBar from "~/components/MobileNavBar.vue";
import { isMobileDevice } from '~/utils/deviceDetection';

// Mobile detection based on user agent
const isMobile = computed(() => {
    if (import.meta.client) {
        return isMobileDevice();
    }
    return false;
});

// Animation state
const mounted = ref(false);
const scanStatus = ref('Analyzing cookie usage...');

// Scanning status messages
const statusMessages = [
    'Analyzing cookie usage...',
    'Checking cookie types...',
    'Verifying privacy compliance...',
    'Cookie analysis complete!'
];

let statusIndex = 0;
let statusInterval = null;

onMounted(() => {
    mounted.value = true;
    
    // Status animation
    statusInterval = setInterval(() => {
        statusIndex = (statusIndex + 1) % statusMessages.length;
        scanStatus.value = statusMessages[statusIndex];
    }, 2500);
});

onUnmounted(() => {
    if (statusInterval) {
        clearInterval(statusInterval);
    }
});

useHead({
    title: "Cookie Policy - For the Badge",
    meta: [{ name: "description", content: "For the Badge's cookie policy explained in plain English. We use minimal cookies and respect your privacy." }],
});
</script>

<style scoped>
/* Particle Background */
.legal-background {
  min-height: 100vh;
  background-color: #f8fafb;
  position: relative;
  overflow-x: hidden;
}

.particle-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.particle-1, .particle-2, .particle-3 {
  position: absolute;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 50%;
  animation: float-up 15s infinite linear;
}

.particle-1 {
  width: 4px;
  height: 4px;
  animation-duration: 12s;
}

.particle-2 {
  width: 6px;
  height: 6px;
  animation-duration: 15s;
  background: rgba(0, 0, 0, 0.06);
}

.particle-3 {
  width: 8px;
  height: 8px;
  animation-duration: 18s;
  background: rgba(0, 0, 0, 0.04);
}

/* Generate random positions */
.particle-1:nth-child(1) { left: 10%; animation-delay: 0s; }
.particle-1:nth-child(4) { left: 20%; animation-delay: -2s; }
.particle-1:nth-child(7) { left: 30%; animation-delay: -4s; }
.particle-1:nth-child(10) { left: 40%; animation-delay: -6s; }
.particle-1:nth-child(13) { left: 50%; animation-delay: -8s; }
.particle-1:nth-child(16) { left: 60%; animation-delay: -10s; }
.particle-1:nth-child(19) { left: 70%; animation-delay: -12s; }
.particle-1:nth-child(22) { left: 80%; animation-delay: -14s; }
.particle-1:nth-child(25) { left: 90%; animation-delay: -16s; }
.particle-1:nth-child(28) { left: 5%; animation-delay: -18s; }
.particle-1:nth-child(31) { left: 15%; animation-delay: -20s; }
.particle-1:nth-child(34) { left: 25%; animation-delay: -22s; }
.particle-1:nth-child(37) { left: 35%; animation-delay: -24s; }
.particle-1:nth-child(40) { left: 45%; animation-delay: -26s; }
.particle-1:nth-child(43) { left: 55%; animation-delay: -28s; }
.particle-1:nth-child(46) { left: 65%; animation-delay: -30s; }
.particle-1:nth-child(49) { left: 75%; animation-delay: -32s; }
.particle-1:nth-child(52) { left: 85%; animation-delay: -34s; }
.particle-1:nth-child(55) { left: 95%; animation-delay: -36s; }
.particle-1:nth-child(58) { left: 12%; animation-delay: -38s; }

.particle-2:nth-child(2) { left: 15%; animation-delay: -1s; }
.particle-2:nth-child(5) { left: 25%; animation-delay: -3s; }
.particle-2:nth-child(8) { left: 35%; animation-delay: -5s; }
.particle-2:nth-child(11) { left: 45%; animation-delay: -7s; }
.particle-2:nth-child(14) { left: 55%; animation-delay: -9s; }
.particle-2:nth-child(17) { left: 65%; animation-delay: -11s; }
.particle-2:nth-child(20) { left: 75%; animation-delay: -13s; }
.particle-2:nth-child(23) { left: 85%; animation-delay: -15s; }
.particle-2:nth-child(26) { left: 95%; animation-delay: -17s; }
.particle-2:nth-child(29) { left: 8%; animation-delay: -19s; }
.particle-2:nth-child(32) { left: 18%; animation-delay: -21s; }
.particle-2:nth-child(35) { left: 28%; animation-delay: -23s; }
.particle-2:nth-child(38) { left: 38%; animation-delay: -25s; }
.particle-2:nth-child(41) { left: 48%; animation-delay: -27s; }
.particle-2:nth-child(44) { left: 58%; animation-delay: -29s; }
.particle-2:nth-child(47) { left: 68%; animation-delay: -31s; }
.particle-2:nth-child(50) { left: 78%; animation-delay: -33s; }
.particle-2:nth-child(53) { left: 88%; animation-delay: -35s; }
.particle-2:nth-child(56) { left: 98%; animation-delay: -37s; }
.particle-2:nth-child(59) { left: 22%; animation-delay: -39s; }

.particle-3:nth-child(3) { left: 12%; animation-delay: -1.5s; }
.particle-3:nth-child(6) { left: 22%; animation-delay: -3.5s; }
.particle-3:nth-child(9) { left: 32%; animation-delay: -5.5s; }
.particle-3:nth-child(12) { left: 42%; animation-delay: -7.5s; }
.particle-3:nth-child(15) { left: 52%; animation-delay: -9.5s; }
.particle-3:nth-child(18) { left: 62%; animation-delay: -11.5s; }
.particle-3:nth-child(21) { left: 72%; animation-delay: -13.5s; }
.particle-3:nth-child(24) { left: 82%; animation-delay: -15.5s; }
.particle-3:nth-child(27) { left: 92%; animation-delay: -17.5s; }
.particle-3:nth-child(30) { left: 2%; animation-delay: -19.5s; }
.particle-3:nth-child(33) { left: 17%; animation-delay: -21.5s; }
.particle-3:nth-child(36) { left: 27%; animation-delay: -23.5s; }
.particle-3:nth-child(39) { left: 37%; animation-delay: -25.5s; }
.particle-3:nth-child(42) { left: 47%; animation-delay: -27.5s; }
.particle-3:nth-child(45) { left: 57%; animation-delay: -29.5s; }
.particle-3:nth-child(48) { left: 67%; animation-delay: -31.5s; }
.particle-3:nth-child(51) { left: 77%; animation-delay: -33.5s; }
.particle-3:nth-child(54) { left: 87%; animation-delay: -35.5s; }
.particle-3:nth-child(57) { left: 97%; animation-delay: -37.5s; }
.particle-3:nth-child(60) { left: 7%; animation-delay: -39.5s; }

@keyframes float-up {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translate3d(0, -100%, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

.legal-page {
  min-height: 100vh;
  padding-top: 80px;
  position: relative;
  z-index: 2;
}

.legal-page.mobile-view {
  padding-top: 56px;
  padding-bottom: 64px;
}

/* Hero Section */
.hero-section {
  min-height: 60vh;
  background: #f8fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  position: relative;
  overflow: hidden;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
  z-index: 1;
  position: relative;
}

.scanning-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  margin-bottom: 2rem;
  animation: slideInDown 0.8s ease-out;
}

.scan-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #10b981;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.scan-text {
  font-weight: 600;
  color: #1f2937;
}

.scan-status {
  color: #6b7280;
  font-size: 0.9rem;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  color: #1f2937;
  animation: slideInUp 0.8s ease-out 0.2s both;
}

.hero-title .highlight {
  color: #10b981;
}

.hero-subtitle {
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  color: #6b7280;
  margin-bottom: 1rem;
  line-height: 1.6;
  font-weight: 400;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  animation: slideInUp 0.8s ease-out 0.4s both;
}

.last-updated {
  font-size: 1rem;
  opacity: 0.8;
  color: #6b7280;
  animation: slideInUp 0.8s ease-out 0.6s both;
}

.content-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 2rem;
  position: relative;
  z-index: 3;
}

.legal-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 3rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.section {
  margin-bottom: 3rem;
}

.section:last-child {
  margin-bottom: 0;
}

.section h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #000000;
}

.section h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  margin-top: 1.5rem;
  color: #4a5568;
}

.section p {
  font-size: 1rem;
  line-height: 1.7;
  color: #4a5568;
  margin-bottom: 1rem;
}

.section ul,
.section ol {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.section li {
  font-size: 1rem;
  line-height: 1.7;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.section a {
  color: #000000;
  text-decoration: none;
  font-weight: 600;
}

.section a:hover {
  text-decoration: underline;
}

.section strong {
  color: #2d3748;
  font-weight: 700;
}

.cookie-table {
  background: #f8fafc;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
}

.cookie-row {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 1rem;
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.9rem;
}

.cookie-row:last-child {
  border-bottom: none;
}

.cookie-name {
  font-family: 'Monaco', 'Menlo', monospace;
  font-weight: 600;
  color: #000000;
}

.cookie-purpose {
  color: #4a5568;
}

.cookie-duration {
  color: #718096;
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .legal-page {
    padding-top: 4rem;
  }
  
  .hero-section {
    min-height: auto;
    padding: 3rem 0;
  }
  
  .hero-container {
    padding: 0 1rem;
  }
  
  .scanning-indicator {
    padding: 0.75rem 1.5rem;
    gap: 0.75rem;
    font-size: 0.9rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .content-container {
    padding: 2rem 1rem;
  }

  .legal-content {
    padding: 2rem;
  }

  .section h2 {
    font-size: 1.5rem;
  }

  .section h3 {
    font-size: 1.2rem;
  }

  .cookie-row {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }

  .cookie-name {
    font-size: 0.85rem;
  }
}
</style>