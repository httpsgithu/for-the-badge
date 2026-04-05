import { requireAuth } from "../../../utils/auth";
import { deleteAccount, getAccountPinHash, verifyAndMigratePin } from "../../../utils/database";
import { isValidLuhn } from "../../../utils/luhn";
import { createProblem } from "../../../utils/problem";

export default defineEventHandler(async (event) => {
    const accountId = getRouterParam(event, "id");
    
    const body = await readBody(event);

    if (!accountId || !/^\d{16}$/.test(accountId) || !isValidLuhn(accountId)) {
        return createProblem(event, 400, "Bad Request", "Invalid account ID format", null, {
            expectedFormat: "16-digit number with valid checksum"
        });
    }

    try {
        // Require full authentication
        const { account } = requireAuth(event);

        if (!body?.confirmAccountNumber || body.confirmAccountNumber !== accountId) {
            return createProblem(event, 400, "Bad Request", "Account confirmation number is required and must match", null, {
                message: "account number mismatch",
                provided: !!body?.confirmAccountNumber,
                matches: body?.confirmAccountNumber === accountId,
                expectedFormat: "16-digit account number"
            });
        }

        // Verify PIN if account has one (never trust session for pin presence)
        const pinHash = await getAccountPinHash(account.queryId);
        if (pinHash)
        {
            const pin = body?.pin?.toString();
            if (!pin)
            {
                return createProblem(event, 400, "Bad Request", "PIN is required for accounts with PIN protection", null, {
                    message: "no pin provided for pinned account",
                    hasPinEnabled: true,
                    expectedField: "pin"
                });
            }

            const pinResult = await verifyAndMigratePin(account.queryId, pin, { pinHash });

            if (!pinResult.valid)
            {
                return createProblem(event, 401, "Unauthorized", "Invalid PIN provided");
            }
        }

        try
        {
            await deleteAccount(account.queryId);
            
            await clearUserSession(event);

            setResponseStatus(event, 204);
            return null;
        }
        catch (deleteError)
        {
            return createProblem(event, 500, "Internal Server Error", "Account deletion failed");
        }
    } catch (authError) {
        throw authError; // Let requireAuth handle the error response
    }
});