"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ShieldCheck,
  ShieldAlert,
  Database,
  Cookie,
  Globe,
  Lock,
  FileText,
  ArrowLeft,
  Download,
  Info,
  UserCheck,
  Trash2,
} from "lucide-react";

/**
 * Politique de confidentialité – page Next.js (TSX)
 *
 * ✔️ UX/UI soigné (shadcn/ui + Tailwind, dark mode)
 * ✔️ Sommaire collant + scroll‑spy
 * ✔️ Cartes « points clés »
 * ✔️ Bouton Imprimer / PDF
 * ✔️ JSON‑LD (PrivacyPolicy)
 * ✔️ Accessibilité (aria‑labels)
 * ⚠️ Modèle à personnaliser et faire valider par un juriste.
 *
 * Intégration :
 *   - Placer ce fichier dans /app/privacy/page.tsx ou /app/legal/politique-confidentialite/page.tsx
 *   - Conserver le nom d’export `Page` (App Router)
 */

const PP_VERSION = "2025-09-18"; // Mettez à jour à chaque modification substantielle

const sections = [
  { id: "intro", label: "Introduction" },
  { id: "controller", label: "Responsable du traitement" },
  { id: "data", label: "Données que nous traitons" },
  { id: "purposes", label: "Finalités et bases légales" },
  { id: "retention", label: "Durées de conservation" },
  { id: "cookies", label: "Cookies & traceurs" },
  { id: "security", label: "Sécurité" },
  { id: "thirdparties", label: "Destinataires & services tiers" },
  { id: "transfers", label: "Transferts internationaux" },
  { id: "rights", label: "Vos droits" },
  { id: "minors", label: "Utilisateurs mineurs" },
  { id: "changes", label: "Modifications" },
  { id: "contact", label: "Contact" },
];

export default function Page() {
  const router = useRouter();
  const [activeId, setActiveId] = useState<string>(sections[0].id);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastUpdated = useMemo(() => {
    try {
      const d = new Date(PP_VERSION);
      return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "2-digit" });
    } catch {
      return PP_VERSION;
    }
  }, []);

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll("section[id]"));
    observer.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top > b.boundingClientRect.top ? 1 : -1));
        if (visible[0]?.target) {
          const id = (visible[0].target as HTMLElement).id;
          setActiveId(id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.2, 0.6, 1] }
    );

    headings.forEach((h) => observer.current?.observe(h));
    return () => observer.current?.disconnect();
  }, []);

  const printPage = () => {
    if (typeof window !== "undefined") window.print();
  };

  // JSON‑LD schema.org
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PrivacyPolicy",
    name: "Politique de confidentialité",
    url: typeof window !== "undefined" ? window.location.href : "",
    dateModified: PP_VERSION,
    publisher: {
      "@type": "Organization",
      name: "POSA – Crypto Risk App",
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 md:px-8">
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Fil d’Ariane */}
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="inline-flex items-center gap-1 hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Retour</Link>
        <span>•</span>
        <span>Mentions légales</span>
        <span>/</span>
        <span className="font-medium text-foreground">Politique de confidentialité</span>
      </div>

      {/* En-tête */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-b from-background to-muted p-6 md:p-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row">
          <div className="max-w-2xl">
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="secondary" className="rounded-full">CRYPTO • RISK • APP</Badge>
              <Badge className="rounded-full" variant="outline"><FileText className="mr-1 h-3.5 w-3.5" /> Version {PP_VERSION}</Badge>
            </div>
            <h1 className="text-3xl font-semibold leading-tight md:text-4xl">Politique de confidentialité</h1>
            <p className="mt-3 text-muted-foreground">
              Cette politique explique quelles données personnelles nous traitons, dans quelles finalités et vos droits.
              Elle s’applique à l’ensemble des services de <span className="font-medium text-foreground">POSA – Crypto Risk App</span>.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Dernière mise à jour : {lastUpdated}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2 md:gap-3">
            <Button onClick={printPage} variant="outline" aria-label="Imprimer la page"><Download className="mr-2 h-4 w-4" />Imprimer / PDF</Button>
          </div>
        </div>
      </div>

      {/* Points clés */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold"><ShieldCheck className="h-4 w-4" /> Minimisation des données</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Nous collectons uniquement les données nécessaires au fonctionnement et à l’amélioration du service.
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold"><Lock className="h-4 w-4" /> Sécurité en priorité</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Mesures techniques et organisationnelles raisonnables ; aucun système n’est infaillible.
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold"><Database className="h-4 w-4" /> Pas de revente</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Nous ne vendons pas vos données personnelles. Partages limités aux prestataires nécessaires.
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-[260px_1fr]">
        {/* Sommaire */}
        <aside className="top-24 h-fit space-y-2 rounded-xl border bg-card p-3 md:sticky">
          <div className="mb-2 px-1 text-xs font-medium uppercase text-muted-foreground">Sommaire</div>
          {sections.map((s) => (
            <Link key={s.id} href={`#${s.id}`} className={`block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${activeId === s.id ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}>
              {s.label}
            </Link>
          ))}
        </aside>

        {/* Contenu */}
        <article className="prose prose-neutral max-w-none dark:prose-invert">
          <Alert className="not-prose border-amber-500/50">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Information importante</AlertTitle>
            <AlertDescription>
              Les informations ci-dessous sont en attente de validation juridique. Donc uniquement à usage informatif avant qu&apos;un cadre juridique plus rigoureux soit mis sur pied.
            </AlertDescription>
          </Alert>

          <section id="intro" aria-label="Introduction">
            <h2>1. Introduction</h2>
            <p>
              La présente politique décrit comment nous traitons vos données personnelles lorsque vous utilisez la Plateforme <strong>POSA – Crypto Risk App</strong> (la « Plateforme »).
              Elle complète nos Conditions d’utilisation.
            </p>
          </section>

          <Separator className="my-6" />

          <section id="controller" aria-label="Responsable du traitement">
            <h2>2. Responsable du traitement</h2>
            <p>
              <strong>Prince jean luc de nteppe</strong> est responsable du traitement des données.
              Contact DPO / confidentialité : <a href="mailto:princejeanluc.denteppe@gmail.com" className="underline underline-offset-4">princejeanluc.denteppe@gmail.com</a>
            </p>
          </section>

          <section id="data" aria-label="Données que nous traitons">
            <h2>3. Données que nous traitons</h2>
            <ul>
              <li><strong>Données de compte</strong> : email, nom/pseudo, mots de passe hachés, préférences.</li>
              <li><strong>Données d’usage</strong> : pages consultées, actions dans l’app, configuration des tableaux de bord, journaux techniques (IP, user‑agent).</li>
              <li><strong>Données de contenu</strong> : jeux de données importés, portefeuilles, paramètres d’algorithmes (si vous les fournissez).</li>
              <li><strong>Support</strong> : messages envoyés via formulaire ou email.</li>
              <li><strong>Cookies/traceurs</strong> : voir section « Cookies & traceurs ».</li>
            </ul>
          </section>

          <section id="purposes" aria-label="Finalités et bases légales">
            <h2>4. Finalités et bases légales</h2>
            <ul>
              <li><strong>Fourniture du service</strong> (exécution du contrat) : création et gestion du compte, fonctionnalités de la Plateforme.</li>
              <li><strong>Sécurité</strong> (intérêt légitime / obligation légale) : prévention des abus, journalisation, détection d’incidents.</li>
              <li><strong>Amélioration produit & statistiques</strong> (intérêt légitime) : analyses agrégées et mesure d’audience.</li>
              <li><strong>Communication</strong> (intérêt légitime / consentement) : réponses support, notifications techniques. Marketing uniquement avec votre consentement.</li>
              <li><strong>Conformité</strong> (obligation légale) : gestion des demandes d’exercice de droits, conservation légale.</li>
            </ul>
          </section>

          <section id="retention" aria-label="Durées de conservation">
            <h2>5. Durées de conservation</h2>
            <p>
              Nous conservons les données pour des durées proportionnées aux finalités :
            </p>
            <ul>
              <li>Données de compte : pendant la vie du compte, puis suppression ou anonymisation dans un délai de <strong>[à compléter : ex. 30 jours]</strong> après clôture.</li>
              <li>Journaux techniques : <strong>12 mois</strong> sauf obligation différente.</li>
              <li>Données de facturation : <strong>10 ans</strong> si applicable.</li>
              <li>Tickets support : <strong>24 mois</strong>.</li>
            </ul>
          </section>

          <section id="cookies" aria-label="Cookies & traceurs">
            <h2>6. Cookies & traceurs</h2>
            <p>
              Nous utilisons des cookies essentiels au fonctionnement, et, avec votre consentement, des cookies de mesure d’audience et de fonctionnalité.
              Vous pouvez gérer vos préférences à tout moment via le centre de préférences (« Gérer les cookies »).
            </p>
            <Card className="not-prose mt-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><Cookie className="h-4 w-4" /> Catégories de cookies</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <ul className="list-disc pl-5">
                  <li><strong>Essentiels</strong> : connexion, sécurité, charge (obligatoires).</li>
                  <li><strong>Mesure d’audience</strong> : usages agrégés pour améliorer le produit (consentement).</li>
                  <li><strong>Fonctionnalité</strong> : préférences d’affichage, expériences bêta (consentement).</li>
                </ul>
                <div className="mt-3 flex gap-2">
                  <Button variant="secondary" onClick={() => router.push("/privacy/preferences")}>Gérer les cookies</Button>
                  <Button variant="outline" onClick={printPage}>Imprimer / PDF</Button>
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="security" aria-label="Sécurité">
            <h2>7. Sécurité</h2>
            <p>
              Nous mettons en œuvre des mesures raisonnables (chiffrement en transit, contrôle d’accès, journalisation, sauvegardes).
              Malgré ces efforts, aucun système n’est exempt de vulnérabilités. Protégez vos identifiants et appareils.
            </p>
          </section>

          <section id="thirdparties" aria-label="Destinataires & services tiers">
            <h2>8. Destinataires & services tiers</h2>
            <p>
              Nous partageons des données avec des prestataires qui nous aident à fournir le service (hébergement, emailing, analytique,
              observabilité, paiement si applicable). Ces prestataires agissent selon nos instructions et des accords de traitement.
            </p>
          </section>

          <section id="transfers" aria-label="Transferts internationaux">
            <h2>9. Transferts internationaux</h2>
            <p>
              Si des données sont transférées en dehors de votre juridiction, nous mettons en place des garanties appropriées (ex. clauses
              contractuelles types) lorsque requis. <strong>Cameroun</strong>.
            </p>
          </section>

          <section id="rights" aria-label="Vos droits">
            <h2>10. Vos droits</h2>
            <ul>
              <li>Droit d’accès, de rectification, d’effacement et de limitation.</li>
              <li>Droit d’opposition et de retrait du consentement (pour les traitements basés sur le consentement).</li>
              <li>Droit à la portabilité (lorsque applicable).</li>
              <li>Droit d’introduire une réclamation auprès de l’autorité de contrôle compétente <strong>[ex. CNIL (FR) / INPDP (TN)]</strong>.</li>
            </ul>
            <Card className="not-prose mt-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><UserCheck className="h-4 w-4" /> Exercer vos droits</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Pour toute demande, contactez‑nous à <a href="mailto:princejeanluc.denteppe@gmail.com" className="underline underline-offset-4">princejeanluc.denteppe@gmail.com</a> en précisant :</p>
                <ul className="list-disc pl-5 mt-2">
                  <li>La nature de la demande (accès, rectification, suppression, portabilité, opposition).</li>
                  <li>L’adresse email liée à votre compte.</li>
                  <li>Tout élément permettant de vérifier votre identité.</li>
                </ul>
                <div className="mt-3 flex gap-2">
                  <Button variant="secondary" onClick={() => router.push("/account/privacy")}>Tableau de bord confidentialité</Button>
                  <Button variant="outline" onClick={() => router.push("/account/delete")}>Supprimer mon compte <Trash2 className="ml-2 h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="minors" aria-label="Utilisateurs mineurs">
            <h2>11. Utilisateurs mineurs</h2>
            <p>
              La Plateforme ne s’adresse pas aux personnes n’ayant pas l’âge légal requis dans leur juridiction. Si vous êtes parent/tuteur et
              pensez qu’un mineur nous a fourni des données, contactez‑nous pour suppression.
            </p>
          </section>

          <section id="changes" aria-label="Modifications">
            <h2>12. Modifications de la politique</h2>
            <p>
              Nous pouvons modifier cette politique pour des raisons juridiques, techniques ou opérationnelles. La date de dernière mise à jour
              figure en tête de page. En cas de changements substantiels, nous chercherons à vous en informer raisonnablement.
            </p>
          </section>

          <section id="contact" aria-label="Contact">
            <h2>13. Contact</h2>
            <p>
              Pour toute question relative à cette politique : <a href="mailto:princejeanluc.denteppe@gmail.com" className="underline underline-offset-4">princejeanluc.denteppe@gmail.com</a>
            </p>
          </section>

          <Separator className="my-8" />

          <div className="not-prose flex flex-wrap items-center gap-3">
            <Button onClick={printPage} variant="outline"><Download className="mr-2 h-4 w-4" />Imprimer / PDF</Button>
            <Button variant="secondary" onClick={() => router.push("/privacy/preferences")}>Gérer les cookies</Button>
            {/* 
            <span className="text-sm text-muted-foreground">Modèle à compléter selon votre juridiction.</span>
            */}
          </div>

          <Card className="not-prose mt-8 border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><Info className="h-4 w-4" /> Nous sommes ravi de vous servir du  mieux qu&apos;on peut</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <ul className="list-disc pl-5">
                <li>n&apos;hésitez pas à nous écrire</li>
                {/** 
                <li>Ajoutez un lien vers cette page dans le pied de page, la page d’inscription et le centre de préférences cookies.</li>
                <li>Si vous utilisez un bandeau cookies, reliez le bouton « Gérer les cookies » à votre composant de consentement.</li>
                <li>Considérez un <em>server wrapper</em> : `app/privacy/page.tsx` serveur qui importe un composant client pour garder la possibilité d’exporter des `metadata`.</li>
                <li>Consignez les versions (constante <code>PP_VERSION</code>) et tenez un journal des changements.</li>
                */}
              </ul>
            </CardContent>
          </Card>
        </article>
      </div>

      {/* Footer mini brand */}
      <div className="mt-14 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5" /> POSA – Crypto Risk App</div>
        <div className="flex items-center gap-2"><Globe className="h-3.5 w-3.5" /> Respect de la vie privée dès la conception</div>
      </div>
    </div>
  );
}
