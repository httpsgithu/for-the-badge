import CryptoJS from "crypto-js";

export interface FTBFileMetadata {
    version: string;
    encrypted: boolean;
    timestamp: string;
    originalFileName ?: string;
    documentType ?: string;
    pageCount ?: number;
    fileSize ?: number;
    checksum ?: string;
}

export interface FTBFileData {
    metadata: FTBFileMetadata;
    analysis : {
        keyPoints : Array<{
            summary: string;
            rawText: string;
        }>;
        redFlags : Array<{
            summary: string;
            rawText: string;
        }>;
        summary: string;
        confidenceFactors: string[];
        confidenceScore?: {
            value: number;
            factors?: string[];
            recommendation?: string;
        };
    };
    document : {
        filename: string;
        type: string;
        text ?: string; // The raw extracted text from the document
        pageInfo ?: {
            totalPages: number;
            contentPages: number;
            blankPages: number;
        };
    };
    highlightedPdfUrl ?: string;
    exportedAt: string;
    exportedBy: string; // Account ID hash for verification
}

export interface EncryptedFTBFile {
    data: string; // Encrypted JSON
    metadata: FTBFileMetadata;
    signature: string; // HMAC signature for tamper protection
}

/**
 * Creates an encrypted .ftb file from analysis data
 */
export function createFTBFile(
    analysisData : any,
    pin : string,
    accountId : string,
    originalFileName ?: string
) : EncryptedFTBFile
{
    try
    {
        // Prepare the file data
        const ftbData : FTBFileData = {
            metadata: {
                version: "1.0",
                encrypted: true,
                timestamp: new Date().toISOString(),
                originalFileName: originalFileName || "document",
                documentType: analysisData.documentType || "pdf",
                pageCount: analysisData.pageCount || 1,
                fileSize: analysisData.fileSize,
            },
            analysis: {
                keyPoints: analysisData.analysis?.keyPoints || [],
                redFlags: analysisData.analysis?.redFlags || [],
                summary: analysisData.analysis?.summary || "",
                confidenceFactors: analysisData.analysis?.confidenceFactors || [],
                confidenceScore: analysisData.analysis?.confidenceScore || analysisData.confidenceScore,
            },
            document: {
                filename: originalFileName || "document",
                type: analysisData.documentType || "pdf",
                text: analysisData.documentText || "", // Include the raw document text
                pageInfo: analysisData.pageInfo,
            },
            highlightedPdfUrl: analysisData.highlightedPdfUrl,
            exportedAt: new Date().toISOString(),
            exportedBy: hashAccountId(accountId),
        };

        // Convert to JSON string
        const dataString = JSON.stringify(ftbData);

        // Calculate checksum for tamper detection
        const checksum = CryptoJS.SHA256(dataString).toString();
        ftbData.metadata.checksum = checksum;

        // Re-stringify with checksum
        const finalDataString = JSON.stringify(ftbData);

        // Encrypt the data using AES-256
        const encrypted = CryptoJS.AES.encrypt(finalDataString, pin).toString();

        // Create HMAC signature for additional tamper protection
        const signature = CryptoJS.HmacSHA256(encrypted, pin + accountId).toString();

        const encryptedFile : EncryptedFTBFile = {
            data: encrypted,
            metadata: {
                version: "1.0",
                encrypted: true,
                timestamp: new Date().toISOString(),
                originalFileName: originalFileName || "document",
                documentType: analysisData.documentType || "pdf",
                pageCount: analysisData.pageCount || 1,
            },
            signature,
        };

        return encryptedFile;
    }
    catch (error)
    {
        console.error("Failed to create .ftb file:", error);
        throw new Error("Failed to create encrypted file");
    }
}

/**
 * Decrypts and validates a .ftb file
 */
export function decryptFTBFile(
    encryptedFile : EncryptedFTBFile,
    pin : string,
    expectedAccountId ?: string,
    options ?: { skipSignatureVerification ?: boolean }
) : FTBFileData
{
    try
    {
        // Verify signature for tamper protection (only if account ID provided and not explicitly skipped)
        if (expectedAccountId && !options?.skipSignatureVerification)
        {
            const expectedSignature = CryptoJS.HmacSHA256(
                encryptedFile.data,
                pin + expectedAccountId
            ).toString();

            if (expectedSignature !== encryptedFile.signature)
            {
                throw new Error("File signature verification failed - file may have been tampered with");
            }
        }

        // Decrypt the data
        const decryptedBytes = CryptoJS.AES.decrypt(encryptedFile.data, pin);
        const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedString)
        {
            throw new Error("Invalid PIN or corrupted file");
        }

        // Parse the decrypted JSON
        const ftbData : FTBFileData = JSON.parse(decryptedString);

        // Verify checksum if present
        if (ftbData.metadata.checksum)
        {
            const dataForChecksum = { ...ftbData };
            delete dataForChecksum.metadata.checksum;
            const calculatedChecksum = CryptoJS.SHA256(JSON.stringify(dataForChecksum)).toString();

            if (calculatedChecksum !== ftbData.metadata.checksum)
            {
                console.warn("Checksum verification failed - file may have been modified");
            }
        }

        return ftbData;
    }
    catch (error)
    {
        console.error("Failed to decrypt .ftb file:", error);
        if (error instanceof Error && error.message.includes("signature"))
        {
            throw error;
        }
        throw new Error("Invalid PIN or corrupted file");
    }
}

/**
 * Downloads a .ftb file
 */
export async function downloadFTBFile(
    encryptedFile : EncryptedFTBFile,
    filename : string
) : Promise<void>
{
    try
    {
        // Clean filename
        const cleanFilename = filename.replace(/[^a-zA-Z0-9\-_\.]/g, "_");
        const finalFilename = cleanFilename.endsWith(".ftb")
            ? cleanFilename
            : `${cleanFilename}.ftb`;

        // Create blob
        const fileContent = JSON.stringify(encryptedFile, null, 2);
        const blob = new Blob([fileContent], { type: "application/json" });

        // Detect device
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        // Try Web Share API on mobile (works on iOS, sometimes on newer Android)
        if (isMobile && typeof navigator.share === 'function' && navigator.canShare) {
            try {
                const file = new File([blob], finalFilename, { type: "application/json" });
                const shareData = {
                    files: [file],
                    title: "For the Badge Export",
                    text: `Export of ${finalFilename}`
                };

                if (navigator.canShare(shareData)) {
                    await navigator.share(shareData);
                    return;
                }
            } catch (shareError: any) {
                if (shareError.name === 'AbortError') {
                    return;
                }
            }
        }

        // Fallback: Direct download
        await triggerDownload(blob, finalFilename);
    }
    catch (error: any)
    {
        throw new Error(`Failed to export file: ${error.message || 'Unknown error'}`);
    }
}

/**
 * Triggers file download using blob URI with transient <a> tag
 */
function triggerDownload(blob: Blob, filename: string): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            link.style.display = "none";
            link.rel = "noopener";

            document.body.appendChild(link);
            link.click();

            setTimeout(() => {
                if (link.parentNode) {
                    document.body.removeChild(link);
                }
                URL.revokeObjectURL(url);
                resolve();
            }, 1000);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Validates a .ftb file structure
 */
export function validateFTBFile(file : any) : boolean
{
    try
    {
        return (
            file
            && typeof file === "object"
            && typeof file.data === "string"
            && typeof file.metadata === "object"
            && typeof file.signature === "string"
            && file.metadata.version
            && file.metadata.encrypted === true
        );
    }
    catch
    {
        return false;
    }
}

/**
 * Gets file info without decrypting
 */
export function getFTBFileInfo(encryptedFile : EncryptedFTBFile) : FTBFileMetadata
{
    return encryptedFile.metadata;
}

/**
 * Hash account ID for verification (simplified version)
 */
function hashAccountId(accountId : string) : string
{
    return CryptoJS.SHA256(accountId + "ftb_export").toString().substring(0, 16);
}

/**
 * Removes emojis from text and replaces with readable text
 */
export function sanitizeTextForViewer(text : string) : string
{
    return text
        .replace(/🔐/g, "[SECURE]")
        .replace(/🔒/g, "[LOCKED]")
        .replace(/🔓/g, "[UNLOCKED]")
        .replace(/🔑/g, "[KEY]")
        .replace(/⚠️/g, "[WARNING]")
        .replace(/❌/g, "[ERROR]")
        .replace(/✅/g, "[SUCCESS]")
        .replace(/📄/g, "[DOCUMENT]")
        .replace(/📊/g, "[CHART]")
        .replace(/💡/g, "[IDEA]")
        .replace(/🎯/g, "[TARGET]")
        .replace(/⭐/g, "[STAR]")
        .replace(/🚨/g, "[ALERT]")
        .replace(/✓/g, "[CHECK]")
        .replace(/[\u{1F000}-\u{1F9FF}]|[\u{2600}-\u{27BF}]/gu, "[ICON]"); // Remove remaining emojis
}