"use client";

import { useCallback, useState } from "react";

import { uploadImages, type UploadScope } from "./upload-images.api";
import { UPLOAD_MAX_FILES } from "./constants";

type UseImageUploadOptions = {
  scope?: UploadScope;
  maxFiles?: number;
  /** Already persisted URLs (e.g. when editing). */
  initialUrls?: string[];
};

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const scope = options.scope ?? "projects";
  const maxFiles = options.maxFiles ?? UPLOAD_MAX_FILES;

  const [files, setFiles] = useState<File[]>([]);
  const [urls, setUrls] = useState<string[]>(options.initialUrls ?? []);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadPending = useCallback(async () => {
    if (files.length === 0) {
      return urls;
    }
    setError(null);
    setIsUploading(true);
    try {
      const result = await uploadImages(files, scope);
      const merged = [...urls, ...result.urls];
      setUrls(merged);
      setFiles([]);
      return merged;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, [files, scope, urls]);

  const removeUrl = useCallback((index: number) => {
    setUrls((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const reset = useCallback(() => {
    setFiles([]);
    setUrls(options.initialUrls ?? []);
    setError(null);
    setIsUploading(false);
  }, [options.initialUrls]);

  const totalCount = urls.length + files.length;

  const setFilesBounded = useCallback(
    (next: File[]) => {
      const room = Math.max(0, maxFiles - urls.length);
      setFiles(next.slice(0, room));
    },
    [maxFiles, urls.length],
  );

  return {
    scope,
    maxFiles,
    files,
    setFiles: setFilesBounded,
    urls,
    setUrls,
    removeUrl,
    uploadPending,
    isUploading,
    error,
    setError,
    reset,
    totalCount,
    hasPendingFiles: files.length > 0,
    coverUrl: urls[0] ?? null,
  };
}