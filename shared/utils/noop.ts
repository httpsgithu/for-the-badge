/**
 * No-operation function that does nothing and returns nothing.
 * Useful for error handling where you want to explicitly ignore errors
 * or as a default callback.
 */
export const noop = (): void => {
    // Intentionally empty
};

/**
 * Async no-operation function that does nothing and returns a resolved promise.
 * Useful for async error handling where you want to explicitly ignore errors.
 * Named following C# TAP (Task-based Asynchronous Pattern) conventions.
 */
export const noopAsync = async (): Promise<void> => {
    // Intentionally empty
};
