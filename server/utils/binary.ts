/**
 * Binary data handling utilities for consistent database operations
 */

/**
 * Supported binary data input types
 */
export type BinaryInput = string | Uint8Array | Buffer | Array;

/**
 * Converts various binary input types to Uint8Array for consistent database operations
 * @param input - Binary data in various formats
 * @param encoding - Encoding to use for string inputs (default: 'utf8')
 * @returns Standardized Uint8Array
 */
export function toBinaryArray(input : BinaryInput, encoding : BufferEncoding = "utf8") : Uint8Array
{
    if (typeof input === "string")
    {
        return new Uint8Array(Buffer.from(input, encoding));
    }
    else if (input instanceof Buffer)
    {
        return new Uint8Array(input);
    }
    else if (input instanceof Uint8Array)
    {
        return input;
    }
    else if (input instanceof Array)
    {
        return Uint8Array.from(input);
    }
    else
    {
        throw new Error("Invalid binary input type");
    }
}

/**
 * Converts binary data to string representation
 * @param input - Binary data
 * @param encoding - Encoding to use for conversion (default: 'utf8')
 * @returns String representation
 */
export function binaryToString(input : BinaryInput, encoding : BufferEncoding = "utf8") : string
{
    if (typeof input === "string")
    {
        return input;
    }
    else if (input instanceof Buffer)
    {
        return input.toString(encoding);
    }
    else if (input instanceof Uint8Array)
    {
        return Buffer.from(input).toString(encoding);
    }
    else
    {
        throw new Error("Invalid binary input type");
    }
}

/**
 * Validates binary data input
 * @param input - Binary data to validate
 * @returns true if valid, false otherwise
 */
export function isValidBinary(input : any) : input is BinaryInput
{
    return typeof input === "string"
        || input instanceof Buffer
        || input instanceof Uint8Array;
}

/**
 * Safely converts binary input with error handling
 * @param input - Binary data input
 * @param encoding - Encoding for string conversion
 * @returns Uint8Array or null if invalid
 */
export function safeToBinaryArray(input : any, encoding : BufferEncoding = "utf8") : Uint8Array | null
{
    try
    {
        if (!isValidBinary(input))
        {
            return null;
        }

        return toBinaryArray(input, encoding);
    }
    catch
    {
        return null;
    }
}

/**
 * Compares two binary values for equality
 * @param a - First binary value
 * @param b - Second binary value
 * @returns true if equal, false otherwise
 */
export function binaryEquals(a : BinaryInput, b : BinaryInput) : boolean
{
    try
    {
        const arrayA = toBinaryArray(a);
        const arrayB = toBinaryArray(b);

        if (arrayA.length !== arrayB.length)
        {
            return false;
        }

        return arrayA.every((value, index) => value === arrayB[index]);
    }
    catch
    {
        return false;
    }
}

/**
 * Converts a UUID string to binary (16 bytes)
 * Handles both standard UUID format (with hyphens) and hex string format (without hyphens)
 * @param uuid - UUID string in format "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" or "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
 * @returns 16-byte Uint8Array representation of the UUID
 * @throws Error if UUID format is invalid
 */
export function uuidToBytes(uuid : string) : Uint8Array
{
    // Remove hyphens if present
    const hex = uuid.replace(/-/g, "");
    
    // Validate hex string length (should be 32 characters for 16 bytes)
    if (hex.length !== 32)
    {
        throw new Error(`Invalid UUID format: expected 32 hex characters, got ${hex.length}`);
    }
    
    // Validate hex string contains only valid hex characters
    if (!/^[0-9a-fA-F]{32}$/.test(hex))
    {
        throw new Error("Invalid UUID format: contains non-hexadecimal characters");
    }
    
    // Convert hex string to bytes
    const bytes = new Uint8Array(16);
    for (let i = 0; i < 16; i++)
    {
        bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    }
    
    return bytes;
}

/**
 * Converts binary UUID data to standard UUID string format
 * Handles both old UTF-8 encoded UUIDs (36 bytes) and new binary format (16 bytes)
 * @param bytes - Binary representation of UUID (16 or 36 bytes)
 * @returns UUID string in format "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
 * @throws Error if input is not 16 or 36 bytes
 */
export function bytesToUuid(bytes : BinaryInput) : string
{
    const array = toBinaryArray(bytes);
    
    // Handle old format: UTF-8 encoded UUID string (36 bytes)
    if (array.length === 36)
    {
        // Convert UTF-8 bytes back to string and validate it's a UUID
        const uuidStr = binaryToString(array);
        if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(uuidStr))
        {
            throw new Error(`Invalid UUID format in UTF-8 encoded bytes: ${uuidStr}`);
        }
        return uuidStr;
    }
    
    // Handle new format: Binary UUID (16 bytes)
    if (array.length !== 16)
    {
        throw new Error(`Invalid UUID bytes: expected 16 or 36 bytes (legacy), got ${array.length}`);
    }
    
    // Convert bytes to hex string
    const hex = Array.from(array)
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
    
    // Format as UUID with hyphens
    return [
        hex.slice(0, 8),
        hex.slice(8, 12),
        hex.slice(12, 16),
        hex.slice(16, 20),
        hex.slice(20, 32),
    ].join("-");
}
