import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockEvent, mockAccount } from "../../../utils/mocks";
import deleteAccountHandler from "../../../../server/api/account/[id]/delete.post";

// Mock dependencies
vi.mock("../../../../server/utils/auth", () => ({
    requireAuth: vi.fn()
}));

vi.mock("../../../../server/utils/database", () => ({
    deleteAccount: vi.fn(),
    getAccountPinHash: vi.fn(),
    verifyAndMigratePin: vi.fn(),
}));

vi.mock("../../../../server/utils/luhn", () => ({
    isValidLuhn: vi.fn()
}));

vi.mock("../../../../server/utils/problem", () => ({
    createProblem: vi.fn((event, status, message) => ({ error: status, message }))
}));

// Mock Nuxt functions
global.getRouterParam = vi.fn();
global.readBody = vi.fn();
global.clearUserSession = vi.fn();
global.setResponseStatus = vi.fn();

describe("server/api/account/[id].delete", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should successfully delete account with valid PIN", async () => {
        const event = mockEvent();
        const account = mockAccount({ pinEnabled: true });
        const accountId = "1234567890123456";

        const { requireAuth } = await import("../../../../server/utils/auth");
        const { deleteAccount, getAccountPinHash, verifyAndMigratePin } = await import("../../../../server/utils/database");
        const { isValidLuhn } = await import("../../../../server/utils/luhn");

        vi.mocked(getRouterParam).mockReturnValueOnce(accountId);
        vi.mocked(readBody).mockResolvedValueOnce({
            confirmAccountNumber: accountId,
            pin: "1234"
        });
        vi.mocked(isValidLuhn).mockReturnValueOnce(true);
        vi.mocked(requireAuth).mockReturnValueOnce({ account });
        vi.mocked(getAccountPinHash).mockResolvedValueOnce("hashed-pin");
        vi.mocked(verifyAndMigratePin).mockResolvedValueOnce({ valid: true, migrated: false, missingPin: false });

        const result = await deleteAccountHandler(event);

        expect(result).toBeNull();
        expect(setResponseStatus).toHaveBeenCalledWith(event, 204);
        expect(deleteAccount).toHaveBeenCalledWith(account.queryId);
        expect(clearUserSession).toHaveBeenCalledWith(event);
    });

    it("should successfully delete account without PIN", async () => {
        const event = mockEvent();
        const account = mockAccount({ pinEnabled: false });
        const accountId = "1234567890123456";

        const { requireAuth } = await import("../../../../server/utils/auth");
        const { deleteAccount, getAccountPinHash } = await import("../../../../server/utils/database");
        const { isValidLuhn } = await import("../../../../server/utils/luhn");

        vi.mocked(getRouterParam).mockReturnValueOnce(accountId);
        vi.mocked(readBody).mockResolvedValueOnce({
            confirmAccountNumber: accountId
        });
        vi.mocked(isValidLuhn).mockReturnValueOnce(true);
        vi.mocked(requireAuth).mockReturnValueOnce({ account });
        vi.mocked(getAccountPinHash).mockResolvedValueOnce(null);

        const result = await deleteAccountHandler(event);

        expect(result).toBeNull();
        expect(setResponseStatus).toHaveBeenCalledWith(event, 204);
        expect(deleteAccount).toHaveBeenCalledWith(account.queryId);
        expect(clearUserSession).toHaveBeenCalledWith(event);
    });

    it("should return error for invalid account ID", async () => {
        const event = mockEvent();
        const { createProblem } = await import("../../../../server/utils/problem");

        vi.mocked(getRouterParam).mockReturnValueOnce("invalid");
        vi.mocked(readBody).mockResolvedValueOnce({});

        const result = await deleteAccountHandler(event);

        expect(createProblem).toHaveBeenCalledWith(
            event, 
            400, 
            "Bad Request",
            "Invalid account ID format",
            null,
            {
                expectedFormat: "16-digit number with valid checksum"
            }
        );
        expect(result).toEqual({ error: 400, message: "Bad Request" });
    });

    it("should return error for invalid Luhn check", async () => {
        const event = mockEvent();
        const { isValidLuhn } = await import("../../../../server/utils/luhn");
        const { createProblem } = await import("../../../../server/utils/problem");

        vi.mocked(getRouterParam).mockReturnValueOnce("1234567890123456");
        vi.mocked(readBody).mockResolvedValueOnce({});
        vi.mocked(isValidLuhn).mockReturnValueOnce(false);

        const result = await deleteAccountHandler(event);

        expect(createProblem).toHaveBeenCalledWith(
            event, 
            400, 
            "Bad Request",
            "Invalid account ID format",
            null,
            {
                expectedFormat: "16-digit number with valid checksum"
            }
        );
        expect(result).toEqual({ error: 400, message: "Bad Request" });
    });

    it("should return error for mismatched confirmation account number", async () => {
        const event = mockEvent();
        const account = mockAccount();
        const accountId = "1234567890123456";

        const { requireAuth } = await import("../../../../server/utils/auth");
        const { isValidLuhn } = await import("../../../../server/utils/luhn");
        const { createProblem } = await import("../../../../server/utils/problem");

        vi.mocked(getRouterParam).mockReturnValueOnce(accountId);
        vi.mocked(readBody).mockResolvedValueOnce({
            confirmAccountNumber: "9876543210987654"
        });
        vi.mocked(isValidLuhn).mockReturnValueOnce(true);
        vi.mocked(requireAuth).mockReturnValueOnce({ account });

        const result = await deleteAccountHandler(event);

        expect(createProblem).toHaveBeenCalledWith(
            event, 
            400, 
            "Bad Request",
            "Account confirmation number is required and must match",
            null,
            {
                expectedFormat: "16-digit account number",
                matches: false,
                message: "account number mismatch",
                provided: true
            }
        );
        expect(result).toEqual({ error: 400, message: "Bad Request" });
    });

    it("should return error for missing PIN when required", async () => {
        const event = mockEvent();
        const account = mockAccount({ pinEnabled: true });
        const accountId = "1234567890123456";

        const { requireAuth } = await import("../../../../server/utils/auth");
        const { isValidLuhn } = await import("../../../../server/utils/luhn");
        const { createProblem } = await import("../../../../server/utils/problem");

        vi.mocked(getRouterParam).mockReturnValueOnce(accountId);
        vi.mocked(readBody).mockResolvedValueOnce({
            confirmAccountNumber: accountId
            // No PIN provided
        });
        vi.mocked(isValidLuhn).mockReturnValueOnce(true);
        const { getAccountPinHash } = await import("../../../../server/utils/database");
        vi.mocked(requireAuth).mockReturnValueOnce({ account });
        vi.mocked(getAccountPinHash).mockResolvedValueOnce("hashed-pin");

        const result = await deleteAccountHandler(event);

        expect(createProblem).toHaveBeenCalledWith(
            event, 
            400, 
            "Bad Request",
            "PIN is required for accounts with PIN protection",
            null,
            {
                expectedField: "pin",
                hasPinEnabled: true,
                message: "no pin provided for pinned account"
            }
        );
        expect(result).toEqual({ error: 400, message: "Bad Request" });
    });

    it("should return error for invalid PIN", async () => {
        const event = mockEvent();
        const account = mockAccount({ pinEnabled: true });
        const accountId = "1234567890123456";

        const { requireAuth } = await import("../../../../server/utils/auth");
        const { verifyAndMigratePin, getAccountPinHash } = await import("../../../../server/utils/database");
        const { isValidLuhn } = await import("../../../../server/utils/luhn");
        const { createProblem } = await import("../../../../server/utils/problem");

        vi.mocked(getRouterParam).mockReturnValueOnce(accountId);
        vi.mocked(readBody).mockResolvedValueOnce({
            confirmAccountNumber: accountId,
            pin: "wrong"
        });
        vi.mocked(isValidLuhn).mockReturnValueOnce(true);
        vi.mocked(requireAuth).mockReturnValueOnce({ account });
        vi.mocked(getAccountPinHash).mockResolvedValueOnce("hashed-pin");
        vi.mocked(verifyAndMigratePin).mockResolvedValueOnce({ valid: false, migrated: false, missingPin: false });

        const result = await deleteAccountHandler(event);

        expect(createProblem).toHaveBeenCalledWith(
            event, 
            401, 
            "Unauthorized",
            "Invalid PIN provided"
        );
        expect(result).toEqual({ error: 401, message: "Unauthorized" });
    });

    it("should handle authentication errors", async () => {
        const event = mockEvent();
        const { requireAuth } = await import("../../../../server/utils/auth");
        const { isValidLuhn } = await import("../../../../server/utils/luhn");

        vi.mocked(getRouterParam).mockReturnValueOnce("1234567890123456");
        vi.mocked(readBody).mockResolvedValueOnce({
            confirmAccountNumber: "1234567890123456"
        });
        vi.mocked(isValidLuhn).mockReturnValueOnce(true);
        vi.mocked(requireAuth).mockImplementationOnce(() => {
            throw new Error("401: Authentication required");
        });

        await expect(deleteAccountHandler(event)).rejects.toThrow("401: Authentication required");
    });
});