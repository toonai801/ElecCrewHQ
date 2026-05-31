"use client";

import { useState, type ChangeEvent, type CSSProperties } from "react";

export function ImageUploadField({
  name,
  label,
  defaultValue = "",
  accent = "var(--ec-violet)",
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  accent?: string;
}) {
  const [value, setValue] = useState(defaultValue || "");
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setFile(event.target.files?.[0] ?? null);
    setMessage("");
  }

  async function upload() {
    if (!file) {
      setMessage("Choose an image first.");
      return;
    }

    setIsUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

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
    <div className="grid gap-2 text-sm font-bold text-white/80">
      <span>{label}</span>
      <input
        name={name}
        type="url"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="rounded-md border border-white/10 bg-black px-3 py-2 text-white outline-none"
        style={{ "--tw-ring-color": accent } as CSSProperties}
        placeholder="Paste image URL or upload a file"
      />
      <div className="flex flex-wrap gap-2">
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
          className="rounded-md border border-white/15 px-3 py-2 text-xs font-black text-white hover:bg-white/10 disabled:opacity-60"
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </div>
      {message ? <p className="text-xs text-[color:var(--ec-muted)]">{message}</p> : null}
    </div>
  );
}
