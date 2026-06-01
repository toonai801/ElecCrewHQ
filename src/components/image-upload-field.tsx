"use client";

import { useRef, useState, type ChangeEvent, type CSSProperties } from "react";
import {
  defaultUploadType,
  getUploadLimitBytes,
  getUploadLimitMegabytes,
  supportedImageTypeLabel,
  supportedImageTypes,
  type UploadType,
} from "@/lib/upload-limits";

export function ImageUploadField({
  name,
  label,
  defaultValue = "",
  accent = "var(--ec-violet)",
  uploadType = defaultUploadType,
  uploadTypeByPostType,
  limitNote,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  accent?: string;
  uploadType?: UploadType;
  uploadTypeByPostType?: Partial<Record<string, UploadType>>;
  limitNote?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(defaultValue || "");
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  function getEffectiveUploadType() {
    const form = rootRef.current?.closest("form");
    const postType = form?.querySelector<HTMLSelectElement>('select[name="postType"]')?.value;

    return (postType && uploadTypeByPostType?.[postType]) || uploadType;
  }

  function getEffectiveLimit() {
    const effectiveUploadType = getEffectiveUploadType();

    return {
      uploadType: effectiveUploadType,
      bytes: getUploadLimitBytes(effectiveUploadType),
      megabytes: getUploadLimitMegabytes(effectiveUploadType),
    };
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null;
    const limit = getEffectiveLimit();

    if (selectedFile && !supportedImageTypes.includes(selectedFile.type)) {
      setFile(null);
      setMessage(`Use ${supportedImageTypeLabel}.`);
      event.target.value = "";
      return;
    }

    if (selectedFile && selectedFile.size > limit.bytes) {
      setFile(null);
      setMessage(`Image must be ${limit.megabytes} MB or smaller.`);
      event.target.value = "";
      return;
    }

    setFile(selectedFile);
    setMessage("");
  }

  async function upload() {
    if (!file) {
      setMessage("Choose an image first.");
      return;
    }

    const limit = getEffectiveLimit();

    if (file.size > limit.bytes) {
      setMessage(`Image must be ${limit.megabytes} MB or smaller.`);
      return;
    }

    setIsUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploadType", limit.uploadType);

    const response = await fetch("/api/uploads", {
      method: "POST",
      body: formData,
    });
    const payload = await response.json().catch(() => ({}));

    setIsUploading(false);

    if (!response.ok || !payload.url) {
      setMessage(payload.error || "Upload is not configured yet.");
      return;
    }

    setValue(payload.url);
    setMessage("Image ready.");
  }

  return (
    <div ref={rootRef} className="grid gap-2 text-sm font-bold text-white/80">
      <span>{label}</span>
      <input
        name={name}
        type="hidden"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <div className="grid gap-2 rounded-md border border-white/10 bg-black/45 p-3">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="max-w-full rounded-md border border-white/10 bg-black px-3 py-2 text-xs text-white/75"
        />
        <button
          type="button"
          onClick={upload}
          disabled={isUploading}
          className="w-fit rounded-md border border-white/15 px-3 py-2 text-xs font-black text-white hover:bg-white/10 disabled:opacity-60"
          style={{ borderColor: accent }}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
        <p className="text-xs text-white/45">
          {limitNote || `${supportedImageTypeLabel}. Max ${getUploadLimitMegabytes(uploadType)} MB.`}
        </p>
        {value ? <p className="break-all text-xs text-[color:var(--ec-green)]">Image selected.</p> : null}
      </div>
      <details className="text-xs text-white/55">
        <summary className="cursor-pointer hover:text-white">Paste image URL instead</summary>
        <input
          type="url"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="mt-2 w-full rounded-md border border-white/10 bg-black px-3 py-2 text-white outline-none"
          style={{ "--tw-ring-color": accent } as CSSProperties}
          placeholder="https://..."
        />
      </details>
      {message ? <p className="text-xs text-[color:var(--ec-muted)]">{message}</p> : null}
    </div>
  );
}
