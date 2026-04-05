import { requireAuth } from "../../utils/auth";
import { isValidLuhn } from "../../utils/luhn";
import { createProblem } from "../../utils/problem";

export default defineEventHandler(async (event) =>
{
    const accountId = getRouterParam(event, "id");

    if (!accountId || !/^\d{16}$/.test(accountId) || !isValidLuhn(accountId))
    {
        return createProblem(event, 400, "Bad Request", "Invalid account ID format", null, {
            expectedFormat: "16-digit number with valid checksum",
            providedLength: accountId?.length || 0,
            isValidLuhn: isValidLuhn(accountId)
        });
    }

    // Require full authentication
    const { account } = requireAuth(event);

    const response : any = {
        id: accountId, // Return the cleartext ID from route parameter
        credits: account.credits,
        pinEnabled: account.pinEnabled,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
    };

    // Only include isAdmin if true
    if (account.isAdmin)
    {
        response.isAdmin = true;
    }

    return response;
});