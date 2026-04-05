import { sqliteTable, text, integer, index, blob } from "drizzle-orm/sqlite-core";
import { UUID } from "../../utils/uuid";

export const feedback = sqliteTable("feedback", {
    id: blob("id", { mode: "buffer" }).primaryKey().$default(() => UUID.createV7().getBytes()).$type<UUID>(),
    message: text("message").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$default(() => new Date()),
}, (table) => ({
    createdAtIdx: index("feedback_createdAt_idx").on(table.createdAt),
}));

export type Feedback = typeof feedback.$inferSelect;
export type InsertFeedback = typeof feedback.$inferInsert;