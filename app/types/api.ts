// Account types based on actual backend responses
export interface Account {
    id : string;
    credits : number;
    pinEnabled : boolean;
    isAdmin ?: boolean;
    createdAt : string;
    updatedAt : string;
}

// Auth endpoints
export interface GenerateAccountResponse { id : string }

export interface LoginRequest { userId : string }

export interface LoginResponse {
    challenge : boolean;
    challengeUrl ?: string;
}

export interface PinChallengeRequest { pin : string }

export interface PinVerifyRequest { pin : string }

export interface PinVerifyResponse {
    message : string;
    verified : boolean;
}

export interface PinCreateRequest { pin : string }

export interface PinCreateResponse { message : string }

export interface PinUpdateRequest {
    currentPin : string;
    newPin : string;
}

export interface PinUpdateResponse { message : string }

export interface PinDeleteRequest { pin : string }

export interface PinDeleteResponse { message : string }

export interface DeleteAccountRequest {
    confirmAccountNumber : string;
    pin ?: string;
}


// Admin endpoints
export interface AdminAccountsQuery {
    cursor ?: string;
    perPage ?: number;
    includeStats ?: boolean;
}

export interface AdminAccountsStats {
    totalUsers: number;
    adminUsers: number;
    pinEnabledUsers: number;
    activeUsersLast7Days: number;
    newUsersLast7Days: number;
    newUsersPrevious7Days: number;
}

export interface AdminAccountsResponse {
    current ?: string;
    next ?: string;
    perPage: number;
    data : Account[];
    stats ?: AdminAccountsStats;
}

export interface AdjustCreditsRequest {
    accountId : string;
    amount : number;
}

// Error handling
export interface ApiError {
    statusCode : number;
    statusMessage : string;
    message ?: string;
    data ?: any;
}

// Utility types
export interface ModalConfig {
    title : string;
    message : string;
    confirmText : string;
    cancelText ?: string;
    showCancel ?: boolean;
    isNoCreditModal ?: boolean;
    isAdminPinSetup ?: boolean;
}

// Context for analysis
export interface AnalysisContext {
    documentType ?: string;
    userRole ?: string;
    concerns ?: string[];
    additionalInfo ?: string;
}
