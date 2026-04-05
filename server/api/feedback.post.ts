import { useDrizzle } from "../utils/drizzle";
import { feedback } from "../database/schemas";
import { createProblem } from "../utils/problem";
import { encodeUuid } from "../utils/sqids";

interface FeedbackRequest {
    message: string;
}

export default defineEventHandler(async (event) => {
    const body = await readBody(event) as FeedbackRequest;

    // Validate message
    if (!body.message || typeof body.message !== "string") {
        return createProblem(event, 400, "Invalid request", "Message is required and must be a string");
    }

    const message = body.message.trim();
    if (message.length === 0) {
        return createProblem(event, 400, "Invalid request", "Message cannot be empty");
    }

    if (message.length > 1000) {
        return createProblem(event, 400, "Invalid request", "Message must be 1000 characters or less");
    }

    const db = useDrizzle();

    try {
        // Insert feedback into database
        const [insertedFeedback] = await db
            .insert(feedback)
            .values({
                message,
            })
            .returning();

        return {
            success: true,
            message: "Feedback submitted successfully",
            id: encodeUuid(UUID.fromBytes(insertedFeedback.id)),
        };
    } catch (error) {
        console.error("Error submitting feedback:", error);
        return createProblem(event, 500, "Internal server error", "Failed to submit feedback");
    }
});
