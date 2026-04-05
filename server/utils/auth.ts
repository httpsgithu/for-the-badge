import { createProblem } from "./problem";
import type { Account } from "../../shared/models/Account";
import type { H3Event } from 'h3';

/**
 * Requires full authentication (user logged in and no PIN verification needed)
 * Throws a 401 error if authentication requirements are not met
 */
export function requireAuth(event : H3Event)
{
    const auth = event.context.auth;

    if (!auth.isAuthenticated || !auth.account)
    {
        throw createProblem(event, 401, "Authentication required", "User must be logged in to access this resource", null, {
            authState: "unauthenticated",
            required: "full_authentication"
        });
    }

    if (auth.requiresPinVerification)
    {
        throw createProblem(event, 401, "PIN verification required", "Account has PIN protection enabled and verification is pending", null, {
            authState: "pending_pin_verification",
            required: "pin_verification",
            challengeUrl: "/api/account/login/challenge"
        });
    }
    
    return {
        isAuthenticated: auth.isAuthenticated,
        isVerified: !auth.requiresPinVerification,
        isAdmin: auth.isAdmin,
        queryId: auth.account?.queryId,
        account: auth.account!,
    };
}

/**
 * Requires partial authentication (user logged in, but PIN verification may be pending)
 * This is useful for PIN-related endpoints that should work even when PIN verification is required
 * Throws a 401 error if user is not authenticated at all
 */
export function requirePartialAuth(event : any)
{
    const auth = event.context.auth;

    if (!auth.isAuthenticated)
    {
        throw createProblem(event, 401, "Authentication required", "User must be logged in to access this resource", null, {
            authState: "unauthenticated",
            required: "partial_authentication"
        });
    }

    return {
        isAuthenticated: auth.isAuthenticated,
        isVerified: !auth.requiresPinVerification,
        isAdmin: auth.isAdmin,
        queryId: auth.account?.queryId,
        account: auth.account,
    };
}

/**
 * Returns authentication information without throwing errors
 * Useful for endpoints that may work with or without authentication
 */
export function getAuthInfo(event : any)
{
    const auth = event.context.auth;

    return {
        isAuthenticated: auth.isAuthenticated,
        isVerified: !auth.requiresPinVerification,
        isAdmin: auth.isAdmin,
        queryId: auth.account?.queryId,
        account: auth.account,
    };
}

/**
 * Checks if the current user is authenticated
 */
export function isAuthenticated(event : any) : boolean
{
    return event.context.auth?.isAuthenticated || false;
}

/**
 * Checks if PIN verification is required for the current user
 */
export function isPinVerificationRequired(event : any) : boolean
{
    return event.context.auth?.requiresPinVerification || false;
}

/**
 * Requires admin authentication (user logged in, no PIN verification needed, and is admin)
 * Throws a 401 error if authentication requirements are not met or user is not admin
 */
export function requireAdmin(event : any)
{
    const auth = requireAuth(event); // This handles basic auth requirements

    if (!auth.isAdmin)
    {
        throw createProblem(event, 403, "Forbidden", "Administrator privileges required");
    }

    return auth;
}