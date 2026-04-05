<template>
    <div class="legal-background">
        <!-- Animated Dot Matrix Background -->
        <div class="dot-matrix" ref="dotMatrix">
            <div v-for="(dot, index) in dots" :key="index" 
                 :class="['dot', dot.type]" 
                 :style="{ left: dot.x + '%', top: dot.y + '%', animationDelay: dot.delay + 'ms' }">
            </div>
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
                        <span class="scan-text">Analyzing terms</span>
                        <span class="scan-status" :key="scanStatus">{{ scanStatus }}</span>
                    </div>
                    
                    <h1 class="hero-title">
                        <span class="highlight">Terms of Service</span>
                    </h1>
                    <p class="hero-subtitle">
                        TL;DR: We're building a fair badge creation service. No tricks, no gotchas.
                    </p>
                    <p class="last-updated">
                        Last updated: October 13, 2025
                    </p>
                </div>
            </section>

            <!-- Main Content Sections -->
            <div class="content-container">
                <!-- The Deal -->
                <section class="legal-section" 
                         :class="{ 'animated': visibleSections.deal }"
                         ref="dealSection">
                    <div class="section-icon">
                        <div class="icon-wrapper deal">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <path d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <h2 class="section-title">The Deal</h2>
                    <div class="section-content">
                        <p class="lead-text">Welcome to For The Badge! By using our service, you're agreeing to these terms.</p>
                        
                        <p>We've tried to make them as straightforward as possible, but lawyers still made us include some fancy language. Here's the gist:</p>
                        
                        <div class="deal-grid">
                            <div class="deal-item">
                                <div class="deal-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M7,5H21V3H7M21,19H7V7H21M21,1H7A2,2 0 0,0 5,3V21A2,2 0 0,0 7,23H21A2,2 0 0,0 23,21V3A2,2 0 0,0 21,1M17.15,12L14,9.15L16.15,7L20.3,11.15L16.15,15.3L14,13.15L17.15,10M11.85,12L8.7,8.85L10.85,6.7L15,10.85L10.85,15L8.7,12.85L11.85,15Z" />
                                    </svg>
                                </div>
                                <p>You create badges, we provide the tools</p>
                            </div>
                            <div class="deal-item">
                                <div class="deal-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <p>Free to use, optional account for saving badges</p>
                            </div>
                            <div class="deal-item">
                                <div class="deal-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <p>We don't track your designs or spy on you</p>
                            </div>
                            <div class="deal-item">
                                <div class="deal-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18 21l-1.5-1.5m0 0L3 6l1.5 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <p>Don't use our service for illegal stuff</p>
                            </div>
                            <div class="deal-item">
                                <div class="deal-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.30c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655-4.653a2.548 2.548 0 010-3.586l.837-.836c.317-.317.751-.487 1.207-.487H12a2.25 2.25 0 012.25 2.25V12c0 .456-.17.892-.487 1.207l-.836.837a2.547 2.547 0 01-3.586 0z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <p>If something goes wrong, we'll try to make it right</p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Contact Section -->
                <section class="legal-section contact-section" 
                         :class="{ 'animated': visibleSections.contact }"
                         ref="contactSection">
                    <div class="section-icon">
                        <div class="icon-wrapper contact">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <h2 class="section-title">Questions About These Terms?</h2>
                    <div class="section-content">
                        <p class="lead-text">We're here to answer any questions about our terms of service.</p>
                        
                        <div class="contact-methods">
                            <div class="contact-method">
                                <div class="contact-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <div>
                                    <h4>Email Us</h4>
                                    <p><a href="mailto:hello@forthebadge.com">hello@forthebadge.com</a></p>
                                    <small>For terms and legal questions</small>
                                </div>
                            </div>
                            <div class="contact-method">
                                <div class="contact-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <div>
                                    <h4>Contact Form</h4>
                                    <p><NuxtLink to="/company/contact">Use our contact page</NuxtLink></p>
                                    <small>For detailed terms inquiries</small>
                                </div>
                            </div>
                        </div>
                        
                        <div class="final-statement">
                            <h3>We actually want you to understand</h3>
                            <p>Unlike most terms of service, we actually want you to understand what you're agreeing to. We're real humans who read and respond to emails.</p>
                            
                            <div class="cta-section">
                                <NuxtLink to="/generator" class="cta-button secondary">
                                    Create badges now
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </section>
                
                <!-- Full Terms Content -->
                <div class="legal-content">
                <div class="section">
                    <h2>What For The Badge Does</h2>
                    <p>For The Badge is a badge creation service that lets you:</p>
                    <ul>
                        <li>Create custom badges for your projects</li>
                        <li>Choose from hundreds of pre-made badge designs</li>
                        <li>Export badges as SVG or PNG files</li>
                        <li>Save your badge designs (optional)</li>
                    </ul>
                    <p><strong>Important:</strong> Badges are for visual representation and aren't legally binding certifications. They're design elements for your projects, documentation, and websites.</p>
                </div>

                <div class="section">
                    <h2>Your Account</h2>
                    <h3>Account Creation</h3>
                    <p>Creating an account is simple: we generate a random 16-digit number, and that's your account. No email, no personal info, no hassle.</p>

                    <h3>Account Security</h3>
                    <p>Your account number is your password. Keep it safe! If you lose it, we can't recover it because we don't have any other way to verify your identity. That's the price of privacy.</p>

                    <h3>Saved Badges (Optional)</h3>
                    <p>If you create an account, you can save badges:</p>
                    <ul>
                        <li>Saved badges are encrypted and tied to your account</li>
                        <li>You can edit and manage your saved badges anytime</li>
                        <li>No limit on how many badges you can save</li>
                        <li>Completely optional - you can use the service without an account</li>
                    </ul>
                </div>

                <div class="section">
                    <h2>What You Can and Can't Do</h2>
                    <h3>Acceptable Use</h3>
                    <p>You can use For The Badge to create badges for:</p>
                    <ul>
                        <li>Open source projects and repositories</li>
                        <li>Documentation and README files</li>
                        <li>Personal portfolios and websites</li>
                        <li>Project status indicators</li>
                        <li>Technology stack displays</li>
                        <li>Any legitimate creative purpose</li>
                    </ul>

                    <h3>Things You Cannot Do</h3>
                    <p>Don't be a jerk. Specifically, you can't:</p>
                    <ul>
                        <li>Create badges with illegal, hateful, or harmful content</li>
                        <li>Try to hack, break, or abuse our service</li>
                        <li>Use our service to generate spam or phishing content</li>
                        <li>Share your account with others (each account is for one person)</li>
                        <li>Create badges that infringe on others' trademarks or copyrights</li>
                        <li>Use our service for any commercial resale without permission</li>
                    </ul>

                    <p>We reserve the right to terminate accounts that violate these rules.</p>
                </div>

                <div class="section">
                    <h2>Privacy and Data</h2>
                    <h3>Badge Storage</h3>
                    <p>We only store what you explicitly save. Here's exactly what happens:</p>
                    <ul>
                        <li>You create a badge in the generator</li>
                        <li>You can download it immediately as SVG or PNG</li>
                        <li>If you have an account, you can optionally save the badge (encrypted)</li>
                        <li>Saved badges remain in your account until you delete them</li>
                    </ul>

                    <h3>What We Do Store</h3>
                    <p>We only keep what's necessary:</p>
                    <ul>
                        <li>Your account number (that random 16-digit ID)</li>
                        <li>Your saved badges (encrypted)</li>
                        <li>Basic account settings and preferences</li>
                    </ul>
                    <p>For the full details, check our <NuxtLink to="/legal/privacy">Privacy Policy</NuxtLink>.</p>
                </div>

                <div class="section">
                    <h2>Service Availability</h2>
                    <p>We try to keep For The Badge running 24/7, but sometimes things break:</p>
                    <ul>
                        <li>We aim for 99.9% uptime, but can't guarantee it</li>
                        <li>Maintenance windows will be announced in advance when possible</li>
                        <li>The badge generator works without an account, so most features remain available</li>
                        <li>We're not responsible for internet outages or your device issues</li>
                    </ul>
                </div>

                <div class="section">
                    <h2>Intellectual Property</h2>
                    <h3>Your Badges</h3>
                    <p>The badges you create are yours. You own them completely and can use them however you want.</p>

                    <h3>Our Service</h3>
                    <p>For The Badge platform, our badge generator, and our pre-made designs are our intellectual property. Don't try to reverse engineer, copy, or steal our technology.</p>

                    <h3>Badge Files</h3>
                    <p>The SVG and PNG files you export are yours to use however you want. Share them, modify them, use them commercially—we don't restrict your use of badges you create.</p>
                </div>

                <div class="section">
                    <h2>Disclaimers</h2>
                    <p><strong>Not Certifications:</strong> Badges are visual design elements, not legally binding certifications or verifications. They're for display purposes only.</p>

                    <p><strong>Service Quality:</strong> We strive to provide a reliable badge generation service, but we don't guarantee that every feature will work perfectly at all times.</p>

                    <p><strong>No Guarantees:</strong> We can't guarantee that badges will display perfectly in every environment or that saved badges will be preserved indefinitely (though we try our best).</p>
                </div>

                <div class="section">
                    <h2>Limitation of Liability</h2>
                    <p>Look, we're providing a free badge creation tool. If something goes wrong, here's what we're responsible for:</p>

                    <p><strong>What we'll cover:</strong> If our service doesn't work as described, we'll try our best to fix the problem promptly.</p>

                    <p><strong>What we won't cover:</strong> We're not responsible for how you use badges, where you display them, or any consequences of using badges created with our service.</p>

                    <p>In legal terms: our liability is limited to providing access to the badge generation service. Since the service is free, there are no refunds to provide.</p>
                </div>

                <div class="section">
                    <h2>Termination</h2>
                    <h3>You Can Leave Anytime</h3>
                    <p>You can stop using For The Badge whenever you want. You can delete your account and all saved badges at any time.</p>

                    <h3>We Can End Service</h3>
                    <p>We can terminate accounts that violate these terms. We'll try to warn you first unless you're doing something seriously wrong.</p>

                    <h3>What Happens to Your Data</h3>
                    <p>When you delete your account, your saved badges and account data will be permanently removed within 30 days.</p>
                </div>

                <div class="section">
                    <h2>Changes to These Terms</h2>
                    <p>We may update these terms occasionally. When we do:</p>
                    <ul>
                        <li>We'll post the new terms on this page</li>
                        <li>We'll update the "Last updated" date</li>
                        <li>For major changes, we'll try to notify users in advance</li>
                    </ul>
                    <p>Continued use of the service means you accept the new terms.</p>
                </div>

                <div class="section">
                    <h2>Governing Law</h2>
                    <p>These terms are governed by the laws of Illinois, USA, because that's where we're based. Any disputes will be resolved in Chicago courts (preferably over deep-dish pizza).</p>
                </div>

                <div class="section">
                    <h2>Contact Us</h2>
                    <p>Questions about these terms? Email us at <a href="mailto:hello@forthebadge.com">hello@forthebadge.com</a> or use our <NuxtLink to="/company/contact">contact page</NuxtLink>.</p>

                    <p>We're real humans who actually read and respond to emails. Unlike most terms of service, we actually want you to understand what you're agreeing to.</p>
                </div>
                </div>
            </div>
        </div>
        <Footer v-if="!isMobile" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
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
const dotMatrix = ref(null);
const dots = ref([]);
const scanStatus = ref('Analyzing terms...');

// Section refs for scroll animations
const dealSection = ref(null);
const contactSection = ref(null);

// Visibility state for sections
const visibleSections = ref({
    deal: false,
    contact: false
});

// Generate random dots for the matrix background
const generateDots = () => {
    const dotCount = 150;
    const newDots = [];
    
    for (let i = 0; i < dotCount; i++) {
        const types = ['small', 'medium', 'large'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        newDots.push({
            x: Math.random() * 100,
            y: Math.random() * 100,
            type,
            delay: Math.random() * 3000
        });
    }
    
    dots.value = newDots;
};

// Scanning status messages
const statusMessages = [
    'Analyzing terms...',
    'Reading clauses...',
    'Checking fairness...',
    'Terms verified!'
];

let statusIndex = 0;
let statusInterval = null;
let observer = null;

// Scroll animation observer
const setupScrollAnimations = () => {
    if (!import.meta.client) return;
    
    const options = {
        root: null,
        rootMargin: '-100px',
        threshold: 0.1
    };
    
    observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                if (entry.target === dealSection.value) {
                    visibleSections.value.deal = true;
                } else if (entry.target === contactSection.value) {
                    visibleSections.value.contact = true;
                }
            }
        });
    }, options);
    
    // Observe all sections
    nextTick(() => {
        if (dealSection.value) observer.observe(dealSection.value);
        if (contactSection.value) observer.observe(contactSection.value);
    });
};

onMounted(() => {
    mounted.value = true;
    generateDots();
    
    // Status animation
    statusInterval = setInterval(() => {
        statusIndex = (statusIndex + 1) % statusMessages.length;
        scanStatus.value = statusMessages[statusIndex];
    }, 2500);
    
    // Setup scroll animations
    setupScrollAnimations();
});

onUnmounted(() => {
    if (statusInterval) {
        clearInterval(statusInterval);
    }
    if (observer) {
        observer.disconnect();
    }
});

useHead({
    title: "Terms of Service - For the Badge",
    meta: [{ name: "description", content: "For the Badge's terms of service in plain English. No legal jargon, just honest terms for our badge creation service." }],
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



/* Main Layout */
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

/* Animated dot matrix background */
.dot-matrix {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.dot {
  position: absolute;
  border-radius: 50%;
  background: #000000;
  opacity: 0;
  animation: dotFade 6s infinite;
}

.dot.small {
  width: 3px;
  height: 3px;
}

.dot.medium {
  width: 5px;
  height: 5px;
}

.dot.large {
  width: 7px;
  height: 7px;
}

@keyframes dotFade {
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 0.6;
  }
}

/* Legal Sections */
.legal-section {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  margin-bottom: 3rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  transition: all 0.6s ease;
}

.legal-section.animated {
  transform: translateY(0);
  opacity: 1;
}

.section-icon {
  margin-bottom: 2rem;
}

.icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  color: white;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.section-content {
  color: #4a5568;
  line-height: 1.7;
}

.lead-text {
  font-size: 1.25rem;
  font-weight: 500;
  color: #2d3748;
  margin-bottom: 2rem;
}

/* Deal Grid */
.deal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.deal-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.deal-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
}

.deal-item p {
  margin: 0;
  font-weight: 500;
  color: #2d3748;
}

/* Contact Methods */
.contact-methods {
  display: grid;
  gap: 2rem;
  margin: 2rem 0;
}

.contact-method {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.contact-icon {
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

.contact-method h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.contact-method p {
  margin: 0 0 0.25rem 0;
  font-weight: 500;
}

.contact-method small {
  color: #6b7280;
  font-size: 0.875rem;
}

/* Final Statement */
.final-statement {
  text-align: center;
  padding: 3rem 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin-top: 3rem;
}

.final-statement h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1f2937;
}

.cta-section {
  margin-top: 2rem;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.cta-button.secondary {
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  color: white;
  border: none;
}

.cta-button.secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
}

@media (max-width: 768px) {
  .hero-section h1 {
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

  .legal-section {
    padding: 2rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .deal-grid {
    grid-template-columns: 1fr;
  }

  .section h2 {
    font-size: 1.5rem;
  }

  .section h3 {
    font-size: 1.2rem;
  }
}
</style>