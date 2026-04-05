import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockEvent, mockAccount } from "../../../../utils/mocks";
import pinPostHandler from "../../../../../server/api/account/[id]/pin.post";

// Mock dependencies
vi.mock("../../../../../server/utils/auth", () => ({
    requirePartialAuth: vi.fn()
}));

vi.mock("../../../../../server/utils/database", () => ({
    verifyAndMigratePin: vi.fn()
}));

vi.mock("../../../../../server/utils/luhn", () => ({
    isValidLuhn: vi.fn()
}));

vi.mock("../../../../../server/utils/problem", () => ({
    createProblem: vi.fn((event, status, message) => ({ error: status, message }))
}));

// Mock Nuxt functions
global.getRouterParam = vi.fn();
global.readBody = vi.fn();

describe("server/api/account/[id]/pin.post", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should successfully verify PIN", async () => {
        const event = mockEvent();
        const account = mockAccount({ pinEnabled: true });
        const accountId = "1234567890123456";

        const { requirePartialAuth } = await import("../../../../../server/utils/auth");
        const { verifyAndMigratePin } = await import("../../../../../server/utils/database");
        const { isValidLuhn } = await import("../../../../../server/utils/luhn");

        vi.mocked(getRouterParam).mockReturnValueOnce(accountId);
        vi.mocked(readBody).mockResolvedValueOnce({ pin: "1234" });
        vi.mocked(isValidLuhn).mockReturnValueOnce(true);
        vi.mocked(requirePartialAuth).mockReturnValueOnce({ account });
        vi.mocked(verifyAndMigratePin).mockResolvedValueOnce({ valid: true, migrated: false, missingPin: false });

        const result = await pinPostHandler(event);

        expect(result).toEqual({
            message: "PIN verified successfully",
            verified: true
        });
        expect(verifyAndMigratePin).toHaveBeenCalledWith(account.queryId, "1234");
    });

    it("should return error for invalid PIN", async () => {
        const event = mockEvent();
        const account = mockAccount({ pinEnabled: true });
        const accountId = "1234567890123456";

        const { requirePartialAuth } = await import("../../../../../server/utils/auth");
        const { verifyAndMigratePin } = await import("../../../../../server/utils/database");
        const { isValidLuhn } = await import("../../../../../server/utils/luhn");
        const { createProblem } = await import("../../../../../server/utils/problem");

        vi.mocked(getRouterParam).mockReturnValueOnce(accountId);
        vi.mocked(readBody).mockResolvedValueOnce({ pin: "wrong" });
        vi.mocked(isValidLuhn).mockReturnValueOnce(true);
        vi.mocked(requirePartialAuth).mockReturnValueOnce({ account });
        vi.mocked(verifyAndMigratePin).mockResolvedValueOnce({ valid: false, migrated: false, missingPin: false });

        const result = await pinPostHandler(event);

        expect(createProblem).toHaveBeenCalledWith(event, 401, "Invalid PIN");
        expect(result).toEqual({ error: 401, message: "Invalid PIN" });
    });

    it("should return error for missing PIN", async () => {
        const event = mockEvent();
        const account = mockAccount({ pinEnabled: true });
        const accountId = "1234567890123456";

        const { requirePartialAuth } = await import("../../../../../server/utils/auth");
        const { isValidLuhn } = await import("../../../../../server/utils/luhn");
        const { createProblem } = await import("../../../../../server/utils/problem");

        vi.mocked(getRouterParam).mockReturnValueOnce(accountId);
        vi.mocked(readBody).mockResolvedValueOnce({}); // No PIN
        vi.mocked(isValidLuhn).mockReturnValueOnce(true);
        vi.mocked(requirePartialAuth).mockReturnValueOnce({ account });

        const result = await pinPostHandler(event);

        expect(createProblem).toHaveBeenCalledWith(event, 400, "PIN is required");
        expect(result).toEqual({ error: 400, message: "PIN is required" });
    });

    it("should return error when PIN is not configured", async () => {
        const event = mockEvent();
        const account = mockAccount({ pinEnabled: false });
        const accountId = "1234567890123456";

        const { requirePartialAuth } = await import("../../../../../server/utils/auth");
        const { verifyAndMigratePin } = await import("../../../../../server/utils/database");
        const { isValidLuhn } = await import("../../../../../server/utils/luhn");
        const { createProblem } = await import("../../../../../server/utils/problem");

        vi.mocked(getRouterParam).mockReturnValueOnce(accountId);
        vi.mocked(readBody).mockResolvedValueOnce({ pin: "1234" });
        vi.mocked(isValidLuhn).mockReturnValueOnce(true);
        vi.mocked(requirePartialAuth).mockReturnValueOnce({ account });
        vi.mocked(verifyAndMigratePin).mockResolvedValueOnce({ valid: false, migrated: false, missingPin: true });

        const result = await pinPostHandler(event);

        expect(createProblem).toHaveBeenCalledWith(event, 400, "No PIN configured for this account");
        expect(result).toEqual({ error: 400, message: "No PIN configured for this account" });
    });

    it("should return error for invalid account ID", async () => {
        const event = mockEvent();
        const { createProblem } = await import("../../../../../server/utils/problem");

        vi.mocked(getRouterParam).mockReturnValueOnce("invalid");
        vi.mocked(readBody).mockResolvedValueOnce({ pin: "1234" });

        const result = await pinPostHandler(event);

        expect(createProblem).toHaveBeenCalledWith(event, 400, "Bad Request");
        expect(result).toEqual({ error: 400, message: "Bad Request" });
    });

    it("should return error for invalid Luhn check", async () => {
        const event = mockEvent();
        const { isValidLuhn } = await import("../../../../../server/utils/luhn");
        const { createProblem } = await import("../../../../../server/utils/problem");

        vi.mocked(getRouterParam).mockReturnValueOnce("1234567890123456");
        vi.mocked(readBody).mockResolvedValueOnce({ pin: "1234" });
        vi.mocked(isValidLuhn).mockReturnValueOnce(false);

        const result = await pinPostHandler(event);

        expect(createProblem).toHaveBeenCalledWith(event, 400, "Bad Request");
        expect(result).toEqual({ error: 400, message: "Bad Request" });
    });

    it("should handle authentication errors", async () => {
        const event = mockEvent();
        const { requirePartialAuth } = await import("../../../../../server/utils/auth");
        const { isValidLuhn } = await import("../../../../../server/utils/luhn");

        vi.mocked(getRouterParam).mockReturnValueOnce("1234567890123456");
        vi.mocked(readBody).mockResolvedValueOnce({ pin: "1234" });
        vi.mocked(isValidLuhn).mockReturnValueOnce(true);
        vi.mocked(requirePartialAuth).mockImplementationOnce(() => {
            throw new Error("401: Authentication required");
        });

        await expect(pinPostHandler(event)).rejects.toThrow("401: Authentication required");
    });
});