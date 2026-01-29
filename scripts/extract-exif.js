import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ExifParser from 'exif-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, '..', 'src', 'assets');

// Get all jpg files from assets directory
const files = fs.readdirSync(assetsDir).filter(file => 
  file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg')
);

console.log('Extracting EXIF data from images in src/assets/\n');
console.log('='.repeat(60));

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
      camera: tags.Make && tags.Model ? `${tags.Make} ${tags.Model}`.trim() : undefined,
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
    
    console.log(`\n${file}:`);
    console.log(`  Camera: ${exifData.camera || 'N/A'}`);
    console.log(`  Lens: ${exifData.lens || 'N/A'}`);
    console.log(`  Focal Length: ${exifData.focalLength || 'N/A'}`);
    console.log(`  Aperture: ${exifData.aperture || 'N/A'}`);
    console.log(`  Shutter Speed: ${exifData.shutterSpeed || 'N/A'}`);
    console.log(`  ISO: ${exifData.iso || 'N/A'}`);
    console.log(`  Date Taken: ${exifData.dateTaken || 'N/A'}`);
    console.log(`  Dimensions: ${exifData.width}x${exifData.height}`);
  } catch (error) {
    console.log(`\n${file}: Error parsing EXIF - ${error.message}`);
    results.push({ file, error: error.message });
  }
}

console.log('\n' + '='.repeat(60));
console.log('\nTypeScript template for photos.ts:\n');

// Output TypeScript template
console.log('export const photos: PhotoMetadata[] = [');
for (const data of results) {
  if (data.error) {
    console.log(`  // ${data.file} - Error: ${data.error}`);
    continue;
  }
  console.log(`  {
    id: '${data.file.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]/g, '-')}',
    filename: '${data.file}',
    title: '', // TODO: Add title
    location: '', // TODO: Add location
    tags: [], // TODO: Add tags: 'Landscape' | 'Cityscape' | 'Street' | 'Car'
    isHero: true,
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
console.log('];');

function formatShutterSpeed(seconds) {
  if (seconds >= 1) {
    return `${seconds}s`;
  }
  // Convert to fraction
  const denominator = Math.round(1 / seconds);
  return `1/${denominator}s`;
}
