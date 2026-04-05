/**
 * File encryption utilities using Web Crypto API
 */

async function deriveKeyFromPin(pin, salt)
{
    const encoder = new TextEncoder();
    const pinBuffer = encoder.encode(pin);

    const baseKey = await crypto.subtle.importKey("raw", pinBuffer, "PBKDF2", false, ["deriveKey"]);

    return await crypto.subtle.deriveKey(
        { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
        baseKey,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}

export async function encryptAnalysisData(data, pin)
{
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKeyFromPin(pin, salt);

    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(JSON.stringify(data));

    const encryptedData = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, dataBytes);

    return {
        version: "2.0",
        encrypted: true,
        salt: Array.from(salt),
        iv: Array.from(iv),
        data: Array.from(new Uint8Array(encryptedData)),
        timestamp: new Date().toISOString(),
    };
}

export async function decryptAnalysisData(encryptedStructure, pin)
{
    const salt = new Uint8Array(encryptedStructure.salt);
    const iv = new Uint8Array(encryptedStructure.iv);
    const encryptedData = new Uint8Array(encryptedStructure.data);

    const key = await deriveKeyFromPin(pin, salt);
    const decryptedBytes = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encryptedData);

    const decoder = new TextDecoder();

    return JSON.parse(decoder.decode(decryptedBytes));
}

export function isEncryptedFile(fileData)
{
    return fileData.version === "2.0" && fileData.encrypted === true;
}