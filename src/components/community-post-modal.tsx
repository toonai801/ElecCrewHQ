"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { CommunityPostForm } from "@/components/community-post-form";

export function CommunityPostModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className="ec-button-primary px-4 py-2 text-sm">
        Add post
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-xl" role="dialog" aria-modal="true" aria-label="Add community post">
          <button className="absolute inset-0 cursor-default" type="button" aria-label="Close modal" onClick={() => setIsOpen(false)} />
          <div className="ec-spectrum-border relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-white/10 bg-black shadow-[0_0_80px_rgba(166,95,255,0.25)]">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-black/90 px-5 py-4 backdrop-blur-xl">
              <h2 className="text-lg font-black text-white">Add community post</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="grid size-9 place-items-center rounded-md border border-white/10 text-white/75 hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            <div className="p-5">
              <CommunityPostForm framed={false} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
