import { sqliteTable, text, integer, index, blob } from "drizzle-orm/sqlite-core";
import { UUID } from "../../utils/uuid";
import { accounts } from "./accounts";

export const developerAwards = sqliteTable("developer_awards", {
    id: blob("id", { mode: "buffer" }).primaryKey().$default(() => UUID.createV7().getBytes()).$type<UUID>(),
    accountId: blob("account_id", { mode: "buffer" }).$type<UUID>().references(() => accounts.queryId, { onDelete: "cascade" }),
    
    // Personal Information (encrypted)
    fullName: text("full_name").notNull(), // Encrypted
    email: text("email").notNull(), // Encrypted
    age: text("age").notNull(), // Encrypted (stored as text)
    location: text("location"), // Encrypted (if provided)
    
    // Project Information (not encrypted - public starboard data)
    projectName: text("project_name").notNull(),
    projectDescription: text("project_description").notNull(),
    repositoryUrl: text("repository_url").notNull(),
    websiteUrl: text("website_url"),
    
    // Detailed responses (encrypted)
    privacyAlignment: text("privacy_alignment").notNull(), // Encrypted
    whyDeserve: text("why_deserve").notNull(), // Encrypted
    
    // Starboard
    showOnStarboard: integer("show_on_starboard", { mode: "boolean" }).notNull().default(true),
    voteCount: integer("vote_count").notNull().default(0),
    
    // System fields
    status: text("status", { enum: ["pending", "winner", "runner-up", "rejected"] }).notNull().default("pending"),
    adminNotes: text("admin_notes"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$default(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).$default(() => new Date()),
}, (table) => ({
    statusIdx: index("developer_awards_status_idx").on(table.status),
    createdAtIdx: index("developer_awards_createdAt_idx").on(table.createdAt),
    emailIdx: index("developer_awards_email_idx").on(table.email),
    accountIdx: index("developer_awards_account_idx").on(table.accountId),
}));

export type DeveloperAward = typeof developerAwards.$inferSelect;
export type InsertDeveloperAward = typeof developerAwards.$inferInsert;
