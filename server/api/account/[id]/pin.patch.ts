import { requirePartialAuth } from "../../../utils/auth";
import { updateAccount, verifyAndMigratePin } from "../../../utils/database";
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


    const {
        currentPin,
        newPin,
    } = body;

    if (!currentPin || !newPin)
    {
        return createProblem(event, 400, "Both current PIN and new PIN are required");
    }

    if (newPin.length < 4 || newPin.length > 8)
    {
        return createProblem(event, 400, "New PIN must be between 4 and 8 characters");
    }

    // Verify current PIN before allowing update (includes pepper migration)
    const currentPinResult = await verifyAndMigratePin(account.queryId, currentPin);

    if (!currentPinResult.valid)
    {
        if (currentPinResult.missingPin)
        {
            return createProblem(event, 400, "No existing PIN to update");
        }

        return createProblem(event, 401, "Current PIN is invalid");
    }

    // Update to new PIN
    await updateAccount(account.queryId, { pin: newPin });

    // Session doesn't need to be updated as PIN change doesn't affect session data

    return { message: "PIN updated successfully" };
});