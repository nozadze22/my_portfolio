/**
 * Reusable image uploads for admin forms and future features.
 *
 * @example
 * const upload = useImageUpload({ scope: "projects" });
 * <Uploads files={upload.files} onChange={upload.setFiles} label="Project photos" />
 * await upload.uploadPending();
 */
export { ImageUploadField, type ImageUploadFieldProps } from "./image-upload-field";
export { useImageUpload } from "./use-image-upload";
export {
  uploadImages,
  uploadProjectImages,
  type UploadImagesResponse,
  type UploadScope,
} from "./upload-images.api";
export {
  UPLOAD_ACCEPT,
  UPLOAD_MAX_BYTES,
  UPLOAD_MAX_BYTES_LABEL,
  UPLOAD_MAX_FILES,
} from "./constants";

export { ImageUploadField as Uploads } from "./image-upload-field";