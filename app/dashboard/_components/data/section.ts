// app/(marketing)/_data/sections.ts
export type BGSection = {
  title: string;
  bg: string;                // chemin image (ex: "/landing/market-bg.webp")
  alt?: string;              // description pour aria
  features: string[];        // 2–6 puces
  href?: string;             // bouton "Ouvrir"
  align?: "left" | "center" | "right"; // position du panneau texte
  tone?: "dark" | "light";   // influence la couleur du texte
};

export const SECTIONS: BGSection[] = [
  {
    title: "Marché",
    bg: "/landing/market-wireframe.png",
    alt: "Tableau de bord Marché",
    features: [
      "Indicateurs clés (volatilité, dominance, PDI)",
      "Graphique agrégé + classement hebdo",
      "Tableau crypto interactif",
    ],
    href: "/dashboard/market",
    align: "left",
    tone: "dark",
  },
  {
    title: "Simulation",
    bg: "/landing/sim-bg.png",
    alt: "Matrice & projection 2D",
    features: ["Corrélations / lag", "UMAP + clusters", "Scénarios rapides"],
    href: "/dashboard/simulation",
    align: "right",
    tone: "light",
  },
  {
    title: "Gestion du risque",
    bg: "/landing/risk-bg.png",
    features: ["Prévision prix/vol", "Pricing d’options", "Stress tests"],
    href: "/dashboard/risk",
    align: "left",
    tone: "dark",
  },
  {
    title: "Assistant",
    bg: "/landing/assistant.png",
    features: ["Brief actu (titres)", "Chat prudent", "Liens sources"],
    href: "/dashboard/assist",
    align: "center",
    tone: "light",
  },
];
