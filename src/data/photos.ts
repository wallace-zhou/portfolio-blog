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

// Hand-curated metadata — edit photo-meta.json to add titles, locations, tags, hero status
import photoMetaRaw from './photo-meta.json';
// Auto-generated EXIF cache — produced by `npm run extract-exif`, gitignored
import exifCacheRaw from './exif-cache.json';

type PhotoMetaEntry = {
  title: string;
  location: string;
  tags: PhotoTag[];
  isHero: boolean;
};

type ExifCacheEntry = {
  camera?: string | null;
  lens?: string | null;
  focalLength?: string | null;
  aperture?: string | null;
  shutterSpeed?: string | null;
  iso?: string | null;
  dateTaken?: string | null;
  width?: number | null;
  height?: number | null;
  error?: string;
};

const photoMeta = photoMetaRaw as Record<string, PhotoMetaEntry>;
const exifCache = exifCacheRaw as Record<string, ExifCacheEntry>;

function filenameToId(filename: string): string {
  return filename.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]/g, '-');
}

// Import all images for type-safe references
import blogplaceholder1 from '../assets/blog-placeholder-1.jpg';
import blogplaceholder2 from '../assets/blog-placeholder-2.jpg';
import blogplaceholder3 from '../assets/blog-placeholder-3.jpg';
import blogplaceholder4 from '../assets/blog-placeholder-4.jpg';
import blogplaceholder6 from '../assets/blog-placeholder-6.jpg';
import blogplaceholderabout from '../assets/blog-placeholder-about.jpg';
import dsc4517 from '../assets/DSC_4517.jpg';
import dsc9074 from '../assets/DSC_9074.jpg';

export const imageSources = {
  'blog-placeholder-1': blogplaceholder1,
  'blog-placeholder-2': blogplaceholder2,
  'blog-placeholder-3': blogplaceholder3,
  'blog-placeholder-4': blogplaceholder4,
  'blog-placeholder-6': blogplaceholder6,
  'blog-placeholder-about': blogplaceholderabout,
  'dsc-4517': dsc4517,
  'dsc-9074': dsc9074,
} as const;

export type PhotoId = keyof typeof imageSources;

// Merge exif cache + manual metadata into the photos array at build time.
// Only includes files that have both an exif cache entry and an image import.
export const photos: PhotoMetadata[] = Object.entries(exifCache)
  .filter(([, entry]) => !entry.error)
  .map(([filename, exif]) => {
    const id = filenameToId(filename);
    const meta = photoMeta[filename] ?? { title: '', location: '', tags: [], isHero: false };
    return {
      id,
      filename,
      title: meta.title,
      location: meta.location,
      tags: meta.tags,
      isHero: meta.isHero,
      exif: {
        camera: exif.camera ?? undefined,
        lens: exif.lens ?? undefined,
        focalLength: exif.focalLength ?? undefined,
        aperture: exif.aperture ?? undefined,
        shutterSpeed: exif.shutterSpeed ?? undefined,
        iso: exif.iso ?? undefined,
        dateTaken: exif.dateTaken ?? undefined,
      },
    };
  })
  .filter(photo => photo.id in imageSources);

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

export const tagBannerPhotos: Record<PhotoTag | 'all', PhotoId> = {
  'all': 'dsc-4517',
  'Landscape': 'blog-placeholder-1',
  'Cityscape': 'blog-placeholder-about',
  'Street': 'blog-placeholder-2',
  'Car': 'blog-placeholder-4',
};

export function getBannerPhotoForTag(tag: PhotoTag | 'all'): PhotoId {
  return tagBannerPhotos[tag];
}

export function getBannerImageSource(tag: PhotoTag | 'all') {
  return imageSources[getBannerPhotoForTag(tag)];
}

export function getPhotosSortedByDate(): PhotoMetadata[] {
  return [...photos].sort((a, b) => {
    const dateA = a.exif.dateTaken ? new Date(a.exif.dateTaken).getTime() : 0;
    const dateB = b.exif.dateTaken ? new Date(b.exif.dateTaken).getTime() : 0;
    return dateB - dateA;
  });
}
