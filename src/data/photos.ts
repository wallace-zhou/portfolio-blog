// Photo tagging and metadata system
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
import blogPlaceholder1 from '../assets/blog-placeholder-1.jpg';
import blogPlaceholder2 from '../assets/blog-placeholder-2.jpg';
import blogPlaceholder3 from '../assets/blog-placeholder-3.jpg';
import blogPlaceholder4 from '../assets/blog-placeholder-4.jpg';
import blogPlaceholder6 from '../assets/blog-placeholder-6.jpg';
import blogPlaceholderAbout from '../assets/blog-placeholder-about.jpg';
import dsc4517 from '../assets/DSC_4517.jpg';
import dsc9074 from '../assets/DSC_9074.jpg';

// Image source mapping for dynamic imports
export const imageSources = {
  'blog-placeholder-1': blogPlaceholder1,
  'blog-placeholder-2': blogPlaceholder2,
  'blog-placeholder-3': blogPlaceholder3,
  'blog-placeholder-4': blogPlaceholder4,
  'blog-placeholder-6': blogPlaceholder6,
  'blog-placeholder-about': blogPlaceholderAbout,
  'dsc-4517': dsc4517,
  'dsc-9074': dsc9074,
} as const;

export type PhotoId = keyof typeof imageSources;

// Photo metadata with EXIF data extracted from images
export const photos: PhotoMetadata[] = [
  {
    id: 'blog-placeholder-1',
    filename: 'blog-placeholder-1.jpg',
    title: 'Golden Hour Mountains',
    location: 'Colorado, USA',
    tags: ['Landscape'],
    isHero: true,
    exif: {
      camera: 'NIKON CORPORATION NIKON D7200',
      lens: '18.0-35.0 mm f/3.5-4.5',
      focalLength: '18mm',
      aperture: 'f/8',
      shutterSpeed: '1/250s',
      iso: 'ISO 100',
      dateTaken: '2025-12-21',
    },
  },
  {
    id: 'blog-placeholder-2',
    filename: 'blog-placeholder-2.jpg',
    title: 'Alpine Road',
    location: 'Eastern Sierra, California',
    tags: ['Landscape', 'Street'],
    isHero: true,
    exif: {
      camera: 'NIKON CORPORATION NIKON D7200',
      lens: '18.0-35.0 mm f/3.5-4.5',
      focalLength: '24mm',
      aperture: 'f/8',
      shutterSpeed: '1/500s',
      iso: 'ISO 400',
      dateTaken: '2025-12-21',
    },
  },
  {
    id: 'blog-placeholder-3',
    filename: 'blog-placeholder-3.jpg',
    title: 'Misty Forest',
    location: 'Pacific Northwest',
    tags: ['Landscape'],
    isHero: true,
    exif: {
      camera: 'NIKON CORPORATION NIKON D7200',
      lens: '18.0-35.0 mm f/3.5-4.5',
      focalLength: '35mm',
      aperture: 'f/8',
      shutterSpeed: '1/80s',
      iso: 'ISO 100',
      dateTaken: '2025-12-22',
    },
  },
  {
    id: 'blog-placeholder-4',
    filename: 'blog-placeholder-4.jpg',
    title: 'Desert Canyon',
    location: 'Utah, USA',
    tags: ['Landscape'],
    isHero: true,
    exif: {
      camera: 'NIKON CORPORATION NIKON D7200',
      lens: '18.0-35.0 mm f/3.5-4.5',
      focalLength: '18mm',
      aperture: 'f/8',
      shutterSpeed: '1/80s',
      iso: 'ISO 100',
      dateTaken: '2025-12-25',
    },
  },
  {
    id: 'blog-placeholder-6',
    filename: 'blog-placeholder-6.jpg',
    title: 'Sunset Valley',
    location: 'Arizona, USA',
    tags: ['Landscape'],
    isHero: true,
    exif: {
      camera: 'NIKON CORPORATION NIKON D7200',
      lens: '50.0 mm f/1.8',
      focalLength: '50mm',
      aperture: 'f/8',
      shutterSpeed: '1/500s',
      iso: 'ISO 100',
      dateTaken: '2025-12-28',
    },
  },
  {
    id: 'blog-placeholder-about',
    filename: 'blog-placeholder-about.jpg',
    title: 'City Lights',
    location: 'New York, USA',
    tags: ['Cityscape', 'Street'],
    isHero: true,
    exif: {
      camera: 'NIKON CORPORATION NIKON D7200',
      lens: '18.0-35.0 mm f/3.5-4.5',
      focalLength: '18mm',
      aperture: 'f/8',
      shutterSpeed: '1/60s',
      iso: 'ISO 280',
      dateTaken: '2025-12-25',
    },
  },
  {
    id: 'dsc-4517',
    filename: 'DSC_4517.jpg',
    title: 'Ocean Panorama',
    location: 'Big Sur, California',
    tags: ['Landscape'],
    isHero: true,
    exif: {
      camera: 'NIKON CORPORATION NIKON D7200',
      lens: '50.0 mm f/1.8',
      focalLength: '50mm',
      aperture: 'f/8',
      shutterSpeed: '1/200s',
      iso: 'ISO 100',
      dateTaken: '2025-07-12',
    },
  },
  {
    id: 'dsc-9074',
    filename: 'DSC_9074.jpg',
    title: 'Urban Exploration',
    location: 'San Francisco, USA',
    tags: ['Street', 'Cityscape'],
    isHero: true,
    exif: {
      camera: 'NIKON CORPORATION NIKON D7200',
      lens: '105.0 mm f/2.8',
      focalLength: '105mm',
      aperture: 'f/2.8',
      shutterSpeed: '1/640s',
      iso: 'ISO 100',
      dateTaken: '2025-12-22',
    },
  },
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
