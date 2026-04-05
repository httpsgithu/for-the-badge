<template>
    <div class="login-page">
        <NavBar v-if="!isMobile" />
        <MobileNavBar v-if="isMobile" />

        <div class="login-container">
            <!-- Particles background -->
            <div class="particles-container">
                <div
                    v-for="(particle, index) in particles"
                    :key="index"
                    :class="['particle', particle.type]"
                    :style="{
                        left: particle.x + '%',
                        top: particle.y + '%',
                        animationDelay: particle.delay + 'ms',
                        animationDuration: particle.duration + 's'
                    }"
                />
            </div>

            <div class="login-content">
                <h1>Sign In</h1>
                <p class="login-subtitle">
                    Access your account
                </p>

                <div class="login-box">
                    <!-- Login Form -->
                    <form v-if="!showPinChallenge" @submit.prevent="handleLogin">
                        <div class="form-group">
                            <label for="accountId" class="form-label">Account Number</label>
                            <input
                                id="accountId"
                                v-model="accountId"
                                type="text"
                                placeholder="Enter your 16-digit account number"
                                class="form-input"
                                :disabled="isLoading"
                                @keyup="formatAccountId"
                            >
                            <p v-if="accountIdError" class="error-text">
                                {{ accountIdError }}
                            </p>
                        </div>

                        <button
                            type="submit"
                            class="btn-login"
                            :disabled="isLoading || !isValidAccountId"
                        >
                            <span v-if="isLoading">Signing in...</span>
                            <span v-else>Sign In</span>
                        </button>
                    </form>

                    <!-- PIN Challenge Form -->
                    <form v-else-if="showPinChallenge" @submit.prevent="handlePinChallenge">
                        <div class="form-group">
                            <label for="pin" class="form-label">Enter your PIN</label>
                            <input
                                id="pin"
                                v-model="pin"
                                type="password"
                                placeholder="Enter your PIN"
                                class="form-input"
                                :disabled="isLoading"
                                maxlength="6"
                            >
                            <p v-if="pinError" class="error-text">
                                {{ pinError }}
                            </p>
                        </div>

                        <button
                            type="submit"
                            class="btn-login"
                            :disabled="isLoading || !pin"
                        >
                            <span v-if="isLoading">Verifying...</span>
                            <span v-else>Verify PIN</span>
                        </button>

                        <button
                            type="button"
                            class="btn-back"
                            :disabled="isLoading"
                            @click="handleBackToLogin"
                        >
                            Back to Login
                        </button>
                    </form>

                    <!-- Error Message -->
                    <p v-if="generalError" class="error-message">
                        {{ generalError }}
                    </p>

                    <NuxtLink to="/account" class="create-account-link">
                        Don't have an account? Create one
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
                        </svg>
                    </NuxtLink>
                </div>
            </div>
        </div>

        <Footer />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { isMobileDevice } from '~/utils/deviceDetection';

const isMobile = computed(() => isMobileDevice());

function isValidLuhn(number : string) : boolean
{
    if (!/^\d+$/.test(number) || number.length < 2)
    {
        return false;
    }
    const body = number.slice(0, -1);
    const check = parseInt(number[number.length - 1], 10);

    let sum = 0;
    let shouldDouble = true;
    for (let i = body.length - 1; i >= 0; i--)
    {
        let d = parseInt(body[i], 10);
        if (shouldDouble)
        {
            d *= 2;
            if (d > 9)
            {
                d -= 9;
            }
        }
        sum += d;
        shouldDouble = !shouldDouble;
    }
    const mod = sum % 10;
    const checkDigit = mod === 0 ? 0 : 10 - mod;

    return checkDigit === check;
}

interface Particle {
    x : number;
    y : number;
    delay : number;
    duration : number;
    type : string;
}

const accountService = useAccountService();
const { push } = useRouter();

const particles = ref<Particle[]>([]);
const accountId = ref("");
const pin = ref("");
const isLoading = ref(false);
const showPinChallenge = ref(false);
const accountIdError = ref("");
const pinError = ref("");
const generalError = ref("");

const isValidAccountId = computed(() =>
{
    return /^\d{16}$/.test(accountId.value) && isValidLuhn(accountId.value);
});

const formatAccountId = () : void =>
{
    // Remove any non-digit characters
    accountId.value = accountId.value.replace(/\D/g, "").slice(0, 16);
    accountIdError.value = "";
};

const handleLogin = async () : Promise<void> =>
{
    generalError.value = "";
    accountIdError.value = "";

    if (!isValidAccountId.value)
    {
        accountIdError.value = "Invalid account number format";

        return;
    }

    isLoading.value = true;

    try
    {
        const response = await accountService.login({ userId: accountId.value });

        if (response.challenge)
        {
            // PIN challenge required
            showPinChallenge.value = true;
            pin.value = "";
        }
        else
        {
            // Login successful - refresh session and redirect to account dashboard
            const { refresh: refreshSession } = useAuth();
            await refreshSession();
            await push("/account/" + accountId.value);
        }
    }
    catch (error : unknown)
    {
        const apiError = error as Record<string, unknown>;
        generalError.value = (apiError?.data as Record<string, unknown>)?.message as string || "Login failed. Please try again.";
    }
    finally
    {
        isLoading.value = false;
    }
};

const handlePinChallenge = async () : Promise<void> =>
{
    generalError.value = "";
    pinError.value = "";

    if (!pin.value)
    {
        pinError.value = "PIN is required";

        return;
    }

    isLoading.value = true;

    try
    {
        const { $csrfFetch } = useNuxtApp();
        await $csrfFetch("/api/account/login/challenge", {
            method: "POST",
            body: { pin: pin.value },
        });

        // PIN verification successful - refresh session and redirect to account dashboard
        const { refresh: refreshSession } = useAuth();
        await refreshSession();
        await push("/account/" + accountId.value);
    }
    catch (error : unknown)
    {
        const apiError = error as Record<string, unknown>;
        pinError.value = (apiError?.data as Record<string, unknown>)?.message as string || "Invalid PIN. Please try again.";
    }
    finally
    {
        isLoading.value = false;
    }
};

const handleBackToLogin = () : void =>
{
    showPinChallenge.value = false;
    pin.value = "";
    pinError.value = "";
    generalError.value = "";
};

onMounted(() =>
{
    const particleTypes = [
        "small",
        "medium",
        "large",
    ];
    const newParticles : Particle[] = [];

    for (let i = 0; i < 60; i++)
    {
        newParticles.push({
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 8000,
            duration: 15 + Math.random() * 10,
            type: particleTypes[Math.floor(Math.random() * particleTypes.length)],
        });
    }

    particles.value = newParticles;
});

definePageMeta({ layout: false });
</script>

<style scoped>
.login-page {
    min-height: 100vh;
    background: #ffffff;
}

.login-container {
    min-height: calc(100vh - 200px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    position: relative;
    margin-top: 3rem;
}

.particles-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    background: linear-gradient(135deg, #fafafa 0%, #ffffff 100%);
}

.particle {
    position: absolute;
    background: #e5e5e5;
    border-radius: 50%;
    opacity: 0;
    animation: particleFloat infinite ease-in-out;
}

.particle.small {
    width: 1px;
    height: 1px;
}

.particle.medium {
    width: 2px;
    height: 2px;
}

.particle.large {
    width: 3px;
    height: 3px;
}

@keyframes particleFloat {
    0% {
        transform: translate(0, 0) scale(0);
        opacity: 0;
    }
    10% {
        opacity: 0.05;
    }
    50% {
        transform: translate(var(--float-x, 20px), var(--float-y, -100px)) scale(1);
        opacity: 0.03;
    }
    90% {
        opacity: 0.04;
    }
    100% {
        transform: translate(var(--float-x-end, -20px), var(--float-y-end, -200px)) scale(0);
        opacity: 0;
    }
}

.login-content {
    max-width: 500px;
    width: 100%;
    position: relative;
    z-index: 2;
    text-align: center;
}

.login-content h1 {
    font-size: 3rem;
    font-weight: 800;
    color: #000000;
    margin-bottom: 1rem;
    letter-spacing: -0.02em;
}

.login-subtitle {
    color: #666666;
    font-size: 1.125rem;
    margin-bottom: 3rem;
}

.login-box {
    background: #ffffff;
    border-radius: 16px;
    padding: 3rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.form-group {
    margin-bottom: 1.5rem;
    text-align: left;
}

.form-label {
    display: block;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
}

.form-input {
    width: 100%;
    padding: 0.875rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.2s;
    box-sizing: border-box;
}

.form-input:focus {
    outline: none;
    border-color: #1f2937;
    box-shadow: 0 0 0 3px rgba(31, 41, 55, 0.1);
}

.form-input:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
}

.error-text {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    margin-bottom: 0;
}

.error-message {
    color: #ef4444;
    font-size: 0.95rem;
    margin: 1rem 0;
    padding: 0.75rem 1rem;
    background-color: rgba(239, 68, 68, 0.1);
    border-radius: 8px;
    border-left: 3px solid #ef4444;
}

.btn-login {
    width: 100%;
    padding: 1rem;
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 1rem;
}

.btn-login:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.btn-login:active:not(:disabled) {
    transform: translateY(0);
}

.btn-login:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-back {
    width: 100%;
    padding: 1rem;
    background: transparent;
    color: #1f2937;
    border: 2px solid #1f2937;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-back:hover:not(:disabled) {
    background: rgba(31, 41, 55, 0.1);
}

.btn-back:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.create-account-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #000000;
    text-decoration: none;
    font-weight: 500;
    transition: gap 0.2s;
    margin-top: 1.5rem;
}

.create-account-link:hover {
    gap: 1rem;
}

@media (max-width: 768px) {
    .login-page {
        padding-bottom: 5rem; /* Account for mobile bottom nav */
    }

    .login-container {
        padding-top: 6rem; /* Account for mobile top bar */
        padding-bottom: 5rem; /* Account for mobile bottom nav */
    }

    .login-content h1 {
        font-size: 2.5rem;
    }

    .login-box {
        padding: 2rem;
    }
}
</style>