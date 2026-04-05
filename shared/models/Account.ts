import type { UUID } from "../../server/utils/uuid";

/**
 * Account model interface
 */
export interface Account {
    /** Unique query identifier for the account */
    queryId : UUID;
    /** Hash of the account identifier */
    accountHash : Uint8Array | Buffer;
    /** Version of the hash algorithm used */
    hashVersion : number;
    /** Whether the account has admin privileges */
    isAdmin : boolean;
    /** Account credit balance */
    credits : number;
    /** Number of refunds issued */
    refundCount : number;
    /** Whether PIN authentication is enabled */
    pinEnabled : boolean;
    /** UUID of the account that referred this account (nullable) */
    referrer ?: UUID | null;
    /** Whether credits have been applied to this account */
    creditsApplied : boolean;
    /** Whether promotional credits have been applied (null if no referrer) */
    promoCreditsApplied ?: boolean | null;
    /** Account creation timestamp */
    createdAt : Date;
    /** Last account update timestamp */
    updatedAt ?: Date | null;
    /** Last access timestamp */
    lastAccessed : Date;
}

/**
 * Frontend Account model interface
 */
export interface SessionAccount {
    /** Cleartext account ID for frontend display (optional - only included when user is authenticated) */
    id ?: string;
    /** Account credit balance */
    credits : number;
    /** Number of refunds issued */
    refundCount : number;
    /** Whether PIN authentication is enabled */
    pinEnabled : boolean;
    /** Whether credits have been applied to this account */
    creditsApplied : boolean;
    /** Account creation timestamp */
    createdAt : Date;
    /** Last access timestamp */
    lastAccessed : Date;
    /** Whether the account has admin privileges. Will be omitted if the account is not an admin */
    isAdmin ?: boolean;
}

/**
 * Partial account data for creation
 */
export interface CreateAccountData {
    accountHash : Uint8Array | Buffer;
    hashVersion ?: number;
    isAdmin ?: boolean;
    pin ?: string;
    referrer ?: UUID | null;
}

/**
 * Account update data
 */
export interface UpdateAccountData {
    credits ?: number;
    refundCount ?: number;
    isAdmin ?: boolean;
    lastAccessed ?: Date;
    pin ?: string | null;
    creditsApplied ?: boolean;
    promoCreditsApplied ?: boolean | null;
}
