/** Represents a type that may either be itself or null, or may not be defined */
export type Maybe<T> = Optional<T> | undefined;

/** Represents a type that may either be itself or null */
export type Optional<T> = T | null;