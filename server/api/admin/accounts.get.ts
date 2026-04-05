import { requireAdmin } from "../../utils/auth";
import { getAllAccounts } from "../../utils/database";
import { createProblem } from "../../utils/problem";
import { decodeUuid } from "../../utils/sqids";

export default defineEventHandler(async (event) =>
{
    // Require admin authentication
    requireAdmin(event);

    const query = getQuery(event);
    const cursor = query.cursor?.toString();
    const perPageRaw = parseInt(query.perPage?.toString() || "50");
    const perPage = Number.isFinite(perPageRaw) ? Math.min(Math.max(perPageRaw, 1), 100) : 50;
    const includeStats = query.includeStats?.toString() !== "false";

    // Validate cursor early so invalid cursors don't 500
    if (cursor) {
        try {
            decodeUuid(cursor);
        }
        catch {
            return createProblem(event, 400, "Invalid cursor", "Cursor must be a valid encoded ID");
        }
    }

    const result = await getAllAccounts({ cursor, perPage, includeStats });

    return result;
});
