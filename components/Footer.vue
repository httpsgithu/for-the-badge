<template>
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-content">
                <div class="footer-brand">
                    <p class="brand-description">
                        Making contracts readable since 2025. Because life's too short for legalese.
                    </p>
                </div>

                <div class="footer-links">
                    <div class="link-group">
                        <h4>Product</h4>
                        <NuxtLink to="/#features">Features</NuxtLink>
                        <NuxtLink to="/#pricing">Pricing</NuxtLink>
                        <NuxtLink to="/app">Analyze Contracts</NuxtLink>
                        <NuxtLink to="/account">Get Account</NuxtLink>
                    </div>

                    <div class="link-group">
                        <h4>Company</h4>
                        <NuxtLink to="/company/about">About</NuxtLink>
                        <NuxtLink to="/company/careers">Careers</NuxtLink>
                        <NuxtLink to="/company/contact">Contact</NuxtLink>
                    </div>

                    <div class="link-group">
                        <h4>Legal</h4>
                        <NuxtLink to="/legal/privacy">Privacy Policy</NuxtLink>
                        <NuxtLink to="/legal/terms">Terms of Service</NuxtLink>
                        <NuxtLink to="/legal/cookies">Cookie Policy</NuxtLink>
                        <NuxtLink to="/legal/gdpr">GDPR</NuxtLink>
                    </div>
                </div>
            </div>

            <div class="footer-bottom">
                <div class="footer-meta">
                    <p>&copy; {{ currentYear }} For the Badge. Made with ❤️ in Chicago.</p>
                    <p class="disclaimer">
                        No badges were harmed in the making of this app.
                    </p>
                </div>

                <div class="footer-social">
                    <a
                        href="#"
                        class="social-link"
                    >🐦</a>
                    <a
                        href="#"
                        class="social-link"
                    >📧</a>
                    <a
                        href="#"
                        class="social-link"
                    >💼</a>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<style scoped>
.footer {
  background: #1a202c;
  color: white;
  padding: 4rem 0 2rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 4rem;
  margin-bottom: 3rem;
}

.footer-brand {
  max-width: 300px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.logo {
  font-size: 2rem;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-description {
  color: #a0aec0;
  line-height: 1.6;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.link-group h4 {
  font-weight: 600;
  margin-bottom: 1rem;
  color: white;
}

.link-group a {
  display: block;
  color: #a0aec0;
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
}

.link-group a:hover {
  color: #667eea;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid #2d3748;
}

.footer-meta p {
  color: #a0aec0;
  margin-bottom: 0.25rem;
}

.disclaimer {
  font-style: italic;
  font-size: 0.9rem;
}

.footer-social {
  display: flex;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  text-decoration: none;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-links {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
