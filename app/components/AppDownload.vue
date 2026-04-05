<template>
    <div class="app-download" :class="{ 'mobile-download': isMobile }">
        <div class="step-header">
            <h2>Download the App</h2>
                <p>Get the For The Badge app to create badges and manage your account. Available for all platforms!</p>
        </div>

        <div class="download-options">
            <div class="download-card">
                <div class="platform-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4,6H20V16H4V6M20,18A2,2 0 0,0 22,16V6A2,2 0 0,0 20,4H4A2,2 0 0,0 2,6V16A2,2 0 0,0 4,18H11V19H7V21H17V19H13V18H20Z" />
                    </svg>
                </div>
                <h3>Web App</h3>
                <p>Use For The Badge directly in your browser</p>
                <button
                    class="download-btn primary"
                    @click="openWebApp"
                >
                    <span class="btn-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8Z" />
                        </svg>
                    </span>
                    Open Web App
                </button>
                <div class="available-now">
                    Available Now!
                </div>
            </div>

            <div class="download-card coming-soon-card">
                <div class="platform-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                    </svg>
                </div>
                <h3>iOS App</h3>
                <p>Create badges with your iPhone camera</p>
                <div class="coming-soon-badge">
                    Coming Soon!
                </div>
            </div>

            <div class="download-card coming-soon-card">
                <div class="platform-icon">
                    <svg width="48" height="48" viewBox="0 0 32 32" fill="currentColor">
                        <path d="M23.35 12.653l2.496-4.323c0.044-0.074 0.070-0.164 0.070-0.26 0-0.287-0.232-0.519-0.519-0.519-0.191 0-0.358 0.103-0.448 0.257l-0.001 0.002-2.527 4.377c-1.887-0.867-4.094-1.373-6.419-1.373s-4.532 0.506-6.517 1.413l0.098-0.040-2.527-4.378c-0.091-0.156-0.259-0.26-0.45-0.26-0.287 0-0.519 0.232-0.519 0.519 0 0.096 0.026 0.185 0.071 0.262l-0.001-0.002 2.496 4.323c-4.286 2.367-7.236 6.697-7.643 11.744l-0.003 0.052h29.991c-0.41-5.099-3.36-9.429-7.57-11.758l-0.076-0.038zM9.098 20.176c-0 0-0 0-0 0-0.69 0-1.249-0.559-1.249-1.249s0.559-1.249 1.249-1.249c0.69 0 1.249 0.559 1.249 1.249v0c-0.001 0.689-0.559 1.248-1.249 1.249h-0zM22.902 20.176c-0 0-0 0-0 0-0.69 0-1.249-0.559-1.249-1.249s0.559-1.249 1.249-1.249c0.69 0 1.249 0.559 1.249 1.249v0c-0.001 0.689-0.559 1.248-1.249 1.249h-0z"/>
                    </svg>
                </div>
                <h3>Android App</h3>
                <p>Create badges  with your Android camera</p>
                <div class="coming-soon-badge">
                    Coming Soon!
                </div>
            </div>
        </div>

        <div class="features-preview">
            <h3>What you can do with the app:</h3>
            <div class="features-grid">
                <div class="feature-item">
                    <span class="feature-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7,5H21V3H7M21,19H7V7H21M21,1H7A2,2 0 0,0 5,3V21A2,2 0 0,0 7,23H21A2,2 0 0,0 23,21V3A2,2 0 0,0 21,1M17.15,12L14,9.15L16.15,7L20.3,11.15L16.15,15.3L14,13.15L17.15,10M11.85,12L8.7,8.85L10.85,6.7L15,10.85L10.85,15L8.7,12.85L11.85,15Z" />
                        </svg>
                    </span>
                    <span>Create custom badges</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M9,17H7V10H9V17M13,17H11V7H13V17M17,17H15V9H17V17Z" />
                        </svg>
                    </span>
                    <span>Browse all badge designs</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                        </svg>
                    </span>
                    <span>Full color customization</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7,10L12,15L17,10H7Z" />
                        </svg>
                    </span>
                    <span>Export as SVG or PNG</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
                        </svg>
                    </span>
                    <span>No sign-up required</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20,8H4V6H20M20,18H4V12H20M22,18V6C22,4.89 21.1,4 20,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20C21.1,20 22,19.1 22,18Z" />
                        </svg>
                    </span>
                    <span>Share badges with markdown</span>
                </div>
            </div>
        </div>

        <div class="help-section">
            <h4>Need help?</h4>
            <p>
                <a
                    href="/company/contact"
                    class="help-link"
                >Contact support</a> if you run into any issues.
            </p>
        </div>

        <ConfirmationModal
            :show="showModal"
            :title="modalConfig.title"
            :message="modalConfig.message"
            :confirmText="modalConfig.confirmText"
            :showCancel="false"
            @confirm="handleModalConfirm"
            @close="handleModalClose"
        />
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { isMobileDevice } from '~/utils/deviceDetection';

import ConfirmationModal from "./ConfirmationModal.vue";

// Mobile detection based on user agent
const isMobile = computed(() => {
    if (import.meta.client) {
        return isMobileDevice();
    }
    return false;
});

const showModal = ref(false);
const modalConfig = ref({});

const downloadApp = (platform) =>
{
    showModal.value = true;
    modalConfig.value = {
        title: `${platform.toUpperCase()} App Coming Soon!`,
        message: `The ${platform.toUpperCase()} app is currently in development. We'll notify you when it's ready for download!`,
        confirmText: "Got it",
    };
};

const openWebApp = () =>
{
    navigateTo("/generator");
};

const handleModalConfirm = () =>
{
    showModal.value = false;
    modalConfig.value = {};
};

const handleModalClose = () =>
{
    showModal.value = false;
    modalConfig.value = {};
};
</script>

<style scoped>
.app-download {
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
}

.app-download.mobile-download {
  max-width: 100%;
}

.step-header {
  margin-bottom: 2rem;
  text-align: left;
}

.mobile-download .step-header {
  margin-bottom: 1.5rem;
}

.step-header h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #1a202c;
}

.mobile-download .step-header h2 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
}

.step-header p {
  color: #4a5568;
  line-height: 1.6;
}

.mobile-download .step-header p {
  font-size: 0.9375rem;
  line-height: 1.5;
}

.download-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.mobile-download .download-options {
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.download-card {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
}

.mobile-download .download-card {
  padding: 1.5rem;
  border-radius: 12px;
}

.download-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.mobile-download .download-card:hover {
  transform: none;
}

.mobile-download .download-card:active {
  transform: scale(0.98);
}

.platform-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.download-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1a202c;
}

.download-card p {
  color: #4a5568;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.download-btn {
  background: #000000;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  min-height: 44px;
}

.mobile-download .download-btn {
  width: 100%;
  padding: 0.875rem 1.25rem;
  font-size: 0.9375rem;
}

.download-btn:hover {
  background: #1f2937;
  transform: translateY(-2px);
}

.mobile-download .download-btn:hover {
  transform: none;
}

.mobile-download .download-btn:active {
  transform: scale(0.98);
  background: #4c51bf;
}

.download-btn.primary {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
}

.coming-soon-card {
  opacity: 0.8;
  cursor: default;
}

.coming-soon-card:hover {
  transform: none;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.coming-soon-badge {
  background: #fef5e7;
  color: #c05621;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 1rem;
}

.coming-soon {
  background: #fef5e7;
  color: #c05621;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.available-now {
  background: #f0fff4;
  color: #22543d;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.features-preview {
  background: #f8fafc;
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
}

.mobile-download .features-preview {
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.features-preview h3 {
  margin-bottom: 1.5rem;
  color: #1a202c;
}

.mobile-download .features-preview h3 {
  font-size: 1.125rem;
  margin-bottom: 1.25rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.mobile-download .features-grid {
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  text-align: left;
}

.mobile-download .feature-item {
  padding: 0.875rem;
  border-radius: 10px;
  font-size: 0.9375rem;
}

.feature-icon {
  font-size: 1.25rem;
}

.help-section {
  padding: 1.5rem;
  background: #edf2f7;
  border-radius: 12px;
}

.mobile-download .help-section {
  padding: 1.25rem;
  border-radius: 10px;
}

.help-section h4 {
  margin-bottom: 0.5rem;
  color: #1a202c;
}

.mobile-download .help-section h4 {
  font-size: 1rem;
}

.help-section p {
  color: #4a5568;
  margin: 0;
}

.mobile-download .help-section p {
  font-size: 0.9375rem;
}

.help-link {
  color: #000000;
  text-decoration: none;
  font-weight: 600;
}

.help-link:hover {
  text-decoration: underline;
}

</style>