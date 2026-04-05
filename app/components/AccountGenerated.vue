<template>
    <div class="account-generated" :class="{ 'mobile-generated': isMobile }">
        <div class="success-icon">
            <svg
                width="56"
                height="56"
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,17L18,12L16.59,10.58L12,15.17L7.91,11.09L6.5,12.5L12,18" />
            </svg>
        </div>
        <h2>Account Generated Successfully!</h2>
        <p class="lead">
            Your account number is ready. Save it somewhere safe — you'll need it to access your account.
        </p>

        <!-- Single, credit-card style membership card (no duplicate number elsewhere) -->
        <div
            class="membership-card"
            :class="{ revealed: showNumber }"
            :aria-label="showNumber ? 'Hide number' : 'Reveal number'"
            :aria-pressed="showNumber ? 'true' : 'false'"
            role="button"
            tabindex="0"
            aria-controls="account-number"
            @click="toggleReveal"
            @keydown.enter.prevent="toggleReveal"
            @keydown.space.prevent="toggleReveal"
        >
            <div class="card-top">
                <div class="brand">
                    <img
                        class="brand-mark"
                        src="/favicon.png"
                        alt=""
                        aria-hidden="true"
                    >
                </div>
                <div
                    class="chip"
                    aria-hidden="true"
                />
            </div>

            <div
                id="account-number"
                class="card-number"
                :data-testid="showNumber ? 'card-number' : 'card-number-masked'"
            >
                <span>{{ showNumber ? formattedNumber : maskedNumber }}</span>
            </div>

            <div class="card-footer">
                <div class="card-info">
                    <div class="label">
                        MEMBERSHIP
                    </div>
                    <div class="creation-date">
                        {{ formattedCreationDate }}
                    </div>
                </div>
                <button
                    class="copy-on-card"
                    :title="copied ? 'Copied' : 'Copy to clipboard'"
                    data-testid="copy-btn"
                    @click.stop="copyToClipboard"
                >
                    <span v-if="copied">✓ Copied</span>
                    <span v-else>Copy</span>
                </button>
            </div>
        </div>

        <div
            class="reveal-hint"
            aria-live="polite"
            data-testid="reveal-hint"
        >
            {{ showNumber ? 'Tap to hide' : 'Tap to reveal' }}
        </div>

        <section
            class="privacy-blurb"
            aria-live="polite"
        >
            <details
                class="info"
            >
                <summary>We designed sign-in to be fast, private, and secure—no password required. Here’s why.</summary>
                <ul>
                    <li><strong>Less to remember:</strong> No password to forget or reset. Your account number is your key.</li>
                    <li><strong>Hard to guess:</strong> It’s a truly random 16‑digit number — that’s about 10,000,000,000,000,000 possibilities. Guessing the right one is like picking one exact grain of sand on a beach.</li>
                    <li><strong>Built‑in typo check:</strong> The last digit is a simple safety test (a “check digit”). If a number is mistyped, it usually fails this quick math check immediately.</li>
                    <li><strong>Private by default:</strong> We only keep the bare minimum to run your account. No activity logs.</li>
                    <li><strong>One‑way storage:</strong> Your number is saved as scrambled gibberish and then locked away. Even we can’t read the original.</li>
                    <li><strong>Masked in the app:</strong> You’ll only see the full number here. Elsewhere it looks like •••• •••• •••• {{ last4 || '1234' }}.</li>
                    <li><strong>Bot blockers:</strong> Too many wrong tries? We slow things down and block the attempts. Sneaky scripts don’t get far.</li>
                    <li><strong>PIN = extra deadbolt:</strong> Add a 4–8 digit PIN for sensitive actions (changing settings or spending credits). Totally optional.</li>
                    <li><strong>You’re in charge:</strong> Delete your account with one click.</li>
                </ul>
            </details>
        </section>

        <PinStatusDisplay
            :account="account"
            @setup-pin="$emit('setup-pin')"
        />

        <div class="next-actions">
            <button
                class="btn-primary next-btn"
                @click="$emit('show-leave-warning')"
            >
                <span>Continue to Download App</span>
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
                </svg>
            </button>
            <p class="next-hint">
                You can always set up PIN security later from your account page
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { isMobileDevice } from '~/utils/deviceDetection';

import PinStatusDisplay from "~/components/PinStatusDisplay.vue";

// Mobile detection based on user agent
const isMobile = computed(() => {
    if (import.meta.client) {
        return isMobileDevice();
    }
    return false;
});

const props = defineProps({
    account: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits([
    "continue",
    "skip-pin",
    "setup-pin",
    "show-leave-warning",
    "account-copied",
]);

const copied = ref(false);
const showNumber = ref(true); // reveal by default on success screen

// Raw/Formatted/Masked numbers
const rawNumber = computed(() => String((props.account && (props.account.accountId || props.account.id)) || "").replace(/\D/g, ""));
const last4 = computed(() => (rawNumber.value ? rawNumber.value.slice(-4) : ""));

const formattedNumber = computed(() => rawNumber.value.replace(/(\d{4})(?=\d)/g, "$1 ").trim());

const maskedNumber = computed(() =>
{
    const digits = rawNumber.value;
    if (!digits)
    {
        return "";
    }
    if (digits.length <= 4)
    {
        return digits;
    }
    const masked = digits.slice(0, -4).replace(/\d/g, "•") + digits.slice(-4);

    return masked.replace(/(\S{4})(?=\S)/g, "$1 ").trim();
});

// Early adopter theme detection
const isEarlyAdopter = computed(() => {
    if (!props.account?.createdAt) return true; // New accounts are early adopters during launch period
    const createdDate = new Date(props.account.createdAt);
    const earlyAdopterStart = new Date('2025-09-28');
    const earlyAdopterEnd = new Date('2025-10-28');
    return createdDate >= earlyAdopterStart && createdDate <= earlyAdopterEnd;
});

// Format creation date for card display
const formattedCreationDate = computed(() => {
    if (!props.account?.createdAt) {
        // For new accounts, use current date
        const date = new Date();
        return date.toLocaleDateString('en-US', { 
            month: '2-digit', 
            year: '2-digit' 
        });
    }
    const date = new Date(props.account.createdAt);
    return date.toLocaleDateString('en-US', { 
        month: '2-digit', 
        year: '2-digit' 
    });
});

const toggleReveal = () =>
{
    showNumber.value = !showNumber.value;
};

const fallbackCopy = (text) =>
{
    try
    {
        const el = document.createElement("textarea");
        el.value = text;
        el.setAttribute("readonly", "");
        el.style.position = "absolute";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);

        return true;
    }
    catch (_)
    {
        return false;
    }
};

const copyToClipboard = async () =>
{
    const text = rawNumber.value;
    try
    {
        if (navigator.clipboard?.writeText)
        {
            await navigator.clipboard.writeText(text);
            copied.value = true;
        }
        else if (fallbackCopy(text))
        {
            copied.value = true;
        }
    }
    catch (_)
    {
        if (fallbackCopy(text))
        {
            copied.value = true;
        }
    }
    finally
    {
        if (copied.value)
        {
            emit("account-copied");
            setTimeout(() => (copied.value = false), 2000);
        }
    }
};

const skipPinAndContinue = () =>
{
    emit("skip-pin");
    emit("continue");
};
</script>

<style scoped>
.account-generated { text-align: center; max-width: 560px; margin: 0 auto; }
.account-generated.mobile-generated { max-width: 100%; }
.success-icon { margin-bottom: .75rem; color: #10b981; }
.mobile-generated .success-icon svg { width: 48px; height: 48px; }
.account-generated h2 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.75rem; color: #1a202c; }
.mobile-generated h2 { font-size: 1.5rem; margin-bottom: 0.5rem; }
.lead { color: #475569; margin-bottom: 1.25rem; font-size: 1rem; line-height: 1.5; }
.mobile-generated .lead { font-size: 0.9375rem; margin-bottom: 1rem; }

/* Credit-card style */
.membership-card {
  position: relative;
  border-radius: 18px;
  padding: 22px;
  color: #fff;
  background: radial-gradient(1200px 500px at 80% -20%, rgba(255,255,255,.15), transparent),
  linear-gradient(135deg, #1f2937, #111827);
  box-shadow: 0 20px 40px rgba(0,0,0,.3);
  text-align: left;
  user-select: none;
  margin: 10px auto 24px;
  width: 100%;
  min-height: 180px;
  overflow: hidden;
  outline: none;
}

.mobile-generated .membership-card {
  border-radius: 16px;
  padding: 18px;
  min-height: 160px;
  margin: 8px auto 18px;
  box-shadow: 0 12px 28px rgba(102,126,234,.25);
}
.membership-card:focus-visible { box-shadow: 0 0 0 4px rgba(0,0,0,.3), 0 20px 40px rgba(0,0,0,.2); }
.membership-card::after{ /* subtle hologram sheen */
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(120deg, transparent 40%, rgba(255,255,255,.12) 50%, transparent 60%);
  transform: translateX(-100%);
  transition: transform .8s ease;
}
.membership-card.revealed::after{ transform: translateX(100%); }

/* Early Adopter Theme */
.membership-card.early-adopter {
  background: radial-gradient(1200px 500px at 80% -20%, rgba(255,215,0,.35), transparent),
  linear-gradient(135deg, #ff6b35, #f7931e, #ffd700);
  box-shadow: 0 20px 40px rgba(255,183,3,.4), 0 0 20px rgba(255,215,0,.2);
}

.membership-card.early-adopter::after {
  background: linear-gradient(120deg, transparent 40%, rgba(255,255,255,.2) 50%, transparent 60%);
}
.card-top{ display:flex; align-items:center; justify-content:space-between; margin-bottom: 24px; }
.brand{ display:flex; align-items:center; gap:8px; font-weight:800; letter-spacing:.08em; text-transform:none; font-size:1.05rem; }
.early-adopter-badge{ display:inline-flex; align-items:center; margin-left:4px; filter:drop-shadow(0 1px 2px rgba(0,0,0,.3)); }
.early-adopter-badge img{ display:block; }
.brand-mark{ width:20px; height:20px; display:block; filter: drop-shadow(0 1px 1px rgba(0,0,0,.2)); }
.chip{ width: 42px; height: 30px; border-radius: 6px; background: linear-gradient(180deg, rgba(255,255,255,.9), rgba(255,255,255,.6)); box-shadow: inset 0 0 0 1px rgba(0,0,0,.08); }
.early-adopter-chip{ background: linear-gradient(180deg, rgba(255,215,0,.9), rgba(255,183,3,.7)); box-shadow: inset 0 0 0 1px rgba(0,0,0,.15); }
.card-number{ font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 1.45rem; letter-spacing: .08em; text-shadow: 0 1px 0 rgba(0,0,0,.25); }
.mobile-generated .card-number { font-size: 1.25rem; letter-spacing: .06em; }
.card-footer{ display:flex; align-items:center; gap:.75rem; justify-content:space-between; margin-top: 26px; flex-wrap: wrap; }
.card-info{ display:flex; flex-direction:column; gap:.25rem; }
.label{ opacity: .85; font-weight: 700; letter-spacing: .18em; font-size: .8rem; }
.creation-date{ opacity: .75; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .75rem; letter-spacing: .05em; }
.last4{ opacity:.85; font-size:.85rem; }
.copy-on-card{ background: rgba(255,255,255,.18); color:#fff; border: 1px solid rgba(255,255,255,.35); padding: .5rem .9rem; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all .2s ease; min-height: 40px; display: flex; align-items: center; }
.copy-on-card:hover{ background: rgba(255,255,255,.28); transform: translateY(-1px); }
.mobile-generated .copy-on-card { padding: .625rem .875rem; font-size: 0.875rem; }
.mobile-generated .copy-on-card:hover { transform: none; }
.mobile-generated .copy-on-card:active { transform: scale(0.98); background: rgba(255,255,255,.35); }

.reveal-hint{ margin-top:-6px; margin-bottom:18px; color:#64748b; font-size:.9rem; user-select:none; }
.mobile-generated .reveal-hint { font-size: 0.875rem; margin-bottom: 1rem; }

.next-steps { background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; text-align: center; margin-top: 1rem; }
.next-steps h3 { font-size: 1.1rem; font-weight: 700; color:#1a202c; margin: 0 0 .5rem 0; }
.next-steps p { color:#4a5568; margin: 0 0 1.25rem 0; font-size: .95rem; line-height: 1.4; }

/* Info / privacy blurb */
.privacy-blurb{ background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:1rem 1.25rem; text-align:left; margin:0 0 1rem; }
.mobile-generated .privacy-blurb { padding: 0.875rem 1rem; border-radius: 10px; font-size: 0.9375rem; }
.privacy-blurb summary{ cursor:pointer; font-weight:700; color:#1a202c; }
.mobile-generated .privacy-blurb summary { font-size: 0.9375rem; }
.privacy-blurb ul{ margin:.5rem 0 0; padding-left:1.1rem; color:#4a5568; }
.mobile-generated .privacy-blurb ul { font-size: 0.875rem; line-height: 1.6; }

/* Buttons */
.btn-primary { background: linear-gradient(135deg, #1f2937 0%, #111827 100%); color:#fff; border:none; border-radius: 10px; padding: .7rem 1.1rem; font-weight: 700; cursor: pointer; transition: all .2s ease; min-height: 48px; }
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(0,0,0,.2); }
.mobile-generated .btn-primary { width: 100%; padding: 1rem; border-radius: 12px; font-size: 1rem; }
.mobile-generated .btn-primary:hover { transform: none; }
.mobile-generated .btn-primary:active { transform: scale(0.98); }
.btn-skip { background: rgba(31,41,55,0.08); color:#1f2937; border: 2px solid #1f2937; border-radius: 10px; padding: .7rem 1.1rem; font-weight: 700; cursor: pointer; }

.actions { display:flex; gap: .75rem; justify-content: center; }
.btn-secondary { background: rgba(31,41,55,0.1); color:#1f2937; border: 2px solid #1f2937; border-radius: 12px; padding: 1rem 2rem; font-weight: 600; text-decoration: none; display:inline-flex; align-items:center; justify-content:center; gap: .5rem; transition: all .3s ease; cursor:pointer; font-size: 1rem; }
.btn-secondary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,.2); }

/* Next actions */
.next-actions { text-align: center; margin-top: 2rem; }
.mobile-generated .next-actions { margin-top: 1.5rem; }
.next-btn { display: inline-flex; align-items: center; justify-content: center; gap: .5rem; font-size: 1.1rem; }
.mobile-generated .next-btn { font-size: 1rem; }
.next-hint { color: #64748b; font-size: .9rem; margin-top: .75rem; }
.mobile-generated .next-hint { font-size: 0.875rem; margin-top: 0.625rem; }

</style>