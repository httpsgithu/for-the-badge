import type { PendingBadgeData, GetPendingBadgesResponse } from "~/server/api/admin/badges/pending.get";
import type { ApproveBadgeRequest, ApproveBadgeResponse } from "~/server/api/admin/badges/approve.post";
import type { DenyBadgeRequest, DenyBadgeResponse } from "~/server/api/admin/badges/deny.post";

export const useAdminBadgeService = () =>
{
    const { $csrfFetch } = useNuxtApp();

    const getPendingBadges = async () : Promise<PendingBadgeData[]> =>
    {
        try
        {
            const data = await $fetch<GetPendingBadgesResponse>("/api/admin/badges/pending");
            return data.badges;
        }
        catch (error)
        {
            console.error("Failed to fetch pending badges:", error);
            throw new Error("Failed to fetch pending badges");
        }
    };

    const approveBadge = async (request : ApproveBadgeRequest) : Promise<ApproveBadgeResponse> =>
    {
        try
        {
            const data = await $csrfFetch<ApproveBadgeResponse>("/api/admin/badges/approve", {
                method: "POST",
                body: request,
            });

            return data;
        }
        catch (error)
        {
            console.error("Failed to approve badge:", error);
            throw new Error("Failed to approve badge");
        }
    };

    const denyBadge = async (request : DenyBadgeRequest) : Promise<DenyBadgeResponse> =>
    {
        try
        {
            const data = await $csrfFetch<DenyBadgeResponse>("/api/admin/badges/deny", {
                method: "POST",
                body: request,
            });

            return data;
        }
        catch (error)
        {
            console.error("Failed to deny badge:", error);
            throw new Error("Failed to deny badge");
        }
    };

    return {
        getPendingBadges,
        approveBadge,
        denyBadge,
    };
};
