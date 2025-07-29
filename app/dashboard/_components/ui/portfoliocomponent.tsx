'use client'
import React from 'react'
import { useCryptoReturnsForPortfolio, usePortfolio, useSimulatePortfolio } from '../../_lib/hooks/simulation'
import ReturnTreeMap from './returntreemap'
import ChartReturns from './chartreturns'
import Titlebar from './titlebar'
import PortfolioPieChart from './portfoliopiechart'
import RiskIndicators from './riskindicators'
import { ActuAndTopCrypto } from './actuandtopcrypto'
import { toast } from 'sonner'
import CryptoMiniList from './cryptominilist'

function PortfolioComponent({ portfolioId }: { portfolioId: number | string }) {
  const { data, error, isLoading } = usePortfolio({ id: portfolioId });
  const { mutateAsync: simulate, isPending } = useSimulatePortfolio()
  const { data: returns, isLoading: loadingReturns } = useCryptoReturnsForPortfolio(portfolioId);
  const handleSimulate = async () => {
        try {
            await simulate(Number(portfolioId))
            toast.success("Simulation lancée avec succès")
            // Tu peux forcer un refetch ici si nécessaire :
            // queryClient.invalidateQueries(["portfolio", portfolioId])
            window.location.reload()  // ou utilise le router pour forcer le rafraîchissement si besoin
        } catch (err) {
            toast.error("Erreur lors de la simulation")
        }
        }
  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Une erreur est survenue</div>;

  if (!data) return <div>Portefeuille introuvable</div>;

  const noSimulation = !data.performances || data.performances.length === 0;

  if (noSimulation) {
    return (
      <div className="flex flex-col items-center justify-center text-center gap-6 p-12 bg-white rounded-md shadow">
        <h1 className="text-2xl font-bold text-primary">Portefeuille : {data.name}</h1>
        <p className="text-gray-600">Ce portefeuille n&apos;a pas encore été simulé.</p>

        <div className="text-sm text-gray-500">
          <p><strong>Budget :</strong> {data.initial_budget} $</p>
          <p><strong>Période :</strong> {data.holding_start} → {data.holding_end}</p>
          <p><strong>Allocation :</strong> {data.allocation_type === 'manual' ? 'Manuelle' : 'Automatique'}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {data.holdings?.map((h: any) => (
            <div key={h.crypto.symbol} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
              {h.crypto_detail.symbol.toUpperCase()} ({h.allocation_percentage}%)
            </div>
          ))}
        </div>

        <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition"
            onClick={handleSimulate} disabled={isPending}>
          Lancer la simulation
        </button>
      </div>
    );
  }

  // Cas où les performances existent (simulation déjà faite)
  return (
    <div className="grid grid-cols-1 gap-8">
      <div className="flex flex-col gap-4">
        <Titlebar title={`Portefeuille : ${data?.name}`} />
        <CryptoMiniList portfolioId={Number(portfolioId)}></CryptoMiniList>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="flex flex-col gap-4 bg-white p-4 rounded-sm lg:col-span-2">
            <span className="text-primary font-medium">Répartition</span>
            <ReturnTreeMap returns={returns || []}/>
          </div>
          <div className="flex flex-col gap-4 bg-white p-4 rounded-sm lg:col-span-3">
            <span className="text-primary font-medium">Rendements</span>
            <ChartReturns performances={data.performances} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="grid grid-cols-1 gap-4">
          <Titlebar title="News associées" />
          <ActuAndTopCrypto />
        </div>
        <div className="flex flex-col gap-4">
          <Titlebar title="Allocation" />
          <PortfolioPieChart holdings={data.holdings}/>
        </div>
        <div className="flex flex-col gap-4">
          <Titlebar title="Indicateur de risque" />
          <RiskIndicators  latestPerformance={data.performances[data.performances.length - 1]} />
        </div>
      </div>
    </div>
  );
}

export default  PortfolioComponent;
