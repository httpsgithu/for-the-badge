import { vi } from "vitest";

// Mock runtime configuration for tests
const mockRuntimeConfig = {
    passwordPepper: Buffer.from("test-pepper-secret-key-for-testing", "utf8").toString("base64url"),
    accountHmacSecret: "test-hmac-secret-for-testing",
    badgeEncryptionKey: Buffer.from("test-badge-encryption-key-for-testing-32bytes!!", "utf8").toString("base64"),
};

// Global mocks for Nuxt runtime functions
global.useRuntimeConfig = vi.fn(() => mockRuntimeConfig);
global.defineEventHandler = vi.fn((handler) => handler);
global.getRouterParam = vi.fn();
global.readBody = vi.fn();
global.readMultipartFormData = vi.fn();
global.getUserSession = vi.fn();
global.setUserSession = vi.fn();
global.clearUserSession = vi.fn();
global.getQuery = vi.fn();
global.getHeader = vi.fn();
global.readRawBody = vi.fn().mockResolvedValue("mock-raw-body");

// Mock process.env for consistent testing
process.env.NODE_ENV = "test";
process.env.NUXT_SESSION_PASSWORD = "test-session-password";
process.env.PASSWORD_PEPPER = mockRuntimeConfig.passwordPepper;
process.env.ACCOUNT_HMAC_SECRET = mockRuntimeConfig.accountHmacSecret;
process.env.BADGE_ENCRYPTION_KEY = mockRuntimeConfig.badgeEncryptionKey;
process.env.REFERRAL_SQIDS_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

// Mock crypto.getRandomValues for consistent testing
Object.defineProperty(global, 'crypto', {
    value: {
        ...require('crypto'),
        getRandomValues: vi.fn((array) => {
            // Fill with predictable values for testing
            for (let i = 0; i < array.length; i++) {
                array[i] = i % 256;
            }
            return array;
        }),
        randomUUID: vi.fn(() => "test-uuid-1234-5678-9012-123456789012")
    }
});

// Setup console mocks to reduce noise in tests
global.console = {
    ...console,
    log: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn()
};