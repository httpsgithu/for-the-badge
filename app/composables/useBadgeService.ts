import type { SaveBadgeRequest, SaveBadgeResponse } from "~/server/api/badges.post";
import type { SubmitBadgeRequest, SubmitBadgeResponse } from "~/server/api/badges/submit.post";
import type { CommunityBadgeData, GetCommunityBadgesResponse } from "~/server/api/badges/community.get";

export type SubmissionStatus = "pending" | "approved" | "denied";

interface BadgeData {
    id: string;
    name: string;
    description?: string;
    submissionStatus?: SubmissionStatus;
    submissionId?: string;
    [key: string]: any;
}

interface GetBadgesResponse {
    badges: BadgeData[];
}

export const useBadgeService = () =>
{
    const { $csrfFetch } = useNuxtApp();

    const getBadges = async () : Promise<BadgeData[]> =>
    {
        try
        {
            const data = await $fetch<GetBadgesResponse>("/api/badges");
            return data.badges;
        }
        catch (error)
        {
            console.error("Failed to fetch badges:", error);
            throw new Error("Failed to fetch badges");
        }
    };

    const saveBadge = async (request : SaveBadgeRequest) : Promise<SaveBadgeResponse> =>
    {
        try
        {
            const data = await $csrfFetch<SaveBadgeResponse>("/api/badges", {
                method: "POST",
                body: request,
            });

            return data;
        }
        catch (error)
        {
            console.error("Failed to save badge:", error);
            throw new Error("Failed to save badge");
        }
    };

    const deleteBadge = async (badgeId : string) : Promise<void> =>
    {
        try
        {
            await $csrfFetch(`/api/badges/${badgeId}`, {
                method: "DELETE",
            });
        }
        catch (error)
        {
            console.error("Failed to delete badge:", error);
            throw new Error("Failed to delete badge");
        }
    };

    const submitBadge = async (request : SubmitBadgeRequest) : Promise<SubmitBadgeResponse> =>
    {
        try
        {
            const data = await $csrfFetch<SubmitBadgeResponse>("/api/badges/submit", {
                method: "POST",
                body: request,
            });

            return data;
        }
        catch (error)
        {
            console.error("Failed to submit badge:", error);
            throw new Error("Failed to submit badge for approval");
        }
    };

    const getCommunityBadges = async () : Promise<CommunityBadgeData[]> =>
    {
        try
        {
            const data = await $fetch<GetCommunityBadgesResponse>("/api/badges/community");
            return data.badges;
        }
        catch (error)
        {
            console.error("Failed to fetch community badges:", error);
            throw new Error("Failed to fetch community badges");
        }
    };

    return {
        getBadges,
        saveBadge,
        deleteBadge,
        submitBadge,
        getCommunityBadges,
    };
};
