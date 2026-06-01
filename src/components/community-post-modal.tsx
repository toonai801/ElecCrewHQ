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
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-xl sm:p-6" role="dialog" aria-modal="true" aria-label="Add community post">
          <button className="fixed inset-0 cursor-default" type="button" aria-label="Close modal" onClick={() => setIsOpen(false)} />
          <div className="ec-spectrum-border relative my-3 flex max-h-[calc(100dvh-1.5rem)] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-white/10 bg-black shadow-[0_0_80px_rgba(166,95,255,0.25)] sm:my-6 sm:max-h-[calc(100dvh-3rem)]">
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-black/90 px-5 py-4 backdrop-blur-xl">
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
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 pb-8">
              <CommunityPostForm framed={false} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
