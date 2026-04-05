<template>
    <SkewNotification v-slot="{ isCurrentChunksOutdated }" :forceOpen="props.show">
        <Transition name="slide-right">
            <div v-if="isCurrentChunksOutdated" class="skew-refresh" @click="reload">
                <span class="refresh-link">Refresh</span> your page get the latest version of <em>For the Badge</em>!
            </div>
        </Transition>
    </SkewNotification>
</template>

<script setup lang="ts">
const props = defineProps<{ show?: boolean }>();

function reload(): void {
    window.location.reload();
}
</script>

<style scoped>
.skew-refresh {
    position: fixed;
    left: 2rem;
    bottom: 5rem;
    z-index: 1000;
    user-select: none;
    pointer-events: all;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(102, 126, 234, 0.2);
    border-radius: 16px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    padding: 1rem 1.5rem;
    max-width: 400px;
    font-size: 0.9rem;
    line-height: 1.5;
    color: #1f2937;
    animation: slideInLeft 0.6s ease-out;
    transition: all 0.3s ease;
}

.skew-refresh:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.15), 0 8px 15px -2px rgba(0, 0, 0, 0.08);
}

.refresh-link {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    position: relative;
}

.skew-refresh > em {
    color: #667eea;
    font-weight: 500;
    font-style: normal;
}

@keyframes slideInLeft {
    from {
        opacity: 0;
        transform: translateX(-100%);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@media (max-width: 768px) {
    .skew-refresh {
        left: 1rem;
        right: 1rem;
        bottom: 4rem;
        padding: 0.875rem 1.25rem;
        font-size: 0.85rem;
        max-width: none;
    }
}

/* Slide-right transition for the Nuxt Transition component */
.slide-right-enter-active,
.slide-right-leave-active {
    transition: all 0.3s ease-out;
}

.slide-right-enter-from {
    opacity: 0;
    transform: translateX(-30px);
}

.slide-right-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}
</style>