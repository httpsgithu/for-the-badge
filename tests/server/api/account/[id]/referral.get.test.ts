import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockEvent, mockAccount } from "../../../../utils/mocks";
import referralHandler from "../../../../../server/api/account/[id]/referral.get";

// Mock dependencies
vi.mock("../../../../../server/utils/auth", () => ({
    requireAuth: vi.fn()
}));

vi.mock("../../../../../server/utils/problem", () => ({
    createProblem: vi.fn((event, status, message, detail) => ({ error: status, message, detail }))
}));

vi.mock("../../../../../server/utils/sqids", () => ({
    encodeUuid: vi.fn()
}));

// No need to mock binary utils anymore since we're not using uuidToBytes

// Mock Nuxt functions
global.getRouterParam = vi.fn();

describe("server/api/account/[id]/referral.get", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.REFERRAL_SQIDS_ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    });

    it("should return referral URL for user with credits applied", async () => {
        const event = mockEvent();
        const account = mockAccount({ 
            queryId: "test-user-id", 
            creditsApplied: true 
        });
        
        const testQueryId = new Uint8Array([1, 2, 3, 4]);
        
        const { requireAuth } = await import("../../../../../server/utils/auth");
        const { encodeUuid } = await import("../../../../../server/utils/sqids");
        
        vi.mocked(requireAuth).mockReturnValueOnce({
            isAuthenticated: true,
            isVerified: true,
            isAdmin: false,
            queryId: testQueryId,
            account: account
        });
        
        vi.mocked(encodeUuid).mockReturnValueOnce("mock-encoded-sqid-123456789012345");
        
        const result = await referralHandler(event);
        
        expect(result).toEqual({
            url: "/?referrer=mock-encoded-sqid-123456789012345"
        });
        expect(encodeUuid).toHaveBeenCalledWith(testQueryId);
    });

    it("should return null URL for user without credits applied", async () => {
        const event = mockEvent();
        const account = mockAccount({ 
            queryId: "test-user-id", 
            creditsApplied: false 
        });
        
        const testQueryId = new Uint8Array([1, 2, 3, 4]);
        
        const { requireAuth } = await import("../../../../../server/utils/auth");
        
        vi.mocked(requireAuth).mockReturnValueOnce({
            isAuthenticated: true,
            isVerified: true,
            isAdmin: false,
            queryId: testQueryId,
            account: account
        });
        
        const result = await referralHandler(event);
        
        expect(result).toEqual({
            url: null,
            reason: "Add credits to unlock referrals"
        });
    });

    it("should return error for auth failures", async () => {
        const event = mockEvent();
        const { requireAuth } = await import("../../../../../server/utils/auth");
        
        const authError = { statusCode: 401, message: "Authentication required" };
        vi.mocked(requireAuth).mockImplementationOnce(() => {
            throw authError;
        });
        
        const result = await referralHandler(event);
        
        expect(result).toEqual(authError);
    });

    // UUID conversion test is no longer needed since queryId is already a Uint8Array

    it("should handle authentication errors", async () => {
        const event = mockEvent();
        const { requireAuth } = await import("../../../../../server/utils/auth");
        
        const authError = { statusCode: 401, message: "Authentication required" };
        vi.mocked(requireAuth).mockImplementationOnce(() => {
            throw authError;
        });
        
        const result = await referralHandler(event);
        
        expect(result).toEqual(authError);
    });

    it("should handle encoding errors gracefully", async () => {
        const event = mockEvent();
        const account = mockAccount({ 
            queryId: "test-user-id", 
            creditsApplied: true 
        });
        
        const testQueryId = new Uint8Array([1, 2, 3, 4]);
        
        const { requireAuth } = await import("../../../../../server/utils/auth");
        const { encodeUuid } = await import("../../../../../server/utils/sqids");
        const { createProblem } = await import("../../../../../server/utils/problem");
        
        vi.mocked(requireAuth).mockReturnValueOnce({
            isAuthenticated: true,
            isVerified: true,
            isAdmin: false,
            queryId: testQueryId,
            account: account
        });
        
        vi.mocked(encodeUuid).mockImplementationOnce(() => {
            throw new Error("Encoding failed");
        });
        
        const result = await referralHandler(event);
        
        expect(createProblem).toHaveBeenCalledWith(event, 500, "Internal Server Error", "Failed to generate referral URL");
        expect(result).toEqual({ error: 500, message: "Internal Server Error", detail: "Failed to generate referral URL" });
    });

    it("should handle undefined credits applied as falsy", async () => {
        const event = mockEvent();
        const account = mockAccount({ 
            queryId: "test-user-id"
            // creditsApplied is undefined by default in mockAccount
        });
        
        const testQueryId = new Uint8Array([1, 2, 3, 4]);
        
        const { requireAuth } = await import("../../../../../server/utils/auth");
        
        vi.mocked(requireAuth).mockReturnValueOnce({
            isAuthenticated: true,
            isVerified: true,
            isAdmin: false,
            queryId: testQueryId,
            account: account
        });
        
        const result = await referralHandler(event);
        
        expect(result).toEqual({
            url: null,
            reason: "Add credits to unlock referrals"
        });
    });

    it("should generate URL for admin users with credits applied", async () => {
        const event = mockEvent();
        const account = mockAccount({ 
            queryId: "admin-user-id", 
            creditsApplied: true,
            isAdmin: true
        });
        
        const testQueryId = new Uint8Array([5, 6, 7, 8]);
        
        const { requireAuth } = await import("../../../../../server/utils/auth");
        const { encodeUuid } = await import("../../../../../server/utils/sqids");
        
        vi.mocked(requireAuth).mockReturnValueOnce({
            isAuthenticated: true,
            isVerified: true,
            isAdmin: true,
            queryId: testQueryId,
            account: account
        });
        
        vi.mocked(encodeUuid).mockReturnValueOnce("admin-encoded-sqid-123456789012345");
        
        const result = await referralHandler(event);
        
        expect(result).toEqual({
            url: "/?referrer=admin-encoded-sqid-123456789012345"
        });
    });
});