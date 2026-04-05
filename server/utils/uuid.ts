import crypto from "crypto";

/**
 * UUID class that wraps a Uint8Array for type-safe UUID handling
 * Prevents accidental concatenation and ensures consistent binary representation
 */
export class UUID
{
    private readonly bytes: Uint8Array;

    private constructor(bytes: Uint8Array) {
        if (bytes.length !== 16) 
        {
            throw new Error(`Invalid UUID bytes: expected 16 bytes, got ${bytes.length}`);
        }
        this.bytes = bytes;
    }

    /** Used in coercion, returns toString() */
    valueOf() {
        return this.toString();
    }

    /** Get the raw bytes of the UUID */
    getBytes(): Uint8Array 
    {
        return this.bytes;
    }

    /** Convert UUID to standard string format (XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX) */
    toString(): string {
        const hex = this.toHex();

        return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
    }

    /** Convert UUID to hex string without hyphens */
    toHex(): string {
        return Array.from(this.bytes)
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");
    }

    /** Convert UUID to a plain array for JSON serialization
     *  This is useful for storing in session cookies */
    toArray(): number[] {
        return Array.from(this.bytes);
    }

    /**
     * Compare two UUIDs for equality
     */
    equals(other: UUID): boolean {
        if (this.bytes.length !== other.bytes.length) {
            return false;
        }
        return this.bytes.every((value, index) => value === other.bytes[index]);
    }

    /** Create a copy of this UUID */
    clone(): UUID {
        return new UUID(new Uint8Array(this.bytes));
    }

    /** Clones the inner byte array into a new Uint8Array reference */
    cloneBytes() : Uint8Array {
        return new Uint8Array(this.bytes);
    }

    /** Creates a new UUIDv4 that asserts universal uniqueness */
    public static create() : UUID {
        const buffer = Buffer.alloc(16);
        crypto.randomFillSync(buffer);
        return new UUID(new Uint8Array(buffer));
    }

    /** Create a new UUIDv7 that asserts universal uniqueness, while remaining suitable for indexing */
    public static createV7() : UUID {
        const timestamp = Date.now();
        const randomBytes = crypto.randomBytes(10);

        // Create buffer for the UUID
        const buffer = Buffer.alloc(16);

        // Set timestamp (first 6 bytes)
        buffer.writeUIntBE(timestamp, 0, 6);

        // Set random data for remaining bytes
        randomBytes.copy(buffer, 6);

        // Set version (4 bits): 7
        buffer[6] = (buffer[6] & 0x0f) | 0x70;

        // Set variant (2 bits): 10
        buffer[8] = (buffer[8] & 0x3f) | 0x80;

        // Return as Uint8Array
        return new UUID(new Uint8Array(buffer));
    }

    /** Parse a UUID from string format
     *  Accepts both hyphenated (XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX) and hex (XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX) formats */
    public static parse(uuid: string): UUID {
        // Remove hyphens if present
        const hex = uuid.replace(/-/g, "");
        
        // Validate hex string length (should be 32 characters for 16 bytes)
        if (hex.length !== 32) {
            throw new Error(`Invalid UUID format: expected 32 hex characters, got ${hex.length}`);
        }
        
        // Validate hex string contains only valid hex characters
        if (!/^[0-9a-fA-F]{32}$/.test(hex)) {
            throw new Error("Invalid UUID format: contains non-hexadecimal characters");
        }
        
        // Convert hex string to bytes
        const bytes = new Uint8Array(16);
        for (let i = 0; i < 16; i++) {
            bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
        }
        
        return new UUID(bytes);
    }

    /** Create UUID from Uint8Arrays and Buffers */
    public static fromBytes(input: Uint8Array | Buffer): UUID {
        let bytes: Uint8Array;
        
        if (input instanceof Uint8Array) {
            bytes = input;
        } else if (Buffer.isBuffer(input)) {
            bytes = new Uint8Array(input);
        } else if (Array.isArray(input)) {
            bytes = Uint8Array.from(input);
        } else {
            throw new Error("Invalid input type for UUID.fromBytes");
        }
        
        return new UUID(bytes);
    }

    /** Create UUID from a plain array (from JSON deserialization) */
    public static fromArray(arr: number[]): UUID {
        if (arr.length !== 16) {
            throw new Error(`Invalid UUID array: expected 16 elements, got ${arr.length}`);
        }
        return new UUID(Uint8Array.from(arr));
    }
}