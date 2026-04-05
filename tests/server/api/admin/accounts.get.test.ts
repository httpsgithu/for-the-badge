import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockEvent, mockAccount } from "../../../utils/mocks";
import adminAccountsHandler from "../../../../server/api/admin/accounts.get";
import { encodeUuid } from "../../../../server/utils/sqids";
import { UUID } from "../../../../server/utils/uuid";

// Mock dependencies
vi.mock("../../../../server/utils/auth", () => ({
    requireAdmin: vi.fn()
}));

vi.mock("../../../../server/utils/database", () => ({
    getAllAccounts: vi.fn()
}));

// Mock Nuxt functions
global.getQuery = vi.fn();

describe("server/api/admin/accounts.get", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should successfully return accounts with default pagination", async () => {
        const event = mockEvent();
        const mockAccountsResult = {
            perPage: 50,
            data: [mockAccount(), mockAccount()],
            next: null,
        };

        const { requireAdmin } = await import("../../../../server/utils/auth");
        const { getAllAccounts } = await import("../../../../server/utils/database");

        vi.mocked(getQuery).mockReturnValueOnce({});
        vi.mocked(getAllAccounts).mockResolvedValueOnce(mockAccountsResult);

        const result = await adminAccountsHandler(event);

        expect(result).toEqual(mockAccountsResult);
        expect(requireAdmin).toHaveBeenCalledWith(event);
        expect(getAllAccounts).toHaveBeenCalledWith({
            cursor: undefined,
            perPage: 50
        });
    });

    it("should handle custom pagination parameters", async () => {
        const event = mockEvent();
        const mockAccountsResult = {
            perPage: 25,
            data: [mockAccount()],
            next: "cursor123",
        };

        const validCursor = encodeUuid(UUID.fromArray([
            0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0,
            0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88,
        ]));

        const { requireAdmin } = await import("../../../../server/utils/auth");
        const { getAllAccounts } = await import("../../../../server/utils/database");

        vi.mocked(getQuery).mockReturnValueOnce({
            cursor: validCursor,
            perPage: "25"
        });
        vi.mocked(getAllAccounts).mockResolvedValueOnce(mockAccountsResult);

        const result = await adminAccountsHandler(event);

        expect(result).toEqual(mockAccountsResult);
        expect(getAllAccounts).toHaveBeenCalledWith({
            cursor: validCursor,
            perPage: 25
        });
    });

    it("should handle invalid perPage parameter", async () => {
        const event = mockEvent();
        const mockAccountsResult = {
            perPage: 50,
            data: [],
            next: null,
        };

        const { requireAdmin } = await import("../../../../server/utils/auth");
        const { getAllAccounts } = await import("../../../../server/utils/database");

        vi.mocked(getQuery).mockReturnValueOnce({
            perPage: "invalid"
        });
        vi.mocked(getAllAccounts).mockResolvedValueOnce(mockAccountsResult);

        const result = await adminAccountsHandler(event);

        expect(result).toEqual(mockAccountsResult);
        expect(getAllAccounts).toHaveBeenCalledWith({
            cursor: undefined,
            perPage: 50 // invalid perPage falls back to default
        });
    });

    it("should handle authentication errors", async () => {
        const event = mockEvent();
        const { requireAdmin } = await import("../../../../server/utils/auth");

        vi.mocked(requireAdmin).mockImplementationOnce(() => {
            throw new Error("403: Admin access required");
        });

        await expect(adminAccountsHandler(event)).rejects.toThrow("403: Admin access required");
    });

    it("should handle empty query parameters", async () => {
        const event = mockEvent();
        const mockAccountsResult = {
            perPage: 50,
            data: [],
            next: null,
        };

        const { requireAdmin } = await import("../../../../server/utils/auth");
        const { getAllAccounts } = await import("../../../../server/utils/database");

        vi.mocked(getQuery).mockReturnValueOnce({
            cursor: "",
            perPage: ""
        });
        vi.mocked(getAllAccounts).mockResolvedValueOnce(mockAccountsResult);

        const result = await adminAccountsHandler(event);

        expect(getAllAccounts).toHaveBeenCalledWith({
            cursor: "",
            perPage: 50 // Default when empty string
        });
    });

    it("should handle database errors gracefully", async () => {
        const event = mockEvent();
        const { requireAdmin } = await import("../../../../server/utils/auth");
        const { getAllAccounts } = await import("../../../../server/utils/database");

        vi.mocked(getQuery).mockReturnValueOnce({});
        vi.mocked(getAllAccounts).mockRejectedValueOnce(new Error("Database connection failed"));

        await expect(adminAccountsHandler(event)).rejects.toThrow("Database connection failed");
    });
});