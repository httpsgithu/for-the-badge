export interface ReferralUrlResponse {
    url: string | null;
    reason?: string;
}

export const useReferralService = () => {
    const { $csrfFetch } = useNuxtApp();

    const getReferralUrl = async (accountId: string): Promise<ReferralUrlResponse> => {
        try {
            const data = await $csrfFetch<ReferralUrlResponse>(`/api/account/${accountId}/referral`, {
                method: "GET",
            });
            
            return data;
        } catch (error) {
            throw new Error("Failed to fetch referral URL");
        }
    };
    
    return {
        getReferralUrl,
    };
};
