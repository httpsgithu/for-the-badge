import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockEvent, mockAccount } from "../../../utils/mocks";
import loginHandler from "../../../../server/api/account/login.post";

// Mock all the utilities used by the handler
vi.mock("../../../../server/utils/database", () => ({
    findAccountByUserId: vi.fn(),
    updateAccount: vi.fn()
}));

vi.mock("../../../../server/utils/luhn", () => ({
    isValidLuhn: vi.fn()
}));

vi.mock("../../../../server/utils/problem", () => ({
    createProblem: vi.fn((event, status, message) => ({ error: status, message }))
}));

vi.mock("../../../../server/utils/composables", () => ({
    setUser: vi.fn(),
    deleteUser: vi.fn(),
    SessionState: {
        AUTHENTICATED: "authenticated",
        PENDING_PIN: "pending_pin",
        UNAUTHENTICATED: "unauthenticated"
    }
}));

// Mock readBody function
global.readBody = vi.fn();

describe("server/api/account/login.post", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        console.info = vi.fn();
        console.debug = vi.fn();
        console.warn = vi.fn();
        console.error = vi.fn();
    });

    it("should successfully login account without PIN", async () => {
        const event = mockEvent();
        const account = mockAccount({ pinEnabled: false });
        const userId = "1234567890123456";
        
        const { findAccountByUserId, updateAccount } = await import("../../../../server/utils/database");
        const { isValidLuhn } = await import("../../../../server/utils/luhn");
        const { setUser } = await import("../../../../server/utils/composables");
        
        // Setup auth context for composable to work
        event.context = { auth: { isAuthenticated: false, requiresPinVerification: false, isAdmin: false, account: null } };
        
        vi.mocked(global.readBody).mockResolvedValueOnce({ userId });
        vi.mocked(isValidLuhn).mockReturnValueOnce(true);
        vi.mocked(findAccountByUserId).mockResolvedValueOnce(account);
        vi.mocked(updateAccount).mockResolvedValueOnce(undefined);

        const result = await loginHandler(event);

        expect(result).toEqual({ challenge: false });
        expect(setUser).toHaveBeenCalledWith(
            event,
            account,
            "authenticated",
            userId
        );
    });

    it("should return challenge for account with PIN enabled", async () => {
        const event = mockEvent();
        const account = mockAccount({ pinEnabled: true });
        const userId = "1234567890123456";
        
        const { findAccountByUserId, updateAccount } = await import("../../../../server/utils/database");
        const { isValidLuhn } = await import("../../../../server/utils/luhn");
        const { setUser } = await import("../../../../server/utils/composables");
        
        // Setup auth context for composable to work
        event.context = { auth: { isAuthenticated: false, requiresPinVerification: false, isAdmin: false, account: null } };
        
        vi.mocked(global.readBody).mockResolvedValueOnce({ userId });
        vi.mocked(isValidLuhn).mockReturnValueOnce(true);
        vi.mocked(findAccountByUserId).mockResolvedValueOnce(account);
        vi.mocked(updateAccount).mockResolvedValueOnce(undefined);

        const result = await loginHandler(event);

        expect(result).toEqual({ 
            challenge: true, 
            challengeUrl: "/api/account/login/challenge"
        });
        expect(setUser).toHaveBeenCalledWith(
            event,
            account,
            "pending_pin",
            userId
        );
    });

    it("should return error for invalid userId format", async () => {
        const event = mockEvent();
        const invalidUserId = "123"; // Too short
        
        const { createProblem } = await import("../../../../server/utils/problem");
        
        vi.mocked(global.readBody).mockResolvedValueOnce({ userId: invalidUserId });

        const result = await loginHandler(event);

        expect(createProblem).toHaveBeenCalledWith(event, 400, "Bad Request", "Invalid account ID format", null, { expectedFormat: "16-digit number with valid checksum" });
        expect(result).toEqual({ error: 400, message: "Bad Request" });
    });

    it("should return error for userId with invalid Luhn check", async () => {
        const event = mockEvent();
        const userId = "1234567890123456"; // Valid format but fails Luhn
        
        const { isValidLuhn } = await import("../../../../server/utils/luhn");
        const { createProblem } = await import("../../../../server/utils/problem");
        
        vi.mocked(global.readBody).mockResolvedValueOnce({ userId });
        vi.mocked(isValidLuhn).mockReturnValueOnce(false);

        const result = await loginHandler(event);

        expect(createProblem).toHaveBeenCalledWith(event, 400, "Bad Request", "Invalid account ID format", null, { expectedFormat: "16-digit number with valid checksum" });
        expect(result).toEqual({ error: 400, message: "Bad Request" });
    });

    it("should return error for missing userId", async () => {
        const event = mockEvent();
        
        const { createProblem } = await import("../../../../server/utils/problem");
        
        vi.mocked(global.readBody).mockResolvedValueOnce({});

        const result = await loginHandler(event);

        expect(createProblem).toHaveBeenCalledWith(event, 400, "Bad Request", "Invalid account ID format", null, { expectedFormat: "16-digit number with valid checksum" });
        expect(result).toEqual({ error: 400, message: "Bad Request" });
    });

    it("should return error for non-existent account", async () => {
        const event = mockEvent();
        const userId = "1234567890123456";
        
        const { findAccountByUserId } = await import("../../../../server/utils/database");
        const { isValidLuhn } = await import("../../../../server/utils/luhn");
        const { createProblem } = await import("../../../../server/utils/problem");
        
        vi.mocked(global.readBody).mockResolvedValueOnce({ userId });
        vi.mocked(isValidLuhn).mockReturnValueOnce(true);
        vi.mocked(findAccountByUserId).mockResolvedValueOnce(null);

        const result = await loginHandler(event);

        expect(createProblem).toHaveBeenCalledWith(event, 401, "Unauthorized");
        expect(result).toEqual({ error: 401, message: "Unauthorized" });
    });

    it("should validate userId format correctly", async () => {
        const event = mockEvent();
        
        const { createProblem } = await import("../../../../server/utils/problem");
        
        // Test various invalid formats
        const invalidUserIds = [
            "12345678901234567", // Too long
            "123456789012345",   // Too short
            "123456789012345a",  // Contains letter
            "123456789012345 ",  // Contains space
            "",                  // Empty
            null,                // Null
            undefined            // Undefined
        ];

        for (const invalidId of invalidUserIds) {
            vi.clearAllMocks();
            vi.mocked(global.readBody).mockResolvedValueOnce({ userId: invalidId });
            
            const result = await loginHandler(event);
            
            expect(createProblem).toHaveBeenCalledWith(event, 400, "Bad Request", "Invalid account ID format", null, { expectedFormat: "16-digit number with valid checksum" });
            expect(result).toEqual({ error: 400, message: "Bad Request" });
        }
    });




    it("should handle errors gracefully", async () => {
        const event = mockEvent();
        const error = new Error("Database connection failed");
        
        const { createProblem } = await import("../../../../server/utils/problem");
        
        vi.mocked(global.readBody).mockRejectedValueOnce(error);

        const result = await loginHandler(event);

        expect(createProblem).toHaveBeenCalledWith(
            event,
            500,
            "Internal Server Error",
            null,
            null,
            null,
            error
        );
        expect(result).toEqual({ error: 500, message: "Internal Server Error" });
    });

    it("should log warnings for invalid userId and missing account", async () => {
        const event = mockEvent();
        
        // Test invalid userId warning
        vi.mocked(global.readBody).mockResolvedValueOnce({ userId: "invalid" });
        await loginHandler(event);
        
    });
});