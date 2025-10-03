"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileCheck2, ShieldAlert, ScrollText, ArrowLeft, Download, Check, AlertTriangle, Info, Lock,  Activity, Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/**
 * Conditions d’utilisation – page Next.js (TSX)
 *
 * ✔️ UX/UI prêt à l’emploi (shadcn/ui + Tailwind)  
 * ✔️ Sommaire collant + surlignage de section (scrollspy)  
 * ✔️ Cartes « À retenir »  
 * ✔️ Boutons Imprimer / Accepter / Refuser  
 * ✔️ Métadonnées JSON‑LD TermsOfService  
 * ✔️ Accessibilité (aria-labels, hiérarchie sémantique)  
 * ⚠️ Contenu fourni à titre informatif, pas un avis juridique.
 *
 * Intégration :
 *   - Placez ce composant sous /app/legal/conditions-utilisation/page.tsx (app router)  
 *   - Vérifiez que shadcn/ui est configuré et que lucide-react est installé
 *   - Tailwind nécessaire (dark mode supporté)
 */

const TOS_VERSION = "2025-09-18"; // Mettez à jour à chaque modification substantielle

const sections = [
  { id: "intro", label: "Introduction" },
  { id: "scope", label: "Champ d’application" },
  { id: "eligibility", label: "Admissibilité & Compte" },
  { id: "nofinancialadvice", label: "Pas de conseil financier" },
  { id: "risks", label: "Avertissement sur les risques" },
  { id: "data", label: "Données, confidentialité & sécurité" },
  { id: "acceptableuse", label: "Utilisation acceptable" },
  { id: "ip", label: "Propriété intellectuelle" },
  { id: "marketdata", label: "Sources & données de marché" },
  { id: "thirdparties", label: "Services tiers" },
  { id: "warranty", label: "Absence de garantie" },
  { id: "liability", label: "Limitation de responsabilité" },
  { id: "indemnity", label: "Indemnisation" },
  { id: "termination", label: "Suspension & résiliation" },
  { id: "law", label: "Loi applicable & juridiction" },
  { id: "changes", label: "Modification des conditions" },
  { id: "contact", label: "Contact" },
];

export default function Page() {
  const router = useRouter();
  const [activeId, setActiveId] = useState<string>(sections[0].id);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastUpdated = useMemo(() => {
    try {
      // Affiche joliment la date de version
      const d = new Date(TOS_VERSION);
      return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "2-digit" });
    } catch {
      return TOS_VERSION;
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

  const accept = () => {
    try {
      localStorage.setItem("tosAcceptedAt", new Date().toISOString());
      localStorage.setItem("tosVersion", TOS_VERSION);
    } catch {}
    router.push("/");
  };

  const decline = () => {
    router.back();
  };

  const printPage = () => {
    if (typeof window !== "undefined") window.print();
  };

  // JSON‑LD schema.org
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TermsOfService",
    name: "Conditions d’utilisation",
    url: typeof window !== "undefined" ? window.location.href : "",
    dateModified: TOS_VERSION,
    publisher: {
      "@type": "Organization",
      name: "POSA – Crypto Risk App",
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 md:px-8">
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="inline-flex items-center gap-1 hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Retour</Link>
        <span>•</span>
        <span>Mentions légales</span>
        <span>/</span>
        <span className="font-medium text-foreground">Conditions d’utilisation</span>
      </div>

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-b from-background to-muted p-6 md:p-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row">
          <div className="max-w-2xl">
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="secondary" className="rounded-full">CRYPTO • RISK • APP</Badge>
              <Badge className="rounded-full" variant="outline"><ScrollText className="mr-1 h-3.5 w-3.5" /> Version {TOS_VERSION}</Badge>
            </div>
            <h1 className="text-3xl font-semibold leading-tight md:text-4xl">Conditions d’utilisation</h1>
            <p className="mt-3 text-muted-foreground">
              Merci d’utiliser <span className="font-medium text-foreground">POSA – Crypto Risk App</span>. En accédant à la plateforme,
              vous acceptez ces conditions. Lisez-les attentivement : elles
              contiennent des informations importantes sur vos droits, obligations
              et limites de responsabilité.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Dernière mise à jour : {lastUpdated}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2 md:gap-3">
            <Button onClick={printPage} variant="outline" aria-label="Imprimer la page"><Download className="mr-2 h-4 w-4" />Imprimer / PDF</Button>
            <Button onClick={decline} variant="secondary" aria-label="Refuser">Refuser</Button>
            <Button onClick={accept} className="font-semibold" aria-label="Accepter"><Check className="mr-2 h-4 w-4" />Accepter</Button>
          </div>
        </div>
      </div>

      {/* Key points */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold"><ShieldAlert className="h-4 w-4" /> Risques élevés</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Les crypto‑actifs sont volatils. Vous pouvez perdre tout ou partie du capital. N’investissez jamais plus que ce que vous êtes prêt à perdre.
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold"><FileCheck2 className="h-4 w-4" /> Pas de conseil</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Les informations et métriques ne constituent pas un conseil en investissement, fiscal ou juridique. Faites vos propres recherches.
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold"><Lock className="h-4 w-4" /> Données & sécurité</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Nous prenons la sécurité au sérieux, mais aucun système n’est infaillible. Protégez vos identifiants et appareils.
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-[260px_1fr]">
        {/* Sidebar TOC */}
        <aside className="top-24 h-fit space-y-2 rounded-xl border bg-card p-3 md:sticky">
          <div className="mb-2 px-1 text-xs font-medium uppercase text-muted-foreground">Sommaire</div>
          {sections.map((s) => (
            <Link key={s.id} href={`#${s.id}`} className={`block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${activeId === s.id ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}>
              {s.label}
            </Link>
          ))}
        </aside>

        {/* Main content */}
        <article className="prose prose-neutral max-w-none dark:prose-invert">
          <Alert className="not-prose border-amber-500/50">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Information importante</AlertTitle>
            <AlertDescription>
              Ce document est une base de travail à personnaliser. Il ne constitue pas un avis juridique. Faites valider ces conditions par un conseil professionnel avant publication.
            </AlertDescription>
          </Alert>

          <section id="intro" aria-label="Introduction">
            <h2>1. Introduction</h2>
            <p>
              Ces Conditions d’utilisation (les « Conditions ») régissent l’accès et l’usage de la plateforme
              <strong> POSA – Crypto Risk App</strong> (la « Plateforme »). En créant un compte, en accédant ou en utilisant la Plateforme, vous reconnaissez avoir lu, compris et accepté ces Conditions.
            </p>
          </section>

          <Separator className="my-6" />

          <section id="scope" aria-label="Champ d’application">
            <h2>2. Champ d’application</h2>
            <p>
              Les présentes s’appliquent à l’ensemble des services, modules d’analyse, tableaux de bord, API, contenu, documentation,
              et éléments logiciels mis à disposition via la Plateforme. Certaines fonctionnalités peuvent être soumises à des termes
              spécifiques complémentaires (par ex. abonnements, modules premium) ; en cas de conflit, ces termes spécifiques prévalent.
            </p>
          </section>

          <section id="eligibility" aria-label="Admissibilité & Compte">
            <h2>3. Admissibilité & gestion de compte</h2>
            <ul>
              <li>Vous déclarez avoir l’âge légal et la capacité juridique dans votre juridiction.</li>
              <li>Vous êtes responsable de l’exactitude des informations fournies et de la confidentialité de vos identifiants.</li>
              <li>Vous nous informez immédiatement de toute utilisation non autorisée de votre compte.</li>
            </ul>
          </section>

          <section id="nofinancialadvice" aria-label="Pas de conseil financier">
            <h2>4. Pas de conseil financier, fiscal ou juridique</h2>
            <p>
              Les analyses, scores de risque, backtests, signaux, indicateurs et contenus fournis par la Plateforme sont fournis à
              titre informatif. Ils ne constituent en aucun cas une recommandation personnalisée d’investissement, un conseil fiscal
              ou juridique. Vous demeurez seul responsable de vos décisions et de la conformité réglementaire qui vous est applicable.
            </p>
          </section>

          <section id="risks" aria-label="Avertissement sur les risques">
            <h2>5. Avertissement sur les risques liés aux crypto‑actifs</h2>
            <p>
              Les marchés de crypto‑actifs sont hautement volatils et spéculatifs. Les performances passées ne préjugent pas des
              performances futures. L’utilisation de leviers, de produits dérivés ou de stratégies automatisées peut accroître les pertes.
              Vous pouvez subir une perte partielle ou totale du capital.
            </p>
          </section>

          <section id="data" aria-label="Données, confidentialité & sécurité">
            <h2>6. Données, confidentialité & sécurité</h2>
            <p>
              Nos engagements et pratiques en matière de données personnelles sont décrits dans la Politique de confidentialité (distincte).
              Vous acceptez que nous traitions certaines données techniques et d’usage afin d’améliorer la Plateforme et d’assurer sa sécurité.
              Malgré nos efforts raisonnables (chiffrement, contrôles d’accès, journalisation), aucun système n’est exempt de vulnérabilités.
            </p>
          </section>

          <section id="acceptableuse" aria-label="Utilisation acceptable">
            <h2>7. Utilisation acceptable</h2>
            <ul>
              <li>Ne pas tenter de porter atteinte à la sécurité, au fonctionnement ou à l’intégrité de la Plateforme.</li>
              <li>Ne pas utiliser la Plateforme pour violer une loi ou un droit de tiers (propriété intellectuelle, vie privée, etc.).</li>
              <li>Ne pas extraire massivement, scraper ou republier nos données sans autorisation écrite.</li>
              <li>Ne pas contourner les limites d’usage, quotas, licences ou mesures anti‑abus.</li>
            </ul>
          </section>

          <section id="ip" aria-label="Propriété intellectuelle">
            <h2>8. Propriété intellectuelle</h2>
            <p>
              La Plateforme, son code, ses marques, logos, contenus, modèles, jeux de données agrégés et interfaces sont protégés par les
              lois applicables. Sauf autorisation expresse, tout droit non accordé explicitement demeure réservé.
            </p>
          </section>

          <section id="marketdata" aria-label="Sources & données de marché">
            <h2>9. Sources & données de marché</h2>
            <p>
              La Plateforme peut agréger des données provenant de sources tierces (ex. agrégateurs de prix, APIs de marché, flux d’actualité).
              Ces données peuvent comporter des erreurs, délais de propagation, interruptions ou restrictions d’usage. Vous comprenez que la
              disponibilité et la qualité de ces données peuvent varier et qu’aucune exactitude en temps réel n’est garantie.
            </p>
          </section>

          <section id="thirdparties" aria-label="Services tiers">
            <h2>10. Services tiers</h2>
            <p>
              Certains modules peuvent s’appuyer sur des services, bibliothèques ou APIs fournis par des tiers. Nous ne sommes pas responsables
              du contenu, de la disponibilité, des conditions ou politiques de ces tiers. L’usage de tels services peut être soumis à leurs propres
              conditions et frais.
            </p>
          </section>

          <section id="warranty" aria-label="Absence de garantie">
            <h2>11. Absence de garantie</h2>
            <p>
              La Plateforme est fournie « en l’état » et « selon disponibilité », sans garantie expresse ou implicite d’exactitude, de fiabilité,
              de disponibilité, d’adéquation à un usage particulier ou d’absence d’erreurs. Nous ne garantissons pas que la Plateforme sera
              ininterrompue, sécurisée ou exempte de bogues.
            </p>
          </section>

          <section id="liability" aria-label="Limitation de responsabilité">
            <h2>12. Limitation de responsabilité</h2>
            <p>
              Dans la mesure maximale permise par la loi, notre responsabilité globale (contractuelle, délictuelle, etc.) pour tout dommage
              direct lié à la Plateforme est limitée au plus élevé entre (i) le montant des frais que vous nous avez effectivement versés au
              cours des 12 derniers mois et (ii) 100 € (ou l’équivalent). Nous déclinons toute responsabilité pour les pertes indirectes,
              immatérielles, de profits, d’opportunités ou consécutives.
            </p>
          </section>

          <section id="indemnity" aria-label="Indemnisation">
            <h2>13. Indemnisation</h2>
            <p>
              Vous acceptez de nous indemniser contre toute réclamation, dommage, responsabilité, coût ou dépense (y compris honoraires
              raisonnables d’avocat) découlant de votre usage de la Plateforme en violation des présentes ou de toute loi applicable.
            </p>
          </section>

          <section id="termination" aria-label="Suspension & résiliation">
            <h2>14. Suspension & résiliation</h2>
            <p>
              Nous pouvons suspendre ou résilier votre accès en cas de non‑respect des présentes, de risques pour la sécurité, ou en cas
              d’exigence légale. Vous pouvez cesser d’utiliser la Plateforme à tout moment. Certaines clauses survivent à la résiliation
              (propriété intellectuelle, limitations de responsabilité, etc.).
            </p>
          </section>

          <section id="law" aria-label="Loi applicable & juridiction">
            <h2>15. Loi applicable & juridiction</h2>
            <p>
              Ces Conditions sont régies par la loi de <strong>Cameroun</strong>. Tout litige sera soumis à la compétence
              exclusive des tribunaux de <strong>Douala</strong>, sauf dispositions impératives contraires.
            </p>
          </section>

          <section id="changes" aria-label="Modification des conditions">
            <h2>16. Modification des conditions</h2>
            <p>
              Nous pouvons mettre à jour ces Conditions pour des raisons juridiques, techniques ou opérationnelles. En cas de changement
              substantiel, nous chercherons à vous en informer raisonnablement. La poursuite de l’usage après la date d’effet vaut acceptation.
              La version en vigueur est identifiée par « Version » et « Dernière mise à jour » en tête de page.
            </p>
          </section>

          <section id="contact" aria-label="Contact">
            <h2>17. Contact</h2>
            <p>
              Pour toute question relative aux présentes : <a href="mailto:contact@votre-domaine.tld" className="underline underline-offset-4">princejeanluc.denteppe@gmail.com</a>
            </p>
          </section>

          <Separator className="my-8" />

          <div className="not-prose flex flex-wrap items-center gap-3">
            <Button onClick={accept} className="font-semibold"><Check className="mr-2 h-4 w-4" />J’accepte</Button>
            <Button onClick={decline} variant="secondary">Je refuse</Button>
            <Button onClick={printPage} variant="outline"><Download className="mr-2 h-4 w-4" />Imprimer / PDF</Button>
            <span className="text-sm text-muted-foreground">En cliquant sur « J’accepte », vous confirmez avoir lu et accepté ces Conditions.</span>
          </div>

          {/* Encadré d’aide */}
          <Card className="not-prose mt-8 border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><Info className="h-4 w-4" /> Conseils d’intégration</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <ul className="list-disc pl-5">
                <li>Personnalisez la juridiction (section 15) et l’adresse de contact.</li>
                <li>Reliez ce flow d’acceptation à votre logique d’onboarding (ex. bloquer l’accès tant que non accepté).</li>
                <li>Ajoutez un lien clair vers la Politique de confidentialité et les Mentions légales.</li>
                <li>Versionnez le document (constante <code>TOS_VERSION</code>) et logguez l’acceptation côté backend si nécessaire.</li>
              </ul>
            </CardContent>
          </Card>
        </article>
      </div>

      {/* Footer mini brand */}
      <div className="mt-14 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2"><Activity className="h-3.5 w-3.5" /> POSA – Crypto Risk App</div>
        <div className="flex items-center gap-2"><Coins className="h-3.5 w-3.5" /> Build for volatile markets</div>
      </div>
    </div>
  );
}
