/** Represents the data used to customise a PagedResponse */
export interface PageRequest { cursor ?: string; perPage: number }

/** Represents a collection of data and the information required to fetch the next logical page of like data */
export interface PagedResponse<T> {
    current ?: string;
    next ?: string;
    perPage: number;
    data: T[];
}