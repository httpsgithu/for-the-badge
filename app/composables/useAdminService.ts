import type { AdminAccountsQuery,
    AdminAccountsResponse } from "~/types/api";
import type { PagedResponse } from "~/shared/types/Paging/Page";

export const useAdminService = () =>
{
    const { $csrfFetch } = useNuxtApp();

    const getAccounts = async (query ?: AdminAccountsQuery) : Promise<AdminAccountsResponse> =>
    {
        const headers = import.meta.server ? useRequestHeaders(["cookie"]) : undefined;

        try
        {
            const data = await $fetch<AdminAccountsResponse>("/api/admin/accounts", {
                query,
                headers,
                credentials: "include",
            });

            return data;
        }
        catch (error)
        {
            // Preserve the original error (status, payload) for callers.
            throw error;
        }
    };

    interface FeedbackItem {
        id: string;
        message: string;
        createdAt: Date;
    }

    const getFeedback = async (query ?: { cursor ?: string; perPage ?: number }) : Promise<PagedResponse<FeedbackItem>> =>
    {
        try
        {
            const data = await $fetch<PagedResponse<FeedbackItem>>("/api/admin/feedback", {
                query,
                headers: useRequestHeaders(["cookie"]),
            });

            return data;
        }
        catch (error)
        {
            throw new Error("Failed to fetch feedback");
        }
    };

    const deleteFeedback = async (feedbackId : string) : Promise<any> =>
    {
        try
        {
            const response = await $csrfFetch<any>(`/api/admin/feedback/${feedbackId}`, {
                method: "DELETE",
            });

            return response;
        }
        catch (error)
        {
            throw new Error("Failed to delete feedback");
        }
    };

    return {
        getAccounts,
        getFeedback,
        deleteFeedback,
    };
};