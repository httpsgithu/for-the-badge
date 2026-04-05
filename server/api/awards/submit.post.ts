import { useDrizzle, eq, or } from "../../utils/drizzle";
import { developerAwards } from "../../database/schemas";
import { createProblem } from "../../utils/problem";
import { UUID } from "../../utils/uuid";
import { encryptAwardsData } from "../../utils/awardsEncryption";

interface SubmissionPayload {
    fullName: string;
    email: string;
    age: number;
    location?: string;
    projectName: string;
    projectDescription: string;
    repositoryUrl: string;
    websiteUrl?: string;
    privacyAlignment: string;
    whyDeserve: string;
    showOnStarboard?: boolean;
    consent: boolean;
}

// Helper function to validate URLs
function isValidUrl(url: string, allowedDomains?: string[]): boolean
{
    try
    {
        const urlObj = new URL(url);
        if (allowedDomains)
        {
            return allowedDomains.some(domain => urlObj.hostname.includes(domain));
        }
        return true;
    }
    catch
    {
        return false;
    }
}

// Helper function to validate email
function isValidEmail(email: string): boolean
{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export default defineEventHandler(async (event) =>
{
    try
    {
        const { auth } = event.context;

        // Check authentication
        if (!auth?.account?.queryId)
        {
            return createProblem(event, 401, "Unauthorized", "You must be logged in to submit an application");
        }

        const body = await readBody<SubmissionPayload>(event);

        // Validate consent
        if (!body.consent)
        {
            return createProblem(event, 400, "Consent Required", "You must agree to the terms and conditions");
        }

        // Validate required fields
        if (!body.fullName || !body.email || !body.age || !body.projectName || 
            !body.projectDescription || !body.repositoryUrl || !body.privacyAlignment || !body.whyDeserve)
        {
            return createProblem(event, 400, "Missing Required Fields", "Please fill in all required fields");
        }

        // Validate email format
        if (!isValidEmail(body.email))
        {
            return createProblem(event, 400, "Invalid Email", "Please provide a valid email address");
        }

        // Validate age (must be a positive number, reasonable range for "young developer")
        if (body.age < 13 || body.age > 35)
        {
            return createProblem(event, 400, "Invalid Age", "Age must be between 13 and 35 years");
        }

        // Validate repository URL
        if (!isValidUrl(body.repositoryUrl, ["github.com", "gitlab.com", "bitbucket.org", "codeberg.org"]))
        {
            return createProblem(event, 400, "Invalid Repository URL", "Please provide a valid repository URL from GitHub, GitLab, Bitbucket, or Codeberg");
        }

        // Validate website URL if provided
        if (body.websiteUrl && !isValidUrl(body.websiteUrl))
        {
            return createProblem(event, 400, "Invalid Website URL", "Please provide a valid website URL");
        }

        // Validate text lengths
        if (body.fullName.length > 100)
        {
            return createProblem(event, 400, "Name Too Long", "Full name must be less than 100 characters");
        }

        if (body.projectName.length > 200)
        {
            return createProblem(event, 400, "Project Name Too Long", "Project name must be less than 200 characters");
        }

        if (body.projectDescription.length > 5000)
        {
            return createProblem(event, 400, "Description Too Long", "Project description must be less than 5000 characters (approximately 500 words)");
        }

        if (body.privacyAlignment.length > 3000)
        {
            return createProblem(event, 400, "Privacy Alignment Too Long", "Privacy alignment must be less than 3000 characters (approximately 300 words)");
        }

        if (body.whyDeserve.length > 2000)
        {
            return createProblem(event, 400, "Response Too Long", "Why you deserve this award must be less than 2000 characters (approximately 200 words)");
        }

        // Check deadline (March 1st, 2026)
        const deadline = new Date("2026-03-01T23:59:59Z");
        const now = new Date();
        
        if (now > deadline)
        {
            return createProblem(event, 400, "Submissions Closed", "The submission deadline has passed");
        }

        const db = useDrizzle();
        const accountUUID = auth.account.queryId;

        // Check for duplicate submission by account (one submission per account)
        const existingSubmission = await db
            .select()
            .from(developerAwards)
            .where(eq(developerAwards.accountId, accountUUID.getBytes()))
            .limit(1);

        // Allow resubmission if the previous submission was rejected
        if (existingSubmission.length > 0)
        {
            if (existingSubmission[0].status !== "rejected")
            {
                return createProblem(event, 400, "Duplicate Submission", "You have already submitted an application. Only one submission per account is allowed.");
            }
            // Delete the rejected submission to allow resubmission
            await db
                .delete(developerAwards)
                .where(eq(developerAwards.accountId, accountUUID.getBytes()));
        }

        // Encrypt sensitive personal and detailed information
        // Note: projectName, projectDescription, repositoryUrl, and websiteUrl are not encrypted
        // because they may be shown publicly on the starboard if the user opts in
        const encryptedFullName = encryptAwardsData(body.fullName);
        const encryptedEmail = encryptAwardsData(body.email);
        const encryptedAge = encryptAwardsData(body.age.toString());
        const encryptedLocation = body.location ? encryptAwardsData(body.location) : null;
        const encryptedPrivacyAlignment = encryptAwardsData(body.privacyAlignment);
        const encryptedWhyDeserve = encryptAwardsData(body.whyDeserve);

        // Insert the submission with encrypted data
        await db.insert(developerAwards).values({
            accountId: accountUUID.getBytes(),
            fullName: encryptedFullName,
            email: encryptedEmail,
            age: encryptedAge, // Encrypted and stored as text
            location: encryptedLocation,
            projectName: body.projectName, // Public starboard data - not encrypted
            projectDescription: body.projectDescription, // Public starboard data - not encrypted
            repositoryUrl: body.repositoryUrl, // Public starboard data - not encrypted
            websiteUrl: body.websiteUrl || null, // Public starboard data - not encrypted
            privacyAlignment: encryptedPrivacyAlignment,
            whyDeserve: encryptedWhyDeserve,
            showOnStarboard: body.showOnStarboard !== false, // Default to true
            status: "pending",
        });

        return {
            success: true,
            message: "Application submitted successfully! We'll review your submission and contact you via email.",
        };
    }
    catch (error)
    {
        console.error("Error submitting award application:", error);
        return createProblem(event, 500, "Submission Failed", "An error occurred while submitting your application. Please try again.");
    }
});
