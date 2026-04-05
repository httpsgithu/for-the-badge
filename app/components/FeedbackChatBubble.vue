<template>
    <div class="feedback-chat-bubble">
        <!-- Chat Bubble Button -->
        <button
            class="chat-bubble-btn"
            :class="{ 'pulse': shouldPulse }"
            @click="openModal"
            aria-label="Open feedback chat"
            title="Send us feedback, report bugs, or say hello!"
        >
            <svg
                class="chat-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92176 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.60573 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    fill="none"
                />
            </svg>
        </button>

        <!-- Feedback Modal -->
        <FeedbackModal
            :show="showModal"
            @close="closeModal"
            @submit="handleSubmit"
        />
    </div>
</template>

<script setup>
const showModal = ref(false);
const shouldPulse = ref(true);

// Stop pulsing after user interaction
const openModal = () => {
    showModal.value = true;
    shouldPulse.value = false;
};

const closeModal = () => {
    showModal.value = false;
};

const handleSubmit = async (feedbackData) => {
    try {
        const response = await $fetch('/api/feedback', {
            method: 'POST',
            body: {
                message: feedbackData.message
            }
        });
        
        console.log('Feedback submitted successfully:', response);
        // Don't close modal here - let the modal show success state first
        
    } catch (error) {
        console.error('Error submitting feedback:', error);
        // Handle error appropriately (show error message to user)
        throw error; // Re-throw so the loading state is handled properly
    }
};

// Stop pulsing after 10 seconds to avoid being too intrusive
onMounted(() => {
    setTimeout(() => {
        shouldPulse.value = false;
    }, 10000);
});
</script>

<style scoped>
.feedback-chat-bubble {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 1000;
}

.chat-bubble-btn {
    width: 60px;
    height: 60px;
    background: #000000;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.4), 0 4px 10px -5px rgba(0, 0, 0, 0.2);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    color: white;
    position: relative;
    overflow: hidden;
}

.chat-bubble-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%);
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.chat-bubble-btn:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 12px 35px -5px rgba(0, 0, 0, 0.5), 0 6px 15px -5px rgba(0, 0, 0, 0.3);
}

.chat-bubble-btn:hover::before {
    opacity: 1;
}

.chat-bubble-btn:active {
    transform: translateY(-1px) scale(1.02);
}

.chat-icon {
    width: 28px;
    height: 28px;
    transition: transform 0.2s ease;
}

.chat-bubble-btn:hover .chat-icon {
    transform: rotate(15deg) scale(1.1);
}

/* Pulse animation for initial attention */
.chat-bubble-btn.pulse {
    animation: bubble-pulse 2s infinite;
}

@keyframes bubble-pulse {
    0% {
        box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.4), 0 4px 10px -5px rgba(0, 0, 0, 0.2);
    }
    50% {
        box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.6), 0 4px 10px -5px rgba(0, 0, 0, 0.4),
                    0 0 0 10px rgba(0, 0, 0, 0.1);
        transform: scale(1.05);
    }
    100% {
        box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.4), 0 4px 10px -5px rgba(0, 0, 0, 0.2);
    }
}

/* Mobile responsiveness - Hide on mobile since it's in the nav menu */
@media (max-width: 768px) {
    .feedback-chat-bubble {
        display: none;
    }
}

/* These mobile rules are no longer needed since bubble is hidden on mobile */
</style>