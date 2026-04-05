import { defineEventHandler, readBody, createError } from "h3";
import { eq } from "drizzle-orm";

import { useDrizzle, tables } from "../../utils/drizzle";
import { UUID } from "../../utils/uuid";
import { requireAuth } from "../../utils/auth";

export interface SubmitBadgeRequest {
    badgeId: string;
}

export interface SubmitBadgeResponse {
    submissionId: string;
    message: string;
}

export default defineEventHandler(async (event) =>
{
    // Verify user is authenticated
    const auth = requireAuth(event);

    const body = await readBody<SubmitBadgeRequest>(event);

    // Validate input
    if (!body.badgeId)
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
        const badgeId = UUID.parse(body.badgeId);

        // Verify the badge exists and belongs to the user
        const badgeIdBytes = badgeId.cloneBytes();
        const badge = await db
            .select()
            .from(tables.badges)
            .where(eq(tables.badges.badgeId, badgeIdBytes))
            .get();

        if (!badge)
        {
            throw createError({
                statusCode: 404,
                statusMessage: "Not Found",
                data: {
                    type: "https://tools.ietf.org/html/rfc7231#section-6.5.4",
                    title: "Not Found",
                    status: 404,
                    detail: "Badge not found",
                },
            });
        }

        // Verify the badge belongs to the authenticated user
        const queryIdBytes = auth.queryId.cloneBytes();
        const badgeQueryIdBytes = badge.queryId;

        // Compare UUIDs as strings to handle different byte representations
        const badgeQueryId = UUID.fromBytes(badgeQueryIdBytes);
        if (badgeQueryId.toString() !== auth.queryId.toString())
        {
            throw createError({
                statusCode: 403,
                statusMessage: "Forbidden",
                data: {
                    type: "https://tools.ietf.org/html/rfc7231#section-6.5.3",
                    title: "Forbidden",
                    status: 403,
                    detail: "You do not have permission to submit this badge",
                },
            });
        }

        // Check if the badge has already been submitted
        const existingSubmission = await db
            .select()
            .from(tables.submittedBadges)
            .where(eq(tables.submittedBadges.badgeId, badgeIdBytes))
            .get();

        if (existingSubmission)
        {
            throw createError({
                statusCode: 409,
                statusMessage: "Conflict",
                data: {
                    type: "https://tools.ietf.org/html/rfc7231#section-6.5.8",
                    title: "Conflict",
                    status: 409,
                    detail: "This badge has already been submitted for approval",
                },
            });
        }

        // Create submission
        const submissionId = UUID.createV7();
        const now = new Date();

        await db.insert(tables.submittedBadges).values({
            submissionId: submissionId.cloneBytes(),
            badgeId: badgeIdBytes,
            submitterQueryId: queryIdBytes,
            status: "pending",
            submittedAt: now,
        }).run();

        return {
            submissionId: submissionId.toString(),
            message: "Badge submitted for approval successfully",
        } as SubmitBadgeResponse;
    }
    catch (error)
    {
        // If it's already a createError, rethrow it
        if (error && typeof error === "object" && "statusCode" in error)
        {
            throw error;
        }

        console.error("Error submitting badge:", error);
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
            data: {
                type: "https://tools.ietf.org/html/rfc7231#section-6.6.1",
                title: "Internal Server Error",
                status: 500,
                detail: "Failed to submit badge for approval",
            },
        });
    }
});
