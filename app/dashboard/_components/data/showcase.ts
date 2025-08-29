// app/(marketing)/_data/showcase.ts
export const FEATURES = [
  {
    key: "market",
    title: "Marché",
    desc: "Indicateurs, graphique, actu & classement, table crypto.",
    cover: "/landing/market-wireframe.png",           // wireframe
    screenshots: ["/landing/market-1.png", "/landing/market-2.png", "/landing/market-3.png"], // vrais screens
    bullets: ["Indicateurs clés", "Actu & Classement top", "Prévision horaire"],
    href: "/dashboard/market",
  },
  {
    key: "simulation",
    title: "Simulation",
    desc: "Corrélations, similarités, scénarios, résultats.",
    cover: "/landing/simulation-wireframe.png",
    screenshots: ["/landing/sim-1.png"],
    bullets: ["Matrice (corr/lag)", "UMAP & clusters", "Scénarios rapides"],
    href: "/dashboard/simulation",
  },
  {
    key: "portfolio-sim",
    title: "Simulation Portefeuille",
    desc: "Répartition, rendement, allocation, risque.",
    cover: "/landing/portfolio-wireframe.png",
    screenshots: ["/landing/portfolio-1.png"],
    bullets: ["Répartition & rendement", "Allocation", "Indicateurs de risque"],
    href: "/dashboard/simulation",
  },
  {
    key: "risk",
    title: "Gestion du risque",
    desc: "Simulations prévisionnelles, options, stress tests.",
    cover: "/landing/risk-wireframe.png",
    screenshots: ["/landing/risk-1.png", "/landing/risk-2.png"],
    bullets: ["Prévision prix/vol", "Pricing d’options", "Stress tests"],
    href: "/dashboard/risk",
  },
  {
    key: "assistant",
    title: "Assistant",
    desc: "Brief actu par titres + chat conseil.",
    cover: "/landing/assistant-wireframe.png",
    screenshots: ["/landing/assistant-1.png"],
    bullets: ["Brief (7 jours)", "Chat prudent", "Liens sources"],
    href: "/dashboard/assist",
  },
];
