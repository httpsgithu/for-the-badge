import { describe, it, expect } from "vitest";
import { toBinaryArray, binaryToString, isValidBinary, safeToBinaryArray, binaryEquals } from "../../../server/utils/binary";

describe("server/utils/binary", () => {
    describe("toBinaryArray", () => {
        it("should convert string to Uint8Array", () => {
            const result = toBinaryArray("hello");
            expect(result).toBeInstanceOf(Uint8Array);
            expect(Array.from(result)).toEqual([104, 101, 108, 108, 111]);
        });

        it("should handle empty string", () => {
            const result = toBinaryArray("");
            expect(result).toBeInstanceOf(Uint8Array);
            expect(result.length).toBe(0);
        });

        it("should handle unicode characters", () => {
            const result = toBinaryArray("🚀");
            expect(result).toBeInstanceOf(Uint8Array);
            expect(result.length).toBeGreaterThan(1);
        });
    });

    describe("binaryToString", () => {
        it("should convert Uint8Array to string", () => {
            const input = new Uint8Array([104, 101, 108, 108, 111]);
            const result = binaryToString(input);
            expect(result).toBe("hello");
        });

        it("should handle empty array", () => {
            const input = new Uint8Array([]);
            const result = binaryToString(input);
            expect(result).toBe("");
        });

        it("should handle unicode characters", () => {
            const original = "🚀";
            const binary = toBinaryArray(original);
            const result = binaryToString(binary);
            expect(result).toBe(original);
        });
    });

    describe("isValidBinary", () => {
        it("should validate Uint8Array", () => {
            expect(isValidBinary(new Uint8Array([1, 2, 3]))).toBe(true);
            expect(isValidBinary(new Uint8Array([]))).toBe(true);
        });

        it("should reject non-Uint8Array values", () => {
            expect(isValidBinary("string")).toBe(true); // String is valid BinaryInput
            expect(isValidBinary([1, 2, 3])).toBe(false);
            expect(isValidBinary(null)).toBe(false);
            expect(isValidBinary(undefined)).toBe(false);
            expect(isValidBinary(123)).toBe(false);
        });
    });

    describe("safeToBinaryArray", () => {
        it("should convert string to Uint8Array", () => {
            const result = safeToBinaryArray("hello");
            expect(result).toBeInstanceOf(Uint8Array);
            expect(Array.from(result)).toEqual([104, 101, 108, 108, 111]);
        });

        it("should return existing Uint8Array unchanged", () => {
            const input = new Uint8Array([1, 2, 3]);
            const result = safeToBinaryArray(input);
            expect(result).toBe(input);
        });

        it("should return null for invalid input", () => {
            expect(safeToBinaryArray(null)).toBe(null);
            expect(safeToBinaryArray(123)).toBe(null);
            expect(safeToBinaryArray([])).toBe(null);
        });
    });

    describe("binaryEquals", () => {
        it("should return true for equal arrays", () => {
            const a = new Uint8Array([1, 2, 3]);
            const b = new Uint8Array([1, 2, 3]);
            expect(binaryEquals(a, b)).toBe(true);
        });

        it("should return false for different arrays", () => {
            const a = new Uint8Array([1, 2, 3]);
            const b = new Uint8Array([1, 2, 4]);
            expect(binaryEquals(a, b)).toBe(false);
        });

        it("should return false for different length arrays", () => {
            const a = new Uint8Array([1, 2, 3]);
            const b = new Uint8Array([1, 2]);
            expect(binaryEquals(a, b)).toBe(false);
        });

        it("should handle empty arrays", () => {
            const a = new Uint8Array([]);
            const b = new Uint8Array([]);
            expect(binaryEquals(a, b)).toBe(true);
        });
    });
});