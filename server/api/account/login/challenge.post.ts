import { updateAccount, verifyAndMigratePin } from "../../../utils/database";
import { createProblem } from "../../../utils/problem";
import { requireUser, updateUser, deleteUser, SessionState } from "../../../utils/composables";


export default defineEventHandler(async (event) =>
{
    try
    {
        const auth = requireUser(event);

        if (!auth.isAuthenticated || !auth.requiresPinVerification || !auth.account?.queryId)
        {
            return createProblem(event, 401, "Unauthorized");
        }

        const body = await readBody(event);
        const pin = body?.pin?.toString();

        if (!pin)
        {
            return createProblem(event, 400, "Bad Request", "PIN is required", null, {
                expectedField: "pin"
            });
        }

        const pinResult = await verifyAndMigratePin(auth.account.queryId, pin);

        if (!pinResult.valid)
        {
            // Clear session immediately when PIN challenge fails
            // This prevents the issue where putting in the correct PIN immediately following 
            // a failure will cause the endpoint to fail the challenge again
            await deleteUser(event);

            return createProblem(event, 401, "Unauthorized");
        }

        // PIN is valid - update last accessed time and session
        
        // Update last accessed time on successful PIN verification
        await updateAccount(auth.account.queryId, { lastAccessed: new Date() });
        
        await updateUser(event, { lastAccessed: new Date() }, SessionState.AUTHENTICATED);

        return {};
    }
    catch (error)
    {
        await deleteUser(event);

        // Always return 500 for security - obfuscate all PIN-related errors to prevent brute forcing
        return createProblem(event, 500, "Internal Server Error", null, null, null, error as Error);
    }
});