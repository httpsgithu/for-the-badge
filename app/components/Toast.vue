<template>
    <Teleport to="body">
        <Transition name="toast">
            <div
                v-if="show"
                class="toast"
                :class="`toast-${type}`"
                @click="handleClick"
            >
                <div class="toast-icon">
                    <svg v-if="type === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                    </svg>
                    <svg v-else-if="type === 'error'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z" />
                    </svg>
                    <svg v-else-if="type === 'info'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                    </svg>
                    <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,6A1.5,1.5 0 0,1 13.5,7.5A1.5,1.5 0 0,1 12,9A1.5,1.5 0 0,1 10.5,7.5A1.5,1.5 0 0,1 12,6M12,18C9.79,18 8,16.21 8,14C8,13.45 8.45,13 9,13H15C15.55,13 16,13.45 16,14C16,16.21 14.21,18 12,18Z" />
                    </svg>
                </div>
                <div class="toast-message">
                    {{ message }}
                </div>
                <button class="toast-close" @click.stop="close">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                    </svg>
                </button>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
    show: boolean;
    message: string;
    type?: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
}>();

const emit = defineEmits<{
    close: [];
}>();

let timeout: NodeJS.Timeout | null = null;

watch(() => props.show, (newVal) => {
    if (newVal) {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            emit('close');
        }, props.duration || 3000);
    }
});

const handleClick = () => {
    // Allow clicking anywhere on toast to close it
    emit('close');
};

const close = () => {
    if (timeout) clearTimeout(timeout);
    emit('close');
};

onUnmounted(() => {
    if (timeout) clearTimeout(timeout);
});
</script>

<style scoped>
.toast {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    border-radius: 12px;
    padding: 1rem 1.5rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 1rem;
    max-width: 400px;
    z-index: 10000;
    cursor: pointer;
    border: 1px solid;
}

.toast-success {
    border-color: #10b981;
    background: #f0fdf4;
}

.toast-success .toast-icon {
    color: #10b981;
}

.toast-error {
    border-color: #ef4444;
    background: #fef2f2;
}

.toast-error .toast-icon {
    color: #ef4444;
}

.toast-info {
    border-color: #3b82f6;
    background: #eff6ff;
}

.toast-info .toast-icon {
    color: #3b82f6;
}

.toast-warning {
    border-color: #f59e0b;
    background: #fffbeb;
}

.toast-warning .toast-icon {
    color: #f59e0b;
}

.toast-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.toast-message {
    flex: 1;
    color: #1f2937;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.4;
}

.toast-close {
    flex-shrink: 0;
    background: none;
    border: none;
    padding: 0.25rem;
    cursor: pointer;
    color: #6b7280;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s;
}

.toast-close:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #1f2937;
}

.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
    opacity: 0;
    transform: translateX(-50%) translateY(100%);
}

.toast-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(100%);
}

@media (max-width: 768px) {
    .toast {
        left: 50%;
        right: auto;
        max-width: calc(100% - 2rem);
        width: calc(100% - 2rem);
    }
}
</style>
