import { requirePartialAuth } from "../../../utils/auth";
import { verifyAndMigratePin } from "../../../utils/database";
import { isValidLuhn } from "../../../utils/luhn";
import { createProblem } from "../../../utils/problem";

export default defineEventHandler(async (event) =>
{
    const accountId = getRouterParam(event, "id");
    const body = await readBody(event);

    if (!accountId || !/^\d{16}$/.test(accountId) || !isValidLuhn(accountId))
    {
        return createProblem(event, 400, "Bad Request");
    }

    // Require partial authentication (PIN endpoints work even when PIN verification is pending)
    const { account } = requirePartialAuth(event);

    const { pin } = body;

    if (!pin)
    {
        return createProblem(event, 400, "PIN is required");
    }

    const result = await verifyAndMigratePin(account.queryId, pin);

    if (!result.valid)
    {
        if (result.missingPin)
        {
            return createProblem(event, 400, "No PIN configured for this account");
        }

        return createProblem(event, 401, "Invalid PIN");
    }

    return {
        message: "PIN verified successfully",
        verified: true,
    };
});