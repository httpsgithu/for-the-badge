import fs from 'node:fs';
import path from 'node:path';

/**
 * Generates a manifest of all badges in the public/badges directory
 * This runs at build time to create a static list for Cloudflare Workers
 */
function generateBadgesManifest() {
    const badgesDir = path.join(process.cwd(), 'public', 'badges');
    const outputPath = path.join(process.cwd(), 'server', 'data', 'badges-manifest.ts');
    
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    if (!fs.existsSync(badgesDir)) {
        console.error('Badges directory not found:', badgesDir);
        process.exit(1);
    }
    
    // Read all files in the badges directory
    const files = fs.readdirSync(badgesDir);
    
    // Filter for only .svg files
    const svgFiles = files
        .filter(file => file.endsWith('.svg'))
        .sort(); // Sort alphabetically
    
    // Map to badge objects
    const badges = svgFiles.map(filename => {
        const name = filename
            .replace('.svg', '')
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        
        return {
            filename,
            path: `/badges/${filename}`,
            name,
        };
    });
    
    // Generate TypeScript file
    const tsContent = `// Auto-generated file - do not edit manually
// Generated at build time from public/badges directory

export interface Badge {
    filename: string;
    path: string;
    name: string;
}

export const badges: Badge[] = ${JSON.stringify(badges, null, 4)};

export const count = ${badges.length};

export default { badges, count };
`;
    
    fs.writeFileSync(outputPath, tsContent);
    
    console.log(`✓ Generated badges manifest: ${badges.length} badges`);
}

generateBadgesManifest();
