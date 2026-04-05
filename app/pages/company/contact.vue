<template>
    <div class="contact-background">
        <!-- Particle background -->
        <div class="particle-container">
            <div v-for="i in 60" :key="i" :class="`particle-${(i % 3) + 1}`"></div>
        </div>
        
        <!-- Desktop Navigation -->
        <NavBar v-if="!isMobile" />
        
        <!-- Mobile Navigation -->
        <MobileNavBar v-if="isMobile" />
        
        <div class="contact-page" :class="{ 'mobile-view': isMobile }">
            <div class="hero-section">
                <div class="hero-container">
                    <h1>Get in Touch</h1>
                    <p class="hero-subtitle">
                        Questions? Complaints? Love letters? We read them all.
                    </p>
                </div>
            </div>

            <div class="content-container">
                <div class="contact-info">
                    <h2>Get in Touch</h2>
                    <p class="contact-intro">
                        We believe in keeping communication simple and direct. Choose the method that works best for your needs.
                    </p>

                    <div class="contact-methods">
                        <div class="contact-method primary-method">
                            <div class="method-icon">
                                📧
                            </div>
                            <div class="method-content">
                                <h3>Use email for non-sensitive issues or general enquiries</h3>
                                <p>Questions about the app, billing, partnerships, or just want to say hello? Drop us a line.</p>
                                <div class="email-action">
                                    <span>Just send an email to </span>
                                    <a
                                        href="mailto:hello@forthebadge.com"
                                        class="contact-link"
                                    >hello@forthebadge.com</a>
                                </div>
                            </div>
                        </div>

                        <div class="contact-method encrypted-method">
                            <div class="method-icon">
                                🔐
                            </div>
                            <div class="method-content">
                                <h3>Use encrypted email for sensitive issues</h3>
                                <p>Found a security vulnerability or need to share confidential information? We've got you covered.</p>
                                <div class="email-action">
                                    <span>Send us a PGP-encrypted email to </span>
                                    <a
                                        href="mailto:hello@forthebadge.com"
                                        class="contact-link"
                                    >hello@forthebadge.com</a>
                                    <span> using our </span>
                                    <a
                                        href="#pgp-key"
                                        class="contact-link"
                                    >public key</a>.
                                </div>
                                <div class="help-text">
                                    Don't know how to do that? <a href="#encryption-guide" class="contact-link">Follow our guide on using encrypted email</a>.
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="pgp-key" class="pgp-section">
                        <h3>Our PGP Public Key</h3>
                        <div class="key-info">
                            <div class="key-details">
                                <p><strong>Key ID:</strong> <code>0x1EEB01504642E057</code></p>
                                <p><strong>Fingerprint:</strong> <code>3219 D2A1 FE32 00CE 6DE0 EF02 1EEB 0150 4642 E057</code></p>
                                <p><strong>Email:</strong> <code>hello@forthebadge.com</code></p>
                                <p><strong>Expires:</strong> <code>November 13, 2027</code></p>
                            </div>
                            <div class="key-actions">
                                <a href="/ftb-public-key.asc" class="key-download-link" download>Download Public Key</a>
                            </div>
                        </div>
                    </div>

                    <div id="encryption-guide" class="encryption-guide">
                        <h3>Quick Encryption Guide</h3>
                        <div class="guide-steps">
                            <div class="guide-step">
                                <span class="step-number">1</span>
                                <div class="step-content">
                                    <h4>Download our public key</h4>
                                    <p>Click the "Download Public Key" link above and import it into your email client or PGP software.</p>
                                </div>
                            </div>
                            <div class="guide-step">
                                <span class="step-number">2</span>
                                <div class="step-content">
                                    <h4>Compose your message</h4>
                                    <p>Write your email as normal, then encrypt it using our public key before sending.</p>
                                </div>
                            </div>
                            <div class="guide-step">
                                <span class="step-number">3</span>
                                <div class="step-content">
                                    <h4>Send to hello@forthebadge.com</h4>
                                    <p>We'll decrypt your message and respond securely. For the most sensitive issues, we recommend using a secure email provider.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="faq-section" id="privacy-update">
                    <h2>Frequently Asked Questions</h2>
                    <div class="faq-accordion">
                        <div class="faq-item" :class="{ 'active': openFaqIndex === 0 }">
                            <button class="faq-header" @click="toggleFaq(0)">
                                <h3>What happened to my data from the previous version?</h3>
                                <span class="faq-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </span>
                            </button>
                            <div class="faq-content">
                                <p>As we've transitioned to a privacy-first platform, all user accounts start fresh. This clean slate approach ensures the anonymity and privacy that are core to our new direction.</p>
                                
                                <p><strong>About your previous data:</strong> Our previous database was designed with privacy at its core—all user data was anonymized, hashed, and encrypted. While this protected your privacy, it also means we cannot migrate or recover historical data from the old platform.</p>
                                
                                <p><strong>Badge submissions:</strong> We are actively working to preserve community badge submissions from the previous platform. While user data cannot be migrated, we're committed to maintaining the badge collection that the community has built over the years.</p>
                                
                                <p>If you'd like to request account information stored by our authentication provider (Auth0), please reach out to <a href="mailto:hello@forthebadge.com" class="contact-link">hello@forthebadge.com</a> within 30 days (until December 13, 2024). This includes basic account details like email and login history, but does not include any activity or usage data from the previous platform.</p>
                            </div>
                        </div>

                        <div class="faq-item" :class="{ 'active': openFaqIndex === 1 }">
                            <button class="faq-header" @click="toggleFaq(1)">
                                <h3>What is For the Badge?</h3>
                                <span class="faq-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </span>
                            </button>
                            <div class="faq-content">
                                <p>For the Badge is a privacy-first, free badge generator inspired by the internet's favorite sarcastically-honest badges. Browse our collection or create custom designs, then download as SVG or PNG. No sign-ups, no tracking, no logs—just badges.</p>
                            </div>
                        </div>

                        <div class="faq-item" :class="{ 'active': openFaqIndex === 2 }">
                            <button class="faq-header" @click="toggleFaq(2)">
                                <h3>How are you privacy-first?</h3>
                                <span class="faq-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </span>
                            </button>
                            <div class="faq-content">
                                <p>We don't track, store, or log your activity. No accounts required, no cookies beyond essential functionality, no analytics tracking your behavior, and no data sold to third parties. When you create a badge, we don't know who you are or what you made—and that's by design. Your privacy isn't a feature; it's our foundation.</p>
                            </div>
                        </div>

                        <div class="faq-item" :class="{ 'active': openFaqIndex === 3 }">
                            <button class="faq-header" @click="toggleFaq(3)">
                                <h3>Is it free? Can I use badges commercially?</h3>
                                <span class="faq-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </span>
                            </button>
                            <div class="faq-content">
                                <p>Yes and yes! For the Badge is completely free—no sign-ups, subscriptions, or hidden fees. All badges are free to use for personal or commercial projects. No attribution required, though we always appreciate a shoutout.</p>
                            </div>
                        </div>

                        <div class="faq-item" :class="{ 'active': openFaqIndex === 4 }">
                            <button class="faq-header" @click="toggleFaq(4)">
                                <h3>What about cookies and tracking?</h3>
                                <span class="faq-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </span>
                            </button>
                            <div class="faq-content">
                                <p>We use only essential cookies required for the site to function (like CSRF protection). No tracking cookies, no advertising cookies, no cross-site tracking. We have a strict no-logs policy—we don't record what badges you create, when you visit, or any identifying information about your session.</p>
                            </div>
                        </div>

                        <div class="faq-item" :class="{ 'active': openFaqIndex === 5 }">
                            <button class="faq-header" @click="toggleFaq(5)">
                                <h3>Can I customize badges? What formats are available?</h3>
                                <span class="faq-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </span>
                            </button>
                            <div class="faq-content">
                                <p>Absolutely! Customize text, colors, and styles on pre-made badges, or create from scratch with our visual editor. Download as SVG (recommended for web use—scales infinitely) or PNG. No accounts needed—just create and download.</p>
                            </div>
                        </div>


                        <div class="faq-item" :class="{ 'active': openFaqIndex === 6 }">
                            <button class="faq-header" @click="toggleFaq(6)">
                                <h3>How do I use badges in my projects?</h3>
                                <span class="faq-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </span>
                            </button>
                            <div class="faq-content">
                                <p>Download your badge as SVG or PNG, then add it anywhere—GitHub README, portfolio site, social media, or documentation. For GitHub: upload to your repo and use `![Badge](path/to/badge.svg)` in Markdown. SVG files scale infinitely without quality loss.</p>
                            </div>
                        </div>


                        <div class="faq-item" :class="{ 'active': openFaqIndex === 7 }">
                            <button class="faq-header" @click="toggleFaq(7)">
                                <h3>Can I contribute designs or report issues?</h3>
                                <span class="faq-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </span>
                            </button>
                            <div class="faq-content">
                                <p>Yes! Send badge designs, bug reports, or feedback to hello@forthebadge.com. For security issues, use our PGP-encrypted email (see above). We're inspired by the original forthebadge.com community and welcome contributions from developers, designers, and badge enthusiasts.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer v-if="!isMobile" />
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
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

// FAQ accordion state
const openFaqIndex = ref(null);

// Toggle FAQ accordion
const toggleFaq = (index) => {
    if (openFaqIndex.value === index) {
        openFaqIndex.value = null;
    } else {
        openFaqIndex.value = index;
    }
};

useHead({
    title: "Contact Us - For the Badge",
    meta: [{ name: "description", content: "Get in touch with the For the Badge team. We're here to help with questions, support, and making badges awesome." }],
});
</script>

<style scoped>
/* Particle Background */
.contact-background {
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

.contact-page {
  min-height: 100vh;
  padding-top: 80px;
  position: relative;
  z-index: 2;
}

.contact-page.mobile-view {
  padding-top: 56px;
  padding-bottom: 64px;
}

.hero-section {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  color: #1f2937;
  padding: 4rem 0;
  text-align: center;
  position: relative;
  z-index: 3;
}

.hero-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 4;
}

.hero-section h1 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  position: relative;
  z-index: 3;
}

.contact-info h2,
.faq-section h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #000000;
}

.contact-intro {
  font-size: 1.1rem;
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.contact-methods {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 3rem;
}

.contact-method {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.contact-method:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.primary-method {
  border-left: 4px solid #000000;
}

.encrypted-method {
  border-left: 4px solid #38a169;
  background: rgba(56, 161, 105, 0.05);
}

.method-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.method-content h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.method-content p {
  color: #4a5568;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.contact-link {
  color: #000000;
  text-decoration: none;
  font-weight: 600;
}

.contact-link:hover {
  text-decoration: underline;
}

.contact-text {
  color: #4a5568;
  font-weight: 500;
}

.email-action {
  margin-top: 1rem;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.6;
}

.help-text {
  margin-top: 0.75rem;
  font-size: 0.9rem;
  color: #718096;
  font-style: italic;
}

.pgp-section {
  margin-top: 3rem;
  padding: 2rem;
  background: rgba(56, 161, 105, 0.03);
  border: 1px solid rgba(56, 161, 105, 0.2);
  border-radius: 12px;
}

.pgp-section h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pgp-section h3::before {
  content: "🔐";
  font-size: 1.1rem;
}

.key-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.key-details {
  font-family: 'Courier New', monospace;
}

.key-details p {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.key-details code {
  background: rgba(0, 0, 0, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.key-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.key-download-link,
.key-view-link {
  padding: 0.75rem 1.5rem;
  background: #38a169;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.key-download-link:hover,
.key-view-link:hover {
  background: #2f855a;
  transform: translateY(-1px);
}

.key-view-link {
  background: transparent;
  color: #38a169;
  border: 2px solid #38a169;
}

.key-view-link:hover {
  background: #38a169;
  color: white;
}

.encryption-guide {
  margin-top: 3rem;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 12px;
}

.encryption-guide h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.encryption-guide h3::before {
  content: "📚";
  font-size: 1.1rem;
}

.guide-steps {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.guide-step {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: #000000;
  color: white;
  border-radius: 50%;
  font-weight: 600;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.step-content h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.step-content p {
  color: #4a5568;
  line-height: 1.6;
  font-size: 0.95rem;
}


.social-section h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
}

.social-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  text-decoration: none;
  color: #000000;
  font-weight: 500;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.faq-section {
  margin-top: 4rem;
}

.faq-section h2 {
  text-align: center;
  margin-bottom: 3rem;
}

.faq-accordion {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 900px;
  margin: 0 auto;
}

.faq-item {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-item:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.faq-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: all 0.3s ease;
}

.faq-header:hover {
  background: rgba(0, 0, 0, 0.05);
}

.faq-item.active .faq-header {
  background: rgba(0, 0, 0, 0.08);
}

.faq-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
  flex: 1;
}

.faq-icon {
  flex-shrink: 0;
  color: #000000;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.faq-item.active .faq-icon {
  transform: rotate(180deg);
}

.faq-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
  padding: 0 1.5rem;
}

.faq-item.active .faq-content {
  max-height: 500px;
  padding: 0 1.5rem 1.5rem 1.5rem;
}

.faq-content p {
  color: #4a5568;
  line-height: 1.6;
  margin: 0;
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

  .contact-method {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }

  .pgp-section,
  .encryption-guide {
    padding: 1.5rem;
    margin-top: 2rem;
  }

  .key-info {
    gap: 1rem;
  }

  .key-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .key-download-link,
  .key-view-link {
    text-align: center;
  }

  .guide-step {
    flex-direction: column;
    text-align: center;
  }

  .step-number {
    align-self: center;
  }

  .faq-accordion {
    max-width: 100%;
  }

  .faq-header {
    padding: 1rem;
  }

  .faq-header h3 {
    font-size: 1rem;
  }

  .faq-item.active .faq-content {
    padding: 0 1rem 1rem 1rem;
  }
}
</style>