import type { PinChallengeRequest,
    PinVerifyRequest,
    PinVerifyResponse,
    PinCreateRequest,
    PinCreateResponse,
    PinUpdateRequest,
    PinUpdateResponse,
    PinDeleteRequest,
    PinDeleteResponse } from "~/types/api";

/**
 * PIN Service - Handles all PIN-related operations
 *
 * SECURITY REQUIREMENT: Any non-200 response from PIN operations means the PIN is invalid
 * and the user should be blocked from proceeding. This applies to:
 * - Login challenges (challengePin)
 * - PIN changes (updatePin) - current PIN verification
 * - PIN deletion (deletePin) - current PIN verification
 * - PIN creation (createPin) - authentication validation
 * - PIN verification (verifyPin) - direct PIN validation
 */
export const usePinService = () =>
{
    const { $csrfFetch } = useNuxtApp();

    const challengePin = async (request : PinChallengeRequest) : Promise<void> =>
    {
        try
        {
            await $csrfFetch("/api/account/login/challenge", {
                method: "POST",
                body: request,
            });
        }
        catch (error)
        {
            // Preserve error details for proper error handling while maintaining security
            throw error;
        }
    };

    const verifyPin = async (accountId : string, request : PinVerifyRequest) : Promise<PinVerifyResponse> =>
    {
        try
        {
            const response = await $csrfFetch<PinVerifyResponse>(`/api/account/${accountId}/pin`, {
                method: "POST",
                body: request,
            });

            return response;
        }
        catch (error)
        {
            // Any non-200 response means the PIN is invalid - block the operation
            throw new Error("PIN verification failed");
        }
    };

    const createPin = async (accountId : string, request : PinCreateRequest) : Promise<PinCreateResponse> =>
    {
        try
        {
            const response = await $csrfFetch<PinCreateResponse>(`/api/account/${accountId}/pin`, {
                method: "PUT",
                body: request,
            });

            return response;
        }
        catch (error)
        {
            // Any non-200 response means there was an error - block the operation
            throw new Error("Failed to create PIN");
        }
    };

    const updatePin = async (
        accountId: string,
        request: PinUpdateRequest
    ): Promise<PinUpdateResponse> => {
        const response = await $csrfFetch<PinUpdateResponse>(
            `/api/account/${accountId}/pin`,
            {
                method: "PATCH",
                body: request,
            }
        );

        return response;
    };


    const deletePin = async (
        accountId: string,
        request: PinDeleteRequest
    ): Promise<PinDeleteResponse> => {
        const response = await $csrfFetch<PinDeleteResponse>(
            `/api/account/${accountId}/pin/remove`,
            {
                method: "POST",
                body: request,
            }
        );

        return response;
    };


    return {
        challengePin,
        verifyPin,
        createPin,
        updatePin,
        deletePin,
    };
};