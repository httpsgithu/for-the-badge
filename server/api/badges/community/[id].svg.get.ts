import { defineEventHandler, createError, setHeader } from "h3";
import { eq, and } from "drizzle-orm";

import { decryptBadgeData } from "../../../utils/badgeEncryption";
import { useDrizzle, tables } from "../../../utils/drizzle";
import { UUID } from "../../../utils/uuid";

export default defineEventHandler(async (event) =>
{
    try
    {
        const badgeId = event.context.params?.id;
        
        if (!badgeId)
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

        // Parse and validate the badge ID
        let badgeUUID: UUID;
        try
        {
            badgeUUID = UUID.parse(badgeId);
        }
        catch (error)
        {
            throw createError({
                statusCode: 400,
                statusMessage: "Bad Request",
                data: {
                    type: "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                    title: "Bad Request",
                    status: 400,
                    detail: "Invalid badge ID format",
                },
            });
        }

        const db = useDrizzle();
        const badgeIdBytes = badgeUUID.getBytes();

        // Fetch the badge and verify it's an approved community badge
        const result = await db
            .select({
                badge: tables.badges,
                submission: tables.submittedBadges,
            })
            .from(tables.badges)
            .innerJoin(tables.submittedBadges, eq(tables.badges.badgeId, tables.submittedBadges.badgeId))
            .where(
                and(
                    eq(tables.badges.badgeId, badgeIdBytes),
                    eq(tables.submittedBadges.status, "approved")
                )
            )
            .limit(1)
            .get();

        if (!result)
        {
            throw createError({
                statusCode: 404,
                statusMessage: "Not Found",
                data: {
                    type: "https://tools.ietf.org/html/rfc7231#section-6.5.4",
                    title: "Not Found",
                    status: 404,
                    detail: "Community badge not found or not approved",
                },
            });
        }

        // Decrypt the SVG
        let svg: string;
        try
        {
            svg = decryptBadgeData(result.badge.svgEncrypted);
        }
        catch (decryptError)
        {
            console.error(`Failed to decrypt badge ${badgeId}:`, decryptError);
            throw createError({
                statusCode: 500,
                statusMessage: "Internal Server Error",
                data: {
                    type: "https://tools.ietf.org/html/rfc7231#section-6.6.1",
                    title: "Internal Server Error",
                    status: 500,
                    detail: "Failed to retrieve badge",
                },
            });
        }

        // Set appropriate headers for SVG
        setHeader(event, "Content-Type", "image/svg+xml");
        setHeader(event, "Cache-Control", "public, max-age=3600"); // Cache for 1 hour
        
        return svg;
    }
    catch (error)
    {
        // Re-throw createError errors
        if (error && typeof error === 'object' && 'statusCode' in error)
        {
            throw error;
        }

        console.error("Error serving community badge:", error);
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
            data: {
                type: "https://tools.ietf.org/html/rfc7231#section-6.6.1",
                title: "Internal Server Error",
                status: 500,
                detail: "Failed to serve badge",
            },
        });
    }
});
