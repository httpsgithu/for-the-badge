<template>
    <div class="donors-page">
        <!-- Desktop Navigation -->
        <NavBar v-if="!isMobile" />
        
        <!-- Mobile Navigation -->
        <MobileNavBar v-if="isMobile" />

        <div class="donors-container">
            <!-- Hero Section -->
            <section class="donors-hero">
                <h1 class="hero-title">Our Amazing Supporters</h1>
                <p class="hero-subtitle">
                    These wonderful people help keep For the Badge free, fast, and tracking-free for everyone.
                </p>
                <div class="hero-stats">
                    <div class="stat-item">
                        <div class="stat-number">{{ stats.totalDonors }}</div>
                        <div class="stat-label">Financial Contributors</div>
                    </div>
                    <div class="stat-divider"></div>
                    <div class="stat-item">
                        <div class="stat-number">${{ stats.totalRaised.toFixed(0) }}</div>
                        <div class="stat-label">Total Raised</div>
                    </div>
                    <div class="stat-divider"></div>
                    <div class="stat-item">
                        <div class="stat-number">{{ githubStats.totalCount }}</div>
                        <div class="stat-label">GitHub Contributors</div>
                    </div>
                </div>
            </section>


            <!-- Loading State -->
            <div v-if="pending" class="loading-state">
                <div class="spinner"></div>
                <p>Loading our amazing supporters...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="error-state">
                <p>Unable to load donors at this time. Please try again later.</p>
            </div>

            <!-- Donors Grid -->
            <section v-else class="donors-section">
                <!-- Patrons -->
                <div v-if="patrons.length > 0" class="donor-tier-group">
                    <h2 class="tier-title">
                        <span class="tier-icon">⭐</span>
                        Patrons
                    </h2>
                    <div class="donors-grid">
                        <div
                            v-for="donor in patrons"
                            :key="donor.slug"
                            class="donor-card patron"
                        >
                            <div class="donor-avatar">
                                <img
                                    v-if="donor.image"
                                    :src="donor.image"
                                    :alt="donor.name"
                                />
                                <div v-else class="avatar-placeholder">
                                    {{ donor.name.charAt(0).toUpperCase() }}
                                </div>
                            </div>
                            <div class="donor-info">
                                <h3 class="donor-name">{{ donor.name }}</h3>
                                <div class="donor-meta">
                                    <span class="donor-tier-badge patron-badge">Patron</span>
                                    <span class="donor-since">Since {{ formatDate(donor.since) }}</span>
                                </div>
                                <p v-if="donor.message" class="donor-message">{{ donor.message }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Supporters -->
                <div v-if="supporters.length > 0" class="donor-tier-group">
                    <h2 class="tier-title">
                        <span class="tier-icon">❤️</span>
                        Supporters
                    </h2>
                    <div class="donors-grid">
                        <div
                            v-for="donor in supporters"
                            :key="donor.slug"
                            class="donor-card supporter"
                        >
                            <div class="donor-avatar">
                                <img
                                    v-if="donor.image"
                                    :src="donor.image"
                                    :alt="donor.name"
                                />
                                <div v-else class="avatar-placeholder">
                                    {{ donor.name.charAt(0).toUpperCase() }}
                                </div>
                            </div>
                            <div class="donor-info">
                                <h3 class="donor-name">{{ donor.name }}</h3>
                                <div class="donor-meta">
                                    <span class="donor-tier-badge supporter-badge">Supporter</span>
                                    <span class="donor-since">Since {{ formatDate(donor.since) }}</span>
                                </div>
                                <p v-if="donor.message" class="donor-message">{{ donor.message }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Other Donors -->
                <div v-if="otherDonors.length > 0" class="donor-tier-group">
                    <h2 class="tier-title">
                        <span class="tier-icon">🎉</span>
                        Contributors
                    </h2>
                    <div class="donors-grid compact">
                        <div
                            v-for="donor in otherDonors"
                            :key="donor.slug"
                            class="donor-card-compact"
                        >
                            <div class="donor-avatar-small">
                                <img
                                    v-if="donor.image"
                                    :src="donor.image"
                                    :alt="donor.name"
                                />
                                <div v-else class="avatar-placeholder-small">
                                    {{ donor.name.charAt(0).toUpperCase() }}
                                </div>
                            </div>
                            <span class="donor-name-small">{{ donor.name }}</span>
                        </div>
                    </div>
                </div>

                <!-- GitHub Contributors -->
                <div v-if="!githubPending && !githubError && githubContributors.length > 0" class="donor-tier-group">
                    <h2 class="tier-title">
                        GitHub Contributors
                    </h2>
                    <p class="tier-description">
                        Amazing developers who have contributed code to our 
                        <a href="https://github.com/forthebadge/for-the-badge" target="_blank" rel="noopener noreferrer" class="github-link">
                            public repository
                        </a>
                    </p>
                    <div class="github-contributors-wall">
                        <a
                            v-for="contributor in githubContributors"
                            :key="contributor.id"
                            :href="contributor.html_url"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="github-contributor"
                            :title="`${contributor.login} - ${contributor.contributions} contributions`"
                        >
                            <img
                                :src="contributor.avatar_url"
                                :alt="contributor.login"
                                class="github-avatar"
                                loading="lazy"
                            />
                        </a>
                    </div>
                </div>
            </section>

            <!-- Call to Action -->
            <section class="cta-section">
                <canvas ref="particlesCanvas" class="particles-canvas"></canvas>
                <div class="cta-content">
                    <h2 class="cta-title">Join Our Supporters</h2>
                    <div class="cta-context">
                        <div class="context-item">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M13,14H11V9H13M13,18H11V16H13M1,21H23L12,2L1,21Z" />
                            </svg>
                            <div>
                                <h3>No Tracking</h3>
                                <p>We never track users, collect analytics, or sell data. Your privacy is paramount.</p>
                            </div>
                        </div>
                        <div class="context-item">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z" />
                            </svg>
                            <div>
                                <h3>Forever Free</h3>
                                <p>Badge generation will always be free for everyone. No premium tiers, no paywalls.</p>
                            </div>
                        </div>
                        <div class="context-item">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z" />
                            </svg>
                            <div>
                                <h3>Fully Open Source</h3>
                                <p>Our code is public, auditable, and community-driven. No hidden agendas.</p>
                            </div>
                        </div>
                        <div class="context-item">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                            </svg>
                            <div>
                                <h3>No Ads, Ever</h3>
                                <p>We rely on community support, not advertisers. Keep the web clean.</p>
                            </div>
                        </div>
                    </div>
                    <p class="cta-description">
                        Your donation keeps our servers running and helps us maintain independence from big tech. 
                        Every contribution, no matter the size, makes a real difference.
                    </p>
                    <a
                        href="https://opencollective.com/forthebadge"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="donate-button"
                    >
                        Donate on Open Collective
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
                        </svg>
                    </a>
                </div>
            </section>
        </div>

        <Footer />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { isMobileDevice } from '~/utils/deviceDetection';

definePageMeta({
    layout: false,
});

useSeoMeta({
    title: 'Our Supporters - For the Badge',
    description: 'Meet the amazing people who support For the Badge and help keep it free, fast, and tracking-free for everyone.',
    ogTitle: 'Our Supporters - For the Badge',
    ogDescription: 'Meet the amazing people who support For the Badge and help keep it free, fast, and tracking-free for everyone.',
});

const isMobile = computed(() => {
    if (import.meta.client) {
        return isMobileDevice();
    }
    return false;
});

interface DonorData {
    name: string;
    slug: string;
    tier: 'supporter' | 'patron' | 'donor';
    totalAmount: number;
    since: string;
    image: string | null;
    message: string | null;
}

interface DonorsResponse {
    donors: DonorData[];
    stats: {
        totalDonors: number;
        totalRaised: number;
        currency: string;
    };
}

interface GitHubContributor {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
    contributions: number;
}

interface GitHubContributorsResponse {
    contributors: GitHubContributor[];
    totalCount: number;
}

// Fetch donors data
const { data, pending, error } = await useFetch<DonorsResponse>('/api/donors');

// Fetch GitHub contributors
const { data: githubData, pending: githubPending, error: githubError } = await useFetch<GitHubContributorsResponse>('/api/github-contributors');

const stats = computed(() => data.value?.stats || { totalDonors: 0, totalRaised: 0, currency: 'USD' });
const donors = computed(() => data.value?.donors || []);
const githubStats = computed(() => ({ totalCount: githubData.value?.totalCount || 0 }));
const githubContributors = computed(() => githubData.value?.contributors || []);

const patrons = computed(() => donors.value.filter(d => d.tier === 'patron'));
const supporters = computed(() => donors.value.filter(d => d.tier === 'supporter'));
const otherDonors = computed(() => donors.value.filter(d => d.tier === 'donor'));

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

// Particles animation
const particlesCanvas = ref<HTMLCanvasElement | null>(null);
let animationId: number;

function initParticles() {
    const canvas = particlesCanvas.value;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: Array<{
        x: number;
        y: number;
        size: number;
        speedX: number;
        speedY: number;
        opacity: number;
        hue: number;
    }> = [];

    const particleCount = 60;
    const rainbowColors = [
        0,    // Red
        30,   // Orange
        60,   // Yellow
        120,  // Green
        180,  // Cyan
        240,  // Blue
        280,  // Purple
        320,  // Magenta
    ];

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 4 + 2,
            speedX: (Math.random() - 0.5) * 0.8,
            speedY: (Math.random() - 0.5) * 0.8,
            opacity: Math.random() * 0.4 + 0.4,
            hue: rainbowColors[Math.floor(Math.random() * rainbowColors.length)],
        });
    }

    function animate() {
        if (!canvas || !ctx) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((particle) => {
            ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();

            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Slowly shift hue for color animation
            particle.hue = (particle.hue + 0.3) % 360;

            if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
        });

        animationId = requestAnimationFrame(animate);
    }

    animate();
}

onMounted(() => {
    if (import.meta.client) {
        initParticles();
        window.addEventListener('resize', () => {
            if (particlesCanvas.value) {
                particlesCanvas.value.width = particlesCanvas.value.offsetWidth;
                particlesCanvas.value.height = particlesCanvas.value.offsetHeight;
            }
        });
    }
});

onUnmounted(() => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
});
</script>

<style scoped>
.donors-page {
    min-height: 100vh;
    background: #ffffff;
}

.donors-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
}

/* Hero Section */
.donors-hero {
    text-align: center;
    padding: 6rem 2rem 4rem;
}

.hero-title {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 800;
    margin-bottom: 1rem;
    letter-spacing: -0.02em;
    color: #000000;
}

.hero-subtitle {
    font-size: 1.25rem;
    color: #666666;
    max-width: 600px;
    margin: 0 auto 3rem;
    line-height: 1.6;
}

.hero-stats {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3rem;
    margin-top: 3rem;
}

.stat-item {
    text-align: center;
}

.stat-number {
    font-size: 3rem;
    font-weight: 800;
    color: #000000;
    letter-spacing: -0.02em;
}

.stat-label {
    font-size: 0.875rem;
    color: #666666;
    font-weight: 600;
    margin-top: 0.5rem;
}

.stat-divider {
    width: 1px;
    height: 60px;
    background: #e5e5e5;
}

/* Loading and Error States */
.loading-state,
.error-state {
    text-align: center;
    padding: 4rem 2rem;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e5e5e5;
    border-top-color: #000000;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* Donors Section */
.donors-section {
    padding: 2rem 0;
}

.donor-tier-group {
    margin-bottom: 4rem;
}

.tier-title {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 2rem;
    color: #000000;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.tier-icon {
    font-size: 1.5rem;
}

.donors-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
}

.donors-grid.compact {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
}

/* Donor Cards */
.donor-card {
    background: #ffffff;
    border: 2px solid #e5e5e5;
    border-radius: 12px;
    padding: 2rem;
    display: flex;
    gap: 1rem;
    transition: all 0.3s;
}

.donor-card.patron {
    border-color: #FFD700;
    background: linear-gradient(135deg, #FFFEF7 0%, #ffffff 100%);
}

.donor-card.supporter {
    border-color: #FF6B6B;
    background: linear-gradient(135deg, #FFF5F5 0%, #ffffff 100%);
}

.donor-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
}

.donor-avatar {
    flex-shrink: 0;
}

.donor-avatar img,
.avatar-placeholder {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
}

.avatar-placeholder {
    background: #000000;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 700;
}

.donor-info {
    flex: 1;
    min-width: 0;
}

.donor-name {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #000000;
}

.donor-meta {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    margin-bottom: 0.75rem;
    flex-wrap: wrap;
}

.donor-tier-badge {
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.patron-badge {
    background: #FFD700;
    color: #000000;
}

.supporter-badge {
    background: #FF6B6B;
    color: #ffffff;
}

.donor-since {
    font-size: 0.875rem;
    color: #666666;
}

.donor-message {
    font-size: 0.9375rem;
    color: #666666;
    line-height: 1.5;
    font-style: italic;
}

/* Compact Donor Cards */
.donor-card-compact {
    background: #ffffff;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transition: all 0.2s;
}

.donor-card-compact:hover {
    border-color: #000000;
    transform: translateY(-2px);
}

.donor-avatar-small img,
.avatar-placeholder-small {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
}

.avatar-placeholder-small {
    background: #000000;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    font-weight: 700;
}

.donor-name-small {
    font-size: 0.9375rem;
    font-weight: 500;
    color: #000000;
}

/* GitHub Contributors Section */
.tier-description {
    font-size: 1rem;
    color: #666666;
    margin-bottom: 2rem;
    line-height: 1.6;
}

.github-link {
    color: #000000;
    font-weight: 600;
    text-decoration: underline;
    transition: color 0.2s;
}

.github-link:hover {
    color: #666666;
}

.github-contributors-wall {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: flex-start;
}

.github-contributor {
    position: relative;
    display: block;
    transition: transform 0.2s;
}

.github-contributor:hover {
    transform: scale(1.1);
    z-index: 10;
}

.github-avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #e5e5e5;
    transition: border-color 0.2s;
}

.github-contributor:hover .github-avatar {
    border-color: #000000;
}

/* CTA Section */
.cta-section {
    position: relative;
    text-align: center;
    padding: 4rem 2rem;
    background: #f8f8f8;
    border: 1px solid #e5e5e5;
    border-radius: 16px;
    margin-top: 4rem;
    overflow: hidden;
}

.particles-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.cta-content {
    position: relative;
    z-index: 1;
}

.cta-title {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 3rem;
    color: #000000;
}

.cta-context {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    max-width: 900px;
    margin: 0 auto 3rem;
    text-align: left;
}

.context-item {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    background: rgba(255, 255, 255, 0.9);
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid #e5e5e5;
}

.context-item svg {
    flex-shrink: 0;
    color: #000000;
}

.context-item h3 {
    font-size: 1rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    color: #000000;
}

.context-item p {
    font-size: 0.875rem;
    line-height: 1.5;
    margin: 0;
    color: #666666;
}

.cta-description {
    font-size: 1.125rem;
    margin-bottom: 2rem;
    color: #666666;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
}

.donate-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
    background: #000000;
    color: #ffffff;
    font-weight: 600;
    font-size: 1.125rem;
    border-radius: 8px;
    text-decoration: none;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.donate-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

/* Responsive */
@media (max-width: 768px) {
    .donors-container {
        padding: 1rem;
    }

    .donors-hero {
        padding: 4rem 1rem 2rem;
    }

    .hero-title {
        font-size: 2rem;
    }

    .hero-subtitle {
        font-size: 1rem;
    }

    .hero-stats {
        flex-direction: column;
        gap: 2rem;
    }

    .stat-divider {
        width: 60px;
        height: 1px;
    }

    .donors-grid {
        grid-template-columns: 1fr;
    }

    .donor-card {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .cta-section {
        padding: 3rem 1.5rem;
    }

    .cta-title {
        font-size: 1.75rem;
        margin-bottom: 2rem;
    }

    .cta-context {
        grid-template-columns: 1fr;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .context-item {
        padding: 1rem;
    }

    .cta-description {
        font-size: 1rem;
    }

    .github-avatar {
        width: 56px;
        height: 56px;
    }

    .github-contributors-wall {
        gap: 0.75rem;
    }
}
</style>
