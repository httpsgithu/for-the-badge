import { sqliteTable, blob, text, integer, index, foreignKey } from "drizzle-orm/sqlite-core";

import { UUID } from "../../utils/uuid";
import { accounts } from "./accounts";

export const badges = sqliteTable("badges", {
    badgeId: blob("badge_id", { mode: "buffer" }).primaryKey().$default(() => UUID.createV7().getBytes()).$type<UUID>(),
    queryId: blob("query_id", { mode: "buffer" }).notNull(),
    nameEncrypted: text("name_encrypted").notNull(),
    descriptionEncrypted: text("description_encrypted"),
    svgEncrypted: text("svg_encrypted").notNull(),
    metadataEncrypted: text("metadata_encrypted"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$default(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$default(() => new Date()),
}, (table) => ({
    queryIdFk: foreignKey({
        columns: [table.queryId],
        foreignColumns: [accounts.queryId],
        name: "fk_badges_queryId",
    }).onDelete("cascade"),
    queryIdIdx: index("badges_query_id_idx").on(table.queryId),
    createdAtIdx: index("badges_created_at_idx").on(table.createdAt),
}));

export type Badge = typeof badges.$inferSelect;
export type InsertBadge = typeof badges.$inferInsert;
export type BadgeId = UUID;