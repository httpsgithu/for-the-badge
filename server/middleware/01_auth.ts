import { getAccountCredits } from "../utils/database";
import { loadAuthContext, updateUser } from "../utils/composables";

export default defineEventHandler(async (event) =>
{
    const requestUrl = event.node.req.url;
    const requestMethod = event.node.req.method;
    
    // Load authentication context from session (initializes with defaults)
    await loadAuthContext(event);

    // Check for credit changes and update session if needed (skip for DELETE requests to avoid connection issues)
    const isDeleteRequest = event.node.req.method === 'DELETE';
    
    if (event.context.auth.account?.queryId && !isDeleteRequest && event.context.auth.isAuthenticated && !event.context.auth.requiresPinVerification)
    {
        try {
            const currentCredits = await getAccountCredits(event.context.auth.account.queryId);
            
            if (currentCredits !== null && currentCredits !== event.context.auth.account.credits)
            {
                // Update via composable to keep session and context in sync
                await updateUser(event, { credits: currentCredits });
            }
        } catch (error) {
            // Ignore database connection issues for credit updates
        }
    }
});
