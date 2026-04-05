import type { Account, SessionAccount } from "../../shared/models/Account";
import { UUID } from "./uuid";
import type { User, SecureSessionData } from "#auth-utils";
import type { H3Event } from "h3";

/**
 * Session state constants for clarity
 */
export const SessionState = {
    /** User is not authenticated */
    UNAUTHENTICATED: "unauthenticated",
    /** User is authenticated but requires PIN verification */
    PENDING_PIN: "pending_pin", 
    /** User is fully authenticated */
    AUTHENTICATED: "authenticated",
} as const;

export type SessionState = typeof SessionState[keyof typeof SessionState];

/**
 * Authentication context interface - what gets stored in event.context.auth
 */
export interface AuthContext {
    isAuthenticated: boolean;
    requiresPinVerification: boolean;
    isAdmin: boolean;
    account: Account | null;
}

/**
 * Returns the default unauthenticated auth context
 */
function getDefaultAuthContext(): AuthContext {
    return {
        isAuthenticated: false,
        requiresPinVerification: false,
        isAdmin: false,
        account: null,
    };
}

/**
 * Converts a full Account object to SessionAccount for frontend use
 */
function toSessionAccount(account: Account): SessionAccount {
    const sessionAccount: SessionAccount = {
        credits: account.credits,
        refundCount: account.refundCount,
        pinEnabled: account.pinEnabled,
        creditsApplied: account.creditsApplied,
        createdAt: account.createdAt,
        lastAccessed: account.lastAccessed,
    };

    // Only include isAdmin if true
    if (account.isAdmin) {
        sessionAccount.isAdmin = true;
    }

    return sessionAccount;
}

/**
 * MIDDLEWARE-ONLY: Loads authentication context from session cookie
 * This should ONLY be called from auth middleware to populate event.context.auth
 */
export async function loadAuthContext(event: H3Event): Promise<void> {
    // Initialize with default context
    event.context.auth = getDefaultAuthContext();

    try {
        const session = await getUserSession(event);
        
        // Check if we have session data
        if (!session?.user?.account || !session?.secure?.queryId) {
            return;
        }

        // Map SessionState to authentication flags
        event.context.auth.isAuthenticated = session.user.isAuthenticated || false;
        event.context.auth.requiresPinVerification = session.user.challengeRequired || false;
        event.context.auth.isAdmin = session.secure.isAdmin || false;
        
        // Reconstruct minimal Account object from session data
        event.context.auth.account = {
            queryId: UUID.parse(session.secure.queryId),
            accountHash: new Uint8Array(session.secure.accountHash),
            hashVersion: 1, // Not needed in session
            isAdmin: session.secure.isAdmin,
            credits: session.user.account.credits,
            refundCount: session.user.account.refundCount,
            pinEnabled: session.user.account.pinEnabled,
            referrer: session.secure.referrer ? UUID.parse(session.secure.referrer) : null,
            creditsApplied: session.user.account.creditsApplied,
            promoCreditsApplied: null, // Not needed in session
            createdAt: session.user.account.createdAt,
            lastAccessed: session.user.account.lastAccessed,
        };
    } catch (error) {

        console.log(error);
        // On any error, clear session and reset to default context
        // await clearUserSession(event).catch(noop);
        // event.context.auth = getDefaultAuthContext();
    }
}

/**
 * READ-ONLY: Returns authentication information from event.context.auth
 * Does NOT modify session or context - just returns current state
 */
export function requireUser(event: any): AuthContext {
    if (!event.context?.auth) {
        throw new Error("Auth context not initialized. Ensure auth middleware has run.");
    }
    
    return {
        isAuthenticated: event.context.auth.isAuthenticated,
        requiresPinVerification: event.context.auth.requiresPinVerification,
        isAdmin: event.context.auth.isAdmin,
        account: event.context.auth.account,
    };
}

/**
 * WRITE: Sets user session and synchronizes event.context.auth
 * Updates both nuxt-auth-utils session and event.context.auth in sync
 */
export async function setUser(event: any, account: Account, state: SessionState, accountId?: string): Promise<void> {
    if (!event.context?.auth) {
        throw new Error("Auth context not initialized. Ensure auth middleware has run.");
    }

    const sessionAccount = toSessionAccount(account);

    // Add the account ID to the session account if provided
    if (accountId) {
        sessionAccount.id = accountId;
    }

    // Build user session data
    const user: User = {
        isAuthenticated: state !== SessionState.UNAUTHENTICATED,
        challengeRequired: state === SessionState.PENDING_PIN,
        pinVerified: state === SessionState.AUTHENTICATED,
        account: sessionAccount,
    };

    const secure: SecureSessionData = {
        queryId: account.queryId.toString(), // Serialize UUID to array for session storage
        accountHash: Array.from(account.accountHash),
        isAdmin: account.isAdmin,
        referrer: account.referrer ? account.referrer.toString() : null,
    };

    // Update nuxt-auth-utils session
    await setUserSession(event, { user, secure });

    // Update event.context.auth in sync using consistent SessionState mapping
    // isAuthenticated: true when login succeeded (PENDING_PIN or AUTHENTICATED)
    event.context.auth.isAuthenticated = state !== SessionState.UNAUTHENTICATED;
    // requiresPinVerification: true only when user has PIN enabled and hasn't verified yet
    event.context.auth.requiresPinVerification = state === SessionState.PENDING_PIN;
    event.context.auth.isAdmin = secure.isAdmin;
    event.context.auth.account = account; // Keep the full account object with UUID instances
}

/**
 * CONDITIONAL WRITE: Updates user session only if changes exist
 * Compares with current context and only updates if there are actual changes
 */
export async function updateUser(event: any, accountPartial: Partial<Account>, state?: SessionState, accountId?: string): Promise<boolean> {
    const currentAuth = requireUser(event);
    
    if (!currentAuth.account) {
        throw new Error("Cannot update user: no current account in context");
    }

    // Build the updated account by merging changes
    const updatedAccount: Account = {
        ...currentAuth.account,
        ...accountPartial,
    };

    // Determine current state if not provided
    const currentState = currentAuth.requiresPinVerification ? SessionState.PENDING_PIN : 
                        currentAuth.isAuthenticated ? SessionState.AUTHENTICATED : 
                        SessionState.UNAUTHENTICATED;
    const targetState = state ?? currentState;

    // Check if there are actual changes
    const hasAccountChanges = Object.keys(accountPartial).some(key => {
        const current = currentAuth.account![key as keyof Account];
        const updated = accountPartial[key as keyof Account];
        
        // Handle UUID comparison
        if (current instanceof UUID && updated instanceof UUID) {
            return !current.equals(updated);
        }
        
        // Handle Uint8Array/Buffer comparison
        if (current instanceof Uint8Array && updated instanceof Uint8Array) {
            return !current.every((val, i) => val === updated[i]);
        }
        
        return current !== updated;
    });

    const hasStateChange = targetState !== currentState;

    // Only update if there are actual changes
    if (hasAccountChanges || hasStateChange) {
        await setUser(event, updatedAccount, targetState, accountId);
        return true;
    }

    return false;
}

/**
 * WRITE: Clears user session and resets event.context.auth to default
 * Removes both nuxt-auth-utils session and resets context to unauthenticated state
 */
export async function deleteUser(event: any): Promise<void> {
    if (!event.context?.auth) {
        throw new Error("Auth context not initialized. Ensure auth middleware has run.");
    }

    // Clear nuxt-auth-utils session
    await clearUserSession(event);
    // Reset event.context.auth to default unauthenticated state
    event.context.auth = getDefaultAuthContext();
}