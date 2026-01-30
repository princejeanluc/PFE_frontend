import React from "react";
import RiskSimulatorCard from "@/features/risk/components/risksimulationcard";
import Titlebar from "@/shared/components/titlebar";
import OptionPricingCard from "@/features/risk/components/optionpricingcard";
import StressTestsCard from "@/features/risk/components/stresstestcard";

function Page() {
  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="grid gap-2">
        <div className="flex flex-col gap-2">
          <Titlebar title="Simulation prévisionnelle" />
          <RiskSimulatorCard />
        </div>
        <div className="flex flex-col gap-2">
          <Titlebar title="Tarification des options" />
          <OptionPricingCard />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Titlebar title="Stress test" />
        <StressTestsCard />
      </div>
    </div>
  );
}

export default Page;
