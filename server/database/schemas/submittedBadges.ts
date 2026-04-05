import { sqliteTable, blob, text, integer, index, foreignKey } from "drizzle-orm/sqlite-core";

import { UUID } from "../../utils/uuid";
import { accounts } from "./accounts";
import { badges } from "./badges";

export const submittedBadges = sqliteTable("submitted_badges", {
    submissionId: blob("submission_id", { mode: "buffer" }).primaryKey().$default(() => UUID.createV7().getBytes()).$type<UUID>(),
    badgeId: blob("badge_id", { mode: "buffer" }).notNull().$type<UUID>(),
    submitterQueryId: blob("submitter_query_id", { mode: "buffer" }).notNull().$type<UUID>(),
    reviewerQueryId: blob("reviewer_query_id", { mode: "buffer" }).$type<UUID>(),
    status: text("status", { enum: ["pending", "approved", "denied"] }).notNull().default("pending"),
    submittedAt: integer("submitted_at", { mode: "timestamp" }).notNull().$default(() => new Date()),
    reviewedAt: integer("reviewed_at", { mode: "timestamp" }),
}, (table) => ({
    badgeIdFk: foreignKey({
        columns: [table.badgeId],
        foreignColumns: [badges.badgeId],
        name: "fk_submitted_badges_badgeId",
    }).onDelete("cascade"),
    submitterQueryIdFk: foreignKey({
        columns: [table.submitterQueryId],
        foreignColumns: [accounts.queryId],
        name: "fk_submitted_badges_submitterQueryId",
    }).onDelete("cascade"),
    reviewerQueryIdFk: foreignKey({
        columns: [table.reviewerQueryId],
        foreignColumns: [accounts.queryId],
        name: "fk_submitted_badges_reviewerQueryId",
    }).onDelete("set null"),
    badgeIdIdx: index("submitted_badges_badge_id_idx").on(table.badgeId),
    submitterQueryIdIdx: index("submitted_badges_submitter_query_id_idx").on(table.submitterQueryId),
    statusIdx: index("submitted_badges_status_idx").on(table.status),
    submittedAtIdx: index("submitted_badges_submitted_at_idx").on(table.submittedAt),
}));

export type SubmittedBadge = typeof submittedBadges.$inferSelect;
export type InsertSubmittedBadge = typeof submittedBadges.$inferInsert;
export type SubmissionId = UUID;
export type SubmissionStatus = "pending" | "approved" | "denied";
