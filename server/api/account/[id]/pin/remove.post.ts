import { requirePartialAuth } from "../../../../utils/auth";
import { updateAccount, verifyAndMigratePin } from "../../../../utils/database";
import { isValidLuhn } from "../../../../utils/luhn";
import { createProblem } from "../../../../utils/problem";
import { updateUser } from "../../../../utils/composables";

export default defineEventHandler(async (event) => {
    const accountId = getRouterParam(event, "id");
    const body = await readBody(event);

    if (!accountId || !/^\d{16}$/.test(accountId) || !isValidLuhn(accountId)) {
        return createProblem(event, 400, "Bad Request");
    }

    // Require partial authentication (PIN endpoints work even when PIN verification is pending)
    const { account } = requirePartialAuth(event);


    const { pin } = body;

    if (!pin) {
        return createProblem(event, 400, "PIN is required to confirm removal");
    }

    // Verify current PIN before allowing removal (includes pepper migration)
    const pinResult = await verifyAndMigratePin(account.queryId, pin);

    if (!pinResult.valid) {
        if (pinResult.missingPin) {
            return createProblem(event, 400, "No PIN configured to remove");
        }

        return createProblem(event, 401, "Invalid PIN");
    }

    // Remove the PIN
    await updateAccount(account.queryId, { pin: null });

    // Update the session to reflect PIN is no longer enabled
    await updateUser(event, { pinEnabled: false });

    return { message: "PIN removed successfully" };
});