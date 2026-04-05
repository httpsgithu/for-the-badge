import { defineEventHandler, createError } from "h3";
import { eq, and } from "drizzle-orm";

import { decryptBadgeData } from "../../utils/badgeEncryption";
import { useDrizzle, tables } from "../../utils/drizzle";
import { UUID } from "../../utils/uuid";

export interface CommunityBadgeData {
    id: string;
    name: string;
    description?: string;
    svg: string;
    submittedAt: Date;
}

export interface GetCommunityBadgesResponse {
    badges: CommunityBadgeData[];
}

export default defineEventHandler(async (event) =>
{
    try
    {
        const db = useDrizzle();

        // Fetch all approved badge submissions with badge details
        const approvedSubmissions = await db
            .select({
                badge: tables.badges,
                submission: tables.submittedBadges,
            })
            .from(tables.submittedBadges)
            .innerJoin(tables.badges, eq(tables.submittedBadges.badgeId, tables.badges.badgeId))
            .where(eq(tables.submittedBadges.status, "approved"))
            .all();

        // Decrypt and map badges
        const badges: CommunityBadgeData[] = approvedSubmissions.map((row) =>
        {
            try
            {
                const badgeIdStr = UUID.fromBytes(row.badge.badgeId).toString();
                return {
                    id: badgeIdStr,
                    name: decryptBadgeData(row.badge.nameEncrypted),
                    description: row.badge.descriptionEncrypted
                        ? decryptBadgeData(row.badge.descriptionEncrypted)
                        : undefined,
                    svg: decryptBadgeData(row.badge.svgEncrypted),
                    submittedAt: row.submission.submittedAt,
                };
            }
            catch (decryptError)
            {
                const badgeIdStr = UUID.fromBytes(row.badge.badgeId).toString();
                console.error(`Failed to decrypt community badge ${badgeIdStr}:`, decryptError);
                // Skip badges that fail to decrypt
                return null;
            }
        }).filter((badge): badge is CommunityBadgeData => badge !== null);

        return {
            badges,
        } as GetCommunityBadgesResponse;
    }
    catch (error)
    {
        console.error("Error fetching community badges:", error);
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
            data: {
                type: "https://tools.ietf.org/html/rfc7231#section-6.6.1",
                title: "Internal Server Error",
                status: 500,
                detail: "Failed to fetch community badges",
            },
        });
    }
});
