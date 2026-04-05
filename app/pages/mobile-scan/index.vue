<template>
    <div class="mobile-scan-redirect">
        <div class="redirect-card">
            <h1>Scanning Removed</h1>
            <p>Camera scanning has been removed. Please upload a single PDF or multiple JPGs on the Analyzer page.</p>
            <NuxtLink to="/app" class="redirect-btn">Go to Analyzer</NuxtLink>
        </div>
    </div>
</template>

<script setup>
useHead({
    title: "Scanning Removed - For the Badge",
    meta: [{ name: "robots", content: "noindex" }],
});

onMounted(() => {
    navigateTo("/app");
});
</script>

<style scoped>
.mobile-scan-redirect {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.redirect-card {
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  max-width: 480px;
}
.redirect-card h1 {
  margin-bottom: 0.5rem;
  color: #1a202c;
}
.redirect-card p {
  color: #4a5568;
  margin-bottom: 1rem;
}
.redirect-btn {
  display: inline-block;
  background: #667eea;
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
}
.redirect-btn:hover { background: #5a67d8; }
.mobile-scan {
  min-height: 100vh;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.scan-header {
  text-align: center;
  color: white;
  margin-bottom: 2rem;
}

.scan-header h1 {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.scan-header p {
  font-size: 1.1rem;
  opacity: 0.9;
}

.error-state, .connecting-state, .scanner-ready {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.error-icon, .status-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-state h2, .connecting-state h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2d3748;
}

.error-state p, .connecting-state p {
  color: #64748b;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.info-section {
  background: #dbeafe;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #1e40af;
}

.info-icon {
  font-size: 1.5rem;
}

.upload-status {
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: 8px;
}

.uploading {
  background: #fef3c7;
  color: #92400e;
}

.success {
  background: #d1fae5;
  color: #065f46;
}

.error {
  background: #fecaca;
  color: #991b1b;
}

.sub-text {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 0.5rem;
}

.retry-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
}

.retry-btn:hover {
  background: #dc2626;
}

.view-btn {
  background: #10b981;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
}

.view-btn:hover {
  background: #059669;
}
</style>