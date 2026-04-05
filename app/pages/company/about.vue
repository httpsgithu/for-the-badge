<template>
    <div class="about-background">
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
        
        <div class="about-page" :class="{ 'mobile-view': isMobile }">
            <!-- Hero Section -->
            <section class="hero-section">
                <div class="hero-container">
                    <div class="scanning-indicator" v-if="mounted">
                        <div class="scan-dot"></div>
                        <span class="scan-text">Analyzing mission</span>
                        <span class="scan-status" :key="scanStatus">{{ scanStatus }}</span>
                    </div>
                    
                    <h1 class="hero-title">
                        We're <span class="highlight">sick of big tech</span>
                        <br>
                        stealing your data
                    </h1>
                    <p class="hero-subtitle">
                        Privacy-first badge creation. Because your creativity belongs to you, not them.
                    </p>
                    
                    <div class="hero-actions">
                        <NuxtLink to="/generator" class="cta-button primary">
                            Create badges now
                        </NuxtLink>
                    </div>
                </div>
            </section>

            <!-- Main Content Sections -->
            <div class="content-container">
                <!-- The Problem Section -->
                <section class="story-section" 
                         :class="{ 'animated': visibleSections.problem }"
                         ref="problemSection">
                    <div class="section-icon">
                        <div class="icon-wrapper problem">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <h2 class="section-title">The Problem We're Solving</h2>
                    <div class="section-content">
                        <p class="lead-text">Big tech companies have spent decades harvesting your personal data to build trillion-dollar empires.</p>
                        
                        <p>They've normalized surveillance capitalism, where <strong>your privacy is the product being sold.</strong> Meanwhile, developers and creators are forced to use tools that track every click, store every creation, and analyze every interaction.</p>

                        <p>We're sick of it. Sick of companies that claim to "help" you while secretly feeding your data into their AI training pipelines. Sick of "free" services that cost you your fundamental right to privacy.</p>

                        <div class="highlight-callout">
                            <strong>For The Badge is our answer to this broken system.</strong>
                        </div>
                    </div>
                </section>

                <!-- Privacy Section -->
                <section class="story-section privacy-section"
                         :class="{ 'animated': visibleSections.privacy }"
                         ref="privacySection">
                    <div class="section-icon">
                        <div class="icon-wrapper privacy">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <path d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <h2 class="section-title">Privacy Is Not Negotiable</h2>
                    <div class="section-content">
                        <p class="lead-text">Your creative work, badge designs, and usage patterns reveal who you are and what you're building.</p>
                        
                        <p>Big tech wants you to upload all of this to their servers so they can analyze it, store it, and potentially use it to train their models.</p>

                        <p><strong>We refuse to participate in this data exploitation.</strong> For The Badge operates with zero unnecessary tracking. We don't store your designs permanently, we don't train AI models on your content, and we don't sell your information to advertisers.</p>

                        <div class="stats-grid">
                            <div class="stat-card">
                                <span class="stat-number">0</span>
                                <span class="stat-label">tracking cookies</span>
                            </div>
                            <div class="stat-card">
                                <span class="stat-number">0</span>
                                <span class="stat-label">data sold to advertisers</span>
                            </div>
                            <div class="stat-card">
                                <span class="stat-number">100%</span>
                                <span class="stat-label">private by design</span>
                            </div>
                        </div>
                        
                        <div class="highlight-callout privacy">
                            <strong>Create badges freely.</strong> We don't watch, track, or store what you make.
                        </div>
                    </div>
                </section>

                <!-- AI Section -->
                <section class="story-section ai-section"
                         :class="{ 'animated': visibleSections.ai }"
                         ref="aiSection">
                    <div class="section-icon">
                        <div class="icon-wrapper ai">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <h2 class="section-title">Tools That Work For You</h2>
                    <div class="section-content">
                        <p class="lead-text">The same companies harvesting your data have created tools that primarily serve their own interests.</p>
                        
                        <p>They build platforms that maximize engagement, ad revenue, and data collection—not your actual needs.</p>

                        <p><strong>For The Badge flips this script.</strong> Our tool exists solely to help you create amazing badges for your projects. Whether it's open source projects, documentation, READMEs, or portfolios—we give you beautiful, customizable badges without the surveillance.</p>

                        <div class="features-showcase">
                            <div class="feature-pill">
                                <span class="feature-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M7,5H21V3H7M21,19H7V7H21M21,1H7A2,2 0 0,0 5,3V21A2,2 0 0,0 7,23H21A2,2 0 0,0 23,21V3A2,2 0 0,0 21,1M17.15,12L14,9.15L16.15,7L20.3,11.15L16.15,15.3L14,13.15L17.15,10M11.85,12L8.7,8.85L10.85,6.7L15,10.85L10.85,15L8.7,12.85L11.85,15Z" />
                                    </svg>
                                </span>
                                <span>Custom badges</span>
                            </div>
                            <div class="feature-pill">
                                <span class="feature-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M9,17H7V10H9V17M13,17H11V7H13V17M17,17H15V9H17V17Z" />
                                    </svg>
                                </span>
                                <span>Browse designs</span>
                            </div>
                            <div class="feature-pill">
                                <span class="feature-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M7,10L12,15L17,10H7Z" />
                                    </svg>
                                </span>
                                <span>Export SVG/PNG</span>
                            </div>
                            <div class="feature-pill">
                                <span class="feature-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M20,8H4V6H20M20,18H4V12H20M22,18V6C22,4.89 21.1,4 20,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20C21.1,20 22,19.1 22,18Z" />
                                    </svg>
                                </span>
                                <span>Markdown ready</span>
                            </div>
                        </div>

                        <p>No ulterior motives. No hidden agendas. No data harvesting. Just a powerful tool that actually helps you create beautiful badges for your projects.</p>
                    </div>
                </section>

                <!-- Why This Matters -->
                <section class="story-section impact-section"
                         :class="{ 'animated': visibleSections.impact }"
                         ref="impactSection">
                    <div class="section-icon">
                        <div class="icon-wrapper impact">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <h2 class="section-title">Why This Matters</h2>
                    <div class="section-content">
                        <p class="lead-text">Creators shouldn't have to trade their privacy for basic tools.</p>
                        
                        <p>You shouldn't need to accept invasive tracking just to create a badge for your GitHub README. You shouldn't have to worry about your creative work being fed into someone's AI training dataset.</p>

                        <p>In a world where big tech has convinced us that surveillance is the price of convenience, <strong>For The Badge proves there's a better way.</strong> You can have powerful creative tools without becoming the product.</p>

                        <div class="highlight-callout impact">
                            <div class="callout-content">
                                <strong>Because honestly?</strong> Life's too short for incomprehensible documents, and privacy is too important to trade away.
                                <span class="lock-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <path d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Manifesto Section -->
                <section class="story-section manifesto-section"
                         :class="{ 'animated': visibleSections.manifesto }"
                         ref="manifestoSection">
                    <div class="manifesto-header">
                        <div class="manifesto-badge">
                            <span>Our Commitment</span>
                        </div>
                    </div>
                    
                    <div class="manifesto-content">
                        <div class="commitment-grid">
                            <div class="commitment-item">
                                <div class="commitment-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M18.364 5.636L5.636 18.364M5.636 5.636l12.728 12.728" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <p>Never store your documents</p>
                            </div>
                            <div class="commitment-item">
                                <div class="commitment-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M18.364 5.636L5.636 18.364M5.636 5.636l12.728 12.728" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <p>Never train AI on your data</p>
                            </div>
                            <div class="commitment-item">
                                <div class="commitment-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M18.364 5.636L5.636 18.364M5.636 5.636l12.728 12.728" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <p>Never sell your information</p>
                            </div>
                            <div class="commitment-item">
                                <div class="commitment-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M18.364 5.636L5.636 18.364M5.636 5.636l12.728 12.728" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <p>Never bow to surveillance capitalism</p>
                            </div>
                        </div>
                        
                        <div class="final-statement">
                            <h3>Your data is yours. Full stop.</h3>
                            <p>This isn't just a promise—it's the foundation of everything we build.</p>
                            
                            <div class="cta-section">
                                <NuxtLink to="/generator" class="cta-button secondary">
                                    Experience true privacy
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
    <Footer v-if="!isMobile" />
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
const scanStatus = ref('Analyzing privacy...');

// Section refs for scroll animations
const problemSection = ref(null);
const privacySection = ref(null);
const aiSection = ref(null);
const impactSection = ref(null);
const manifestoSection = ref(null);

// Visibility state for sections
const visibleSections = ref({
    problem: false,
    privacy: false,
    ai: false,
    impact: false,
    manifesto: false
});

// Generate random dots for the matrix background
const generateDots = () => {
    const dotCount = 200;
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
    'Analyzing privacy...',
    'Detecting surveillance...',
    'Protecting your data...',
    'Mission analyzed!'
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
            const sectionName = entry.target.getAttribute('data-section') || 
                entry.target.classList.value.match(/ref="(\w+)Section"/);
            
            if (entry.isIntersecting) {
                if (entry.target === problemSection.value) {
                    visibleSections.value.problem = true;
                } else if (entry.target === privacySection.value) {
                    visibleSections.value.privacy = true;
                } else if (entry.target === aiSection.value) {
                    visibleSections.value.ai = true;
                } else if (entry.target === impactSection.value) {
                    visibleSections.value.impact = true;
                } else if (entry.target === manifestoSection.value) {
                    visibleSections.value.manifesto = true;
                }
            }
        });
    }, options);
    
    // Observe all sections
    nextTick(() => {
        if (problemSection.value) observer.observe(problemSection.value);
        if (privacySection.value) observer.observe(privacySection.value);
        if (aiSection.value) observer.observe(aiSection.value);
        if (impactSection.value) observer.observe(impactSection.value);
        if (manifestoSection.value) observer.observe(manifestoSection.value);
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
    title: "About Us - For The Badge",
    meta: [{ name: "description", content: "Learn why For The Badge was built as a privacy-first alternative to big tech's data-hungry badge tools. Your badges, your data, your privacy." }],
});
</script>

<style scoped>
/* Base Layout */
.about-background {
  min-height: 100vh;
  background: #f8fafb;
  position: relative;
  overflow-x: hidden;
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
  background: #667eea;
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
  0%, 90%, 100% { opacity: 0; }
  45% { opacity: 0.6; }
}

/* Main Layout */
.about-page {
  min-height: 100vh;
  padding-top: 6rem;
  position: relative;
  z-index: 2;
}

.about-page.mobile-view {
  padding-top: 4rem;
}

/* Hero Section */
.hero-section {
  min-height: 100vh;
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
  background: #667eea;
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
  color: #667eea;
}

.hero-subtitle {
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  color: #6b7280;
  margin-bottom: 2.5rem;
  line-height: 1.6;
  font-weight: 400;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  animation: slideInUp 0.8s ease-out 0.4s both;
}

.hero-actions {
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  animation: slideInUp 0.8s ease-out 0.6s both;
}

.cta-button {
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 160px;
}

.cta-button.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.cta-button.primary:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.cta-button.secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.cta-button.secondary:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

/* Content Container */
.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 2rem;
  position: relative;
  z-index: 3;
}

/* Story Sections */
.story-section {
  background: white;
  border-radius: 24px;
  padding: 3rem;
  margin-bottom: 4rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.8s ease-out;
  position: relative;
}

.story-section.animated {
  opacity: 1;
  transform: translateY(0);
}

.story-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Section Icons */
.section-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  animation: iconBounce 2s ease-out infinite;
}

.icon-wrapper.problem {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.icon-wrapper.privacy {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.icon-wrapper.ai {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.icon-wrapper.impact {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

@keyframes iconBounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-4px);
  }
  60% {
    transform: translateY(-2px);
  }
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 2rem;
  text-align: center;
}

.section-content {
  position: relative;
}

.lead-text {
  font-size: 1.25rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.story-section p {
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  color: #4b5563;
}

.story-section strong {
  color: #1f2937;
  font-weight: 700;
}

/* Highlight Callouts */
.highlight-callout {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-left: 4px solid #667eea;
  padding: 1.5rem;
  border-radius: 0 12px 12px 0;
  margin: 2rem 0;
  font-size: 1.1rem;
  animation: slideInRight 0.6s ease-out;
}

.highlight-callout.privacy {
  border-left-color: #10b981;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%);
}

.highlight-callout.impact {
  border-left-color: #f59e0b;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%);
}

.callout-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.lock-icon {
  display: inline-flex;
  align-items: center;
  color: #f59e0b;
  opacity: 0.8;
}

.lock-icon svg {
  flex-shrink: 0;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.stat-card {
  background: #f9fafb;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  border: 1px solid #e5e7eb;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: #667eea;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
  margin-top: 0.5rem;
  display: block;
}

/* Features Showcase */
.features-showcase {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 2rem 0;
  justify-content: center;
}

.feature-pill {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 30px;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #374151;
  transition: all 0.3s ease;
  animation: slideInUp 0.6s ease-out;
}

.feature-pill:hover {
  border-color: #667eea;
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

.feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
}

.feature-icon svg {
  transition: all 0.3s ease;
}

/* Manifesto Section */
.manifesto-section {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border: 2px solid rgba(102, 126, 234, 0.2);
  position: relative;
  overflow: hidden;
}

.manifesto-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px 24px 0 0;
}

.manifesto-header {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.manifesto-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 30px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  animation: slideInDown 0.6s ease-out;
}

.commitment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.commitment-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  animation: slideInLeft 0.6s ease-out;
}

.commitment-item:hover {
  transform: translateX(4px);
  border-color: #667eea;
}

.commitment-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  color: #ef4444;
  opacity: 0.8;
}

.commitment-icon svg {
  width: 24px;
  height: 24px;
}

.commitment-item p {
  margin: 0;
  font-weight: 500;
  color: #374151;
}

.final-statement {
  text-align: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(102, 126, 234, 0.2);
}

.final-statement h3 {
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

.cta-section {
  margin-top: 2rem;
}

/* Animations */
@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .about-page {
    padding-top: 4rem;
  }
  
  .hero-section {
    min-height: auto;
    padding: 4rem 0;
  }
  
  .hero-container {
    padding: 0 1rem;
  }
  
  .scanning-indicator {
    padding: 0.75rem 1.5rem;
    gap: 0.75rem;
    font-size: 0.9rem;
  }
  
  .content-container {
    padding: 4rem 1rem;
  }
  
  .story-section {
    padding: 2rem;
    margin-bottom: 3rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .lead-text {
    font-size: 1.1rem;
  }
  
  .story-section p {
    font-size: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .features-showcase {
    flex-direction: column;
    align-items: center;
  }
  
  .commitment-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-button {
    width: 100%;
    max-width: 300px;
  }
}
</style>
