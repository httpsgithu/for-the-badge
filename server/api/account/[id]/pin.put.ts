import { requirePartialAuth } from "../../../utils/auth";
import { getAccountPinHash, updateAccount } from "../../../utils/database";
import { isValidLuhn } from "../../../utils/luhn";
import { createProblem } from "../../../utils/problem";
import { updateUser } from "../../../utils/composables";

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

    // Check if PIN already exists (do not trust session state)
    const existingPinHash = await getAccountPinHash(account.queryId);
    if (existingPinHash)
    {
        return createProblem(event, 409, "PIN already exists");
    }

    const { pin } = body;

    if (!pin || pin.length < 4 || pin.length > 8)
    {
        return createProblem(event, 400, "PIN must be between 4 and 8 characters");
    }

    await updateAccount(account.queryId, { pin });

    // Update the session with PIN enabled
    await updateUser(event, { pinEnabled: true });

    return { message: "PIN created successfully" };
});