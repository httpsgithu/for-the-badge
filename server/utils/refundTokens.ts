import crypto from "crypto";

import { createError } from "h3";

import { UUID } from "./uuid";

interface RefundTokenData {
    refundId : UUID;
    accountId : UUID;
    documentId : string;
    analysisCost : number;
    pageCount : number;
    pricingTier : string;
    timestamp : number;
    expiresAt : number;
}

/**
 * Creates a signed and encrypted refund token containing analysis cost information
 * Uses simple AES-256-CBC encryption + HMAC-SHA256 signature for security
 */
export function createRefundToken(
    accountId : UUID,
    documentId : string,
    analysisCost : number,
    pageCount : number,
    pricingTier : string
) : string
{
    const secret = getRefundSecret();

    if (!secret)
    {
        throw new Error("Refund token secret not configured");
    }

    const now = Date.now();
    const refundId = UUID.createV7();
    const tokenData : RefundTokenData = {
        refundId,
        accountId,
        documentId,
        analysisCost,
        pageCount,
        pricingTier,
        timestamp: now,
        expiresAt: now + (15 * 60 * 1000), // 15 minutes from creation
    };

    // Serialize the data - convert UUIDs to strings for JSON
    const jsonData = JSON.stringify({
        ...tokenData,
        refundId: tokenData.refundId.toString(),
        accountId: tokenData.accountId.toString(),
    });

    // Encrypt the data using AES-256-CBC
    const key = crypto.scryptSync(secret, "refund-salt", 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

    let encrypted = cipher.update(jsonData, "utf8", "hex");
    encrypted += cipher.final("hex");

    // Combine IV + encrypted data
    const encryptedPayload = iv.toString("hex") + ":" + encrypted;

    // Create HMAC signature of the encrypted payload
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(encryptedPayload);
    const signature = hmac.digest("hex");

    // Combine encrypted payload and signature
    const token = encryptedPayload + ":" + signature;

    // Base64 encode for safe transport
    return Buffer.from(token).toString("base64");
}

/**
 * Verifies signature and decrypts a refund token
 * Returns the analysis cost information if valid, throws error if invalid/tampered
 */
export function verifyAndDecryptRefundToken(token : string, expectedAccountId : UUID) : RefundTokenData
{
    const secret = getRefundSecret();

    if (!secret)
    {
        throw createError({
            statusCode: 500,
            statusMessage: "Server configuration error",
        });
    }

    try
    {
        // Base64 decode
        const decodedToken = Buffer.from(token, "base64").toString("utf8");

        // Split into encrypted payload and signature
        const parts = decodedToken.split(":");
        if (parts.length !== 3)
        {
            throw new Error("Invalid token format");
        }

        const [
            ivHex,
            encryptedData,
            providedSignature,
        ] = parts;
        const encryptedPayload = `${ivHex}:${encryptedData}`;

        // Verify HMAC signature
        const hmac = crypto.createHmac("sha256", secret);
        hmac.update(encryptedPayload);
        const calculatedSignature = hmac.digest("hex");

        if (!crypto.timingSafeEqual(Buffer.from(providedSignature, "hex"), Buffer.from(calculatedSignature, "hex")))
        {
            throw new Error("Invalid signature");
        }

        // Decrypt the data
        const key = crypto.scryptSync(secret, "refund-salt", 32);
        const iv = Buffer.from(ivHex, "hex");

        const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

        let decrypted = decipher.update(encryptedData, "hex", "utf8");
        decrypted += decipher.final("utf8");

        // Parse the JSON data and convert string IDs back to UUIDs
        const parsedData = JSON.parse(decrypted);
        const tokenData : RefundTokenData = {
            ...parsedData,
            refundId: UUID.parse(parsedData.refundId),
            accountId: UUID.parse(parsedData.accountId),
        };

        // Validate the account ID matches
        if (!tokenData.accountId.equals(expectedAccountId))
        {
            throw createError({
                statusCode: 403,
                statusMessage: "Refund token is not valid for this account.",
            });
        }

        // Check if token has expired (15 minutes from creation)
        if (Date.now() > tokenData.expiresAt)
        {
            throw createError({
                statusCode: 400,
                statusMessage: "Refund token has expired. Refunds must be requested within 15 minutes of token creation.",
            });
        }

        // Check if token is not too old (24 hours max)
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        if (Date.now() - tokenData.timestamp > maxAge)
        {
            throw createError({
                statusCode: 400,
                statusMessage: "Refund token has expired. Refunds must be requested within 24 hours of analysis.",
            });
        }

        // Validate the analysis cost is within reasonable bounds
        if (tokenData.analysisCost < 1.00 || tokenData.analysisCost > 3.00)
        {
            throw createError({
                statusCode: 400,
                statusMessage: "Invalid analysis cost in refund token.",
            });
        }

        return tokenData;
    }
    catch (error)
    {
        if (error.statusCode)
        {
            // Re-throw createError instances
            throw error;
        }

        // Handle crypto/parsing errors
        throw createError({
            statusCode: 400,
            statusMessage: "Invalid or corrupted refund token.",
        });
    }
}

/**
 * Verifies signature and decrypts a refund token for admin use (skips account validation)
 * Returns the analysis cost information if valid, throws error if invalid/tampered
 */
export function verifyAndDecryptRefundTokenAdmin(token : string) : RefundTokenData
{
    const secret = getRefundSecret();

    if (!secret)
    {
        throw createError({
            statusCode: 500,
            statusMessage: "Server configuration error",
        });
    }

    try
    {
        // Base64 decode
        const decodedToken = Buffer.from(token, "base64").toString("utf8");

        // Split into encrypted payload and signature
        const parts = decodedToken.split(":");
        if (parts.length !== 3)
        {
            throw new Error("Invalid token format");
        }

        const [
            ivHex,
            encryptedData,
            providedSignature,
        ] = parts;
        const encryptedPayload = `${ivHex}:${encryptedData}`;

        // Verify HMAC signature
        const hmac = crypto.createHmac("sha256", secret);
        hmac.update(encryptedPayload);
        const calculatedSignature = hmac.digest("hex");

        if (!crypto.timingSafeEqual(Buffer.from(providedSignature, "hex"), Buffer.from(calculatedSignature, "hex")))
        {
            throw new Error("Invalid signature");
        }

        // Decrypt the data
        const key = crypto.scryptSync(secret, "refund-salt", 32);
        const iv = Buffer.from(ivHex, "hex");

        const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

        let decrypted = decipher.update(encryptedData, "hex", "utf8");
        decrypted += decipher.final("utf8");

        // Parse the JSON data and convert string IDs back to UUIDs
        const parsedData = JSON.parse(decrypted);
        const tokenData : RefundTokenData = {
            ...parsedData,
            refundId: UUID.parse(parsedData.refundId),
            accountId: UUID.parse(parsedData.accountId),
        };

        // Skip account ID validation for admin use

        // // Check if token has expired (15 minutes from creation)
        // if (Date.now() > tokenData.expiresAt)
        // {
        //     throw createError({
        //         statusCode: 400,
        //         statusMessage: "Refund token has expired. Refunds must be requested within 15 minutes of token creation.",
        //     });
        // }

        // Check if token is not too old (24 hours max)
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        if (Date.now() - tokenData.timestamp > maxAge)
        {
            throw createError({
                statusCode: 400,
                statusMessage: "Refund token has expired. Refunds must be requested within 24 hours of analysis.",
            });
        }

        // Validate the analysis cost is within reasonable bounds
        if (tokenData.analysisCost < 1.00 || tokenData.analysisCost > 3.00)
        {
            throw createError({
                statusCode: 400,
                statusMessage: "Invalid analysis cost in refund token.",
            });
        }

        return tokenData;
    }
    catch (error)
    {
        if (error.statusCode)
        {
            // Re-throw createError instances
            throw error;
        }

        // Handle crypto/parsing errors
        throw createError({
            statusCode: 400,
            statusMessage: "Invalid or corrupted refund token.",
        });
    }
}

/**
 * Get the refund token secret from configuration.
 * We intentionally do NOT introduce a separate REFUND_* env var; instead we
 * use the same secret as session encryption.
 */
function getRefundSecret() : string
{
    const secret = process.env.NUXT_SESSION_PASSWORD;

    return typeof secret === "string" ? secret : "";
}
