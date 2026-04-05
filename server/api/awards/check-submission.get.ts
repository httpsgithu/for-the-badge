import { useDrizzle, eq } from "../../utils/drizzle";
import { developerAwards } from "../../database/schemas";
import { createProblem } from "../../utils/problem";

export default defineEventHandler(async (event) => {
    try {
        const { auth } = event.context;

        // Check authentication
        if (!auth?.account?.queryId) {
            return createProblem(event, 401, "Unauthorized", "You must be logged in to check submission status");
        }

        const db = useDrizzle();
        const accountUUID = auth.account.queryId;

        // Check if user has already submitted
        const existingSubmission = await db
            .select()
            .from(developerAwards)
            .where(eq(developerAwards.accountId, accountUUID.getBytes()))
            .limit(1);

        return {
            hasSubmitted: existingSubmission.length > 0,
            showOnStarboard: existingSubmission.length > 0 ? existingSubmission[0].showOnStarboard : null,
            status: existingSubmission.length > 0 ? existingSubmission[0].status : null,
        };
    } catch (error) {
        console.error("Error checking submission status:", error);
        return createProblem(event, 500, "Internal server error", "Failed to check submission status");
    }
});
