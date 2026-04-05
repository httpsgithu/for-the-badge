import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockEvent, mockAccount } from "../../../utils/mocks";
import getAccountHandler from "../../../../server/api/account/[id].get";

// Mock dependencies
vi.mock("../../../../server/utils/auth", () => ({
    requireAuth: vi.fn()
}));

vi.mock("../../../../server/utils/luhn", () => ({
    isValidLuhn: vi.fn()
}));

vi.mock("../../../../server/utils/problem", () => ({
    createProblem: vi.fn((event, status, message) => ({ error: status, message }))
}));

// Mock Nuxt functions
global.getRouterParam = vi.fn();

describe("server/api/account/[id].get", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return account details for regular user", async () => {
        const event = mockEvent();
        const account = mockAccount({
            credits: 100,
            pinEnabled: true,
            createdAt: new Date("2023-01-01"),
            updatedAt: new Date("2023-12-01"),
            isAdmin: false
        });
        const accountId = "1234567890123456";

        const { requireAuth } = await import("../../../../server/utils/auth");
        const { isValidLuhn } = await import("../../../../server/utils/luhn");

        vi.mocked(getRouterParam).mockReturnValueOnce(accountId);
        vi.mocked(isValidLuhn).mockReturnValueOnce(true);
        vi.mocked(requireAuth).mockReturnValueOnce({ account });

        const result = await getAccountHandler(event);

        expect(result).toEqual({
            id: accountId,
            credits: 100,
            pinEnabled: true,
            createdAt: new Date("2023-01-01"),
            updatedAt: new Date("2023-12-01")
        });
        expect(result.isAdmin).toBeUndefined();
    });

    it("should return account details for admin user", async () => {
        const event = mockEvent();
        const account = mockAccount({
            credits: 500,
            pinEnabled: false,
            createdAt: new Date("2023-01-01"),
            updatedAt: new Date("2023-12-01"),
            isAdmin: true
        });
        const accountId = "1234567890123456";

        const { requireAuth } = await import("../../../../server/utils/auth");
        const { isValidLuhn } = await import("../../../../server/utils/luhn");

        vi.mocked(getRouterParam).mockReturnValueOnce(accountId);
        vi.mocked(isValidLuhn).mockReturnValueOnce(true);
        vi.mocked(requireAuth).mockReturnValueOnce({ account });

        const result = await getAccountHandler(event);

        expect(result).toEqual({
            id: accountId,
            credits: 500,
            pinEnabled: false,
            createdAt: new Date("2023-01-01"),
            updatedAt: new Date("2023-12-01"),
            isAdmin: true
        });
    });

    it("should return error for invalid account ID format", async () => {
        const event = mockEvent();
        const { createProblem } = await import("../../../../server/utils/problem");

        vi.mocked(getRouterParam).mockReturnValueOnce("invalid");

        const result = await getAccountHandler(event);

        expect(createProblem).toHaveBeenCalledWith(event, 400, "Bad Request", "Invalid account ID format", null, { expectedFormat: "16-digit number with valid checksum", isValidLuhn: undefined, providedLength: 7 });
        expect(result).toEqual({ error: 400, message: "Bad Request" });
    });

    it("should return error for account ID with invalid Luhn check", async () => {
        const event = mockEvent();
        const { isValidLuhn } = await import("../../../../server/utils/luhn");
        const { createProblem } = await import("../../../../server/utils/problem");

        vi.mocked(getRouterParam).mockReturnValueOnce("1234567890123456");
        vi.mocked(isValidLuhn).mockReturnValueOnce(false);

        const result = await getAccountHandler(event);

        expect(createProblem).toHaveBeenCalledWith(event, 400, "Bad Request", "Invalid account ID format", null, { expectedFormat: "16-digit number with valid checksum", isValidLuhn: undefined, providedLength: 16 });
        expect(result).toEqual({ error: 400, message: "Bad Request" });
    });

    it("should return error for missing account ID", async () => {
        const event = mockEvent();
        const { createProblem } = await import("../../../../server/utils/problem");

        vi.mocked(getRouterParam).mockReturnValueOnce(null);

        const result = await getAccountHandler(event);

        expect(createProblem).toHaveBeenCalledWith(event, 400, "Bad Request", "Invalid account ID format", null, { expectedFormat: "16-digit number with valid checksum", isValidLuhn: undefined, providedLength: 0 });
        expect(result).toEqual({ error: 400, message: "Bad Request" });
    });

    it("should handle authentication errors", async () => {
        const event = mockEvent();
        const { requireAuth } = await import("../../../../server/utils/auth");
        const { isValidLuhn } = await import("../../../../server/utils/luhn");

        vi.mocked(getRouterParam).mockReturnValueOnce("1234567890123456");
        vi.mocked(isValidLuhn).mockReturnValueOnce(true);
        vi.mocked(requireAuth).mockImplementationOnce(() => {
            throw new Error("401: Authentication required");
        });

        await expect(getAccountHandler(event)).rejects.toThrow("401: Authentication required");
    });

    it("should handle account with zero credits", async () => {
        const event = mockEvent();
        const account = mockAccount({
            credits: 0,
            pinEnabled: false,
            isAdmin: false
        });
        const accountId = "1234567890123456";

        const { requireAuth } = await import("../../../../server/utils/auth");
        const { isValidLuhn } = await import("../../../../server/utils/luhn");

        vi.mocked(getRouterParam).mockReturnValueOnce(accountId);
        vi.mocked(isValidLuhn).mockReturnValueOnce(true);
        vi.mocked(requireAuth).mockReturnValueOnce({ account });

        const result = await getAccountHandler(event);

        expect(result.credits).toBe(0);
        expect(result.isAdmin).toBeUndefined();
    });

    it("should validate account ID format correctly", async () => {
        const event = mockEvent();
        const { createProblem } = await import("../../../../server/utils/problem");

        // Test various invalid formats with their expected lengths
        const testCases = [
            { id: "123456789012345", expectedLength: 15 },   // Too short
            { id: "12345678901234567", expectedLength: 17 }, // Too long
            { id: "123456789012345a", expectedLength: 16 },  // Contains letter
            { id: "123456789012345 ", expectedLength: 16 },  // Contains space
            { id: "", expectedLength: 0 }                   // Empty string
        ];

        for (const testCase of testCases) {
            vi.clearAllMocks();
            vi.mocked(getRouterParam).mockReturnValueOnce(testCase.id);
            
            const result = await getAccountHandler(event);
            
            expect(createProblem).toHaveBeenCalledWith(event, 400, "Bad Request", "Invalid account ID format", null, { expectedFormat: "16-digit number with valid checksum", isValidLuhn: undefined, providedLength: testCase.expectedLength });
            expect(result).toEqual({ error: 400, message: "Bad Request" });
        }
    });
});