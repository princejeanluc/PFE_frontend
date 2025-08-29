// app/(marketing)/_components/FeatureShowcase.tsx
"use client";
import { FEATURES } from "../data/showcase";
import FeatureCard from "./FeatureCard";

export default function FeatureShowcase() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <h2 className="text-2xl md:text-3xl font-bold text-center">Fonctionnalités</h2>
      <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
        Chaque carte montre le wireframe ; cliquez pour voir les captures réelles.
      </p>
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((f, i) => <FeatureCard key={f.key} f={f as any} i={i} />)}
      </div>
    </section>
  );
}
