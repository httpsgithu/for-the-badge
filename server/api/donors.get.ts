import { getDonorsForWall, getTotalDonorCount, getTotalAmountRaised } from '../utils/openCollective';

export default defineEventHandler(async (event) => {
    try {
        // Fetch all donor data in parallel
        const [donors, totalCount, totalRaised] = await Promise.all([
            getDonorsForWall(),
            getTotalDonorCount(),
            getTotalAmountRaised(),
        ]);

        return {
            donors,
            stats: {
                totalDonors: totalCount,
                totalRaised: totalRaised.amount,
                currency: totalRaised.currency,
            },
        };
    } catch (error) {
        console.error('Error fetching donors:', error);
        throw createError({
            statusCode: 500,
            message: 'Failed to fetch donors',
        });
    }
});
