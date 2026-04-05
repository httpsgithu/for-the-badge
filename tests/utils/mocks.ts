import { vi } from "vitest";
import type { Account } from "../../shared/models/Account";
import { UUID } from "../../server/utils/uuid";

// Mock account data for testing - function to allow overrides
export const mockAccount = (overrides: Partial<Account> = {}): Account => ({
    queryId: UUID.fromArray([1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
    accountHash: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64]),
    hashVersion: 1,
    credits: 100,
    isAdmin: false,
    pinEnabled: false,
    refundCount: 0,
    referrer: null,
    creditsApplied: false,
    promoCreditsApplied: null,
    lastAccessed: new Date("2025-01-01T00:00:00Z"),
    createdAt: new Date("2025-01-01T00:00:00Z"),
    updatedAt: new Date("2025-01-01T00:00:00Z"),
    ...overrides
});

export const mockAdminAccount = () => mockAccount({
    queryId: UUID.fromArray([2, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
    isAdmin: true,
    credits: 1000
});

export const mockAccountWithPin = () => mockAccount({
    queryId: UUID.fromArray([3, 0, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
    pinEnabled: true,
});

// Mock event object for API handlers
export const mockEvent = (overrides = {}) => ({
    node: {
        req: {
            url: "/api/test",
            method: "POST",
            headers: {
                "user-agent": "test-agent",
                "origin": "http://localhost:3000",
                "x-forwarded-for": "*********"
            }
        },
        res: {
            statusCode: 200,
            setHeader: vi.fn(),
            writeHead: vi.fn(),
            end: vi.fn()
        }
    },
    context: {
        auth: {
            isAuthenticated: false,
            requiresPinVerification: false,
            isAdmin: false,
            account: null
        }
    },
    ...overrides
});

// Legacy alias for backward compatibility
export const createMockEvent = (overrides = {}) => ({
    node: {
        req: {
            url: "/api/test",
            method: "POST",
            headers: {
                "user-agent": "test-agent",
                "origin": "http://localhost:3000",
                "x-forwarded-for": "127.0.0.1"
            }
        },
        res: {
            statusCode: 200,
            setHeader: vi.fn(),
            writeHead: vi.fn(),
            end: vi.fn()
        }
    },
    context: {
        auth: {
            isAuthenticated: false,
            requiresPinVerification: false,
            isAdmin: false,
            account: null
        }
    },
    ...overrides
});

// Mock authenticated event
export const createAuthenticatedEvent = (account = mockAccount()) => 
    mockEvent({
        context: {
            auth: {
                isAuthenticated: true,
                requiresPinVerification: false,
                isAdmin: account.isAdmin,
                account
            }
        }
    });

// Mock database functions
export const mockDatabase = {
    findAccountByUserId: vi.fn(),
    getAccountByQueryId: vi.fn(),
    createAccount: vi.fn(),
    updateAccount: vi.fn(),
    deleteAccount: vi.fn()
};

// Mock session functions
export const mockSession = {
    getUserSession: vi.fn(),
    setSession: vi.fn(),
    setSafeSession: vi.fn(),
    refreshAccountSession: vi.fn(),
    clearAuthSession: vi.fn(),
    updateSessionState: vi.fn()
};

// Mock crypto functions
export const mockCrypto = {
    hash: vi.fn(),
    verify: vi.fn(),
    randomToken: vi.fn(() => "mock-random-token"),
    fingerprint: vi.fn(() => "mock-fingerprint"),
    generateAccountHash: vi.fn(() => new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64])),
    verifyAccountHash: vi.fn(() => true)
};

// Mock file processor functions
export const mockFileProcessor = {
    extractTextFromPDF: vi.fn(() => Promise.resolve("Mock PDF text")),
    extractTextFromImage: vi.fn(() => Promise.resolve("Mock image text")),
    extractTextWithDocling: vi.fn(() => Promise.resolve("Mock docling text")),
    extractTextWithPageCount: vi.fn(() => Promise.resolve({ text: "Mock text", pageCount: 1 })),
    detectDocumentType: vi.fn(() => "pdf"),
    cleanTextForAnalysis: vi.fn((text) => text),
    highlightPDFWithDocling: vi.fn(() => Promise.resolve(Buffer.from("mock pdf")))
};

// Mock LLM provider
export const mockLLMProvider = {
    analyze: vi.fn(() => Promise.resolve('{"keyPoints": [], "redFlags": [], "summary": "Mock analysis"}')),
    getName: vi.fn(() => "Mock LLM")
};

// Mock Stripe functions
export const mockStripe = {
    checkout: {
        sessions: {
            create: vi.fn(() => Promise.resolve({ url: "https://checkout.stripe.com/mock" })),
            retrieve: vi.fn(() => Promise.resolve({ payment_status: "paid" }))
        }
    },
    webhooks: {
        constructEvent: vi.fn(() => ({
            type: "checkout.session.completed",
            data: {
                object: {
                    metadata: {
                        accountId: "1234567890123456",
                        documents: "5"
                    }
                }
            }
        }))
    }
};

// Mock pricing functions
export const mockPricing = {
    getPricingTierInfo: vi.fn(() => ({
        tier: "Basic",
        price: 5,
        pageRange: "1-10 pages"
    })),
    calculatePriceFromPageCount: vi.fn(() => 5)
};

// Mock problem creation
export const mockCreateProblem = vi.fn((event, status, title, detail) => ({
    statusCode: status,
    statusMessage: title,
    data: {
        type: "about:blank",
        title,
        status,
        detail
    }
}));

// Reset all mocks helper
export const resetAllMocks = () => {
    vi.clearAllMocks();
    Object.values(mockDatabase).forEach(mock => mock.mockReset());
    Object.values(mockSession).forEach(mock => mock.mockReset());
    Object.values(mockCrypto).forEach(mock => mock.mockReset());
    Object.values(mockFileProcessor).forEach(mock => mock.mockReset());
    Object.values(mockPricing).forEach(mock => mock.mockReset());
    mockCreateProblem.mockReset();
};