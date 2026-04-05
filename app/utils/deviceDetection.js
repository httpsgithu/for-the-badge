/**
 * Device detection utilities for mobile PDF handling
 */

/**
 * Detect if the current device is mobile based on user agent
 * @returns {boolean} True if mobile device
 */
export function isMobileDevice() {
  // Server-side: check headers if available
  if (typeof window === 'undefined') {
    // During SSR, this will return false by default
    // The actual detection should happen on the client or via middleware
    return false;
  }
  
  // Client-side: check user agent and screen size for mobile indicators
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  
  // Additional check for small screens (Samsung and other Android devices)
  // This helps with devices that may not match the regex perfectly
  const screenWidth = window.innerWidth || document.documentElement.clientWidth;
  const isSmallScreen = screenWidth <= 768;
  
  // Also check for touch capability as secondary indicator
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Return true if user agent matches OR if it's a small screen with touch capability
  return mobileRegex.test(userAgent) || (isSmallScreen && hasTouch);
}

/**
 * Check if device should use tablet/desktop PDF viewing
 * @returns {boolean} True if should use desktop-style viewer
 */
export function shouldUseDesktopViewer() {
  if (typeof window === 'undefined') return true;
  
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  
  // Use desktop viewer for:
  // - Large screens (width > 1024px)
  // - Tablets in landscape (width > 900px and height > 600px)
  // - Any screen wider than 900px regardless of touch capability
  return screenWidth > 1024 || (screenWidth > 900 && screenHeight > 600);
}

/**
 * Check if the browser supports PDF viewing in iframes
 * @returns {boolean} True if PDF iframe is supported
 */
export function supportsPDFIframe() {
  if (typeof window === 'undefined') return false;
  
  // Mobile browsers generally have poor iframe PDF support
  if (isMobileDevice()) return false;
  
  // Check for PDF plugin availability (desktop browsers)
  const mimeTypes = navigator.mimeTypes;
  if (mimeTypes && mimeTypes['application/pdf']) {
    const pdfPlugin = mimeTypes['application/pdf'].enabledPlugin;
    return pdfPlugin && pdfPlugin.name !== '';
  }
  
  // Default to true for desktop browsers
  return !isMobileDevice();
}

/**
 * Get the best PDF viewing strategy for the current device
 * @param {string} pdfUrl - The PDF URL to display
 * @returns {object} Strategy object with type and action
 */
export function getPDFViewingStrategy(pdfUrl) {
  if (!pdfUrl) {
    return { type: 'none', message: 'No PDF URL provided' };
  }
  
  // Use desktop viewer for larger screens, even if touch-enabled
  if (shouldUseDesktopViewer()) {
    return {
      type: 'iframe',
      action: 'embed',
      url: pdfUrl,
      message: 'Document viewer'
    };
  }
  
  // For truly mobile devices (small screens), use mobile fallback
  if (isMobileDevice()) {
    return {
      type: 'mobile-fallback',
      action: 'open-new-tab',
      message: 'Tap to open PDF in new tab',
      url: pdfUrl
    };
  }
  
  // Fallback for edge cases
  return {
    type: 'fallback',
    action: 'download-link',
    message: 'Click to download PDF',
    url: pdfUrl
  };
}

/**
 * Open PDF in the most appropriate way for the current device
 * @param {string} pdfUrl - The PDF URL to open
 * @param {string} filename - Optional filename for download
 */
export function openPDF(pdfUrl, filename = 'document.pdf') {
  if (!pdfUrl) return;
  
  const strategy = getPDFViewingStrategy(pdfUrl);
  
  switch (strategy.action) {
    case 'open-new-tab':
      // For mobile, open in new tab/window
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        // Create a simple HTML page with the PDF
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>PDF Viewer</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { margin: 0; padding: 0; background: #f0f0f0; }
              .pdf-container { 
                width: 100vw; 
                height: 100vh; 
                display: flex;
                flex-direction: column;
              }
              .pdf-header {
                background: #333;
                color: white;
                padding: 10px;
                text-align: center;
                font-family: Arial, sans-serif;
              }
              .pdf-content {
                flex: 1;
                width: 100%;
                border: none;
              }
              .fallback-message {
                text-align: center;
                padding: 20px;
                font-family: Arial, sans-serif;
              }
              .download-btn {
                display: inline-block;
                background: #007bff;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 10px;
              }
            </style>
          </head>
          <body>
            <div class="pdf-container">
              <div class="pdf-header">Document Viewer</div>
              <iframe src="${pdfUrl}" class="pdf-content" title="PDF Document">
                <div class="fallback-message">
                  <p>Your browser doesn't support PDF viewing.</p>
                  <a href="${pdfUrl}" class="download-btn" download="${filename}">Download PDF</a>
                </div>
              </iframe>
            </div>
          </body>
          </html>
        `);
        newWindow.document.close();
      }
      break;
      
    case 'download-link':
      // Trigger download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      break;
      
    default:
      // For iframe embedding, this is handled by the component
      break;
  }
}