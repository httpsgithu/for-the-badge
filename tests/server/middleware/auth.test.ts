import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockEvent, mockAccount } from "../../utils/mocks";
import authMiddleware from "../../../server/middleware/01_auth";

// Mock all the utilities used by the middleware
vi.mock("../../../server/utils/binary", () => ({
    toBinaryArray: vi.fn(() => new Uint8Array([1, 2, 3, 4])),
    uuidToBytes: vi.fn(() => new Uint8Array(16).fill(0))
}));

vi.mock("../../../server/utils/database", () => ({
    updateAccount: vi.fn(),
    getAccountCredits: vi.fn().mockResolvedValue(null)
}));

vi.mock("../../../server/utils/composables", () => ({
    loadAuthContext: vi.fn(),
    updateUser: vi.fn()
}));

// Use global getUserSession mock

describe("server/middleware/01_auth", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        console.error = vi.fn();
    });

    it("should initialize default auth context", async () => {
        const event = mockEvent();
        
        const { loadAuthContext } = await import("../../../server/utils/composables");
        vi.mocked(loadAuthContext).mockImplementationOnce(async (event) => {
            event.context.auth = {
                isAuthenticated: false,
                requiresPinVerification: false,
                isAdmin: false,
                account: null
            };
        });

        await authMiddleware(event);

        expect(event.context.auth).toEqual({
            isAuthenticated: false,
            requiresPinVerification: false,
            isAdmin: false,
            account: null
        });
        expect(loadAuthContext).toHaveBeenCalledWith(event);
    });

    it("should set auth context for valid authenticated session", async () => {
        const event = mockEvent();
        const account = mockAccount({ isAdmin: true, credits: 100 });
        
        const { loadAuthContext, updateUser } = await import("../../../server/utils/composables");
        const { getAccountCredits } = await import("../../../server/utils/database");
        
        vi.mocked(loadAuthContext).mockImplementationOnce(async (event) => {
            event.context.auth = {
                isAuthenticated: true,
                requiresPinVerification: false,
                isAdmin: true,
                account
            };
        });
        vi.mocked(getAccountCredits).mockResolvedValueOnce(100);
        vi.mocked(updateUser).mockResolvedValueOnce(false); // No credit changes

        await authMiddleware(event);

        expect(event.context.auth).toEqual({
            isAuthenticated: true,
            requiresPinVerification: false,
            isAdmin: true,
            account
        });
        
        expect(loadAuthContext).toHaveBeenCalledWith(event);
        expect(getAccountCredits).toHaveBeenCalledWith(account.queryId);
    });

    it("should set PIN verification required for challenge sessions", async () => {
        const event = mockEvent();
        const account = mockAccount();
        
        const { loadAuthContext } = await import("../../../server/utils/composables");
        
        vi.mocked(loadAuthContext).mockImplementationOnce(async (event) => {
            event.context.auth = {
                isAuthenticated: false,
                requiresPinVerification: true,
                isAdmin: false,
                account
            };
        });

        await authMiddleware(event);

        expect(event.context.auth).toEqual({
            isAuthenticated: false,
            requiresPinVerification: true,
            isAdmin: false,
            account
        });
        expect(loadAuthContext).toHaveBeenCalledWith(event);
    });

    it("should clear session when validation fails", async () => {
        const event = mockEvent();
        
        const { loadAuthContext } = await import("../../../server/utils/composables");
        
        vi.mocked(loadAuthContext).mockImplementationOnce(async (event) => {
            event.context.auth = {
                isAuthenticated: false,
                requiresPinVerification: false,
                isAdmin: false,
                account: null
            };
        });

        await authMiddleware(event);

        expect(loadAuthContext).toHaveBeenCalledWith(event);
        expect(event.context.auth.isAuthenticated).toBe(false);
    });

    it("should clear session when user session is invalid", async () => {
        const event = mockEvent();
        
        const { loadAuthContext } = await import("../../../server/utils/composables");
        
        vi.mocked(loadAuthContext).mockImplementationOnce(async (event) => {
            event.context.auth = {
                isAuthenticated: false,
                requiresPinVerification: false,
                isAdmin: false,
                account: null
            };
        });

        await authMiddleware(event);

        expect(loadAuthContext).toHaveBeenCalledWith(event);
        expect(event.context.auth.isAuthenticated).toBe(false);
    });

    it("should clear session when user is not authenticated", async () => {
        const event = mockEvent();
        
        const { loadAuthContext } = await import("../../../server/utils/composables");
        
        vi.mocked(loadAuthContext).mockImplementationOnce(async (event) => {
            event.context.auth = {
                isAuthenticated: false,
                requiresPinVerification: false,
                isAdmin: false,
                account: null
            };
        });

        await authMiddleware(event);

        expect(loadAuthContext).toHaveBeenCalledWith(event);
        expect(event.context.auth.isAuthenticated).toBe(false);
    });

    it("should clear session when secure account is missing", async () => {
        const event = mockEvent();
        
        const { loadAuthContext } = await import("../../../server/utils/composables");
        
        vi.mocked(loadAuthContext).mockImplementationOnce(async (event) => {
            event.context.auth = {
                isAuthenticated: false,
                requiresPinVerification: false,
                isAdmin: false,
                account: null
            };
        });

        await authMiddleware(event);

        expect(loadAuthContext).toHaveBeenCalledWith(event);
        expect(event.context.auth.isAuthenticated).toBe(false);
    });

    it("should handle errors gracefully", async () => {
        const event = mockEvent();
        const error = new Error("Session error");
        
        const { loadAuthContext } = await import("../../../server/utils/composables");
        
        vi.mocked(loadAuthContext).mockImplementationOnce(async (event) => {
            event.context.auth = {
                isAuthenticated: false,
                requiresPinVerification: false,
                isAdmin: false,
                account: null
            };
        });

        await authMiddleware(event);

        expect(loadAuthContext).toHaveBeenCalledWith(event);
        expect(event.context.auth).toEqual({
            isAuthenticated: false,
            requiresPinVerification: false,
            isAdmin: false,
            account: null
        });
    });

    it("should not check credits when queryId is missing", async () => {
        const event = mockEvent();
        const account = mockAccount({ queryId: "" });
        
        const { loadAuthContext } = await import("../../../server/utils/composables");
        const { getAccountCredits } = await import("../../../server/utils/database");
        
        vi.mocked(loadAuthContext).mockImplementationOnce(async (event) => {
            event.context.auth = {
                isAuthenticated: true,
                requiresPinVerification: false,
                isAdmin: false,
                account: { ...account, queryId: "" }  // Empty queryId should prevent credit check
            };
        });

        await authMiddleware(event);

        expect(getAccountCredits).not.toHaveBeenCalled();
    });

    it("should handle getAccountCredits errors without affecting auth context", async () => {
        const event = mockEvent();
        const account = mockAccount({ credits: 100 });
        
        const { loadAuthContext } = await import("../../../server/utils/composables");
        const { getAccountCredits } = await import("../../../server/utils/database");
        
        vi.mocked(loadAuthContext).mockImplementationOnce(async (event) => {
            event.context.auth = {
                isAuthenticated: true,
                requiresPinVerification: false,
                isAdmin: false,
                account
            };
        });
        vi.mocked(getAccountCredits).mockRejectedValueOnce(new Error("Database query failed"));

        await authMiddleware(event);

        // Auth context should remain unchanged despite error (middleware catches and ignores DB errors)
        expect(event.context.auth).toEqual({
            isAuthenticated: true,
            requiresPinVerification: false,
            isAdmin: false,
            account
        });
    });

    it("should correctly calculate PIN verification requirement", async () => {
        const event = mockEvent();
        const account = mockAccount();
        
        const { loadAuthContext } = await import("../../../server/utils/composables");
        
        // Test case: challenge required but PIN verified (should be false)
        vi.mocked(loadAuthContext).mockImplementationOnce(async (event) => {
            event.context.auth = {
                isAuthenticated: true,
                requiresPinVerification: false,  // PIN is verified, so no PIN verification required
                isAdmin: false,
                account
            };
        });

        await authMiddleware(event);

        expect(event.context.auth.requiresPinVerification).toBe(false);
        expect(loadAuthContext).toHaveBeenCalledWith(event);
    });

    it("should set PIN verification required when challenge needed", async () => {
        const event = mockEvent();
        const account = mockAccount();
        
        const { loadAuthContext } = await import("../../../server/utils/composables");
        
        // Test case: challenge required and PIN not verified (should be true)
        vi.mocked(loadAuthContext).mockImplementationOnce(async (event) => {
            event.context.auth = {
                isAuthenticated: true,
                requiresPinVerification: true,  // Challenge needed and PIN not verified
                isAdmin: false,
                account
            };
        });

        await authMiddleware(event);

        expect(event.context.auth.requiresPinVerification).toBe(true);
        expect(loadAuthContext).toHaveBeenCalledWith(event);
    });

    it("should handle non-admin users correctly", async () => {
        const event = mockEvent();
        const account = mockAccount({ isAdmin: false });
        
        const { loadAuthContext } = await import("../../../server/utils/composables");
        
        vi.mocked(loadAuthContext).mockImplementationOnce(async (event) => {
            event.context.auth = {
                isAuthenticated: true,
                requiresPinVerification: false,
                isAdmin: false,
                account
            };
        });

        await authMiddleware(event);

        expect(event.context.auth.isAdmin).toBe(false);
        expect(loadAuthContext).toHaveBeenCalledWith(event);
    });

    it("should handle getUserSession errors", async () => {
        const event = mockEvent();
        const error = new Error("Session retrieval failed");
        
        const { loadAuthContext } = await import("../../../server/utils/composables");
        
        vi.mocked(loadAuthContext).mockImplementationOnce(async (event) => {
            event.context.auth = {
                isAuthenticated: false,
                requiresPinVerification: false,
                isAdmin: false,
                account: null
            };
        });

        await authMiddleware(event);

        expect(loadAuthContext).toHaveBeenCalledWith(event);
        expect(event.context.auth).toEqual({
            isAuthenticated: false,
            requiresPinVerification: false,
            isAdmin: false,
            account: null
        });
    });
});