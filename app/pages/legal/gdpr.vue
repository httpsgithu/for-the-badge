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
                        <span class="scan-text">Analyzing GDPR compliance</span>
                        <span class="scan-status" :key="scanStatus">{{ scanStatus }}</span>
                    </div>
                    
                    <h1 class="hero-title">
                        <span class="highlight">GDPR Compliance</span>
                    </h1>
                    <p class="hero-subtitle">
                        TL;DR: Your European privacy rights, explained in plain English. No law degree required.
                    </p>
                    <p class="last-updated">
                        Last updated: January 19, 2025
                    </p>
                </div>
            </section>

            <div class="content-container">
                <div class="legal-content">
                    <div class="section">
                        <h2>What is GDPR?</h2>
                        <p>The General Data Protection Regulation (GDPR) is a European law that gives you control over your personal data. Think of it as your digital bill of rights.</p>

                        <p>If you're in the EU, EEA, or UK, this applies to you. If you're not, you still get the same protections because we believe privacy is a human right, not a geographic privilege.</p>
                    </div>

                    <div class="section">
                        <h2>Your Rights Under GDPR</h2>
                        <p>You have some pretty powerful rights when it comes to your data. Here's what you can do:</p>

                        <h3>Right to Access</h3>
                        <p>You can ask us what data we have about you. Spoiler alert: it's basically nothing because we don't collect personal information.</p>

                        <h3>Right to Rectification</h3>
                        <p>If we somehow have incorrect data about you, you can ask us to fix it. Again, since we don't collect personal data, this is unlikely to be an issue.</p>

                        <h3>Right to Erasure ("Right to be Forgotten")</h3>
                        <p>You can ask us to delete your data. Since we only store your saved badges (encrypted) and basic account info, this is easy to comply with.</p>

                        <h3>Right to Restrict Processing</h3>
                        <p>You can ask us to limit how we use your data. Since we only use it to provide badge creation services, there's not much to restrict.</p>

                        <h3>Right to Data Portability</h3>
                        <p>You can ask for your data in a format you can take elsewhere. We can export your saved badges as SVG files anytime.</p>

                        <h3>Right to Object</h3>
                        <p>You can object to how we process your data. We respect this right, though again, we're not doing much processing to begin with.</p>

                        <h3>Rights Related to Automated Decision Making</h3>
                        <p>You have rights regarding automated decisions that significantly affect you. We don't make any automated decisions that affect you - you're in complete control of badge creation.</p>
                    </div>

                    <div class="section">
                        <h2>How We Protect Your Data</h2>
                        <p>We take data protection seriously, even though we barely collect any data to begin with:</p>

                        <ul>
                            <li><strong>Minimal Data Collection:</strong> We only collect what's absolutely necessary (basically just your account number)</li>
                            <li><strong>No Design Tracking:</strong> We don't monitor what badges you create</li>
                            <li><strong>Encryption:</strong> Saved badges are encrypted, both in transmission and at rest</li>
                            <li><strong>Access Controls:</strong> Only authorized personnel can access our systems</li>
                            <li><strong>Regular Security Audits:</strong> We regularly review our security practices</li>
                        </ul>
                    </div>

                    <div class="section">
                        <h2>Legal Basis for Processing</h2>
                        <p>When we do process data, we do it based on:</p>

                        <ul>
                            <li><strong>Legitimate Interest:</strong> Providing you with badge creation services</li>
                            <li><strong>Contract Performance:</strong> Fulfilling our service agreement with you</li>
                            <li><strong>Consent:</strong> When you explicitly agree to something (like saving badges)</li>
                        </ul>
                    </div>

                    <div class="section">
                        <h2>Data Transfers</h2>
                        <p>We're based in the US, but we follow GDPR standards regardless of where you are. If we ever need to transfer data internationally, we'll use appropriate safeguards like:</p>

                        <ul>
                            <li>Standard Contractual Clauses</li>
                            <li>Adequacy decisions</li>
                            <li>Other legally approved transfer mechanisms</li>
                        </ul>

                        <p>But honestly, since we only store encrypted saved badges, there's not much to transfer anyway.</p>
                    </div>

                    <div class="section">
                        <h2>Data Retention</h2>
                        <p>We keep data for as long as necessary to provide our services:</p>

                        <ul>
                            <li><strong>Account Information:</strong> Until you delete your account</li>
                            <li><strong>Saved Badges:</strong> Until you delete them or your account</li>
                            <li><strong>Usage Analytics:</strong> Minimal, anonymized, kept for service improvement</li>
                        </ul>
                    </div>

                    <div class="section">
                        <h2>Your Data Protection Officer</h2>
                        <p>We don't have a formal Data Protection Officer because we're a small company that barely processes personal data. But if you have questions about your privacy rights, you can contact us directly.</p>
                    </div>

                    <div class="section">
                        <h2>Complaints and Supervisory Authorities</h2>
                        <p>
                            If you're not happy with how we handle your data, you have the right to complain to your local data protection authority. In the EU, you can find your local authority <a
                                href="https://edpb.europa.eu/about-edpb/board/members_en"
                                target="_blank"
                                rel="noopener"
                            >here</a>.
                        </p>

                        <p>But before you do that, please reach out to us first. We're reasonable people and we want to make things right.</p>
                    </div>

                    <div class="section">
                        <h2>Changes to This Policy</h2>
                        <p>If we update this GDPR policy, we'll let you know by updating the date at the top and posting the new version on our website. For major changes, we might send you a notification.</p>
                    </div>

                    <div class="section">
                        <h2>Contact Us</h2>
                        <p>Questions about your GDPR rights? We're here to help:</p>

                        <div class="contact-info">
                            <p><strong>Email:</strong> hello@forthebadge.com</p>
                            <p><strong>Address:</strong> 800 N King Street Suite 304-1653 Wilmington, DE 19801</p>
                        </div>

                        <p>We'll respond to your request within 30 days, as required by GDPR. Usually much faster because we're not drowning in bureaucracy.</p>
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
const scanStatus = ref('Analyzing GDPR compliance...');

// Scanning status messages
const statusMessages = [
    'Analyzing GDPR compliance...',
    'Checking privacy rights...',
    'Verifying data protection...',
    'GDPR compliance verified!'
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
    title: "GDPR Compliance - For the Badge",
    meta: [{ name: "description", content: "For the Badge's GDPR compliance information. Your European privacy rights explained in plain English." }],
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
  padding-top: 6rem;
  position: relative;
  z-index: 2;
}

.legal-page.mobile-view {
  padding-top: 4rem;
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

.contact-info {
  background: #f8fafc;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
}

.contact-info p {
  margin-bottom: 0.5rem;
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
}
</style>