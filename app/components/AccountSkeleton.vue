<template>
    <div class="account-skeleton">
        <div class="skeleton-nav">
            <div class="skeleton-nav-content">
                <div class="skeleton-logo" />
                <div class="skeleton-nav-items">
                    <div class="skeleton-nav-item" />
                    <div class="skeleton-nav-item" />
                </div>
            </div>
        </div>

        <div class="skeleton-main">
            <div class="skeleton-container">
                <div class="skeleton-header">
                    <div class="skeleton-title" />
                    <div class="skeleton-account-id" />
                </div>

                <div class="skeleton-stats">
                    <div class="skeleton-stat-card">
                        <div class="skeleton-stat-label" />
                        <div class="skeleton-stat-value large" />
                    </div>
                    <div class="skeleton-stat-card">
                        <div class="skeleton-stat-label" />
                        <div class="skeleton-stat-value" />
                    </div>
                    <div class="skeleton-stat-card">
                        <div class="skeleton-stat-label" />
                        <div class="skeleton-stat-value" />
                    </div>
                </div>

                <div class="skeleton-actions">
                    <div class="skeleton-action-card">
                        <div class="skeleton-action-title" />
                        <div class="skeleton-action-desc" />
                        <div class="skeleton-button" />
                    </div>
                    <div class="skeleton-action-card">
                        <div class="skeleton-action-title" />
                        <div class="skeleton-action-desc" />
                        <div class="skeleton-button" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// No props needed - this is a loading state
</script>

<style scoped>
.account-skeleton {
    min-height: 100vh;
    background: #f8fafc;
}

.skeleton-nav {
    background: white;
    border-bottom: 1px solid #e2e8f0;
    padding: 1rem 0;
    position: sticky;
    top: 0;
    z-index: 100;
}

.skeleton-nav-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.skeleton-logo {
    width: 120px;
    height: 32px;
    background: #e2e8f0;
    border-radius: 4px;
    animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-nav-items {
    display: flex;
    gap: 2rem;
}

.skeleton-nav-item {
    width: 80px;
    height: 20px;
    background: #e2e8f0;
    border-radius: 4px;
    animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-main {
    flex: 1;
    padding: 3rem 0;
}

.skeleton-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 2rem;
}

.skeleton-header {
    text-align: center;
    margin-bottom: 3rem;
}

.skeleton-title {
    width: 200px;
    height: 36px;
    background: #e2e8f0;
    border-radius: 6px;
    margin: 0 auto 1rem;
    animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-account-id {
    width: 180px;
    height: 24px;
    background: #f1f5f9;
    border-radius: 4px;
    margin: 0 auto;
    animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
}

.skeleton-stat-card {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.skeleton-stat-label {
    width: 100px;
    height: 16px;
    background: #f1f5f9;
    border-radius: 4px;
    margin: 0 auto 1rem;
    animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-stat-value {
    width: 80px;
    height: 24px;
    background: #e2e8f0;
    border-radius: 4px;
    margin: 0 auto;
    animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-stat-value.large {
    width: 120px;
    height: 32px;
}

.skeleton-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.skeleton-action-card {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.skeleton-action-title {
    width: 150px;
    height: 24px;
    background: #e2e8f0;
    border-radius: 4px;
    margin-bottom: 1rem;
    animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-action-desc {
    width: 100%;
    height: 16px;
    background: #f1f5f9;
    border-radius: 4px;
    margin-bottom: 1.5rem;
    animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-button {
    width: 120px;
    height: 40px;
    background: #e2e8f0;
    border-radius: 6px;
    animation: skeleton-pulse 1.5s ease-in-out infinite;
}

@keyframes skeleton-pulse {
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0.4;
    }
    100% {
        opacity: 1;
    }
}

@media (max-width: 768px) {
    .skeleton-nav-content {
        padding: 0 1rem;
    }

    .skeleton-container {
        padding: 0 1rem;
    }

    .skeleton-stats {
        grid-template-columns: 1fr;
    }

    .skeleton-actions {
        grid-template-columns: 1fr;
    }

    .skeleton-title {
        width: 180px;
    }

    .skeleton-account-id {
        width: 160px;
    }
}
</style>