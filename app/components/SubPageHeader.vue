<template>
    <section class="sub-page-header">
        <!-- Animated dot matrix background -->
        <div ref="dotMatrix" class="dot-matrix">
            <div
                v-for="(dot, index) in dots"
                :key="index"
                :class="['dot', dot.type]"
                :style="{ left: dot.x + '%', top: dot.y + '%', animationDelay: dot.delay + 'ms', background: dot.color }"
            />
        </div>

        <div class="header-container">
            <div class="header-content">
                <h1 class="header-title">{{ title }}</h1>
                <p v-if="subtitle" class="header-subtitle">{{ subtitle }}</p>
                <slot />
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        default: ''
    }
});

const dotMatrix = ref(null);
const dots = ref([]);

// Generate random dots for the matrix background
const generateDots = () => {
    const dotCount = 100;
    const newDots = [];
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788'];

    for (let i = 0; i < dotCount; i++) {
        const types = ["small", "medium", "large"];
        const type = types[Math.floor(Math.random() * types.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];

        newDots.push({
            x: Math.random() * 100,
            y: Math.random() * 100,
            type,
            color,
            delay: Math.random() * 2000,
        });
    }

    dots.value = newDots;
};

onMounted(() => {
    generateDots();
});
</script>

<style scoped>
.sub-page-header {
    min-height: 40vh;
    background: #f8fafb;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 0;
    padding-top: 8rem;
    padding-bottom: 4rem;
    position: relative;
    overflow: hidden;
}

/* Animated dot matrix background */
.dot-matrix {
    position: absolute;
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
    opacity: 0;
    animation: dotFade 4s infinite;
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

.header-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    text-align: center;
    z-index: 1;
    position: relative;
}

.header-content {
    max-width: 800px;
    margin: 0 auto;
}

.header-title {
    font-size: clamp(2.5rem, 5vw, 3.5rem);
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 1rem;
    color: #000000;
    letter-spacing: -0.02em;
}

.header-subtitle {
    font-size: clamp(1.1rem, 2vw, 1.3rem);
    color: #6b7280;
    margin-bottom: 2rem;
    line-height: 1.6;
    font-weight: 400;
}

@media (max-width: 768px) {
    .sub-page-header {
        min-height: 30vh;
        padding-top: 6rem;
        padding-bottom: 3rem;
    }

    .header-container {
        padding: 0 1rem;
    }
}
</style>
