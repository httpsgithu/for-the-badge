import { defineEventHandler, createError } from "h3";
import { eq } from "drizzle-orm";

import { requireAdmin } from "../../../utils/auth";
import { decryptBadgeData } from "../../../utils/badgeEncryption";
import { useDrizzle, tables } from "../../../utils/drizzle";
import { UUID } from "../../../utils/uuid";

export interface PendingBadgeData {
    submissionId: string;
    badgeId: string;
    name: string;
    description?: string;
    svg: string;
    submittedAt: Date;
    submitterId: string;
}

export interface GetPendingBadgesResponse {
    badges: PendingBadgeData[];
}

export default defineEventHandler(async (event) =>
{
    // Require admin authentication
    requireAdmin(event);

    try
    {
        const db = useDrizzle();

        // Fetch all pending badge submissions with badge details
        const pendingSubmissions = await db
            .select({
                badge: tables.badges,
                submission: tables.submittedBadges,
            })
            .from(tables.submittedBadges)
            .innerJoin(tables.badges, eq(tables.submittedBadges.badgeId, tables.badges.badgeId))
            .where(eq(tables.submittedBadges.status, "pending"))
            .all();

        // Decrypt and map badges
        const badges: PendingBadgeData[] = pendingSubmissions.map((row) =>
        {
            try
            {
                const badgeIdStr = UUID.fromBytes(row.badge.badgeId).toString();
                const submissionIdStr = UUID.fromBytes(row.submission.submissionId).toString();
                const submitterIdStr = UUID.fromBytes(row.submission.submitterQueryId).toString();

                return {
                    submissionId: submissionIdStr,
                    badgeId: badgeIdStr,
                    name: decryptBadgeData(row.badge.nameEncrypted),
                    description: row.badge.descriptionEncrypted
                        ? decryptBadgeData(row.badge.descriptionEncrypted)
                        : undefined,
                    svg: decryptBadgeData(row.badge.svgEncrypted),
                    submittedAt: row.submission.submittedAt,
                    submitterId: submitterIdStr,
                };
            }
            catch (decryptError)
            {
                const badgeIdStr = UUID.fromBytes(row.badge.badgeId).toString();
                console.error(`Failed to decrypt pending badge ${badgeIdStr}:`, decryptError);
                // Skip badges that fail to decrypt
                return null;
            }
        }).filter((badge): badge is PendingBadgeData => badge !== null);

        return {
            badges,
        } as GetPendingBadgesResponse;
    }
    catch (error)
    {
        console.error("Error fetching pending badges:", error);
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
            data: {
                type: "https://tools.ietf.org/html/rfc7231#section-6.6.1",
                title: "Internal Server Error",
                status: 500,
                detail: "Failed to fetch pending badges",
            },
        });
    }
});
