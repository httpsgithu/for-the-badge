export default defineEventHandler(async () =>
{
    try
    {
        const response = await $fetch<Array<{
            login: string;
            id: number;
            avatar_url: string;
            html_url: string;
            contributions: number;
        }>>("https://api.github.com/repos/forthebadge/for-the-badge/contributors", {
            headers: {
                "Accept": "application/vnd.github+json",
                "User-Agent": "forthebadge-v4",
            },
        });

        return {
            contributors: response,
            totalCount: response.length,
        };
    }
    catch (error)
    {
        console.error("Error fetching GitHub contributors:", error);
        throw createError({
            statusCode: 500,
            message: "Failed to fetch GitHub contributors",
        });
    }
});