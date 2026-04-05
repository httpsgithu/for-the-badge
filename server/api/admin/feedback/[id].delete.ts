import { requireAdmin } from "../../../utils/auth";
import { useDrizzle, eq } from "../../../utils/drizzle";
import { feedback } from "../../../database/schemas";
import { UUID } from "../../../utils/uuid";
import { decodeUuid } from "../../../utils/sqids";
import { createProblem } from "../../../utils/problem";

export default defineEventHandler(async (event) => {
    // Require admin authentication - returns 401 if not admin
    try {
        requireAdmin(event);
    } catch (error) {
        return createProblem(event, 401, "Unauthorized", "Administrator privileges required");
    }

    assertMethod(event, "DELETE");

    const feedbackId = getRouterParam(event, "id");

    if (!feedbackId) {
        return createProblem(event, 400, "Invalid request", "Feedback ID is required");
    }

    // Parse the sqids-encoded UUID
    let parsedId: UUID;
    try {
        parsedId = decodeUuid(feedbackId);
    } catch (error) {
        return createProblem(event, 400, "Invalid request", "Invalid feedback ID format");
    }

    const db = useDrizzle();

    try {
        // Delete the feedback record
        const result = await db
            .delete(feedback)
            .where(eq(feedback.id, parsedId.getBytes()))
            .returning();

        if (result.length === 0) {
            return createProblem(event, 404, "Not found", "Feedback not found");
        }

        return {
            success: true,
            message: "Feedback deleted successfully",
            deletedId: feedbackId,
        };
    } catch (error) {
        console.error("Error deleting feedback:", error);
        return createProblem(event, 500, "Internal server error", "Failed to delete feedback");
    }
});
