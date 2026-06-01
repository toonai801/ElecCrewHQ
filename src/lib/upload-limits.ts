export const uploadLimitMegabytes = {
  avatar: 2,
  community: 5,
  flyer: 8,
  adminEventFlyer: 10,
} as const;

export type UploadType = keyof typeof uploadLimitMegabytes;

export const defaultUploadType: UploadType = "community";

export function getUploadLimitMegabytes(uploadType: UploadType) {
  return uploadLimitMegabytes[uploadType];
}

export function getUploadLimitBytes(uploadType: UploadType) {
  return getUploadLimitMegabytes(uploadType) * 1024 * 1024;
}

export const supportedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const supportedImageTypeLabel = "JPG, PNG, WebP, or GIF";
