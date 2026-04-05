import { sqliteTable, text, integer, index, uniqueIndex, blob, foreignKey } from "drizzle-orm/sqlite-core";
import { UUID } from "../../utils/uuid";

export const accounts = sqliteTable("accounts", {
    queryId: blob("query_id", { mode: "buffer" }).primaryKey().$default(() => UUID.createV7().getBytes()).$type<UUID>(),
    accountHash: blob("account_hash", { mode: "buffer" }).notNull().unique(),
    hashVersion: integer("hash_version").notNull().default(1),
    pinHash: text("pin_hash"),
    isAdmin: integer("is_admin", { mode: "boolean" }).notNull().default(false),
    referrer: blob("referrer", { mode: "buffer" }),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$default(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }),
    lastAccessed: integer("last_accessed", { mode: "timestamp" }).notNull().$default(() => new Date()),
}, (table) => ({
    accountHashIdx: uniqueIndex("accounts_accountHash_idx").on(table.accountHash),
    lastAccessedIdx: index("accounts_lastAccessed_idx").on(table.lastAccessed),
    referrerIdx: index("accounts_referrer_idx").on(table.referrer),
    referrerFk: foreignKey({
        columns: [table.referrer],
        foreignColumns: [table.queryId],
        name: "fk_accounts_queryId_referrer"
    }),
}));
