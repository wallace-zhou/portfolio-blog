const IMAGE_BASE_URL = import.meta.env.PUBLIC_IMAGE_BASE_URL;

export function getImageUrl(r2Path: string): string {
  return `${IMAGE_BASE_URL}/${r2Path}`;
}
