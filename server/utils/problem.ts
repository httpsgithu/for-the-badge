import type { H3Event } from "h3";
import { createError } from "h3";

type Opt<T> = T | null;

/**
 * Problem details structure
 */
interface ProblemDetails {
    type: string;
    title: string;
    status: number;
    detail ?: string;
    error ?: {
        message: string;
        stack ?: string;
        name: string;
    };
    [key : string]: any;
}

/**
 * Creates problem details without throwing
 * @param event - H3 event context
 * @param status - HTTP status code
 * @param title - Problem title
 * @param detail - Optional detailed description
 * @param type - Optional problem type URI
 * @param extras - Optional additional properties
 * @param error - Optional original error
 * @returns H3 Error object ready to be thrown
 */
export function createProblem(event : H3Event, status : number, title : string, detail ?: Opt<string>, type ?: Opt<string>, extras ?: Opt<Record<string, any>>, error ?: Opt<Error>)
{

    const isDevelopment = process.env.NODE_ENV === "development";

    const body : ProblemDetails = {
        type: type || "about:blank",
        title,
        status,
    };

    if (detail)
    {
        body.detail = detail;
    }

    if (extras && typeof extras === "object")
    {
        for (const k of Object.keys(extras))
        {
            if (!(k in body))
            {
                body[k] = extras[k];
            }
        }
    }

    // In development, include error details for debugging
    if (isDevelopment && error)
    {
        body.error = {
            message: error.message,
            stack: error.stack,
            name: error.name,
        };
    }

    return createError({
        statusCode: status,
        statusMessage: title,
        data: body,
        cause: error, // Include the original error as cause for logging
    });
}

