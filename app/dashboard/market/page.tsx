import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import Titlebar from "@/shared/components/titlebar";
import LatestCryptoInfoComponent from "@/features/market/components/latestcryptoinfo";
import ListMarketInfoCard from "@/features/market/components/ListMarketInfoCard";
import { Card } from "@/components/ui/card";

const ChartAreaInteractive = dynamic(
  () => import("@/features/market/components/chartareaInteractive").then((m) => m.ChartAreaInteractive),
  { loading: () => <SkeletonChartPlaceholder /> }
);

const ActuAndTopCrypto = dynamic(
  () => import("@/features/market/components/actuandtopcrypto").then((m) => m.ActuAndTopCrypto),
  { loading: () => <SkeletonNewsPlaceholder /> }
);

function SkeletonChartPlaceholder() {
  return (
    <Card className="rounded-md p-4">
      <div className="animate-pulse space-y-3">
        <div className="h-6 w-48 bg-slate-200 rounded" />
        <div className="h-64 bg-slate-200 rounded" />
      </div>
    </Card>
  );
}

function SkeletonNewsPlaceholder() {
  return (
    <Card className="rounded-md p-4">
      <div className="animate-pulse space-y-2">
        <div className="h-5 w-40 bg-slate-200 rounded" />
        <div className="h-40 bg-slate-200 rounded" />
      </div>
    </Card>
  );
}

export default function Page() {
  return (
    <main className="container mx-auto max-w-7xl px-4 py-4" aria-labelledby="dashboard-heading">
      <header className="mb-4">
        <h1 id="dashboard-heading" className="sr-only">
          Tableau de bord crypto
        </h1>
      </header>

      <section className="grid grid-cols-1 gap-4">
        <div className="flex flex-col gap-2">
          <Titlebar title="Métriques marché" />
          <ListMarketInfoCard />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="lg:col-span-3 flex flex-col gap-2">
            <Titlebar title="Graphique" />
            <Suspense fallback={<SkeletonChartPlaceholder />}>
              <ChartAreaInteractive />
            </Suspense>
          </div>

          <aside className="lg:col-span-2 flex flex-col gap-2" aria-label="Actualités et top cryptos">
            <Titlebar title="Actualités & Classement" />
            <Suspense fallback={<SkeletonNewsPlaceholder />}>
              <ActuAndTopCrypto />
            </Suspense>
          </aside>
        </div>

        <div>
          <LatestCryptoInfoComponent />
        </div>
      </section>
    </main>
  );
}
