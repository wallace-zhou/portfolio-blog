import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ExifParser from 'exif-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, '..', 'src', 'assets');
const photosFilePath = path.join(__dirname, '..', 'src', 'data', 'photos.ts');

// Get all jpg files from assets directory
const files = fs.readdirSync(assetsDir).filter(file => 
  file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg')
);

console.log('Extracting EXIF data from images...');

// Read existing photos.ts to preserve manual data
let existingPhotos = new Map();
try {
  const photosContent = fs.readFileSync(photosFilePath, 'utf-8');
  const photosMatch = photosContent.match(/export const photos: PhotoMetadata\[\] = \[([\s\S]*?)\];/);
  
  if (photosMatch) {
    // Parse existing photo objects to preserve title, location, tags, isHero
    const photosArray = photosMatch[1];
    const photoRegex = /{\s*id:\s*'([^']+)',\s*filename:\s*'([^']+)',\s*title:\s*'([^']*)',\s*location:\s*'([^']*)',\s*tags:\s*\[([^\]]*)\],\s*isHero:\s*(true|false)/g;
    
    let match;
    while ((match = photoRegex.exec(photosArray)) !== null) {
      const [, id, filename, title, location, tagsStr, isHero] = match;
      const tags = tagsStr.split(',').map(t => t.trim().replace(/'/g, '')).filter(t => t);
      
      existingPhotos.set(filename, {
        id,
        title,
        location,
        tags,
        isHero: isHero === 'true'
      });
    }
  }
} catch (error) {
  console.log('Note: Could not read existing photos.ts, will create new entries');
}

const results = [];

for (const file of files) {
  const filePath = path.join(assetsDir, file);
  const buffer = fs.readFileSync(filePath);
  
  try {
    const parser = ExifParser.create(buffer);
    const result = parser.parse();
    const tags = result.tags;
    
    const exifData = {
      file: file,
      camera: tags.Model || undefined,
      lens: tags.LensModel || undefined,
      focalLength: tags.FocalLength ? `${tags.FocalLength}mm` : undefined,
      aperture: tags.FNumber ? `f/${tags.FNumber}` : undefined,
      shutterSpeed: tags.ExposureTime ? formatShutterSpeed(tags.ExposureTime) : undefined,
      iso: tags.ISO ? `ISO ${tags.ISO}` : undefined,
      dateTaken: tags.DateTimeOriginal ? new Date(tags.DateTimeOriginal * 1000).toISOString().split('T')[0] : undefined,
      width: result.imageSize?.width,
      height: result.imageSize?.height,
    };
    
    results.push(exifData);
  } catch (error) {
    console.log(`⚠ ${file}: Error parsing EXIF - ${error.message}`);
    results.push({ file, error: error.message });
  }
}

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
  
  // Use existing data if available, otherwise use defaults
  const title = existing?.title || '';
  const location = existing?.location || '';
  const tags = existing?.tags || [];
  const isHero = existing?.isHero !== undefined ? existing.isHero : true;
  
  const tagsStr = tags.length > 0 ? tags.map(t => `'${t}'`).join(', ') : '';
  
  photoEntries.push(`  {
    id: '${id}',
    filename: '${data.file}',
    title: '${title}',
    location: '${location}',
    tags: [${tagsStr}],
    isHero: ${isHero},
    exif: {
      camera: ${data.camera ? `'${data.camera}'` : 'undefined'},
      lens: ${data.lens ? `'${data.lens}'` : 'undefined'},
      focalLength: ${data.focalLength ? `'${data.focalLength}'` : 'undefined'},
      aperture: ${data.aperture ? `'${data.aperture}'` : 'undefined'},
      shutterSpeed: ${data.shutterSpeed ? `'${data.shutterSpeed}'` : 'undefined'},
      iso: ${data.iso ? `'${data.iso}'` : 'undefined'},
      dateTaken: ${data.dateTaken ? `'${data.dateTaken}'` : 'undefined'},
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

console.log(`✓ Successfully updated ${photosFilePath}`);
console.log(`✓ Processed ${results.filter(r => !r.error).length} images`);

if (results.some(r => r.error)) {
  console.log(`⚠ ${results.filter(r => r.error).length} images had errors`);
}

function formatShutterSpeed(seconds) {
  if (seconds >= 1) {
    return `${seconds}s`;
  }
  // Convert to fraction
  const denominator = Math.round(1 / seconds);
  return `1/${denominator}s`;
}
