/**
 * Open Collective API integration for fetching contributors
 * API Documentation: https://docs.opencollective.com/help/developers/api
 */

export interface OpenCollectiveMember {
    name: string;
    slug: string;
    type: string;
    role: string;
    isActive: boolean;
    totalAmountDonated: number;
    currency: string;
    since: string;
    image: string | null;
    description: string | null;
    publicMessage: string | null;
    tier: {
        name: string;
        slug: string;
    } | null;
}

export interface DonorDisplayInfo {
    name: string;
    slug: string;
    tier: 'supporter' | 'patron' | 'donor';
    totalAmount: number;
    since: Date;
    image: string | null;
    message: string | null;
}

const OPEN_COLLECTIVE_API = 'https://opencollective.com';
const COLLECTIVE_SLUG = 'forthebadge';

/**
 * Fetch all members (contributors) from Open Collective
 */
export async function fetchOpenCollectiveMembers(): Promise<OpenCollectiveMember[]> {
    try {
        const response = await fetch(
            `${OPEN_COLLECTIVE_API}/${COLLECTIVE_SLUG}/members/all.json`,
            {
                headers: {
                    'User-Agent': 'For-The-Badge/1.0',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Open Collective API error: ${response.status}`);
        }

        const members: OpenCollectiveMember[] = await response.json();
        return members;
    } catch (error) {
        console.error('Failed to fetch Open Collective members:', error);
        return [];
    }
}

/**
 * Map Open Collective tier to our internal tier system
 */
function mapTierToDonorType(tierName: string | null, totalAmount: number): 'supporter' | 'patron' | 'donor' {
    if (!tierName) {
        // For custom/one-time donations, map by amount
        if (totalAmount >= 25) return 'patron';
        if (totalAmount >= 10) return 'supporter';
        return 'donor';
    }

    const lowerTier = tierName.toLowerCase();
    
    if (lowerTier.includes('patron') || lowerTier.includes('sponsor')) {
        return 'patron';
    }
    
    if (lowerTier.includes('supporter')) {
        return 'supporter';
    }

    // Default mapping based on amount
    if (totalAmount >= 25) return 'patron';
    if (totalAmount >= 10) return 'supporter';
    return 'donor';
}

/**
 * Get formatted list of donors for display on the donors wall
 */
export async function getDonorsForWall(): Promise<DonorDisplayInfo[]> {
    const members = await fetchOpenCollectiveMembers();

    // Filter for active financial contributors
    const donors = members
        .filter(member => 
            member.role === 'BACKER' && 
            member.isActive && 
            member.totalAmountDonated > 0
        )
        .map(member => ({
            name: member.name,
            slug: member.slug,
            tier: mapTierToDonorType(member.tier?.name || null, member.totalAmountDonated),
            totalAmount: member.totalAmountDonated,
            since: new Date(member.since),
            image: member.image,
            message: member.publicMessage,
        }))
        .sort((a, b) => {
            // Sort by tier first (patron > supporter > donor)
            const tierOrder = { patron: 3, supporter: 2, donor: 1 };
            if (tierOrder[a.tier] !== tierOrder[b.tier]) {
                return tierOrder[b.tier] - tierOrder[a.tier];
            }
            // Then by total amount
            return b.totalAmount - a.totalAmount;
        });

    return donors;
}

/**
 * Get total number of contributors
 */
export async function getTotalDonorCount(): Promise<number> {
    const members = await fetchOpenCollectiveMembers();
    return members.filter(member => 
        member.role === 'BACKER' && 
        member.isActive && 
        member.totalAmountDonated > 0
    ).length;
}

/**
 * Get total amount raised
 */
export async function getTotalAmountRaised(): Promise<{ amount: number; currency: string }> {
    const members = await fetchOpenCollectiveMembers();
    const total = members
        .filter(member => member.role === 'BACKER')
        .reduce((sum, member) => sum + member.totalAmountDonated, 0);
    
    const currency = members.find(m => m.currency)?.currency || 'USD';
    
    return { amount: total / 100, currency }; // Convert cents to dollars
}
