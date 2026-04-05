import Tesseract from "tesseract.js";

export async function extractTextWithVision(fileBuffer : Buffer, mimeType : string) : Promise<{ text : string; coordinates ?: any[] }>
{
    try
    {
        if (mimeType === "application/pdf")
        {
            const text = await extractTextFromPDF(fileBuffer);

            return { text, coordinates: [] };
        }
        else
        {
            const text = await extractTextWithDocling(fileBuffer, "vision-fallback-document");

            return { text, coordinates: [] };
        }
    }
    catch (error)
    {
        return { text: await extractTextFromPDF(fileBuffer) };
    }
}

export async function extractTextFromPDF(pdfBuffer : Buffer) : Promise<string>
{
    try
    {
        const pdfParse = await import("pdf-parse-new");
        const data = await pdfParse.default(pdfBuffer);

        return data.text.trim();
    }
    catch (error)
    {
        try
        {
            return await extractTextWithVision(pdfBuffer, "application/pdf")
                .then((result) => result.text);
        }
        catch (visionError)
        {
            return "PDF text extraction temporarily unavailable. Please try with an image or text document.";
        }
    }
}

export async function getPDFPageCount(pdfBuffer : Buffer) : Promise<number>
{
    try
    {
        const pdfParse = await import("pdf-parse-new");
        const data = await pdfParse.default(pdfBuffer);

        // Count only pages with actual content
        const contentPageCount = await countNonBlankPDFPages(pdfBuffer, data);

        return Math.max(1, contentPageCount); // Always return at least 1 page
    }
    catch (error)
    {
        // Fallback: try to count pages using pdf-lib
        try
        {
            const { PDFDocument } = await import("pdf-lib");
            const pdfDoc = await PDFDocument.load(pdfBuffer);
            const totalPages = pdfDoc.getPageCount();

            // For fallback, assume all pages have content (conservative approach)
            return totalPages;
        }
        catch (fallbackError)
        {
            return 1; // Default to 1 page if counting fails
        }
    }
}

export async function countNonBlankPDFPages(pdfBuffer : Buffer, parsedData ?: any) : Promise<number>
{
    try
    {
        // First, get the total page count and text
        const pdf = await import("pdf-parse-new");
        const data = parsedData || await pdf.default(pdfBuffer);
        const totalPages = data.numpages || 1;
        const text = data.text?.trim() || "";

        // If very little text for the number of pages, likely has blank pages
        if (text.length < 100)
        {
            return 1;
        }

        // Calculate average characters per page
        const avgCharsPerPage = text.length / totalPages;

        // More sophisticated blank page detection
        let contentPages = totalPages;

        // If average chars per page is very low, likely has blank pages
        if (avgCharsPerPage < 200 && totalPages > 1)
        {
            // Estimate content pages based on text density
            // Assume a content page has at least 500 characters on average
            const minCharsPerContentPage = 500;
            const estimatedContentPages = Math.max(1, Math.ceil(text.length / minCharsPerContentPage));

            // Be conservative - don't reduce page count by more than 30%
            const maxReduction = Math.floor(totalPages * 0.3);
            const reduction = Math.min(maxReduction, totalPages - estimatedContentPages);
            contentPages = totalPages - Math.max(0, reduction);
        }
        else if (avgCharsPerPage < 100 && totalPages > 3)
        {
            // Very low density - more aggressive reduction
            const estimatedContentPages = Math.max(1, Math.ceil(text.length / 300));
            contentPages = Math.min(estimatedContentPages, Math.ceil(totalPages * 0.6));
        }

        return Math.max(1, contentPages);
    }
    catch (error)
    {
        // Conservative fallback - try basic page count
        try
        {
            const { PDFDocument } = await import("pdf-lib");
            const pdfDoc = await PDFDocument.load(pdfBuffer);
            const totalPages = pdfDoc.getPageCount();

            return totalPages;
        }
        catch (fallbackError)
        {
            return 1;
        }
    }
}

export async function extractTextWithPageCount(fileBuffer : Buffer, filename : string, mimeType ?: string) : Promise<{ text : string; pageCount : number }>
{
    const documentType = detectDocumentType(filename, mimeType);
    let text = "";
    let pageCount = 1;

    switch (documentType)
    {
        case "pdf":
            text = await extractTextFromPDF(fileBuffer);
            // Use blank page detection for accurate counting - exclude blank pages
            pageCount = await countNonBlankPDFPages(fileBuffer);
            break;
        case "image":
            text = await extractTextFromImage(fileBuffer);
            pageCount = 1; // Images are always 1 "page" (and never blank if we can process them)
            break;
        case "document":
            // For documents (.docx, etc.), use local extraction methods
            text = await extractTextWithDocling(fileBuffer, filename);
            // For docling documents, estimate content page count based on meaningful text
            const meaningfulTextLength = text.replace(/\s+/g, " ").trim().length;
            if (meaningfulTextLength < 100)
            {
                pageCount = 1; // Very little content = 1 page
            }
            else
            {
                pageCount = Math.max(1, Math.ceil(meaningfulTextLength / 2000)); // ~2000 chars per content page
            }
            break;
        default:
            throw new Error("Unsupported document type");
    }

    return { text, pageCount };
}

export async function extractTextFromImage(imageBuffer : Buffer) : Promise<string>
{
    try
    {
        const Tesseract = await import("tesseract.js");

        const { data: { text } } = await Tesseract.default.recognize(imageBuffer, "eng", {
            logger: () =>
            {},
        });

        return text.trim();
    }
    catch (error)
    {
        return "Image text extraction temporarily unavailable. Please try with a PDF or text document.";
    }
}

export function detectDocumentType(filename : string, mimeType ?: string) : "pdf" | "image" | "document" | "docling"
{
    const extension = filename.toLowerCase().split(".").pop();

    // PDF files - return actual type but will be processed via Docling API
    if (mimeType?.includes("pdf") || extension === "pdf")
    {
        return "pdf";
    }

    // Image formats - return actual type but will be processed via Docling API
    if (mimeType?.includes("image") || [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "bmp",
        "webp",
        "tif",
        "tiff",
    ].includes(extension || ""))
    {
        return "image";
    }

    // Document formats that will be processed via Docling API
    if ([
        "docx",
        "xlsx",
        "pptx",
        "html",
        "csv",
        "md",
        "adoc",
    ].includes(extension || ""))
    {
        return "document";
    }

    return "document";
}

export async function extractTextWithDocling(fileBuffer : Buffer, filename : string) : Promise<string>
{
    const maxRetries = 3;
    const baseDelay = 1000;

    for (let attempt = 1; attempt <= maxRetries; attempt++)
    {
        try
        {
            if (!fileBuffer || fileBuffer.length === 0)
            {
                throw new Error("Invalid file buffer provided");
            }

            if (!filename || filename.trim() === "")
            {
                throw new Error("Invalid filename provided");
            }

            if (!import.meta.server)
            {
                throw new Error("Docling processing only available on server");
            }

            const { spawn } = await import("child_process");
            const { writeFile, unlink } = await import("fs/promises");
            const path = await import("path");
            const os = await import("os");

            const tempDir = os.tmpdir();
            const tempFilePath = path.join(tempDir, `docling_${Date.now()}_${filename}`);

            await writeFile(tempFilePath, fileBuffer);

            const pythonProcess = spawn("python3", [path.join(process.cwd(), "server/utils/docling_processor.py"), tempFilePath], {
                stdio: [
                    "pipe",
                    "pipe",
                    "pipe",
                ],
                timeout: 30000,
            });

            let stdout = "";
            let stderr = "";

            pythonProcess.stdout?.on("data", (data) =>
            {
                stdout += data.toString();
            });

            pythonProcess.stderr?.on("data", (data) =>
            {
                stderr += data.toString();
            });

            await new Promise((resolve, reject) =>
            {
                pythonProcess.on("close", (code) =>
                {
                    if (code === 0)
                    {
                        resolve(code);
                    }
                    else
                    {
                        reject(new Error(`Python process exited with code ${code}: ${stderr}`));
                    }
                });

                pythonProcess.on("error", (error) =>
                {
                    reject(new Error(`Failed to spawn Python process: ${error.message}`));
                });
            });

            try
            {
                await unlink(tempFilePath);
            }
            catch (unlinkError)
            {
            }

            if (!stdout.trim())
            {
                throw new Error("No output received from Python process");
            }

            const result = JSON.parse(stdout);
            if (result.success)
            {
                return result.text;
            }
            else
            {
                throw new Error(result.error);
            }
        }
        catch (error)
        {
            const errorMessage = error instanceof Error ? error.message : String(error);
            const isSpawnError = errorMessage.includes("spawn") || errorMessage.includes("EBADF");

            if (isSpawnError && attempt < maxRetries)
            {
                const delay = baseDelay * Math.pow(2, attempt - 1);
                await new Promise((resolve) => setTimeout(resolve, delay));
                continue;
            }

            return "Document text extraction temporarily unavailable. Please try with a PDF or image document.";
        }
    }

    return "Document text extraction temporarily unavailable after multiple attempts. Please try with a PDF or image document.";
}

export function cleanTextForAnalysis(text : string) : string
{
    return text
        .replace(/\s+/g, " ")
        .replace(/[^\w\s.,!?;:()\-"']/g, "")
        .trim();
}

export async function highlightPDFWithDocling(inputPdfBuffer : Buffer, terms : string[]) : Promise<Buffer | null>
{
    const requestId = `pdf-highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    try
    {
        const formData = new FormData();
        formData.append("document_file", new Blob([inputPdfBuffer], { type: "application/pdf" }), "document.pdf");

        terms.forEach((term, index) =>
        {
            formData.append("terms", term);
        });

        const apiUrl = "https://docling-api.forthebadge.com/markup/";

        const response = await fetch(apiUrl, {
            method: "POST",
            body: formData,
            headers: {
                // Let fetch set Content-Type automatically for FormData
                "User-Agent": "ForTheBadge-App/1.0",
                "X-Request-ID": requestId,
            },
        });

        if (!response.ok)
        {
            const errorText = await response.text();
            throw new Error(`Docling API failed: ${response.status} - ${errorText}`);
        }
        const highlightedPdfBuffer = await response.arrayBuffer();

        if (highlightedPdfBuffer.byteLength === 0)
        {
            return null;
        }

        const pdfBuffer = Buffer.from(highlightedPdfBuffer);

        const headerBytes = pdfBuffer.subarray(0, 4);
        const headerString = headerBytes.toString();

        if (pdfBuffer.length > 4 && headerString === "%PDF")
        {
            return pdfBuffer;
        }
        else
        {
            return pdfBuffer;
        }
    }
    catch (error)
    {
        return null;
    }
}