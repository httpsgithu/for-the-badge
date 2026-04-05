import { defineEventHandler, createError, getRouterParam } from "h3";
import { eq, and } from "drizzle-orm";

import { useDrizzle, tables } from "../../utils/drizzle";
import { requireAuth } from "../../utils/auth";
import { UUID } from "../../utils/uuid";

export default defineEventHandler(async (event) =>
{
    // Verify user is authenticated
    const auth = requireAuth(event);

    // Get badge ID from route params
    const badgeIdParam = getRouterParam(event, "id");
    
    if (!badgeIdParam)
    {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            data: {
                type: "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                title: "Bad Request",
                status: 400,
                detail: "Badge ID is required",
            },
        });
    }

    try
    {
        const db = useDrizzle();
        const badgeId = UUID.parse(badgeIdParam);

        // Delete the badge (only if it belongs to the authenticated user)
        const result = await db
            .delete(tables.badges)
            .where(
                and(
                    eq(tables.badges.badgeId, badgeId.getBytes()),
                    eq(tables.badges.queryId, auth.queryId.getBytes())
                )
            )
            .run();

        // Check if a badge was actually deleted
        if (result.changes === 0)
        {
            throw createError({
                statusCode: 404,
                statusMessage: "Not Found",
                data: {
                    type: "https://tools.ietf.org/html/rfc7231#section-6.5.4",
                    title: "Not Found",
                    status: 404,
                    detail: "Badge not found or you don't have permission to delete it",
                },
            });
        }

        return {
            success: true,
            message: "Badge deleted successfully",
        };
    }
    catch (error)
    {
        // If it's already a createError, rethrow it
        if (error && typeof error === "object" && "statusCode" in error)
        {
            throw error;
        }

        console.error("Error deleting badge:", error);
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
            data: {
                type: "https://tools.ietf.org/html/rfc7231#section-6.6.1",
                title: "Internal Server Error",
                status: 500,
                detail: "Failed to delete badge",
            },
        });
    }
});
