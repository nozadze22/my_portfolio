"use client";

import { useEffect, useMemo, useRef } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";

import {
  UPLOAD_ACCEPT,
  UPLOAD_MAX_BYTES,
  UPLOAD_MAX_BYTES_LABEL,
  UPLOAD_MAX_FILES,
} from "./constants";

export type ImageUploadFieldProps = {
  files: File[];
  onChange: (files: File[]) => void;
  /** URLs already saved on the server (edit flows). */
  existingUrls?: string[];
  onRemoveExistingUrl?: (url: string, index: number) => void;
  maxFiles?: number;
  disabled?: boolean;
  label?: string;
  description?: string;
  className?: string;
  showCoverBadge?: boolean;
  onValidationError?: (message: string) => void;
};

type LocalPreview = {
  id: string;
  previewUrl: string;
};

function fileId(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

export function ImageUploadField({
  files,
  onChange,
  existingUrls = [],
  onRemoveExistingUrl,
  maxFiles = UPLOAD_MAX_FILES,
  disabled = false,
  label = "Images",
  description,
  className = "",
  showCoverBadge = true,
  onValidationError,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const slotsLeft = Math.max(0, maxFiles - existingUrls.length);

  const localPreviews = useMemo<LocalPreview[]>(
    () =>
      files.map((file) => ({
        id: fileId(file),
        previewUrl: URL.createObjectURL(file),
      })),
    [files],
  );

  useEffect(() => {
    return () => {
      for (const p of localPreviews) URL.revokeObjectURL(p.previewUrl);
    };
  }, [localPreviews]);

  const hint = useMemo(() => {
    const base = `${existingUrls.length + files.length}/${maxFiles} · JPG, PNG, WebP, GIF · max ${UPLOAD_MAX_BYTES_LABEL} each`;
    return description ?? base;
  }, [description, existingUrls.length, files.length, maxFiles]);

  function reportError(message: string) {
    onValidationError?.(message);
  }

  function addFiles(incoming: FileList | null) {
    if (disabled || !incoming?.length) return;

    const allowed: File[] = [];
    for (const file of incoming) {
      if (!file.type.startsWith("image/")) {
        reportError(`${file.name}: not an image`);
        continue;
      }
      if (file.size > UPLOAD_MAX_BYTES) {
        reportError(`${file.name}: exceeds ${UPLOAD_MAX_BYTES_LABEL}`);
        continue;
      }
      allowed.push(file);
    }

    if (!allowed.length) return;

    const merged = [...files, ...allowed].slice(0, slotsLeft);
    if (merged.length < files.length + allowed.length) {
      reportError(`Maximum ${maxFiles} images allowed`);
    }
    onChange(merged);
  }

  function removeLocalAt(index: number) {
    onChange(files.filter((_, i) => i !== index));
  }

  const canAddMore = !disabled && existingUrls.length + files.length < maxFiles;

  return (
    <div className={`flex flex-col gap-space-sm ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-on-surface">{label}</span>
        <span className="font-label-code text-[11px] text-on-surface-variant">{hint}</span>
      </div>

      {canAddMore ? (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          onKeyDown={(e) => {
            if (disabled) return;
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          onClick={() => !disabled && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addFiles(e.dataTransfer.files);
          }}
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-surface-variant bg-surface-container-low px-space-md py-8 transition-colors hover:border-primary hover:bg-surface-container-lowest aria-disabled:cursor-not-allowed aria-disabled:opacity-60"
        >
          <MaterialSymbol name="upload" className="text-[32px] text-primary" />
          <p className="text-center text-sm text-on-surface-variant">
            Click or drag images here
          </p>
          <p className="text-center text-xs text-outline">Select multiple files at once</p>
        </div>
      ) : (
        <p className="rounded-lg bg-surface-container-low px-space-sm py-2 text-sm text-on-surface-variant">
          Image limit reached ({maxFiles}).
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={UPLOAD_ACCEPT}
        multiple
        disabled={disabled || !canAddMore}
        className="hidden"
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {existingUrls.length > 0 || localPreviews.length > 0 ? (
        <ul className="grid grid-cols-2 gap-space-sm sm:grid-cols-3 md:grid-cols-4">
          {existingUrls.map((url, index) => (
            <li
              key={url}
              className="group relative aspect-video overflow-hidden rounded-lg border border-surface-variant bg-surface-container shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              {showCoverBadge && index === 0 ? (
                <span className="absolute top-1 left-1 rounded bg-primary px-1.5 py-0.5 font-label-badge text-[10px] text-on-primary">
                  Cover
                </span>
              ) : null}
              {onRemoveExistingUrl ? (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onRemoveExistingUrl(url, index)}
                  className="absolute top-1 right-1 rounded-lg bg-surface-container-lowest/90 p-1 text-on-surface-variant opacity-0 transition-opacity group-hover:opacity-100 hover:text-error disabled:opacity-40"
                  title="Remove"
                >
                  <MaterialSymbol name="close" className="text-[18px]" />
                </button>
              ) : null}
            </li>
          ))}
          {localPreviews.map((item, index) => (
            <li
              key={item.id}
              className="group relative aspect-video overflow-hidden rounded-lg border border-surface-variant bg-surface-container shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.previewUrl} alt="" className="h-full w-full object-cover" />
              <span className="absolute bottom-1 left-1 rounded bg-on-surface/70 px-1.5 py-0.5 font-label-badge text-[10px] text-surface">
                New
              </span>
              {showCoverBadge && existingUrls.length === 0 && index === 0 ? (
                <span className="absolute top-1 left-1 rounded bg-primary px-1.5 py-0.5 font-label-badge text-[10px] text-on-primary">
                  Cover
                </span>
              ) : null}
              <button
                type="button"
                disabled={disabled}
                onClick={() => removeLocalAt(index)}
                className="absolute top-1 right-1 rounded-lg bg-surface-container-lowest/90 p-1 text-on-surface-variant opacity-0 transition-opacity group-hover:opacity-100 hover:text-error disabled:opacity-40"
                title="Remove"
              >
                <MaterialSymbol name="close" className="text-[18px]" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}