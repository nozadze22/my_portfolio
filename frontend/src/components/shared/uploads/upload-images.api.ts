import { api } from "@/lib/api";

export type UploadScope = "projects" | "profile" | "misc";

export type UploadImagesResponse = {
  urls: string[];
  storage?: "r2" | "local";
};

export async function uploadImages(files: File[], scope: UploadScope = "projects") {
  const body = new FormData();
  for (const file of files) {
    body.append("files", file);
  }
  const query = scope === "projects" ? "" : `?scope=${scope}`;
  const path = scope === "projects" ? "/uploads/project-images" : `/uploads/images${query}`;

  return api<UploadImagesResponse>(path, {
    method: "POST",
    body,
  });
}

/** @deprecated Prefer `uploadImages(files, "projects")`. */
export async function uploadProjectImages(files: File[]) {
  return uploadImages(files, "projects");
}