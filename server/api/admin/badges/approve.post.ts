import { defineEventHandler, readBody, createError } from "h3";
import { eq } from "drizzle-orm";

import { requireAdmin } from "../../../utils/auth";
import { useDrizzle, tables } from "../../../utils/drizzle";
import { UUID } from "../../../utils/uuid";

export interface ApproveBadgeRequest {
    submissionId: string;
}

export interface ApproveBadgeResponse {
    message: string;
}

export default defineEventHandler(async (event) =>
{
    // Require admin authentication
    const auth = requireAdmin(event);

    const body = await readBody<ApproveBadgeRequest>(event);

    // Validate input
    if (!body.submissionId)
    {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            data: {
                type: "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                title: "Bad Request",
                status: 400,
                detail: "Submission ID is required",
            },
        });
    }

    try
    {
        const db = useDrizzle();
        const submissionId = UUID.parse(body.submissionId);
        const submissionIdBytes = submissionId.cloneBytes();

        // Verify the submission exists and is pending
        const submission = await db
            .select()
            .from(tables.submittedBadges)
            .where(eq(tables.submittedBadges.submissionId, submissionIdBytes))
            .get();

        if (!submission)
        {
            throw createError({
                statusCode: 404,
                statusMessage: "Not Found",
                data: {
                    type: "https://tools.ietf.org/html/rfc7231#section-6.5.4",
                    title: "Not Found",
                    status: 404,
                    detail: "Submission not found",
                },
            });
        }

        if (submission.status !== "pending")
        {
            throw createError({
                statusCode: 409,
                statusMessage: "Conflict",
                data: {
                    type: "https://tools.ietf.org/html/rfc7231#section-6.5.8",
                    title: "Conflict",
                    status: 409,
                    detail: `Submission has already been ${submission.status}`,
                },
            });
        }

        // Update submission to approved
        const now = new Date();
        const reviewerQueryIdBytes = auth.queryId.cloneBytes();

        await db
            .update(tables.submittedBadges)
            .set({
                status: "approved",
                reviewedAt: now,
                reviewerQueryId: reviewerQueryIdBytes,
            })
            .where(eq(tables.submittedBadges.submissionId, submissionIdBytes))
            .run();

        return {
            message: "Badge approved successfully",
        } as ApproveBadgeResponse;
    }
    catch (error)
    {
        // If it's already a createError, rethrow it
        if (error && typeof error === "object" && "statusCode" in error)
        {
            throw error;
        }

        console.error("Error approving badge:", error);
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
            data: {
                type: "https://tools.ietf.org/html/rfc7231#section-6.6.1",
                title: "Internal Server Error",
                status: 500,
                detail: "Failed to approve badge",
            },
        });
    }
});
