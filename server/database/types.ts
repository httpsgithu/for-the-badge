// Database-related TypeScript types and utilities

import type { accounts, refundRequests } from "./schemas/index";

// Inferred types from schema
export type Account = typeof accounts.$inferSelect;
export type InsertAccount = typeof accounts.$inferInsert;

export type RefundRequest = typeof refundRequests.$inferSelect;
export type InsertRefundRequest = typeof refundRequests.$inferInsert;

// Common field types
export type QueryId = Account["queryId"];
export type AccountHash = Account["accountHash"];
export type RefundId = RefundRequest["refundId"];

// Status enums for potential future use
export enum RefundStatus {
    PENDING = "pending",
    APPROVED = "approved",
    DENIED = "denied",
    PROCESSED = "processed"
}

// Database utility types
export interface PaginationOptions {
    limit ?: number;
    offset ?: number;
    cursor ?: string;
}

export interface DatabaseError extends Error {
    code ?: string;
    constraint ?: string;
}