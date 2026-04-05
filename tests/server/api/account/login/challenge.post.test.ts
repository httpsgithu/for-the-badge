import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockEvent, mockAccount } from "../../../../utils/mocks";
import challengeHandler from "../../../../../server/api/account/login/challenge.post";

// Mock dependencies
vi.mock("../../../../../server/utils/database", () => ({
    verifyAndMigratePin: vi.fn(),
    updateAccount: vi.fn()
}));

vi.mock("../../../../../server/utils/problem", () => ({
    createProblem: vi.fn((event, status, message) => ({ error: status, message }))
}));

vi.mock("../../../../../server/utils/composables", () => ({
    requireUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
    SessionState: {
        AUTHENTICATED: "authenticated",
        PENDING_PIN: "pending_pin",
        UNAUTHENTICATED: "unauthenticated"
    }
}));

// Use global getUserSession mock

// Mock Nuxt functions
global.readBody = vi.fn();

describe("server/api/account/login/challenge.post", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset global mocks specifically
        vi.mocked(global.getUserSession).mockReset();
        vi.mocked(global.readBody).mockReset();
        
        console.info = vi.fn();
        console.debug = vi.fn();
        console.warn = vi.fn();
        console.error = vi.fn();
    });

    it("should successfully verify PIN and update session", async () => {
        const event = mockEvent();
        const account = mockAccount({ pinEnabled: true });

        const { verifyAndMigratePin, updateAccount } = await import("../../../../../server/utils/database");
        const { requireUser, updateUser, SessionState } = await import("../../../../../server/utils/composables");

        // Setup auth context mock to return authenticated user requiring PIN verification
        vi.mocked(requireUser).mockReturnValueOnce({
            isAuthenticated: true,
            requiresPinVerification: true,
            isAdmin: false,
            account: account
        });
        vi.mocked(global.readBody).mockResolvedValueOnce({ pin: "1234" });
        vi.mocked(updateAccount).mockResolvedValueOnce(undefined);
        vi.mocked(verifyAndMigratePin).mockResolvedValueOnce({ valid: true, migrated: false, missingPin: false });

        const result = await challengeHandler(event);

        expect(result).toEqual({});
        expect(updateUser).toHaveBeenCalledWith(event, { lastAccessed: expect.any(Date) }, SessionState.AUTHENTICATED);
        expect(verifyAndMigratePin).toHaveBeenCalledWith(account.queryId, "1234");
    });

    it("should return error for invalid PIN", async () => {
        const event = mockEvent();
        const account = mockAccount({ pinEnabled: true });

        const { verifyAndMigratePin } = await import("../../../../../server/utils/database");
        const { createProblem } = await import("../../../../../server/utils/problem");
        const { requireUser, deleteUser } = await import("../../../../../server/utils/composables");

        // Setup auth context mock to return authenticated user requiring PIN verification
        vi.mocked(requireUser).mockReturnValueOnce({
            isAuthenticated: true,
            requiresPinVerification: true,
            isAdmin: false,
            account: account
        });
        vi.mocked(global.readBody).mockResolvedValueOnce({ pin: "wrong" });
        vi.mocked(verifyAndMigratePin).mockResolvedValueOnce({ valid: false, migrated: false, missingPin: false });

        const result = await challengeHandler(event);

        expect(createProblem).toHaveBeenCalledWith(event, 401, "Unauthorized");
        expect(result).toEqual({ error: 401, message: "Unauthorized" });
    });

    it("should return error for invalid session state", async () => {
        const event = mockEvent();
        const { createProblem } = await import("../../../../../server/utils/problem");
        const { requireUser } = await import("../../../../../server/utils/composables");

        // Setup auth context mock to return user not requiring PIN verification
        vi.mocked(requireUser).mockReturnValueOnce({
            isAuthenticated: true,
            requiresPinVerification: false, // Challenge not required
            isAdmin: false,
            account: null
        });
        vi.mocked(global.readBody).mockResolvedValueOnce({ pin: "1234" });

        const result = await challengeHandler(event);

        expect(createProblem).toHaveBeenCalledWith(event, 401, "Unauthorized");
        expect(result).toEqual({ error: 401, message: "Unauthorized" });
    });

    it("should return error for missing PIN", async () => {
        const event = mockEvent();
        const { createProblem } = await import("../../../../../server/utils/problem");
        const { requireUser } = await import("../../../../../server/utils/composables");

        // Setup auth context mock to return user requiring PIN verification
        vi.mocked(requireUser).mockReturnValueOnce({
            isAuthenticated: true,
            requiresPinVerification: true,
            isAdmin: false,
            account: { queryId: "test-id" } // Missing actual account
        });
        vi.mocked(global.readBody).mockResolvedValueOnce({}); // No PIN

        const result = await challengeHandler(event);

        expect(createProblem).toHaveBeenCalledWith(event, 400, "Bad Request", "PIN is required", null, { expectedField: "pin" });
        expect(result).toEqual({ error: 400, message: "Bad Request" });
    });

    it("should clear session and return error when account not found", async () => {
        const event = mockEvent();
        const { verifyAndMigratePin } = await import("../../../../../server/utils/database");
        const { createProblem } = await import("../../../../../server/utils/problem");
        const { requireUser, deleteUser } = await import("../../../../../server/utils/composables");

        const { UUID } = await import("../../../../../server/utils/uuid");
        const invalidQueryId = UUID.fromArray([9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]);
        
        // Setup auth context mock to return authenticated user requiring PIN verification
        vi.mocked(requireUser).mockReturnValueOnce({
            isAuthenticated: true,
            requiresPinVerification: true,
            isAdmin: false,
            account: { queryId: invalidQueryId } // Provide the UUID object directly
        });
        
        vi.mocked(global.readBody).mockResolvedValueOnce({ pin: "1234" });
        vi.mocked(verifyAndMigratePin).mockResolvedValueOnce({ valid: false, migrated: false, missingPin: true });

        const result = await challengeHandler(event);

        expect(deleteUser).toHaveBeenCalledWith(event);
        expect(createProblem).toHaveBeenCalledWith(event, 401, "Unauthorized");
        expect(result).toEqual({ error: 401, message: "Unauthorized" });
    });

    it("should handle errors and return 500", async () => {
        const event = mockEvent();
        const { createProblem } = await import("../../../../../server/utils/problem");
        const { requireUser, deleteUser } = await import("../../../../../server/utils/composables");

        // Mock requireUser to throw an error
        vi.mocked(requireUser).mockImplementationOnce(() => {
            throw new Error("Database error");
        });

        const result = await challengeHandler(event);

        expect(deleteUser).toHaveBeenCalledWith(event);
        expect(createProblem).toHaveBeenCalledWith(
            event, 
            500, 
            "Internal Server Error", 
            null, 
            null, 
            null, 
            expect.any(Error)
        );
        expect(result).toEqual({ error: 500, message: "Internal Server Error" });
    });

});