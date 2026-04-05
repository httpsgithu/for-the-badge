import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockEvent, mockAccount } from "../../../../utils/mocks";
import pinPutHandler from "../../../../../server/api/account/[id]/pin.put";

// Mock dependencies
vi.mock("../../../../../server/utils/auth", () => ({
    requirePartialAuth: vi.fn()
}));

vi.mock("../../../../../server/utils/database", () => ({
    getAccountPinHash: vi.fn(),
    updateAccount: vi.fn(),
}));

vi.mock("../../../../../server/utils/luhn", () => ({
    isValidLuhn: vi.fn()
}));

vi.mock("../../../../../server/utils/problem", () => ({
    createProblem: vi.fn((event, status, message) => ({ error: status, message }))
}));

vi.mock("../../../../../server/utils/composables", () => ({
    updateUser: vi.fn()
}));

// Mock Nuxt functions
global.getRouterParam = vi.fn();
global.readBody = vi.fn();

describe("server/api/account/[id]/pin.put", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should successfully create PIN", async () => {
        const event = mockEvent();
        const account = mockAccount({ pinEnabled: false });
        const accountId = "1234567890123456";

        const { requirePartialAuth } = await import("../../../../../server/utils/auth");
        const { getAccountPinHash, updateAccount } = await import("../../../../../server/utils/database");
        const { isValidLuhn } = await import("../../../../../server/utils/luhn");
        const { updateUser } = await import("../../../../../server/utils/composables");

        vi.mocked(getRouterParam).mockReturnValueOnce(accountId);
        vi.mocked(readBody).mockResolvedValueOnce({ pin: "1234" });
        vi.mocked(isValidLuhn).mockReturnValueOnce(true);
        vi.mocked(requirePartialAuth).mockReturnValueOnce({ account });
        vi.mocked(getAccountPinHash).mockResolvedValueOnce(null);
        vi.mocked(updateUser).mockResolvedValueOnce(true);

        const result = await pinPutHandler(event);

        expect(result).toEqual({ message: "PIN created successfully" });
        expect(updateAccount).toHaveBeenCalledWith(account.queryId, { pin: "1234" });
        expect(updateUser).toHaveBeenCalledWith(event, { pinEnabled: true });
    });

    it("should return error when PIN already exists", async () => {
        const event = mockEvent();
        const account = mockAccount({ pinEnabled: true });
        const accountId = "1234567890123456";

        const { requirePartialAuth } = await import("../../../../../server/utils/auth");
        const { getAccountPinHash } = await import("../../../../../server/utils/database");
        const { isValidLuhn } = await import("../../../../../server/utils/luhn");
        const { createProblem } = await import("../../../../../server/utils/problem");

        vi.mocked(getRouterParam).mockReturnValueOnce(accountId);
        vi.mocked(readBody).mockResolvedValueOnce({ pin: "1234" });
        vi.mocked(isValidLuhn).mockReturnValueOnce(true);
        vi.mocked(requirePartialAuth).mockReturnValueOnce({ account });
        vi.mocked(getAccountPinHash).mockResolvedValueOnce("hashed-pin");

        const result = await pinPutHandler(event);

        expect(createProblem).toHaveBeenCalledWith(event, 409, "PIN already exists");
        expect(result).toEqual({ error: 409, message: "PIN already exists" });
    });

    it("should return error for PIN too short", async () => {
        const event = mockEvent();
        const account = mockAccount({ pinEnabled: false });
        const accountId = "1234567890123456";

        const { requirePartialAuth } = await import("../../../../../server/utils/auth");
        const { getAccountPinHash } = await import("../../../../../server/utils/database");
        const { isValidLuhn } = await import("../../../../../server/utils/luhn");
        const { createProblem } = await import("../../../../../server/utils/problem");

        vi.mocked(getRouterParam).mockReturnValueOnce(accountId);
        vi.mocked(readBody).mockResolvedValueOnce({ pin: "12" }); // Too short
        vi.mocked(isValidLuhn).mockReturnValueOnce(true);
        vi.mocked(requirePartialAuth).mockReturnValueOnce({ account });
        vi.mocked(getAccountPinHash).mockResolvedValueOnce(null);

        const result = await pinPutHandler(event);

        expect(createProblem).toHaveBeenCalledWith(event, 400, "PIN must be between 4 and 8 characters");
        expect(result).toEqual({ error: 400, message: "PIN must be between 4 and 8 characters" });
    });

    it("should return error for PIN too long", async () => {
        const event = mockEvent();
        const account = mockAccount({ pinEnabled: false });
        const accountId = "1234567890123456";

        const { requirePartialAuth } = await import("../../../../../server/utils/auth");
        const { getAccountPinHash } = await import("../../../../../server/utils/database");
        const { isValidLuhn } = await import("../../../../../server/utils/luhn");
        const { createProblem } = await import("../../../../../server/utils/problem");

        vi.mocked(getRouterParam).mockReturnValueOnce(accountId);
        vi.mocked(readBody).mockResolvedValueOnce({ pin: "123456789" }); // Too long
        vi.mocked(isValidLuhn).mockReturnValueOnce(true);
        vi.mocked(requirePartialAuth).mockReturnValueOnce({ account });
        vi.mocked(getAccountPinHash).mockResolvedValueOnce(null);

        const result = await pinPutHandler(event);

        expect(createProblem).toHaveBeenCalledWith(event, 400, "PIN must be between 4 and 8 characters");
        expect(result).toEqual({ error: 400, message: "PIN must be between 4 and 8 characters" });
    });

    it("should return error for missing PIN", async () => {
        const event = mockEvent();
        const account = mockAccount({ pinEnabled: false });
        const accountId = "1234567890123456";

        const { requirePartialAuth } = await import("../../../../../server/utils/auth");
        const { getAccountPinHash } = await import("../../../../../server/utils/database");
        const { isValidLuhn } = await import("../../../../../server/utils/luhn");
        const { createProblem } = await import("../../../../../server/utils/problem");

        vi.mocked(getRouterParam).mockReturnValueOnce(accountId);
        vi.mocked(readBody).mockResolvedValueOnce({}); // No PIN
        vi.mocked(isValidLuhn).mockReturnValueOnce(true);
        vi.mocked(requirePartialAuth).mockReturnValueOnce({ account });
        vi.mocked(getAccountPinHash).mockResolvedValueOnce(null);

        const result = await pinPutHandler(event);

        expect(createProblem).toHaveBeenCalledWith(event, 400, "PIN must be between 4 and 8 characters");
        expect(result).toEqual({ error: 400, message: "PIN must be between 4 and 8 characters" });
    });

    it("should handle account refresh gracefully when account not found", async () => {
        const event = mockEvent();
        const account = mockAccount({ pinEnabled: false });
        const accountId = "1234567890123456";

        const { requirePartialAuth } = await import("../../../../../server/utils/auth");
        const { getAccountPinHash, updateAccount } = await import("../../../../../server/utils/database");
        const { isValidLuhn } = await import("../../../../../server/utils/luhn");
        const { updateUser } = await import("../../../../../server/utils/composables");

        vi.mocked(getRouterParam).mockReturnValueOnce(accountId);
        vi.mocked(readBody).mockResolvedValueOnce({ pin: "1234" });
        vi.mocked(isValidLuhn).mockReturnValueOnce(true);
        vi.mocked(requirePartialAuth).mockReturnValueOnce({ account });
        vi.mocked(getAccountPinHash).mockResolvedValueOnce(null);
        vi.mocked(updateUser).mockResolvedValueOnce(true);

        const result = await pinPutHandler(event);

        expect(result).toEqual({ message: "PIN created successfully" });
        expect(updateAccount).toHaveBeenCalledWith(account.queryId, { pin: "1234" });
    });
});