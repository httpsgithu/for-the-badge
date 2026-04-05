/**
 * CENTRALIZED PRICING CONFIGURATION
 *
 * This file is the SINGLE SOURCE OF TRUTH for all pricing in the application.
 *
 * Two independent systems:
 * 1. CREDIT PACKS: Users buy credits to add to their account balance
 * 2. PAGE-BASED PRICING: Credits are deducted based on document page count
 *
 * These systems are intentionally separate - packs determine purchase options,
 * while page tiers determine analysis costs.
 */

// ============================================================================
// CREDIT PURCHASE PACKS
// ============================================================================
// Define what users can buy to add credits to their account
// Prices are in USD dollars
// Credits added equal the "credits" field value

export interface CreditPack {
    id: string;
    name: string;
    price: number; // USD dollars (e.g., 0.99, 4.99)
    credits: number; // Credits added to account
    description: string;
    icon: string;
    popular?: boolean;
}

export const CREDIT_PACKS: CreditPack[] = [
    {
        id: "single",
        name: "One Time Pack",
        price: 0.99,
        credits: 1,
        description: "Try one document analysis",
        icon: "number-one",
    },
    {
        id: "starter",
        name: "Starter Pack",
        price: 4.99,
        credits: 5,
        description: "Great for getting started",
        icon: "rocket",
    },
    {
        id: "popular",
        name: "Popular Pack",
        price: 9.99,
        credits: 10,
        description: "Most popular choice",
        icon: "target",
        popular: true,
    },
    {
        id: "power",
        name: "Power User",
        price: 19.99,
        credits: 25,
        description: "For the document-heavy folks",
        icon: "lightning",
    },
    {
        id: "enterprise",
        name: "Enterprise",
        price: 39.99,
        credits: 50,
        description: "When you analyze a lot",
        icon: "building",
    },
];

// ============================================================================
// PAGE-BASED PRICING TIERS
// ============================================================================
// Define how much credits are deducted based on document page count
// Prices are in USD dollars

export interface PricingTier {
    min: number;
    max: number;
    price: number; // USD dollars deducted from account
    name: string;
}

export const PRICING_TIERS: PricingTier[] = [
    { min: 1, max: 25, price: 1, name: "Light" },
    { min: 26, max: 50, price: 2, name: "Standard" },
    { min: 51, max: Infinity, price: 3, name: "Heavy" },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get credit pack by ID
 */
export function getCreditPack(id: string): CreditPack | undefined {
    return CREDIT_PACKS.find(pack => pack.id === id);
}

/**
 * Get credit pack price in cents (for Stripe)
 */
export function getCreditPackPriceInCents(id: string): number {
    const pack = getCreditPack(id);
    if (!pack) {
        throw new Error(`Invalid credit pack ID: ${id}`);
    }
    return Math.round(pack.price * 100);
}

/**
 * Calculate price from page count
 */
export function calculatePriceFromPageCount(pageCount: number): { price: number; tier: string } {
    const tier = PRICING_TIERS.find((t) => pageCount >= t.min && pageCount <= t.max);

    if (!tier) {
        // Fallback to highest tier
        const highestTier = PRICING_TIERS[PRICING_TIERS.length - 1];
        return {
            price: highestTier.price,
            tier: highestTier.name,
        };
    }

    return {
        price: tier.price,
        tier: tier.name,
    };
}

/**
 * Get pricing tier info including page range
 */
export function getPricingTierInfo(pageCount: number): {
    tier: string; price: number; pageRange: string;
} {
    const pricing = calculatePriceFromPageCount(pageCount);
    const tier = PRICING_TIERS.find((t) => pageCount >= t.min && pageCount <= t.max);

    let pageRange = "";
    if (tier) {
        if (tier.max === Infinity) {
            pageRange = `${tier.min}+ pages`;
        }
        else {
            pageRange = `${tier.min}-${tier.max} pages`;
        }
    }

    return {
        tier: pricing.tier,
        price: pricing.price,
        pageRange,
    };
}

/**
 * Get page-based pricing in cents (for Stripe)
 */
export function getPageBasedPriceInCents(pageCount: number): number {
    const { price } = calculatePriceFromPageCount(pageCount);
    return Math.round(price * 100);
}

// ============================================================================
// LEGACY EXPORTS (for backward compatibility - can be removed later)
// ============================================================================

export const CREDIT_PACKAGES = CREDIT_PACKS.map(pack => ({
    id: pack.id,
    name: pack.name,
    price: Math.round(pack.price * 100), // Convert to cents for legacy code
    pages: pack.credits,
}));