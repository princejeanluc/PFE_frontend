// app/(marketing)/_components/Lightbox.tsx
"use client";
import { useEffect } from "react";
import Image from "next/image";

export default function Lightbox({
  open,
  onClose,
  srcs,
  index = 0,
}: { open: boolean; onClose: () => void; srcs: string[]; index?: number }) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <button onClick={onClose} className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-white text-black">
        Fermer
      </button>
      <div className="max-w-5xl w-full space-y-4">
        {srcs.map((src, i) => (
          <div key={i} className="relative w-full aspect-[16/9] overflow-hidden rounded-xl border border-white/10">
            <Image
              src={src}
              alt={`capture ${i + 1}`}
              fill
              className="object-contain bg-zinc-900"
              sizes="(max-width: 1200px) 100vw, 1200px"
              placeholder="empty"
              priority={i === index}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
