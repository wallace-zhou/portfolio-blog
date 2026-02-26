import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ExifParser from 'exif-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, '..', 'src', 'assets');
const cacheFilePath = path.join(__dirname, '..', 'src', 'data', 'exif-cache.json');

function formatShutterSpeed(seconds) {
  if (seconds >= 1) return `${seconds}s`;
  return `1/${Math.round(1 / seconds)}s`;
}

if (!fs.existsSync(assetsDir)) {
  console.log(`Note: Assets directory not found at ${assetsDir}, skipping EXIF extraction`);
  process.exit(0);
}

const imageFiles = new Set(
  fs.readdirSync(assetsDir).filter(f => /\.(jpg|jpeg)$/i.test(f))
);

let cache = {};
try {
  cache = JSON.parse(fs.readFileSync(cacheFilePath, 'utf-8'));
} catch {
  // Cache doesn't exist yet
}

// Remove stale entries for files no longer in assets
const staleKeys = Object.keys(cache).filter(filename => !imageFiles.has(filename));
if (staleKeys.length > 0) {
  staleKeys.forEach(key => delete cache[key]);
  console.log(`Removed ${staleKeys.length} stale cache entry(s): ${staleKeys.join(', ')}`);
}

// Extract EXIF only for new files not yet cached
const newFiles = [...imageFiles].filter(f => !cache[f]);

if (newFiles.length === 0) {
  console.log('No new images found, skipping EXIF extraction');
} else {
  console.log(`Extracting EXIF data from ${newFiles.length} new image(s)...`);

  for (const file of newFiles) {
    const filePath = path.join(assetsDir, file);
    const buffer = fs.readFileSync(filePath);

    try {
      const result = ExifParser.create(buffer).parse();
      const tags = result.tags;

      cache[file] = {
        camera: tags.Model || null,
        lens: tags.LensModel || null,
        focalLength: tags.FocalLength ? `${tags.FocalLength}mm` : null,
        aperture: tags.FNumber ? `f/${tags.FNumber}` : null,
        shutterSpeed: tags.ExposureTime ? formatShutterSpeed(tags.ExposureTime) : null,
        iso: tags.ISO ? `ISO ${tags.ISO}` : null,
        dateTaken: tags.DateTimeOriginal
          ? new Date(tags.DateTimeOriginal * 1000).toISOString().split('T')[0]
          : null,
        width: result.imageSize?.width || null,
        height: result.imageSize?.height || null,
      };

      console.log(`  ✓ ${file}`);
    } catch (error) {
      console.warn(`  ⚠ ${file}: ${error.message}`);
      cache[file] = { error: error.message };
    }
  }
}

fs.writeFileSync(cacheFilePath, JSON.stringify(cache, null, 2) + '\n', 'utf-8');

const validCount = Object.values(cache).filter(v => !v.error).length;
console.log(`✓ exif-cache.json updated (${validCount} valid, ${imageFiles.size} total images)`);
