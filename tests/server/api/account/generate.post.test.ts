import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockEvent, mockAccount } from "../../../utils/mocks";
import generateHandler from "../../../../server/api/account/generate.post";

// Mock all the utilities used by the handler
vi.mock("../../../../server/utils/crypto", () => ({
    generateAccountHash: vi.fn(() => new Uint8Array([1, 2, 3, 4]))
}));

vi.mock("../../../../server/utils/database", () => ({
    createAccount: vi.fn(),
    getAccountByQueryId: vi.fn()
}));

vi.mock("../../../../server/utils/luhn", () => ({
    luhnCheckDigit: vi.fn(() => "5")
}));

vi.mock("../../../../server/utils/problem", () => ({
    createProblem: vi.fn((event, status, message) => ({ error: status, message }))
}));

vi.mock("../../../../server/utils/composables", () => ({
    setUser: vi.fn(),
    SessionState: {
        AUTHENTICATED: "authenticated",
        PENDING_PIN: "pending_pin",
        UNAUTHENTICATED: "unauthenticated"
    }
}));

vi.mock("../../../../server/utils/sqids", () => ({
    validateAndDecodeSqid: vi.fn()
}));

vi.mock("../../../../server/utils/binary", () => ({
    binaryToString: vi.fn(),
    binaryEquals: vi.fn()
}));

vi.mock("h3", () => ({
    getQuery: vi.fn()
}));

// Mock crypto.getRandomValues
Object.defineProperty(global, 'crypto', {
    value: {
        getRandomValues: vi.fn((arr) => {
            // Fill with predictable values for testing
            for (let i = 0; i < arr.length; i++) {
                arr[i] = i + 1;
            }
        })
    }
});

describe("server/api/account/generate.post", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        console.info = vi.fn();
        console.debug = vi.fn();
        console.error = vi.fn();
    });

    it("should successfully generate account and return account ID", async () => {
        const event = mockEvent();
        const account = mockAccount();
        
        const { createAccount } = await import("../../../../server/utils/database");
        const { setUser } = await import("../../../../server/utils/composables");
        const { getQuery } = await import("h3");
        
        // Setup auth context for composable to work
        event.context = { auth: { isAuthenticated: false, requiresPinVerification: false, isAdmin: false, account: null } };
        
        vi.mocked(getQuery).mockReturnValueOnce({}); // No referrer
        vi.mocked(createAccount).mockResolvedValueOnce(account);
        vi.mocked(setUser).mockResolvedValueOnce(undefined);

        const result = await generateHandler(event);

        expect(result).toEqual({
            id: expect.stringMatching(/^\d{16}$/)
        });
        expect(createAccount).toHaveBeenCalledWith({
            accountHash: expect.any(Uint8Array),
            hashVersion: 1,
            isAdmin: false,
            referrer: null
        });
        expect(setUser).toHaveBeenCalledWith(
            event,
            account,
            "authenticated",
            expect.stringMatching(/^\d{16}$/)
        );
    });

    it("should return error when account creation fails", async () => {
        const event = mockEvent();
        
        const { createAccount } = await import("../../../../server/utils/database");
        const { createProblem } = await import("../../../../server/utils/problem");
        
        vi.mocked(createAccount).mockResolvedValueOnce(null);

        const result = await generateHandler(event);

        expect(createProblem).toHaveBeenCalledWith(
            event,
            500,
            "Internal Server Error",
            "Failed to create account"
        );
        expect(result).toEqual({ error: 500, message: "Internal Server Error" });
    });

    it("should return error when session creation fails", async () => {
        const event = mockEvent();
        const account = mockAccount();
        
        const { createAccount } = await import("../../../../server/utils/database");
        const { setUser } = await import("../../../../server/utils/composables");
        const { createProblem } = await import("../../../../server/utils/problem");
        
        // Setup auth context for composable to work
        event.context = { auth: { isAuthenticated: false, requiresPinVerification: false, isAdmin: false, account: null } };
        
        vi.mocked(createAccount).mockResolvedValueOnce(account);
        vi.mocked(setUser).mockRejectedValueOnce(new Error("Session error"));

        const result = await generateHandler(event);

        expect(createProblem).toHaveBeenCalledWith(
            event,
            500,
            "Internal Server Error",
            "Failed to create user session"
        );
        expect(result).toEqual({ error: 500, message: "Internal Server Error" });
    });

    it("should generate valid 16-digit account ID with Luhn check digit", async () => {
        const event = mockEvent();
        const account = mockAccount();
        
        const { createAccount } = await import("../../../../server/utils/database");
        const { setUser } = await import("../../../../server/utils/composables");
        const { luhnCheckDigit } = await import("../../../../server/utils/luhn");
        const { getQuery } = await import("h3");
        
        // Setup auth context for composable to work
        event.context = { auth: { isAuthenticated: false, requiresPinVerification: false, isAdmin: false, account: null } };
        
        vi.mocked(getQuery).mockReturnValueOnce({}); // No referrer
        vi.mocked(createAccount).mockResolvedValueOnce(account);
        vi.mocked(setUser).mockResolvedValueOnce(undefined);

        const result = await generateHandler(event);

        expect(luhnCheckDigit).toHaveBeenCalledWith(expect.stringMatching(/^\d{15}$/));
        expect(result.id).toMatch(/^\d{16}$/);
        expect(result.id.endsWith("5")).toBe(true); // Mock returns "5" as check digit
    });

    it("should use account hash version 1", async () => {
        const event = mockEvent();
        const account = mockAccount();
        
        const { createAccount } = await import("../../../../server/utils/database");
        const { setUser } = await import("../../../../server/utils/composables");
        const { generateAccountHash } = await import("../../../../server/utils/crypto");
        const { getQuery } = await import("h3");
        
        // Setup auth context for composable to work
        event.context = { auth: { isAuthenticated: false, requiresPinVerification: false, isAdmin: false, account: null } };
        
        vi.mocked(getQuery).mockReturnValueOnce({}); // No referrer
        vi.mocked(createAccount).mockResolvedValueOnce(account);
        vi.mocked(setUser).mockResolvedValueOnce(undefined);

        await generateHandler(event);

        expect(generateAccountHash).toHaveBeenCalledWith(
            expect.stringMatching(/^\d{16}$/),
            1
        );
        expect(createAccount).toHaveBeenCalledWith({
            accountHash: expect.any(Uint8Array),
            hashVersion: 1,
            isAdmin: false,
            referrer: null
        });
    });


    it("should generate account numbers within valid 15-digit range", async () => {
        const event = mockEvent();
        const account = mockAccount();
        
        const { createAccount } = await import("../../../../server/utils/database");
        const { setUser } = await import("../../../../server/utils/composables");
        const { luhnCheckDigit } = await import("../../../../server/utils/luhn");
        const { getQuery } = await import("h3");
        
        // Setup auth context for composable to work
        event.context = { auth: { isAuthenticated: false, requiresPinVerification: false, isAdmin: false, account: null } };
        
        vi.mocked(getQuery).mockReturnValueOnce({}); // No referrer
        vi.mocked(createAccount).mockResolvedValueOnce(account);
        vi.mocked(setUser).mockResolvedValueOnce(undefined);

        await generateHandler(event);

        const baseIdCall = vi.mocked(luhnCheckDigit).mock.calls[0][0];
        const baseId = BigInt(baseIdCall);
        
        expect(baseId >= BigInt("100000000000000")).toBe(true);
        expect(baseId <= BigInt("999999999999999")).toBe(true);
    });

    it("should create non-admin account by default", async () => {
        const event = mockEvent();
        const account = mockAccount();
        
        const { createAccount } = await import("../../../../server/utils/database");
        const { setUser } = await import("../../../../server/utils/composables");
        const { getQuery } = await import("h3");
        
        // Setup auth context for composable to work
        event.context = { auth: { isAuthenticated: false, requiresPinVerification: false, isAdmin: false, account: null } };
        
        vi.mocked(getQuery).mockReturnValueOnce({}); // No referrer
        vi.mocked(createAccount).mockResolvedValueOnce(account);
        vi.mocked(setUser).mockResolvedValueOnce(undefined);

        await generateHandler(event);

        expect(createAccount).toHaveBeenCalledWith(
            expect.objectContaining({ isAdmin: false })
        );
    });

    it("should successfully create account with valid referrer", async () => {
        const event = mockEvent();
        const account = mockAccount();
        const referrerAccount = mockAccount();
        const { UUID } = await import("../../../../server/utils/uuid");
        const referrerUuid = UUID.fromArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
        
        const { createAccount, getAccountByQueryId } = await import("../../../../server/utils/database");
        const { setUser } = await import("../../../../server/utils/composables");
        const { getQuery } = await import("h3");
        const { validateAndDecodeSqid } = await import("../../../../server/utils/sqids");
        
        // Setup auth context for composable to work
        event.context = { auth: { isAuthenticated: false, requiresPinVerification: false, isAdmin: false, account: null } };
        
        vi.mocked(getQuery).mockReturnValueOnce({ referrer: "valid-referrer-sqid" });
        vi.mocked(validateAndDecodeSqid).mockReturnValueOnce(referrerUuid);
        vi.mocked(getAccountByQueryId).mockResolvedValueOnce(referrerAccount);
        vi.mocked(createAccount).mockResolvedValueOnce(account);
        vi.mocked(setUser).mockResolvedValueOnce(undefined);

        const result = await generateHandler(event);

        expect(result).toEqual({
            id: expect.stringMatching(/^\d{16}$/)
        });
        expect(validateAndDecodeSqid).toHaveBeenCalledWith("valid-referrer-sqid");
        expect(getAccountByQueryId).toHaveBeenCalledWith(referrerUuid);
        expect(createAccount).toHaveBeenCalledWith({
            accountHash: expect.anything(),
            hashVersion: 1,
            isAdmin: false,
            referrer: referrerUuid
        });
    });

    it("should return error for invalid referrer Sqid", async () => {
        const event = mockEvent();
        
        const { getQuery } = await import("h3");
        const { validateAndDecodeSqid } = await import("../../../../server/utils/sqids");
        const { createProblem } = await import("../../../../server/utils/problem");
        
        vi.mocked(getQuery).mockReturnValueOnce({ referrer: "invalid-sqid" });
        vi.mocked(validateAndDecodeSqid).mockImplementationOnce(() => {
            throw new Error("Invalid Referral Id");
        });

        const result = await generateHandler(event);

        expect(createProblem).toHaveBeenCalledWith(event, 400, "Bad Request", "Invalid Referral Id");
        expect(result).toEqual({ error: 400, message: "Bad Request" });
    });

    it("should return error for non-existent referrer account", async () => {
        const event = mockEvent();
        const { UUID } = await import("../../../../server/utils/uuid");
        const referrerUuid = UUID.fromArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
        
        const { getAccountByQueryId } = await import("../../../../server/utils/database");
        const { getQuery } = await import("h3");
        const { validateAndDecodeSqid } = await import("../../../../server/utils/sqids");
        const { createProblem } = await import("../../../../server/utils/problem");
        
        vi.mocked(getQuery).mockReturnValueOnce({ referrer: "valid-sqid" });
        vi.mocked(validateAndDecodeSqid).mockReturnValueOnce(referrerUuid);
        vi.mocked(getAccountByQueryId).mockResolvedValueOnce(null); // Account not found

        const result = await generateHandler(event);

        expect(createProblem).toHaveBeenCalledWith(event, 400, "Bad Request", "Invalid Referral Id");
        expect(result).toEqual({ error: 400, message: "Bad Request" });
    });

    it("should return error for self-referral", async () => {
        const event = mockEvent();
        const { UUID } = await import("../../../../server/utils/uuid");
        const selfUuid = UUID.fromArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
        const selfAccount = mockAccount();
        // Mock the new account to have the same queryId as referrer UUID for self-referral
        const newAccount = { ...selfAccount, queryId: selfUuid };
        
        const { createAccount, getAccountByQueryId } = await import("../../../../server/utils/database");
        const { getQuery } = await import("h3");
        const { validateAndDecodeSqid } = await import("../../../../server/utils/sqids");
        const { createProblem } = await import("../../../../server/utils/problem");
        
        vi.mocked(getQuery).mockReturnValueOnce({ referrer: "self-sqid" });
        vi.mocked(validateAndDecodeSqid).mockReturnValueOnce(selfUuid);
        vi.mocked(getAccountByQueryId).mockResolvedValueOnce(selfAccount);
        vi.mocked(createAccount).mockResolvedValueOnce(newAccount);

        const result = await generateHandler(event);

        expect(createProblem).toHaveBeenCalledWith(event, 400, "Bad Request", "Invalid Referral Id");
        expect(result).toEqual({ error: 400, message: "Bad Request" });
    });
});