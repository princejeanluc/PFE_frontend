"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import React from "react";
import { SECTIONS } from "./dashboard/_components/data/section";
import ScrollBGShowcase from "./dashboard/_components/ui/ScrollBGShowcase";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: 0.08 * i, duration: 0.5, ease: "easeOut" } }),
};

function NavBar() {
  return (
    <header className="sticky top-0 z-40 bg-white/70 dark:bg-black/40 backdrop-blur border-b border-zinc-200/60 dark:border-zinc-800/60">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src={"/landing/logo.png"}  alt="Logo POSA" width={36} height={36}></Image>

          <span className="font-semibold tracking-tight">POSA</span>
        </Link>
        <nav className="hidden md:flex items-center gap-5 text-sm">
          <Link href="/" className="hover:text-indigo-600">Accueil</Link>
          <Link href="/dashboard/market" className="hover:text-indigo-600">Marché</Link>
          <Link href="/dashboard/assist" className="hover:text-indigo-600">Assistant News</Link>
          <Link href="/dashboard/risk" className="hover:text-indigo-600">Gestion de risque</Link>
          <Link href="/dashboard/simulation" className="hover:text-indigo-600">Simulation</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm">
            Se connecter
          </Link>
          <Link href="/register" className="px-3 py-1.5 rounded-lg bg-black text-white dark:bg-white dark:text-black text-sm">
            S’enregistrer
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Fond doux */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-sky-400/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <motion.h1
            className="text-3xl md:text-5xl font-bold leading-tight"
            variants={fadeUp} initial="hidden" animate="show"
          >
            Maîtriser le marché <span className="whitespace-nowrap">dès maintenant</span>
          </motion.h1>
          <motion.p
            className="mt-4 text-zinc-600 dark:text-zinc-300"
            custom={1} variants={fadeUp} initial="hidden" animate="show"
          >
            L’IA au cœur de votre stratégie : analyse des actualités, gestion du risque et simulation —
            tout-en-un, simple et rapide.
          </motion.p>
          <motion.div className="mt-6 flex gap-3" custom={2} variants={fadeUp} initial="hidden" animate="show">
            <Link href="/register" className="px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black">
              C’est parti
            </Link>
            <Link href="/dashboard/assist" className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700">
              Voir l’analyse
            </Link>
          </motion.div>
        </div>

        {/* Visuel (remplace par ton image/illustration) */}
        <motion.div
          className="relative aspect-[16/10] w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-black overflow-hidden"
          custom={3} variants={fadeUp} initial="hidden" animate="show"
        >
          {/* Placeholder image */}
          <Image
            alt="Aperçu produit"
            src="/landing/hero.png" // remplace par ton asset (public/hero-placeholder.png)
            fill
            className="object-cover opacity-90"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCard({
  title, desc, href, i, icon,
}: { title: string; desc: string; href: string; i: number; icon?: React.ReactNode }) {
  return (
    <motion.div
      custom={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}
      className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 hover:shadow-md transition bg-white/60 dark:bg-black/40 backdrop-blur"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
          {icon ?? <span className="text-indigo-600 font-bold">★</span>}
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{desc}</p>
      <Link href={href} className="mt-4 inline-block text-sm text-indigo-600 hover:underline">
        Découvrir →
      </Link>
    </motion.div>
  );
}

function Features() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <motion.h2 className="text-2xl md:text-3xl font-bold text-center" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
        L’IA au cœur de votre stratégie
      </motion.h2>
      <div className="mt-8 grid md:grid-cols-3 gap-5">
        <FeatureCard
          i={1}
          title="Gestion du risque"
          desc="Définis des limites, suis l’exposition et génère des suggestions prudentes."
          href="/dashboard/risk"
        />
        <FeatureCard
          i={2}
          title="Simulation"
          desc="Teste tes idées avant d’agir : scénarios, hypothèses, sensibilités."
          href="/dashboard/simulation"
        />
        <FeatureCard
          i={3}
          title="Assistant"
          desc="Brief actu (titres) et chat de conseils — sans quitter ton dashboard."
          href="/dashboard/assist"
        />
      </div>
    </section>
  );
}
/*
function BigVisual() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <motion.div
        variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
        className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
      >
        
        <div className="aspect-[16/9] bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
          <span className="text-sm text-zinc-500">Place ici une capture ou illustration de ton dashboard</span>
        </div>
      </motion.div>
    </section>
  );
}*/

function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-4 py-10 grid sm:grid-cols-3 gap-6 text-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-indigo-500 to-sky-400" />
            <span className="font-semibold">POSA</span>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400">Plateforme d’aide à la décision crypto.</p>
        </div>
        <div>
          <h4 className="font-medium">Produit</h4>
          <ul className="mt-2 space-y-1 text-zinc-600 dark:text-zinc-400">
            <li><Link href="/dashboard/assist">Assistant</Link></li>
            <li><Link href="/dashboard/risk">Gestion du risque</Link></li>
            <li><Link href="/dashboard/simulation">Simulation</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium">Compte</h4>
          <ul className="mt-2 space-y-1 text-zinc-600 dark:text-zinc-400">
            <li><Link href="/login">Se connecter</Link></li>
            <li><Link href="/register">S’enregistrer</Link></li>
          </ul>
        </div>
      </div>
      <div className="py-4 text-center text-xs text-zinc-500">© {new Date().getFullYear()} POSA — Tous droits réservés</div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100">
      <NavBar />
      <Hero />
      <Features />
      <ScrollBGShowcase sections={SECTIONS} />
      <Footer />
    </main>
  );
}
