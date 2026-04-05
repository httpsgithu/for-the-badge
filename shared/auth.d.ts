// Auth types extension for nuxt-auth-utils
// This file extends the User interface from nuxt-auth-utils with custom properties
import type { AuthContext } from "~~/server/utils/composables";
import type { Account, SessionAccount } from "./models/Account";

declare module "#auth-utils"
{
    interface UserSession
    {
        user: User;
        secure: SecureSessionData;
    }

    interface User
    {
        isAuthenticated: boolean;
        challengeRequired ?: boolean;
        pinVerified ?: boolean;
        account ?: SessionAccount;
    }

    interface SecureSessionData
    {
        queryId: Uint8Array | Buffer;
        accountHash: Uint8Array | Buffer | number[];
        isAdmin: boolean;
        referrer?: Uint8Array | Buffer | null;
    }
}

declare module "h3" {
    interface H3EventContext {
        auth: AuthContext;
    }
}

export {};