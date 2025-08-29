// app/(marketing)/_components/ScrollBGShowcase.tsx
"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import clsx from "clsx";
import { BGSection } from "../data/section";

const wrapVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", when: "beforeChildren", staggerChildren: 0.08 },
  },
};

const chipVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 6 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

function Panel({ s }: { s: BGSection }) {
  const align = s.align ?? "left";
  const light = s.tone === "light";

  return (
    <section
      aria-label={s.alt || s.title}
      className="relative w-full min-h-[86vh] md:min-h-[92vh] flex items-center"
      style={{
        backgroundImage: `url(${s.bg})`,
        backgroundSize: "auto",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Gradient de lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent dark:from-black/40" />

      {/* Contenu */}
      <div className={clsx(
        "relative z-10 mx-auto w-full max-w-6xl px-4 md:px-6",
        align === "center" ? "flex justify-center" :
        align === "right"  ? "flex justify-end" : "flex justify-start"
      )}>
        <motion.div
          variants={wrapVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className={clsx(
            "backdrop-blur-sm rounded-2xl p-5 md:p-7 border",
            light
              ? "bg-white/55 border-white/40 text-zinc-900"
              : "bg-black/45 border-white/10 text-white",
            "max-w-xl"
          )}
        >
          <motion.h3 variants={chipVariants} className="text-2xl md:text-3xl font-bold">
            {s.title}
          </motion.h3>

          {/* Puces/bulles */}
          <div className="mt-4 flex flex-wrap gap-2">
            {s.features.map((f, i) => (
              <motion.span
                key={i}
                variants={chipVariants}
                className={clsx(
                  "text-sm px-3 py-1.5 rounded-full border",
                  light
                    ? "bg-white/70 border-white/60"
                    : "bg-white/10 border-white/20"
                )}
              >
                {f}
              </motion.span>
            ))}
          </div>

          {/* Bouton */}
          {s.href && (
            <motion.div variants={chipVariants} className="mt-5">
              <Link
                href={s.href}
                className={clsx(
                  "inline-block px-4 py-2 rounded-lg text-sm font-medium",
                  light ? "bg-black text-white" : "bg-white text-black"
                )}
              >
                Ouvrir
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export default function ScrollBGShowcase({ sections }: { sections: BGSection[] }) {
  return (
    <div className="relative">
      {/* Décors doux */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-0 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-400/15 blur-3xl" />
      </div>

      {sections.map((s, i) => (
        <Panel key={`${s.title}-${i}`} s={s} />
      ))}
    </div>
  );
}
