import { uniqueIndex } from 'drizzle-orm/sqlite-core';
import { hash, verify, generateAccountHash, verifyAccountHash, verifyWithPepperFallback, isPasswordPepperConfigured } from "./crypto";
import { useDrizzle, tables, eq, gt, gte, lt, and, sql } from "./drizzle";
import { UUID } from "./uuid";
import { decodeUuid, encodeUuid } from "./sqids";
import type { Account, CreateAccountData, UpdateAccountData } from "../../shared/models/Account";
import type { Maybe } from "../../shared/types/Nullability";
import type { PageRequest, PagedResponse } from "../../shared/types/Paging/Page";

let db: ReturnType<typeof useDrizzle>;

function getDb() {
    if (!db) {
        try {
            db = useDrizzle();
        }
        catch {
            throw new Error("Database connection failed");
        }
    }

    return db;
}

export async function getAccountByHash(accountHash: Uint8Array): Promise<Maybe<Account>> {
    const database = getDb();
    
    const result = await database.select().from(tables.accounts)
        .where(eq(tables.accounts.accountHash, new Uint8Array(accountHash)))
        .limit(1)
        .get();
        
    if (!result) {
        return null;
    }

    return {
        queryId: UUID.fromBytes(result.queryId),
        accountHash: new Uint8Array(result.accountHash),
        hashVersion: result.hashVersion ?? 1,
        isAdmin: !!result.isAdmin,
        credits: result.credits ?? 0,
        refundCount: result.refundCount ?? 0,
        pinEnabled: !!result.pinHash,
        referrer: result.referrer ? UUID.fromBytes(result.referrer) : null,
        creditsApplied: !!result.creditsApplied,
        promoCreditsApplied: result.promoCreditsApplied !== null ? !!result.promoCreditsApplied : null,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        lastAccessed: result.lastAccessed,
    };
}

export async function getAccountByQueryId(queryId: UUID): Promise<Account | null> {
    const database = getDb();
    // Get raw bytes from UUID for database query
    const queryIdBuffer = queryId.cloneBytes();

    // Use direct query instead of prepared statement to avoid connection leaks in Cloudflare Workers
    const result = await database.select().from(tables.accounts)
        .where(eq(tables.accounts.queryId, queryIdBuffer))
        .limit(1)
        .get();
    if (!result) {
        return result;
    }

    return {
        queryId: UUID.fromBytes(result.queryId),
        accountHash: new Uint8Array(result.accountHash),
        hashVersion: result.hashVersion ?? 1,
        isAdmin: !!result.isAdmin,
        credits: result.credits ?? 0,
        refundCount: result.refundCount ?? 0,
        pinEnabled: !!result.pinHash,
        referrer: result.referrer ? UUID.fromBytes(result.referrer) : null,
        creditsApplied: !!result.creditsApplied,
        promoCreditsApplied: result.promoCreditsApplied !== null ? !!result.promoCreditsApplied : null,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        lastAccessed: result.lastAccessed,
    };
}

export function findAccountByUserId(userId: string): Promise<Maybe<Account>> {
    const userHash = generateAccountHash(userId, 1);
    
    return getAccountByHash(userHash);
}

export type VerifyAndMigratePinResult = {
    valid: boolean;
    migrated: boolean;
    missingPin: boolean;
};

export async function getAccountPinHash(queryId: UUID): Promise<string | null>
{
    const database = getDb();
    const queryIdBuffer = queryId.cloneBytes();

    const row = await database.select({ pinHash: tables.accounts.pinHash })
        .from(tables.accounts)
        .where(eq(tables.accounts.queryId, queryIdBuffer))
        .limit(1)
        .get();

    return row?.pinHash ?? null;
}

/**
 * Verifies an account PIN against the stored hash and performs an automatic migration
 * from the legacy empty-pepper scheme to the configured PASSWORD_PEPPER scheme.
 */
export async function verifyAndMigratePin(
    queryId: UUID,
    pin: string,
    opts: { pinHash?: string | null } = {},
): Promise<VerifyAndMigratePinResult>
{
    const database = getDb();
    const queryIdBuffer = queryId.cloneBytes();

    const storedHash = opts.pinHash ?? (await database.select({ pinHash: tables.accounts.pinHash })
        .from(tables.accounts)
        .where(eq(tables.accounts.queryId, queryIdBuffer))
        .limit(1)
        .get())?.pinHash;

    if (!storedHash)
    {
        return { valid: false, migrated: false, missingPin: true };
    }

    const { isValid, usedLegacyPepper } = await verifyWithPepperFallback(pin, storedHash);

    if (!isValid)
    {
        return { valid: false, migrated: false, missingPin: false };
    }

    if (!usedLegacyPepper)
    {
        return { valid: true, migrated: false, missingPin: false };
    }

    // Legacy pepper matched. If we don't have a configured pepper, there's nothing to migrate to.
    if (!isPasswordPepperConfigured())
    {
        return { valid: true, migrated: false, missingPin: false };
    }

    // Migrate: re-hash with active pepper and persist.
    const migratedHash = await hash(pin);

    // Confirm the new hash verifies with the active pepper.
    if (!await verify(pin, migratedHash))
    {
        throw new Error("PIN migration failed: rehashed PIN did not verify");
    }

    await database.update(tables.accounts)
        .set({ pinHash: migratedHash, updatedAt: new Date() })
        .where(eq(tables.accounts.queryId, queryIdBuffer));

    // Confirm the stored hash verifies after persistence.
    const persistedHash = (await database.select({ pinHash: tables.accounts.pinHash })
        .from(tables.accounts)
        .where(eq(tables.accounts.queryId, queryIdBuffer))
        .limit(1)
        .get())?.pinHash;

    if (!persistedHash)
    {
        throw new Error("PIN migration failed: pinHash missing after update");
    }

    if (!await verify(pin, persistedHash))
    {
        throw new Error("PIN migration failed: persisted pinHash did not verify");
    }

    return { valid: true, migrated: true, missingPin: false };
}

/**
 * Gets only the credits for a specific account (lightweight query)
 * @param queryId - The account's queryId
 * @returns The current credits count or null if account not found
 */
export async function getAccountCredits(queryId: UUID): Promise<number | null> {
    const database = getDb();
    // Get raw bytes from UUID for database query
    const queryIdBuffer = queryId.getBytes();

    const result = await database.select({ credits: tables.accounts.credits })
        .from(tables.accounts)
        .where(eq(tables.accounts.queryId, queryIdBuffer))
        .limit(1)
        .get();
    if (!result) {
        return null;
    }

    return result.credits ?? 0;
}

export async function createAccount(accountData: CreateAccountData): Promise<Account | null> {
    const database = getDb();
    const hashVersion = accountData.hashVersion || 1;

    // Convert accountHash to Uint8Array for database
    const accountHashBuffer = accountData.accountHash instanceof Uint8Array ? accountData.accountHash : new Uint8Array(accountData.accountHash);

    const values: any = {
        accountHash: accountHashBuffer,
        hashVersion: hashVersion,
        isAdmin: !!accountData.isAdmin,
    };

    if (accountData.pin) {
        values.pinHash = await hash(accountData.pin);
    }

    if (accountData.referrer) {
        // Get raw bytes from UUID for database
        values.referrer = accountData.referrer.getBytes();
        values.promoCreditsApplied = false; // Initialize to false for referred accounts
    }

    let account;
    try {
        // Use direct query instead of prepared statement to avoid connection leaks in Cloudflare Workers
        const result = await database.insert(tables.accounts)
            .values({
                accountHash: values.accountHash,
                hashVersion: values.hashVersion,
                isAdmin: values.isAdmin,
                pinHash: values.pinHash,
                referrer: values.referrer,
                promoCreditsApplied: values.promoCreditsApplied,
                creditsApplied: false, // Explicitly set to false for new accounts
                credits: 2, // Give all new accounts 2 free credits to get started
            })
            .returning()
            .get();

        if (!result) {
            return null;
        }

        // Transform to proper Account object format
        account = {
            queryId: UUID.fromBytes(result.queryId),
            accountHash: new Uint8Array(result.accountHash),
            hashVersion: result.hashVersion ?? 1,
            isAdmin: !!result.isAdmin,
            credits: result.credits ?? 0,
            refundCount: result.refundCount ?? 0,
            pinEnabled: !!result.pinHash,
            referrer: result.referrer ? UUID.fromBytes(result.referrer) : null,
            creditsApplied: !!result.creditsApplied,
            promoCreditsApplied: result.promoCreditsApplied !== null ? !!result.promoCreditsApplied : null,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
            lastAccessed: result.lastAccessed,
        };
    }
    catch (error) {
        throw error;
    }

    return account;
}

export async function updateAccount(queryId: UUID, updates: UpdateAccountData): Promise<void> {
    const database = getDb();
    // Get raw bytes from UUID for database query
    const queryIdBuffer = queryId.cloneBytes();
    const updateData: any = { updatedAt: new Date() };

    let dirty = false;
    if (updates.credits !== undefined)
    {
        updateData.credits = updates.credits;
        dirty = true;
    }
    if (updates.refundCount !== undefined) {
        updateData.refundCount = updates.refundCount;
        dirty = true;
    }
    if (updates.isAdmin !== undefined) {
        updateData.isAdmin = !!updates.isAdmin;
        dirty = true;
    }
    if (updates.lastAccessed !== undefined) {
        updateData.lastAccessed = updates.lastAccessed;
        dirty = true;
    }
    if (updates.pin !== undefined) {
        updateData.pinHash = updates.pin ? await hash(updates.pin) : null;
        dirty = true;
    }
    if (updates.creditsApplied !== undefined) {
        updateData.creditsApplied = !!updates.creditsApplied;
        dirty = true;
    }
    if (updates.promoCreditsApplied !== undefined) {
        updateData.promoCreditsApplied = updates.promoCreditsApplied !== null ? !!updates.promoCreditsApplied : null;
        dirty = true;
    }

    if (!dirty)
    {
        return;
    }

    // Use direct query instead of prepared statement to avoid connection leaks in Cloudflare Workers
    await database.update(tables.accounts)
        .set(updateData)
        .where(eq(tables.accounts.queryId, queryIdBuffer));
}

export async function deleteAccount(queryId : UUID) : Promise<void>
{
    const database = getDb();
    // Get raw bytes from UUID for database query
    const queryIdBuffer = queryId.getBytes();

    // Use direct query instead of prepared statement to avoid connection leaks in Cloudflare Workers
    await database.delete(tables.accounts)
        .where(eq(tables.accounts.queryId, queryIdBuffer));
}

interface AdminAccountStats {
    totalUsers: number;
    adminUsers: number;
    pinEnabledUsers: number;
    activeUsersLast7Days: number;
    newUsersLast7Days: number;
    newUsersPrevious7Days: number;
}

interface AdminAccountsPageRequest extends PageRequest {
    includeStats?: boolean;
}

interface AdminAccountsPageResponse<T> extends PagedResponse<T> {
    stats?: AdminAccountStats;
}

export async function getAllAccounts(pageRequest: AdminAccountsPageRequest = { perPage: 50 }): Promise<AdminAccountsPageResponse<any>> {
    const database = getDb();
    const { cursor, perPage = 50, includeStats = true } = pageRequest;

    // Cursor is an encoded UUID string (sqids). Decode to bytes for DB pagination.
    const cursorBytes = cursor ? decodeUuid(cursor).getBytes() : undefined;

    // Build query conditionally to avoid type conflicts with single await
    const results = await (cursorBytes
        ? database.select().from(tables.accounts)
            .where(gt(tables.accounts.queryId, cursorBytes))
            .orderBy(tables.accounts.queryId)
            .limit(perPage + 1)
        : database.select().from(tables.accounts)
            .orderBy(tables.accounts.queryId)
            .limit(perPage + 1));

    const hasNext = results.length >= perPage + 1;
    const data = hasNext ? results.slice(0, -1) : results;

    const response: AdminAccountsPageResponse<any> = {
        perPage,
        data: data.map((row) => ({
            // Use account hash as the display ID (hex)
            id: Buffer.from(row.accountHash).toString("hex"),
            isAdmin: !!row.isAdmin,
            credits: row.credits ?? 0,
            refundCount: row.refundCount ?? 0,
            pinEnabled: !!row.pinHash,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            lastAccessed: row.lastAccessed,
        })),
    };

    if (cursor) {
        response.current = cursor;
    }

    if (hasNext && data.length > 0) {
        response.next = encodeUuid(UUID.fromBytes(data[data.length - 1].queryId));
    }
    if (includeStats) {
        const now = Date.now();
        const sevenDaysAgo = new Date(now - (7 * 24 * 60 * 60 * 1000));
        const fourteenDaysAgo = new Date(now - (14 * 24 * 60 * 60 * 1000));

        const [
            totalUsersResult,
            adminUsersResult,
            pinEnabledUsersResult,
            activeUsersLast7DaysResult,
            newUsersLast7DaysResult,
            newUsersPrevious7DaysResult,
        ] = await Promise.all([
            database.select({ count: sql<number>`count(*)` }).from(tables.accounts).get(),
            database.select({ count: sql<number>`count(*)` }).from(tables.accounts).where(eq(tables.accounts.isAdmin, true)).get(),
            database.select({ count: sql<number>`count(*)` }).from(tables.accounts).where(sql`${tables.accounts.pinHash} IS NOT NULL`).get(),
            database.select({ count: sql<number>`count(*)` }).from(tables.accounts).where(gte(tables.accounts.lastAccessed, sevenDaysAgo)).get(),
            database.select({ count: sql<number>`count(*)` }).from(tables.accounts).where(gte(tables.accounts.createdAt, sevenDaysAgo)).get(),
            database.select({ count: sql<number>`count(*)` }).from(tables.accounts).where(and(gte(tables.accounts.createdAt, fourteenDaysAgo), lt(tables.accounts.createdAt, sevenDaysAgo))).get(),
        ]);

        response.stats = {
            totalUsers: Number(totalUsersResult?.count ?? 0),
            adminUsers: Number(adminUsersResult?.count ?? 0),
            pinEnabledUsers: Number(pinEnabledUsersResult?.count ?? 0),
            activeUsersLast7Days: Number(activeUsersLast7DaysResult?.count ?? 0),
            newUsersLast7Days: Number(newUsersLast7DaysResult?.count ?? 0),
            newUsersPrevious7Days: Number(newUsersPrevious7DaysResult?.count ?? 0),
        };
    }

    return response;
}
