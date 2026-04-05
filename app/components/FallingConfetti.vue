<template>
    <div class="confetti" aria-hidden="true">
        <span
            v-for="p in pieces"
            :key="p.id"
            class="piece"
            :style="pieceStyle(p)"
        />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

type ConfettiPiece = {
    id: number;
    left: number;
    delayMs: number;
    durationMs: number;
    sizePx: number;
    rotateDeg: number;
    color: string;
};

const PIECE_COUNT = 48;

const pieces = ref<ConfettiPiece[]>([]);

const colors = [
    "#fbbf24", // amber
    "#f59e0b", // orange
    "#FF6B6B", // coral
    "#4ECDC4", // teal
    "#45B7D1", // sky
    "#FFA07A", // light salmon
    "#98D8C8", // mint
    "#F7DC6F", // yellow
    "#BB8FCE", // purple
    "#85C1E2", // light blue
];

function rand(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

function randInt(min: number, max: number) {
    return Math.floor(rand(min, max + 1));
}

function pieceStyle(p: ConfettiPiece) {
    return {
        left: `${p.left}%`,
        background: p.color,
        "--delay": `${p.delayMs}ms`,
        "--duration": `${p.durationMs}ms`,
        "--size": `${p.sizePx}px`,
        "--rotate": `${p.rotateDeg}deg`,
    };
}

onMounted(() =>
{
    const newPieces: ConfettiPiece[] = [];

    for (let i = 0; i < PIECE_COUNT; i++)
    {
        const size = randInt(6, 12);
        newPieces.push({
            id: i,
            left: rand(0, 100),
            delayMs: randInt(0, 2500),
            durationMs: randInt(7000, 11000),
            sizePx: size,
            rotateDeg: randInt(-45, 45),
            color: colors[randInt(0, colors.length - 1)],
        });
    }

    pieces.value = newPieces;
});
</script>

<style scoped>
.confetti {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 20;
    overflow: hidden;
}

.piece {
    position: absolute;
    top: -12px;
    width: var(--size);
    height: calc(var(--size) * 0.65);
    border-radius: 2px;
    opacity: 0.9;
    transform: rotate(var(--rotate));
    animation: confetti-fall var(--duration) linear infinite;
    animation-delay: var(--delay);
    filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.12));
}

@keyframes confetti-fall {
    0% {
        transform: translateY(-20px) rotate(var(--rotate));
    }

    100% {
        transform: translateY(110vh) rotate(calc(var(--rotate) + 380deg));
    }
}

@media (prefers-reduced-motion: reduce) {
    .piece {
        animation: none;
        display: none;
    }
}
</style>
