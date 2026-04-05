import { requireAuth } from "../../../utils/auth";
import { createProblem } from "../../../utils/problem";
import { encodeUuid } from "../../../utils/sqids";

export default defineEventHandler(async (event) => {
    try {
        // Require authentication - this ensures the user is logged in
        // The authenticated user is always requesting their own referral URL
        const auth = requireAuth(event);
        
        // Validate we have the necessary account data (without exposing what's missing)
        if (!auth.queryId) {
            return createProblem(event, 400, "Account Error", "Unable to generate referral URL for this account");
        }

        // Referrals are only unlocked once the account has purchased/applied credits.
        // This prevents referral farming on free accounts.
        if (!auth.account?.creditsApplied) {
            return {
                url: null,
                reason: "Add credits to unlock referrals",
            };
        }

        // Generate the referral URL using the user's queryId
        const referralSqid = encodeUuid(auth.queryId);

        return { url: `/?referrer=${referralSqid}` };
        
    } catch (error) {
        // Handle authentication errors specifically
        if (error?.statusCode) {
            return error;
        }
        
        // Any other unexpected errors
        return createProblem(event, 500, "Internal Server Error", "Failed to generate referral URL");
    }
});
