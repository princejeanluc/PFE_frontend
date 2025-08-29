"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import clsx from "clsx";
import { ShowSection } from "../data/section";

const listVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.10, duration: 0.45, ease: "easeOut" },
  },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

function Row({ s, index }: { s: ShowSection; index: number }) {
  const reverse = index % 2 === 1;

  // image anim
  const imgInitial = { opacity: 0, x: reverse ? 30 : -30 };
  const imgWhileInView = { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } };

  // texte anim (stagger)
  const txtInitial = "hidden";
  const txtWhileInView = "show";

  return (
    <section className="relative mx-auto max-w-6xl px-4 md:px-6 py-16 md:py-24">
      <div className={clsx(
        "grid items-center gap-8 md:gap-12",
        reverse ? "md:grid-cols-[1fr_1.1fr]" : "md:grid-cols-[1.1fr_1fr]"
      )}>
        {/* Image */}
        <motion.div
          initial={imgInitial}
          whileInView={imgWhileInView}
          viewport={{ once: true, amount: 0.4 }}
          className={clsx(
            "relative aspect-[16/10] w-full overflow-hidden rounded-2xl border",
            "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900",
            reverse ? "order-2 md:order-2" : "order-2 md:order-1"
          )}
        >
          <Image
            src={s.image}
            alt={s.alt || s.title}
            fill
            className="object-contain md:object-cover"
            sizes="(max-width: 1200px) 100vw, 1000px"
            priority={index <= 1}
          />
          <div className="absolute left-3 top-3 text-xs px-2 py-0.5 rounded-md bg-black/70 text-white">
            Aperçu
          </div>
        </motion.div>

        {/* Texte / bullets */}
        <motion.div
          variants={listVariants}
          initial={txtInitial}
          whileInView={txtWhileInView}
          viewport={{ once: true, amount: 0.4 }}
          className={clsx(
            "order-1 md:order-2",
            reverse ? "md:pl-0" : "md:pr-0"
          )}
        >
          <motion.h3 variants={itemVariants} className="text-2xl md:text-3xl font-bold">
            {s.title}
          </motion.h3>

          <motion.ul variants={listVariants} className="mt-4 space-y-2">
            {s.features.map((f, i) => (
              <motion.li
                key={i}
                variants={itemVariants}
                className="text-zinc-700 dark:text-zinc-300 flex items-start gap-2"
              >
                <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                <span>{f}</span>
              </motion.li>
            ))}
          </motion.ul>

          {s.href && (
            <motion.div variants={itemVariants} className="mt-6">
              <Link
                href={s.href}
                className="inline-block px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black"
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

export default function ScrollShowcase({ sections }: { sections: ShowSection[] }) {
  return (
    <div className="relative">
      {/* fond doux */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 left-0 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-sky-400/15 blur-3xl" />
      </div>

      {sections.map((s, i) => (
        <Row key={s.title} s={s} index={i} />
      ))}
    </div>
  );
}
