import { computed } from "vue";

/**
 * Authentication helper composable that provides consistent access to session state
 * and authentication status checks. This replaces manual session state management
 * and provides a clean API for components to use.
 */
export const useAuth = () =>
{
    const { loggedIn, user, session, fetch: refreshSession, clear: clearSession } = useUserSession();
    const { $csrfFetch } = useNuxtApp();

    /**
     * Check if user is fully authenticated (not just partially authenticated)
     * This includes checking for PIN verification if required
     */
    const isAuthenticated = computed(() =>
    {
        if (!loggedIn.value || !session.value?.user?.account)
        {
            return false;
        }

        // If PIN is required, user must have verified it
        if (session.value.user.challengeRequired && !session.value.user.pinVerified)
        {
            return false;
        }

        return session.value.user.isAuthenticated;
    });

    /**
     * Check if user is in partial authentication state (logged in but needs PIN)
     */
    const requiresPin = computed(() =>
    {
        return !!(session.value?.user?.challengeRequired && !session.value?.user?.pinVerified);
    });

    /**
     * Check if user is admin
     */
    const isAdmin = computed(() =>
    {
        return session.value?.user?.account?.isAdmin || false;
    });

    /**
     * Get current account data from session
     */
    const account = computed(() =>
    {
        return session.value?.user?.account || null;
    });

    /**
     * Get current account ID
     */
    const accountId = computed(() =>
    {
        return session.value?.user?.account?.id || null;
    });

    /**
     * Get current account credits
     */
    const credits = computed(() =>
    {
        return session.value?.user?.account?.credits || 0;
    });

    /**
     * Get formatted account number (with spaces)
     */
    const formattedAccountId = computed(() =>
    {
        return accountId.value ? accountId.value.replace(/(\d{4})(?=\d)/g, "$1 ") : "";
    });

    /**
     * Check if session is ready (not loading)
     */
    const isReady = computed(() =>
    {
        // nuxt-auth-utils provides a ready state
        return session.value !== undefined;
    });

    /**
     * Comprehensive logout that clears both server and client session state
     */
    const logout = async () =>
    {
        try
        {
            // First, call the backend logout endpoint to clear server-side session
            try
            {
                await $csrfFetch("/api/account/logout", {
                    method: "POST",
                    // Don't throw on error - we still want to clear local state
                });
            }
            catch (serverError)
            {
                // Server session clearing failed, continue with local cleanup
            }

            // Clear any stored analysis data from session storage
            if (import.meta.client)
            {
                const { clearAnalysis } = useAnalysisStorage();
                clearAnalysis();
            }

            // Clear client-side session using nuxt-auth-utils
            await clearSession();
            // Navigate to home page
            await navigateTo("/");
        }
        catch (error)
        {
            // Even if logout fails, still clear local state and redirect
            try
            {
                // Clear analysis storage even on error
                if (import.meta.client)
                {
                    const { clearAnalysis } = useAnalysisStorage();
                    clearAnalysis();
                }
                await clearSession();
            }
            catch (clearError)
            {
                // Failed to clear local session
            }
            await navigateTo("/");
        }
    };

    /**
     * Refresh session data from server
     */
    const refresh = async () =>
    {
        try
        {
            // Use $csrfFetch for POST request
            await $csrfFetch("/api/account/refresh", {
                method: "POST",
            });
            
            // Refresh the client session after server refresh
            await refreshSession();
        }
        catch (error)
        {
            // Session refresh error
        }
    };

    /**
     * Clear only the client-side session (without calling backend logout)
     * Used when backend has already cleared the session (e.g., failed PIN challenge)
     */
    const clearClientSession = async () =>
    {
        try
        {
            await clearSession();
        }
        catch (error)
        {
            // Failed to clear client session
        }
    };

    /**
     * Update credits in the current session without making an API call
     * Used when we get updated credits from other API responses (e.g., analyze, refund)
     */
    const updateCredits = (newCredits: number) =>
    {
        if (session.value?.user?.account) {
            // Directly update the reactive session object
            session.value.user.account.credits = newCredits;
        }
    };

    return {
        // Session state
        loggedIn,
        user,
        session,
        isReady,

        // Computed authentication state
        isAuthenticated,
        requiresPin,
        isAdmin,

        // Account data
        account,
        accountId,
        credits,
        formattedAccountId,

        // Actions
        logout,
        refresh,
        clearClientSession,
        updateCredits,
    };
};