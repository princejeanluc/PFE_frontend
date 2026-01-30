import React from "react";
import Titlebar from "@/shared/components/titlebar";
import RelationMap from "@/features/simulation/components/relationmap";
import CryptoScatterChart from "@/features/simulation/components/cryptoscatterchart";
import ListPortFolioComponent from "@/features/simulation/components/listportfolio";

function Page() {
  return (
    <div className="flex flex-col gap-4 text-sm py-4">
      <ListPortFolioComponent />
      <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Titlebar title="Relation" />
          <RelationMap />
        </div>
        <div className="flex flex-col gap-2">
          <Titlebar title="Cartographie du marché" />
          <CryptoScatterChart />
        </div>
      </div>
    </div>
  );
}

export default Page;
