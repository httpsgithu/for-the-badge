import { describe, it, expect } from "vitest";
import { getIcon, searchIcons, getPopularIcons, generateIconSVG } from "../../../server/utils/icons";

describe("Icon Utilities", () =>
{
    describe("getIcon", () =>
    {
        it("should return icon data for a valid slug", () =>
        {
            const icon = getIcon("react");
            
            expect(icon).toBeDefined();
            expect(icon).toHaveProperty("slug");
            expect(icon).toHaveProperty("title");
            expect(icon).toHaveProperty("hex");
            expect(icon).toHaveProperty("path");
            expect(icon?.slug).toBe("react");
        });

        it("should return null for an invalid slug", () =>
        {
            const icon = getIcon("nonexistenticon12345");
            
            expect(icon).toBeNull();
        });

        it("should handle case-insensitive slugs", () =>
        {
            const icon = getIcon("GitHub");
            
            expect(icon).toBeDefined();
            expect(icon?.slug).toBe("github");
        });
    });

    describe("searchIcons", () =>
    {
        it("should return matching icons for a search query", () =>
        {
            const icons = searchIcons("react", 10);
            
            expect(Array.isArray(icons)).toBe(true);
            expect(icons.length).toBeGreaterThan(0);
            expect(icons.some(icon => icon.slug === "react")).toBe(true);
        });

        it("should return empty array for empty query", () =>
        {
            const icons = searchIcons("", 10);
            
            expect(Array.isArray(icons)).toBe(true);
            expect(icons.length).toBe(0);
        });

        it("should respect the limit parameter", () =>
        {
            const icons = searchIcons("a", 5);
            
            expect(icons.length).toBeLessThanOrEqual(5);
        });

        it("should find icons by title or slug", () =>
        {
            const icons = searchIcons("python", 10);
            
            expect(icons.length).toBeGreaterThan(0);
            expect(icons.some(icon => icon.title.toLowerCase().includes("python"))).toBe(true);
        });
    });

    describe("getPopularIcons", () =>
    {
        it("should return a list of popular icons", () =>
        {
            const icons = getPopularIcons(10);
            
            expect(Array.isArray(icons)).toBe(true);
            expect(icons.length).toBeGreaterThan(0);
            expect(icons.length).toBeLessThanOrEqual(10);
        });

        it("should include common icons like react, typescript, javascript", () =>
        {
            const icons = getPopularIcons(20);
            const slugs = icons.map(icon => icon.slug);
            
            expect(slugs).toContain("react");
            expect(slugs).toContain("typescript");
            expect(slugs).toContain("javascript");
        });
    });

    describe("generateIconSVG", () =>
    {
        it("should generate SVG markup for an icon", () =>
        {
            const icon = getIcon("react");
            
            if (icon)
            {
                const svg = generateIconSVG(icon.path, 10, 17.5, 16, "#FFFFFF");
                
                expect(svg).toContain("<g transform=");
                expect(svg).toContain("<path d=");
                expect(svg).toContain("fill=\"#FFFFFF\"");
            }
        });

        it("should apply correct scaling based on size", () =>
        {
            const icon = getIcon("react");
            
            if (icon)
            {
                const svg = generateIconSVG(icon.path, 10, 17.5, 24, "#000000");
                
                expect(svg).toContain("scale(1)"); // 24/24 = 1
                expect(svg).toContain("fill=\"#000000\"");
            }
        });
    });
});
