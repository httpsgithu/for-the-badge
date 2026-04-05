import { requireAdmin } from "../../utils/auth";
import { useDrizzle, desc, lt } from "../../utils/drizzle";
import { feedback } from "../../database/schemas";
import { encodeUuid, decodeUuid } from "../../utils/sqids";
import { createProblem } from "../../utils/problem";
import { UUID } from "../../utils/uuid";
import type { PagedResponse } from "../../../shared/types/Paging/Page";

interface FeedbackItem {
    id: string;
    message: string;
    createdAt: Date;
}

export default defineEventHandler(async (event) => {
    // Require admin authentication - returns 401 if not admin
    try {
        requireAdmin(event);
    } catch (error) {
        return createProblem(event, 401, "Unauthorized", "Administrator privileges required");
    }

    const query = getQuery(event);
    const cursor = query.cursor?.toString();
    const perPage = Math.min(parseInt(query.perPage?.toString() || "50"), 100); // Max 100 per page

    const db = useDrizzle();

    try {
        let dbQuery = db
            .select({
                id: feedback.id,
                message: feedback.message,
                createdAt: feedback.createdAt,
            })
            .from(feedback)
            .orderBy(desc(feedback.createdAt))
            .limit(perPage + 1); // Fetch one extra to determine if there are more

        // If cursor is provided, filter for records with IDs less than the cursor
        if (cursor) {
            try {
                const cursorUuid = decodeUuid(cursor);
                dbQuery = dbQuery.where(lt(feedback.id, cursorUuid.getBytes()));
            } catch {
                return createProblem(event, 400, "Invalid cursor", "Cursor must be a valid encoded ID");
            }
        }

        const feedbackList = await dbQuery;

        const hasMore = feedbackList.length > perPage;
        const items = hasMore ? feedbackList.slice(0, perPage) : feedbackList;

        // Convert UUIDs to sqids-encoded strings for JSON serialization
        const serializedItems: FeedbackItem[] = items.map(item => ({
            id: encodeUuid(UUID.fromBytes(item.id)),
            message: item.message,
            createdAt: item.createdAt,
        }));

        const nextCursor = hasMore 
            ? encodeUuid(UUID.fromBytes(items[items.length - 1].id))
            : null;

        const response: PagedResponse<FeedbackItem> = {
            current: cursor,
            next: nextCursor,
            perPage,
            data: serializedItems,
        };

        return response;
    } catch (error) {
        console.error("Error fetching feedback:", error);
        return createProblem(event, 500, "Internal server error", "Failed to fetch feedback");
    }
});
