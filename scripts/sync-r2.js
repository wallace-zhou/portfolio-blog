import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import ExifParser from 'exif-parser';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const registryPath = path.join(__dirname, '..', 'src', 'data', 'photo-registry.json');

const endpoint = process.env.R2_ENDPOINT;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;

if (!endpoint || !accessKeyId || !secretAccessKey || !bucketName) {
  console.error('Missing R2 credentials. Set R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME in .env');
  process.exit(1);
}

const s3 = new S3Client({
  region: 'auto',
  endpoint,
  credentials: { accessKeyId, secretAccessKey },
});

function formatShutterSpeed(seconds) {
  if (seconds >= 1) return `${seconds}s`;
  return `1/${Math.round(1 / seconds)}s`;
}

async function listAllObjects() {
  const objects = [];
  let continuationToken;

  do {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      ContinuationToken: continuationToken,
    });
    const response = await s3.send(command);
    if (response.Contents) {
      for (const obj of response.Contents) {
        if (/\.(jpg|jpeg)$/i.test(obj.Key)) {
          objects.push(obj.Key);
        }
      }
    }
    continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
  } while (continuationToken);

  return objects;
}

async function downloadExifHeader(key) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
    Range: 'bytes=0-262143',
  });
  const response = await s3.send(command);
  const chunks = [];
  for await (const chunk of response.Body) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

function extractExif(buffer) {
  const result = ExifParser.create(buffer).parse();
  const tags = result.tags;
  return {
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
}

async function main() {
  console.log('Listing objects in R2 bucket...');
  const r2Keys = await listAllObjects();
  console.log(`Found ${r2Keys.length} image(s) in R2`);

  let registry = {};
  try {
    registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
  } catch {
    // Registry doesn't exist yet
  }

  const r2KeySet = new Set(r2Keys);
  const staleKeys = Object.keys(registry).filter(k => !r2KeySet.has(k));
  if (staleKeys.length > 0) {
    staleKeys.forEach(k => delete registry[k]);
    console.log(`Removed ${staleKeys.length} stale entry(s): ${staleKeys.join(', ')}`);
  }

  const newKeys = r2Keys.filter(k => !registry[k] || registry[k].width === null);
  if (newKeys.length === 0) {
    console.log('No new images to process');
  } else {
    console.log(`Extracting EXIF from ${newKeys.length} new image(s)...`);
    for (const key of newKeys) {
      try {
        const buffer = await downloadExifHeader(key);
        registry[key] = extractExif(buffer);
        console.log(`  ✓ ${key}`);
      } catch (error) {
        console.warn(`  ⚠ ${key}: ${error.message}`);
        registry[key] = { error: error.message };
      }
    }
  }

  const sorted = Object.keys(registry).sort().reduce((acc, k) => {
    acc[k] = registry[k];
    return acc;
  }, {});

  fs.writeFileSync(registryPath, JSON.stringify(sorted, null, 2) + '\n', 'utf-8');

  const validCount = Object.values(sorted).filter(v => !v.error).length;
  console.log(`✓ photo-registry.json updated (${validCount} valid, ${r2Keys.length} total images)`);
}

main().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});
