import { describe, it, expect } from "vitest";

import { normalizeOpenAIBaseURL, normalizeOpenAIApiKey } from "../../../server/utils/openai";

describe("server/utils/openai", () => {
    describe("normalizeOpenAIBaseURL", () => {
        it("should append /v1 when missing", () => {
            expect(normalizeOpenAIBaseURL("https://example.com")).toBe("https://example.com/v1");
        });

        it("should not double-append /v1", () => {
            expect(normalizeOpenAIBaseURL("https://example.com/v1")).toBe("https://example.com/v1");
        });

        it("should trim whitespace and trailing slashes", () => {
            expect(normalizeOpenAIBaseURL("  https://example.com///  ")).toBe("https://example.com/v1");
            expect(normalizeOpenAIBaseURL("https://example.com/v1///")).toBe("https://example.com/v1");
        });
    });

    describe("normalizeOpenAIApiKey", () => {
        it("should trim whitespace", () => {
            expect(normalizeOpenAIApiKey("  sk-test  ")).toBe("sk-test");
        });

        it("should strip a leading Bearer prefix (case-insensitive)", () => {
            expect(normalizeOpenAIApiKey("Bearer sk-test")).toBe("sk-test");
            expect(normalizeOpenAIApiKey("bearer sk-test")).toBe("sk-test");
            expect(normalizeOpenAIApiKey("BEARER sk-test")).toBe("sk-test");
            expect(normalizeOpenAIApiKey("  Bearer   sk-test  ")).toBe("sk-test");
        });

        it("should not alter keys without a Bearer prefix", () => {
            expect(normalizeOpenAIApiKey("sk-test")).toBe("sk-test");
        });
    });
});
