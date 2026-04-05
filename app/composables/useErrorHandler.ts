import type { ApiError, ModalConfig } from "~/types/api";

export const useErrorHandler = () =>
{
    const createErrorModal = (error : unknown) : ModalConfig =>
    {
        let title = "Error";
        let message = "An unexpected error occurred. Please try again.";

        if (error instanceof Error)
        {
            message = error.message;
        }
        else if (typeof error === "object" && error !== null)
        {
            const apiError = error as ApiError;
            if (apiError.statusMessage)
            {
                message = apiError.statusMessage;
            }
            switch (apiError.statusCode)
            {
                case 401:
                    title = "Unauthorized";
                    message = "Please log in to continue.";
                    break;
                case 402:
                    title = "Insufficient Credits";
                    message = "You need more credits to perform this action.";
                    break;
                case 403:
                    title = "Access Denied";
                    message = "You don't have permission to perform this action.";
                    break;
                case 404:
                    title = "Not Found";
                    message = "The requested resource was not found.";
                    break;
                default:
                    if (apiError.statusCode >= 500)
                    {
                        title = "Server Error";
                        message = "A server error occurred. Please try again later.";
                    }
                    break;
            }
        }

        return {
            title,
            message,
            confirmText: "OK",
            cancelText: "Cancel",
            showCancel: false,
        };
    };

    const handleApiError = (error : unknown, defaultMessage ?: string) : string =>
    {
        if (error instanceof Error)
        {
            return cleanErrorMessage(error.message);
        }

        if (typeof error === "object" && error !== null)
        {
            const apiError = error as any;
            
            // Try multiple possible error message locations
            if (apiError.data?.message)
            {
                return cleanErrorMessage(apiError.data.message);
            }
            if (apiError.data?.statusMessage)
            {
                return cleanErrorMessage(apiError.data.statusMessage);
            }
            if (apiError.statusMessage)
            {
                return cleanErrorMessage(apiError.statusMessage);
            }
            if (apiError.message)
            {
                return cleanErrorMessage(apiError.message);
            }
        }

        return defaultMessage || "An unexpected error occurred";
    };

    // Helper function to clean error messages from technical details
    const cleanErrorMessage = (message: string): string =>
    {
        if (!message) return message;
        
        // Remove HTTP method and endpoint prefixes like "[POST] "/api/...": 409 "
        // Pattern: [METHOD] "path": statusCode message
        let cleanedMessage = message.replace(/^\[\w+\]\s+"[^"]+":\s+\d+\s+/, '');
        
        // Also handle pattern without status code: [METHOD] "path": message
        cleanedMessage = cleanedMessage.replace(/^\[\w+\]\s+"[^"]+":\s+/, '');
        
        return cleanedMessage;
    };

    const isAuthError = (error : unknown) : boolean =>
    {
        if (typeof error === "object" && error !== null)
        {
            const apiError = error as ApiError;

            return apiError.statusCode === 401 || apiError.statusCode === 403;
        }

        return false;
    };

    return {
        createErrorModal,
        handleApiError,
        isAuthError,
    };
};