import { defineEventHandler, getQuery, createError } from "h3";

export default defineEventHandler(async (event) =>
{
    try
    {
        const query = getQuery(event);
        const searchQuery = (query.q as string) || "";

        // If no search query, return popular icons
        if (!searchQuery || searchQuery.trim().length === 0)
        {
            const popularIcons = getPopularIcons(30);
            return {
                success: true,
                icons: popularIcons,
                count: popularIcons.length,
            };
        }

        // Search for icons matching the query
        const limit = query.limit ? parseInt(query.limit as string, 10) : 50;
        const icons = searchIcons(searchQuery, limit);

        return {
            success: true,
            icons,
            count: icons.length,
        };
    }
    catch (error)
    {
        console.error("Error searching icons:", error);
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
            data: {
                type: "https://tools.ietf.org/html/rfc7231#section-6.6.1",
                title: "Internal Server Error",
                status: 500,
                detail: "Failed to search icons",
            },
        });
    }
});
