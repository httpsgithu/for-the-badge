import { getQuery } from "h3";
import type { Account } from "../../../shared/models/Account";
import { generateAccountHash } from "../../utils/crypto";
import { createAccount, getAccountByQueryId } from "../../utils/database";
import { luhnCheckDigit } from "../../utils/luhn";
import { createProblem } from "../../utils/problem";
import { setUser, SessionState } from "../../utils/composables";
import { validateAndDecodeSqid } from "../../utils/sqids";
import { UUID } from "../../utils/uuid";

export default defineEventHandler(async (event) => {
    // Rate limiting now handled by nuxt-security middleware

    // Check for referrer query parameter
    const query = getQuery(event) || {};
    const referrerSqid = query.referrer as string | undefined;
    let referrerUuid: UUID | null = null;

    if (referrerSqid) {
        try {
            // Validate and decode the referrer Sqid (includes canonical validation)
            referrerUuid = validateAndDecodeSqid(referrerSqid);

            // Verify the referrer account exists
            const referrerAccount = await getAccountByQueryId(referrerUuid);
            if (!referrerAccount) {
                return createProblem(event, 400, "Bad Request", "Invalid Referral Id");
            }

            // Self-referral prevention will be handled after account creation
            // since we can't predict the new account's UUID beforehand
        } catch (error) {
            // Any validation error returns "Invalid Referral Id"
            return createProblem(event, 400, "Bad Request", "Invalid Referral Id");
        }
    }

    const randomBytes = new Uint8Array(8);
    crypto.getRandomValues(randomBytes);

    let accountNumber = BigInt(0);
    for (let i = 0; i < randomBytes.length; i++) {
        accountNumber = (accountNumber << BigInt(8)) | BigInt(randomBytes[i]);
    }

    const min15Digit = BigInt("100000000000000");
    const max15Digit = BigInt("999999999999999");
    const baseId = (accountNumber % (max15Digit - min15Digit + BigInt(1)) + min15Digit).toString();
    const check = luhnCheckDigit(baseId);
    const accountId = `${baseId}${check}`;

    const accountHash = generateAccountHash(accountId, 1);

    const account: Account | null = await createAccount({
        accountHash,
        hashVersion: 1,
        isAdmin: false,
        referrer: referrerUuid,
    });

    if (!account) {
        return createProblem(event, 500, "Internal Server Error", "Failed to create account");
    }

    // Check for self-referral after account creation
    // Compare UUIDs directly
    if (referrerUuid && referrerUuid.equals(account.queryId)) {
        return createProblem(event, 400, "Bad Request", "Invalid Referral Id");
    }

    try {
        await setUser(event, account, SessionState.AUTHENTICATED, accountId);
    } catch (error) {
        return createProblem(event, 500, "Internal Server Error", "Failed to create user session");
    }

    return { id: accountId };
});