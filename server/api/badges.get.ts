import { defineEventHandler, createError } from "h3";
import { eq } from "drizzle-orm";

import { decryptBadgeData } from "../utils/badgeEncryption";
import { useDrizzle, tables, type SubmissionStatus } from "../utils/drizzle";
import { requireAuth } from "../utils/auth";
import { UUID } from "../utils/uuid";

export interface BadgeData {
    id: string;
    name: string;
    description?: string;
    svg: string;
    createdAt: Date;
    updatedAt: Date;
    submissionStatus?: SubmissionStatus;
    submissionId?: string;
}

export interface GetBadgesResponse {
    badges: BadgeData[];
}

export default defineEventHandler(async (event) =>
{
    // Verify user is authenticated
    const auth = requireAuth(event);

    try
    {
        const db = useDrizzle();

        // Fetch all badges for the authenticated user with submission status
        // Use Uint8Array directly for BLOB comparison (compatible with miniflare)
        const queryIdBytes = auth.queryId.cloneBytes();
        const userBadgesWithSubmissions = await db
            .select({
                badge: tables.badges,
                submission: tables.submittedBadges,
            })
            .from(tables.badges)
            .leftJoin(tables.submittedBadges, eq(tables.badges.badgeId, tables.submittedBadges.badgeId))
            .where(eq(tables.badges.queryId, queryIdBytes))
            .all();

        // Decrypt and map badges
        const badges: BadgeData[] = userBadgesWithSubmissions.map((row) =>
        {
            try
            {
                const badgeIdStr = UUID.fromBytes(row.badge.badgeId).toString();
                const badgeData: BadgeData = {
                    id: badgeIdStr,
                    name: decryptBadgeData(row.badge.nameEncrypted),
                    description: row.badge.descriptionEncrypted 
                        ? decryptBadgeData(row.badge.descriptionEncrypted) 
                        : undefined,
                    svg: decryptBadgeData(row.badge.svgEncrypted),
                    createdAt: row.badge.createdAt,
                    updatedAt: row.badge.updatedAt,
                };

                // Add submission info if exists
                if (row.submission)
                {
                    badgeData.submissionStatus = row.submission.status as SubmissionStatus;
                    badgeData.submissionId = UUID.fromBytes(row.submission.submissionId).toString();
                }

                return badgeData;
            }
            catch (decryptError)
            {
                const badgeIdStr = UUID.fromBytes(row.badge.badgeId).toString();
                console.error(`Failed to decrypt badge ${badgeIdStr}:`, decryptError);
                // Skip badges that fail to decrypt
                return null;
            }
        }).filter((badge): badge is BadgeData => badge !== null);

        return {
            badges,
        } as GetBadgesResponse;
    }
    catch (error)
    {
        console.error("Error fetching badges:", error);
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
            data: {
                type: "https://tools.ietf.org/html/rfc7231#section-6.6.1",
                title: "Internal Server Error",
                status: 500,
                detail: "Failed to fetch badges",
            },
        });
    }
});
