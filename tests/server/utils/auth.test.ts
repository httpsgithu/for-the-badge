import { describe, it, expect, vi, beforeEach } from "vitest";
import { 
    requireAuth,
    requirePartialAuth,
    getAuthInfo,
    isAuthenticated,
    isPinVerificationRequired,
    requireAdmin
} from "../../../server/utils/auth";
import { mockEvent, mockAccount } from "../../utils/mocks";

// Mock the problem utility
vi.mock("../../../server/utils/problem", () => ({
    createProblem: vi.fn((event, status, message) => new Error(`${status}: ${message}`))
}));

describe("server/utils/auth", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("requireAuth", () => {
        it("should return auth info for fully authenticated user", () => {
            const account = mockAccount();
            const event = mockEvent({
                context: {
                    auth: {
                        isAuthenticated: true,
                        requiresPinVerification: false,
                        isAdmin: false,
                        account
                    }
                }
            });

            const result = requireAuth(event);

            expect(result).toEqual({
                isAuthenticated: true,
                isVerified: true,
                isAdmin: false,
                queryId: account.queryId,
                account
            });
        });

        it("should throw error if user is not authenticated", () => {
            const event = mockEvent({
                context: {
                    auth: {
                        isAuthenticated: false,
                        requiresPinVerification: false,
                        isAdmin: false,
                        account: null
                    }
                }
            });

            expect(() => requireAuth(event)).toThrow("401: Authentication required");
        });

        it("should throw error if PIN verification is required", () => {
            const event = mockEvent({
                context: {
                    auth: {
                        isAuthenticated: true,
                        requiresPinVerification: true,
                        isAdmin: false,
                        account: mockAccount()
                    }
                }
            });

            expect(() => requireAuth(event)).toThrow("401: PIN verification required");
        });
    });

    describe("requirePartialAuth", () => {
        it("should return auth info for authenticated user with PIN required", () => {
            const account = mockAccount();
            const event = mockEvent({
                context: {
                    auth: {
                        isAuthenticated: true,
                        requiresPinVerification: true,
                        isAdmin: false,
                        account
                    }
                }
            });

            const result = requirePartialAuth(event);

            expect(result).toEqual({
                isAuthenticated: true,
                isVerified: false,
                isAdmin: false,
                queryId: account.queryId,
                account
            });
        });

        it("should throw error if user is not authenticated", () => {
            const event = mockEvent({
                context: {
                    auth: {
                        isAuthenticated: false,
                        requiresPinVerification: false,
                        isAdmin: false,
                        account: null
                    }
                }
            });

            expect(() => requirePartialAuth(event)).toThrow("401: Authentication required");
        });
    });

    describe("getAuthInfo", () => {
        it("should return auth info for authenticated user", () => {
            const account = mockAccount();
            const event = mockEvent({
                context: {
                    auth: {
                        isAuthenticated: true,
                        requiresPinVerification: false,
                        isAdmin: true,
                        account
                    }
                }
            });

            const result = getAuthInfo(event);

            expect(result).toEqual({
                isAuthenticated: true,
                isVerified: true,
                isAdmin: true,
                queryId: account.queryId,
                account
            });
        });

        it("should return auth info for unauthenticated user", () => {
            const event = mockEvent({
                context: {
                    auth: {
                        isAuthenticated: false,
                        requiresPinVerification: false,
                        isAdmin: false,
                        account: null
                    }
                }
            });

            const result = getAuthInfo(event);

            expect(result).toEqual({
                isAuthenticated: false,
                isVerified: true,
                isAdmin: false,
                queryId: undefined,
                account: null
            });
        });
    });

    describe("isAuthenticated", () => {
        it("should return true for authenticated user", () => {
            const event = mockEvent({
                context: {
                    auth: {
                        isAuthenticated: true,
                        requiresPinVerification: false,
                        isAdmin: false,
                        account: mockAccount()
                    }
                }
            });

            const result = isAuthenticated(event);

            expect(result).toBe(true);
        });

        it("should return false for unauthenticated user", () => {
            const event = mockEvent({
                context: {
                    auth: {
                        isAuthenticated: false,
                        requiresPinVerification: false,
                        isAdmin: false,
                        account: null
                    }
                }
            });

            const result = isAuthenticated(event);

            expect(result).toBe(false);
        });

        it("should return false if auth context is missing", () => {
            const event = mockEvent({
                context: {}
            });

            const result = isAuthenticated(event);

            expect(result).toBe(false);
        });
    });

    describe("isPinVerificationRequired", () => {
        it("should return true if PIN verification is required", () => {
            const event = mockEvent({
                context: {
                    auth: {
                        isAuthenticated: true,
                        requiresPinVerification: true,
                        isAdmin: false,
                        account: mockAccount()
                    }
                }
            });

            const result = isPinVerificationRequired(event);

            expect(result).toBe(true);
        });

        it("should return false if PIN verification is not required", () => {
            const event = mockEvent({
                context: {
                    auth: {
                        isAuthenticated: true,
                        requiresPinVerification: false,
                        isAdmin: false,
                        account: mockAccount()
                    }
                }
            });

            const result = isPinVerificationRequired(event);

            expect(result).toBe(false);
        });
    });

    describe("requireAdmin", () => {
        it("should return auth info for admin user", () => {
            const account = mockAccount({ isAdmin: true });
            const event = mockEvent({
                context: {
                    auth: {
                        isAuthenticated: true,
                        requiresPinVerification: false,
                        isAdmin: true,
                        account
                    }
                }
            });

            const result = requireAdmin(event);

            expect(result).toEqual({
                isAuthenticated: true,
                isVerified: true,
                isAdmin: true,
                queryId: account.queryId,
                account
            });
        });

        it("should throw error for non-admin user", () => {
            const event = mockEvent({
                context: {
                    auth: {
                        isAuthenticated: true,
                        requiresPinVerification: false,
                        isAdmin: false,
                        account: mockAccount()
                    }
                }
            });

            expect(() => requireAdmin(event)).toThrow("403: Forbidden");
        });
    });
});