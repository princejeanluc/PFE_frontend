// app/(marketing)/_components/FeatureCard.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import Lightbox from "./LightBox";

type Feature = {
  title: string; desc: string; cover: string; screenshots: string[];
  bullets: string[]; href: string;
};

export default function FeatureCard({ f, i }: { f: Feature; i: number }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 * i, duration: 0.45, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-black/40 backdrop-blur hover:shadow-md transition p-4"
      >
        <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl border border-zinc-200/60 dark:border-zinc-800/60">
          <Image
            src={f.cover}
            alt={`${f.title} aperçu`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 480px"
            priority={i < 2}
          />
          <div className="absolute left-3 top-3 text-xs px-2 py-0.5 rounded-md bg-black/70 text-white">Wireframe</div>
        </div>

        <h3 className="mt-3 text-lg font-semibold">{f.title}</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">{f.desc}</p>
        <ul className="mt-2 text-sm list-disc list-inside text-zinc-600 dark:text-zinc-300 space-y-1">
          {f.bullets.map((b, k) => <li key={k}>{b}</li>)}
        </ul>

        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setOpen(true)}
            className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-sm"
          >
            Voir les captures
          </button>
          <Link
            href={f.href}
            className="px-3 py-1.5 rounded-lg bg-black text-white dark:bg-white dark:text-black text-sm"
          >
            Ouvrir
          </Link>
        </div>
      </motion.div>

      <Lightbox open={open} onClose={() => setOpen(false)} srcs={f.screenshots} />
    </>
  );
}
