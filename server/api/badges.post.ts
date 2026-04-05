import { defineEventHandler, readBody, createError } from "h3";

import { encryptBadgeData, validateBadgeMetadata } from "../utils/badgeEncryption";
import { useDrizzle, tables } from "../utils/drizzle";
import { UUID } from "../utils/uuid";
import { requireAuth } from "../utils/auth";
import { getAccountByQueryId } from "../utils/database";

export interface SaveBadgeRequest {
    name : string;
    description? : string;
    svg : string;
}

export interface SaveBadgeResponse {
    badgeId : string;
    message : string;
}

export default defineEventHandler(async (event) =>
{
    // Verify user is authenticated
    const auth = requireAuth(event);

    const body = await readBody<SaveBadgeRequest>(event);

    // Validate input
    if (!body.name || !body.svg)
    {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            data: {
                type: "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                title: "Bad Request",
                status: 400,
                detail: "Name and SVG are required",
            },
        });
    }

    // Validate metadata
    const validation = validateBadgeMetadata(body.name, body.description);
    if (!validation.isValid)
    {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            data: {
                type: "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                title: "Validation Error",
                status: 400,
                detail: validation.errors.join("; "),
            },
        });
    }

    try
    {
        // Verify the account exists in the database
        const account = await getAccountByQueryId(auth.queryId);
        if (!account) {
            throw createError({
                statusCode: 401,
                statusMessage: "Unauthorized",
                data: {
                    type: "https://tools.ietf.org/html/rfc7231#section-6.5.3",
                    title: "Unauthorized",
                    status: 401,
                    detail: "Account not found. Please log in again.",
                },
            });
        }

        const db = useDrizzle();
        const badgeId = UUID.createV7();

        // Encrypt sensitive data
        const nameEncrypted = encryptBadgeData(body.name);
        const descriptionEncrypted = body.description ? encryptBadgeData(body.description) : null;
        const svgEncrypted = encryptBadgeData(body.svg);

        const now = new Date();

        // Insert badge into database
        // Use Uint8Array for UUID bytes (compatible with miniflare dev mode)
        // Encrypted fields are already strings (base64), no conversion needed
        await db.insert(tables.badges).values({
            badgeId: badgeId.cloneBytes(),
            queryId: auth.queryId.cloneBytes(),
            nameEncrypted,
            descriptionEncrypted,
            svgEncrypted,
            createdAt: now,
            updatedAt: now,
        }).run();

        return {
            badgeId: badgeId.toString(),
            message: "Badge saved successfully",
        } as SaveBadgeResponse;
    }
    catch (error)
    {
        console.error("Error saving badge:", error);
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
            data: {
                type: "https://tools.ietf.org/html/rfc7231#section-6.6.1",
                title: "Internal Server Error",
                status: 500,
                detail: "Failed to save badge",
            },
        });
    }
});