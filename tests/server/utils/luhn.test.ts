import { describe, it, expect } from "vitest";
import { luhnCheckDigit, isValidLuhn, generateLuhnNumber } from "../../../server/utils/luhn";

describe("server/utils/luhn", () => {
    describe("luhnCheckDigit", () => {
        it("should calculate correct Luhn check digit", () => {
            expect(luhnCheckDigit("123456789012345")).toBe(2);
            expect(luhnCheckDigit("411111111111111")).toBe(1);
            expect(luhnCheckDigit("555555555555444")).toBe(4);
            expect(luhnCheckDigit("378282246310005")).toBe(2);
        });

        it("should handle single digit numbers", () => {
            expect(luhnCheckDigit("1")).toBe(8);
            expect(luhnCheckDigit("2")).toBe(6);
            expect(luhnCheckDigit("9")).toBe(1);
        });

        it("should handle empty string", () => {
            expect(luhnCheckDigit("")).toBe(0);
        });

        it("should produce check digit that makes valid Luhn number", () => {
            const baseNumbers = ["123456789", "987654321", "555444333222111"];
            
            for (const base of baseNumbers) {
                const checkDigit = luhnCheckDigit(base);
                const fullNumber = base + checkDigit;
                expect(isValidLuhn(fullNumber)).toBe(true);
            }
        });
    });

    describe("isValidLuhn", () => {
        it("should validate correct Luhn numbers", () => {
            expect(isValidLuhn("1234567890123457")).toBe(false); // Invalid
            expect(isValidLuhn("4111111111111111")).toBe(true);
            expect(isValidLuhn("5555555555554444")).toBe(true);
            expect(isValidLuhn("3782822463100050")).toBe(false); // Invalid
        });

        it("should reject incorrect Luhn numbers", () => {
            expect(isValidLuhn("1234567890123456")).toBe(false);
            expect(isValidLuhn("4111111111111112")).toBe(false);
            expect(isValidLuhn("5555555555554445")).toBe(false);
            expect(isValidLuhn("3782822463100051")).toBe(false);
        });

        it("should handle single digit numbers", () => {
            expect(isValidLuhn("0")).toBe(false); // Single digits are invalid
            expect(isValidLuhn("1")).toBe(false);
            expect(isValidLuhn("18")).toBe(true);
            expect(isValidLuhn("26")).toBe(true);
        });

        it("should handle empty string as invalid", () => {
            expect(isValidLuhn("")).toBe(false);
        });

        it("should handle non-numeric strings as invalid", () => {
            expect(isValidLuhn("abcd")).toBe(false);
            expect(isValidLuhn("123a")).toBe(false);
            expect(isValidLuhn("12 34")).toBe(false);
        });
    });

    describe("generateLuhnNumber", () => {
        it("should generate valid Luhn numbers of default length", () => {
            const number = generateLuhnNumber();
            expect(number.length).toBe(16); // Default length is 15 digits + 1 check digit
            expect(isValidLuhn(number)).toBe(true);
            expect(/^\d+$/.test(number)).toBe(true);
        });

        it("should generate different numbers on multiple calls", () => {
            const numbers = new Set();
            for (let i = 0; i < 100; i++) {
                numbers.add(generateLuhnNumber());
            }
            expect(numbers.size).toBeGreaterThan(95);
        });

        it("should generate consistent format", () => {
            const number = generateLuhnNumber();
            expect(number.length).toBe(16);
            expect(/^\d{16}$/.test(number)).toBe(true);
        });
    });
});