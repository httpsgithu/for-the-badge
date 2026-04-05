import { getAccountByQueryId } from "../../utils/database";
import { createProblem } from "../../utils/problem";
import { requireUser, updateUser } from "../../utils/composables";

export default defineEventHandler(async (event) =>
{
    try
    {
        // Get current authentication state
        const auth = requireUser(event);
        
        // Check if we have an authenticated user with account data
        if (!auth.isAuthenticated || !auth.account?.queryId)
        {
            return createProblem(event, 401, "Unauthorized", "No active session");
        }
        
        // Fetch fresh account data from database
        const updatedAccount = await getAccountByQueryId(auth.account.queryId);
        if (!updatedAccount)
        {
            return createProblem(event, 401, "Unauthorized", "Account access denied");
        }

        // Update the session with fresh account data if there are changes
        await updateUser(event, updatedAccount);
        
        // Return the updated session account data for frontend use
        return {
            account: {
                credits: updatedAccount.credits,
                refundCount: updatedAccount.refundCount,
                pinEnabled: updatedAccount.pinEnabled,
                isAdmin: updatedAccount.isAdmin,
                createdAt: updatedAccount.createdAt,
                lastAccessed: updatedAccount.lastAccessed,
            }
        };
    }
    catch (error)
    {
        return createProblem(event, 500, "Internal Server Error", null, null, null, error as Error);
    }
});