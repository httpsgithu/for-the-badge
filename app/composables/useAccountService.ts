import type { Account,
    GenerateAccountResponse,
    LoginRequest,
    LoginResponse,
    DeleteAccountRequest,
    ApiError } from "~/types/api";

export const useAccountService = () =>
{
    const { $csrfFetch } = useNuxtApp();
    
    const generateAccount = async (url ?: string) : Promise<GenerateAccountResponse> =>
    {
        try
        {
            const endpoint = url || "/api/account/generate";
            const data = await $csrfFetch<GenerateAccountResponse>(endpoint, {
                method: "POST",
            });

            return data;
        }
        catch (error)
        {
            throw new Error("Failed to generate account");
        }
    };

    const login = async (request : LoginRequest) : Promise<LoginResponse> =>
    {
        try
        {
            const data = await $csrfFetch<LoginResponse>("/api/account/login", {
                method: "POST",
                body: request,
            });

            return data;
        }
        catch (error)
        {
            throw new Error("Login failed");
        }
    };

    const logout = async () : Promise<void> =>
    {
        try
        {
            await $csrfFetch("/api/account/logout", {
                method: "POST",
            });
        }
        catch (error)
        {
            throw new Error("Logout failed");
        }
    };

    const getAccount = async (accountId : string) : Promise<Account> =>
    {
        try
        {
            const data = await $fetch<Account>(`/api/account/${accountId}`);

            return data;
        }
        catch (error)
        {
            throw new Error("Failed to fetch account data");
        }
    };

    const deleteAccount = async (accountId : string, confirmAccountNumber : string, pin ?: string) : Promise<void> =>
    {
        try
        {
            const request : DeleteAccountRequest = {
                confirmAccountNumber,
                ...(pin && { pin }),
            };

            await $csrfFetch(`/api/account/${accountId}/delete`, {
                method: "POST",
                body: request,
            });
        }
        catch (error)
        {
            throw new Error("Failed to delete account");
        }
    };

    return {
        generateAccount,
        login,
        logout,
        getAccount,
        deleteAccount,
    };
};