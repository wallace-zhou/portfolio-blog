import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ExifParser from 'exif-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, '..', 'src', 'assets');
const photosFilePath = path.join(__dirname, '..', 'src', 'data', 'photos.ts');
const cacheFilePath = path.join(__dirname, '..', 'src', 'data', 'exif-cache.json');

// Get all jpg files from assets directory
if (!fs.existsSync(assetsDir)) {
  console.log(`Note: Assets directory not found at ${assetsDir}, skipping EXIF extraction`);
  process.exit(0);
}

const files = fs.readdirSync(assetsDir).filter(file => 
  file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg')
);

// Load existing EXIF cache
let exifCache = {};
try {
  exifCache = JSON.parse(fs.readFileSync(cacheFilePath, 'utf-8'));
} catch {
  // Cache doesn't exist yet; will be created after extraction
}

const newFiles = files.filter(file => !exifCache[file]);

if (newFiles.length === 0) {
  console.log('No new images found, skipping EXIF extraction');
} else {
  console.log(`Extracting EXIF data from ${newFiles.length} new image(s)...`);

  for (const file of newFiles) {
    const filePath = path.join(assetsDir, file);
    const buffer = fs.readFileSync(filePath);

    try {
      const parser = ExifParser.create(buffer);
      const result = parser.parse();
      const tags = result.tags;

      exifCache[file] = {
        camera: tags.Model || null,
        lens: tags.LensModel || null,
        focalLength: tags.FocalLength ? `${tags.FocalLength}mm` : null,
        aperture: tags.FNumber ? `f/${tags.FNumber}` : null,
        shutterSpeed: tags.ExposureTime ? formatShutterSpeed(tags.ExposureTime) : null,
        iso: tags.ISO ? `ISO ${tags.ISO}` : null,
        dateTaken: tags.DateTimeOriginal ? new Date(tags.DateTimeOriginal * 1000).toISOString().split('T')[0] : null,
        width: result.imageSize?.width || null,
        height: result.imageSize?.height || null,
      };

      console.log(`  ✓ ${file}`);
    } catch (error) {
      console.log(`  ⚠ ${file}: Error parsing EXIF - ${error.message}`);
      exifCache[file] = { error: error.message };
    }
  }

  fs.writeFileSync(cacheFilePath, JSON.stringify(exifCache, null, 2), 'utf-8');
  console.log(`✓ Cache updated at ${cacheFilePath}`);
}

// Read existing photos.ts to preserve manual metadata (title, location, tags, isHero)
let existingPhotos = new Map();
try {
  const photosContent = fs.readFileSync(photosFilePath, 'utf-8');
  const photosMatch = photosContent.match(/export const photos: PhotoMetadata\[\] = \[([\s\S]*?)\];/);

  if (photosMatch) {
    const photosArray = photosMatch[1];
    const photoRegex = /{\s*id:\s*'([^']+)',\s*filename:\s*'([^']+)',\s*title:\s*'([^']*)',\s*location:\s*'([^']*)',\s*tags:\s*\[([^\]]*)\],\s*isHero:\s*(true|false)/g;

    let match;
    while ((match = photoRegex.exec(photosArray)) !== null) {
      const [, id, filename, title, location, tagsStr, isHero] = match;
      const tags = tagsStr.split(',').map(t => t.trim().replace(/'/g, '')).filter(t => t);
      existingPhotos.set(filename, { id, title, location, tags, isHero: isHero === 'true' });
    }
  }
} catch {
  console.log('Note: Could not read existing photos.ts, will create new entries');
}

// Build results from cache (only for files that exist in assets)
const results = files.map(file => {
  const cached = exifCache[file];
  if (!cached) return { file, error: 'Not in cache' };
  if (cached.error) return { file, error: cached.error };
  return { file, ...cached };
});

// Generate image imports
const imageImports = [];
const imageSources = [];

for (const data of results) {
  if (data.error) continue;

  const id = data.file.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]/g, '-');
  const varName = id.replace(/-/g, '');

  imageImports.push(`import ${varName} from '../assets/${data.file}';`);
  imageSources.push(`  '${id}': ${varName},`);
}

// Generate photo metadata entries
const photoEntries = [];

for (const data of results) {
  if (data.error) {
    photoEntries.push(`  // ${data.file} - Error: ${data.error}`);
    continue;
  }

  const id = data.file.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]/g, '-');
  const existing = existingPhotos.get(data.file);

  const title = existing?.title || '';
  const location = existing?.location || '';
  const tags = existing?.tags || [];
  const isHero = existing?.isHero !== undefined ? existing.isHero : true;

  const tagsStr = tags.length > 0 ? tags.map(t => `'${t}'`).join(', ') : '';
  const v = (val) => val ? `'${val}'` : 'undefined';

  photoEntries.push(`  {
    id: '${id}',
    filename: '${data.file}',
    title: '${title}',
    location: '${location}',
    tags: [${tagsStr}],
    isHero: ${isHero},
    exif: {
      camera: ${v(data.camera)},
      lens: ${v(data.lens)},
      focalLength: ${v(data.focalLength)},
      aperture: ${v(data.aperture)},
      shutterSpeed: ${v(data.shutterSpeed)},
      iso: ${v(data.iso)},
      dateTaken: ${v(data.dateTaken)},
    },
  },`);
}

// Generate complete photos.ts file
const photosContent = `// Photo tagging and metadata system
export type PhotoTag = 'Landscape' | 'Cityscape' | 'Street' | 'Car';

export interface PhotoExif {
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: string;
  dateTaken?: string;
}

export interface PhotoMetadata {
  id: string;
  filename: string;
  title: string;
  location: string;
  tags: PhotoTag[];
  isHero: boolean;
  exif: PhotoExif;
}

// Import all images for type-safe references
${imageImports.join('\n')}

// Image source mapping for dynamic imports
export const imageSources = {
${imageSources.join('\n')}
} as const;

export type PhotoId = keyof typeof imageSources;

// Photo metadata with EXIF data extracted from images
export const photos: PhotoMetadata[] = [
${photoEntries.join('\n')}
];

// Helper functions
export function getHeroPhotos(): PhotoMetadata[] {
  return photos.filter(photo => photo.isHero);
}

export function getPhotosByTag(tag: PhotoTag): PhotoMetadata[] {
  return photos.filter(photo => photo.tags.includes(tag));
}

export function getPhotoById(id: string): PhotoMetadata | undefined {
  return photos.find(photo => photo.id === id);
}

export function getImageSource(id: PhotoId) {
  return imageSources[id];
}

export const allTags: PhotoTag[] = ['Landscape', 'Cityscape', 'Street', 'Car'];

// TODO: Replace with custom banner photo selection per tag
// Banner photos for each tag (should be landscape-oriented images)
export const tagBannerPhotos: Record<PhotoTag | 'all', PhotoId> = {
  'all': 'dsc-4517',           // Ocean Panorama - default banner
  'Landscape': 'blog-placeholder-1',  // Golden Hour Mountains
  'Cityscape': 'blog-placeholder-about', // City Lights
  'Street': 'blog-placeholder-2',     // Alpine Road
  'Car': 'blog-placeholder-4',        // Desert Canyon
};

export function getBannerPhotoForTag(tag: PhotoTag | 'all'): PhotoId {
  return tagBannerPhotos[tag];
}

export function getBannerImageSource(tag: PhotoTag | 'all') {
  const photoId = getBannerPhotoForTag(tag);
  return imageSources[photoId];
}

// Get photos sorted by date (descending order - newest to oldest)
export function getPhotosSortedByDate(): PhotoMetadata[] {
  return [...photos].sort((a, b) => {
    const dateA = a.exif.dateTaken ? new Date(a.exif.dateTaken).getTime() : 0;
    const dateB = b.exif.dateTaken ? new Date(b.exif.dateTaken).getTime() : 0;
    return dateB - dateA;
  });
}
`;

// Write to photos.ts
fs.writeFileSync(photosFilePath, photosContent, 'utf-8');

const successCount = results.filter(r => !r.error).length;
const errorCount = results.filter(r => r.error).length;
console.log(`✓ photos.ts updated (${successCount} images total, ${newFiles.length} newly extracted)`);
if (errorCount > 0) {
  console.log(`⚠ ${errorCount} image(s) had errors`);
}

function formatShutterSpeed(seconds) {
  if (seconds >= 1) {
    return `${seconds}s`;
  }
  // Convert to fraction
  const denominator = Math.round(1 / seconds);
  return `1/${denominator}s`;
}
