import type { Account } from "../../../shared/models/Account";
import { findAccountByUserId, updateAccount } from "../../utils/database";
import { isValidLuhn } from "../../utils/luhn";
import { createProblem } from "../../utils/problem";
import { setUser, SessionState, deleteUser } from "../../utils/composables";

export default defineEventHandler(async (event) =>
{
    try
    {
        const body = await readBody(event);
        const userId = body?.userId?.toString();

        if (!userId || !/^\d{16}$/.test(userId) || !isValidLuhn(userId))
        {
            // Clear any existing session to prevent empty session creation on login failure
            await deleteUser(event);
            return createProblem(event, 400, "Bad Request", "Invalid account ID format", null, {
                expectedFormat: "16-digit number with valid checksum"
            });
        }

        const account = await findAccountByUserId(userId);
        if (!account)
        {
            // Clear any existing session to prevent empty session creation on login failure
            await deleteUser(event);
            return createProblem(event, 401, "Unauthorized");
        }
        
        // Update last accessed time on successful login
        // account.queryId is a UUID object
        await updateAccount(account.queryId, { lastAccessed: new Date() });

        if (account.pinEnabled)
        {
            // Set partial session for accounts requiring PIN
            await setUser(event, account, SessionState.PENDING_PIN, userId);

            return { challenge: true, challengeUrl: "/api/account/login/challenge" };
        }

        // Set complete session for accounts not requiring PIN
        await setUser(event, account, SessionState.AUTHENTICATED, userId);

        return { challenge: false };
    }
    catch (error)
    {
        // Clear any existing session on unexpected errors to prevent empty sessions
        await deleteUser(event);
        return createProblem(event, 500, "Internal Server Error", null, null, null, error as Error);
    }
});