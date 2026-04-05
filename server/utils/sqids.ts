/**
 * Sqids utilities for encoding/decoding UUID bytes to referral IDs
 * Uses custom shuffled alphabet and 24-character minimum length
 */

import Sqids from "sqids";
import { UUID } from "./uuid";

let sqids: Sqids | null = null;

/**
 * Initialize Sqids instance with environment configuration
 * @throws Error if REFERRAL_SQIDS_ALPHABET is not configured
 */
function getSqids(): Sqids {
    if (!sqids) {
        const alphabet = process.env.REFERRAL_SQIDS_ALPHABET;
        if (!alphabet) {
            throw new Error("REFERRAL_SQIDS_ALPHABET environment variable is required");
        }
        
        sqids = new Sqids({
            alphabet,
            minLength: 24
        });
    }
    return sqids;
}

/**
 * Encodes a UUID to a Sqids string
 * @param uuid - UUID object
 * @returns Encoded Sqids string
 */
export function encodeUuid(uuid: UUID): string {
    const sqidsInstance = getSqids();
    const bytes = uuid.getBytes();
    
    if (bytes.length !== 16) {
        throw new Error("UUID must be exactly 16 bytes");
    }
    
    // Convert UInt8Array to number array for Sqids
    const numbers = Array.from(bytes);
    return sqidsInstance.encode(numbers);
}

/**
 * Decodes a Sqids string back to UUID
 * @param sqid - Sqids encoded string
 * @returns UUID object
 * @throws Error if sqid is invalid or doesn't decode to 16 bytes
 */
export function decodeUuid(sqid: string): UUID {
    const sqidsInstance = getSqids();
    const numbers = sqidsInstance.decode(sqid);
    
    if (numbers.length !== 16) {
        throw new Error("Invalid Encoded ID: must decode to 16 bytes");
    }
    
    // Validate that all numbers are valid bytes (0-255)
    for (const num of numbers) {
        if (num < 0 || num > 255 || !Number.isInteger(num)) {
            throw new Error("Invalid Encoded ID: contains invalid byte values");
        }
    }
    
    return UUID.fromArray(numbers);
}

/**
 * Validates that a Sqids string is canonical (re-encoding produces the same string)
 * @param sqid - Sqids encoded string to validate
 * @returns true if canonical, false otherwise
 */
export function isEncodedIdCanonical(sqid: string): boolean {
    try {
        const decoded = decodeUuid(sqid);
        const reEncoded = encodeUuid(decoded);
        return sqid === reEncoded;
    } catch {
        return false;
    }
}

/**
 * Validates and decodes a referral ID, ensuring it's canonical
 * @param sqid - Sqids encoded string
 * @returns UUID object if valid and canonical
 * @throws Error with "Invalid Referral Id" message if invalid or non-canonical
 */
export function validateAndDecodeSqid(sqid: string): UUID {
    if (!isEncodedIdCanonical(sqid)) {
        throw new Error("Invalid Encoded Id");
    }
    
    try {
        return decodeUuid(sqid);
    } catch {
        throw new Error("Invalid Encoded Id");
    }
}

/**
 * Test function to verify Sqids configuration is working
 * @returns true if configuration is valid
 */
export function testSquidsConfiguration(): boolean {
    try {
        const testUuid = UUID.fromArray([
            0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0,
            0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88
        ]);
        
        const encoded = encodeUuid(testUuid);
        const decoded = decodeUuid(encoded);
        const isCanonical = isEncodedIdCanonical(encoded);
        
        // Verify roundtrip works and result is canonical
        return encoded.length >= 24 && 
               decoded.equals(testUuid) &&
               isCanonical;
    } catch {
        return false;
    }
}