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
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'





function PortfolioComponent({ portfolioId }: { portfolioId: number | string }) {
  const id = Number(portfolioId)
  const qc = useQueryClient()

  const { data, error, isLoading, refetch } = usePortfolio({ id })
  const { data: returns } = useCryptoReturnsForPortfolio(id)

  const { mutateAsync: simulate, isPending: isLaunching } = useSimulatePortfolio()

  // état local pour piloter le polling post-lancement
  const [launchingUI, setLaunchingUI] = React.useState(false)  // 👈 pour l’overlay
  const [isPolling, setIsPolling] = React.useState(false) 

  const handleSimulate = async () => {
    setLaunchingUI(true)       // montre l’overlay court
    setIsPolling(true)         // lance la phase de polling non bloquante
    try {
      await simulate(id)       // POST /simulate (peut être long)
      toast.success("Simulation lancée")
      await qc.invalidateQueries({ queryKey: ["portfolio", id] })
      await qc.invalidateQueries({ queryKey: ["portfolio-returns", id] })
    } catch (e: any) {
      toast.error(e?.response?.data?.error ?? e?.message ?? "Erreur lors de la simulation")
      setIsPolling(false)
    } finally {
      setLaunchingUI(false)    // on enlève le voile dans tous les cas
    }
  }
  
    // Watchdog: si jamais le POST ne “settle” pas (réseau, dev server), on coupe l’overlay au bout de 8s
  React.useEffect(() => {
    if (!launchingUI) return
    const t = setTimeout(() => setLaunchingUI(false), 8000)
    return () => clearTimeout(t)
  }, [launchingUI])

  // Boucle de polling douce (toutes les 1.5s, max 2 min)
  React.useEffect(() => {
    if (!isPolling) return
    let tries = 0
    let stopped = false

    const tick = async () => {
      tries += 1
      const res = await refetch() // refetch du portefeuille
      const ready = !!res.data?.performances?.length
      if (ready || tries > 80 /* ~2 min */) {
        stopped = true
        setIsPolling(false)
        if (ready) {
          toast.success("Simulation terminée")
          // rafraîchir les returns si tu les affiches
          qc.invalidateQueries({ queryKey: ["portfolio-returns", id] })
        } else {
          toast.message("Temps d’attente dépassé", { description: "Les résultats s’afficheront dès qu’ils seront prêts." })
        }
        return
      }
      if (!stopped) timer = setTimeout(tick, 1500)
    }

    let timer = setTimeout(tick, 1500)
    return () => { stopped = true; clearTimeout(timer) }
  }, [isPolling, refetch, qc, id])

  if (isLoading) return <div>Chargement…</div>
  if (error) return <div>Une erreur est survenue</div>
  if (!data) return <div>Portefeuille introuvable</div>

  const noSimulation = !data.performances || data.performances.length === 0

  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between">
        <Titlebar title={`Portefeuille : ${data.name}`} />
        <button
          onClick={handleSimulate}
          disabled={launchingUI || isPolling}
          className="bg-primary text-white px-3 py-2 rounded hover:bg-primary/90 text-sm disabled:opacity-60"
        >
          {launchingUI ? (
              <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Lancement…</span>
            ) : isPolling ? (
              <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Simulation en cours…</span>
            ) : 'Relancer la simulation'}
        </button>
      </div>

      {/* Bandeau non bloquant pendant le polling */}
      {isPolling && (
        <div className="mb-4 rounded-md border bg-white p-2 text-sm text-gray-700">
          La simulation est en cours de calcul. Cette étape peut prendre un moment selon la période et le nombre d’actifs.
        </div>
      )}

      {noSimulation ? (
        <div className="flex flex-col items-center justify-center text-center gap-6 p-12 bg-white rounded-md shadow">
          <h1 className="text-2xl font-bold text-primary">Portefeuille : {data.name}</h1>
          <p className="text-gray-600">Ce portefeuille n’a pas encore été simulé.</p>
          <div className="text-sm text-gray-500">
            <p><strong>Budget :</strong> {data.initial_budget} $</p>
            <p><strong>Période :</strong> {data.holding_start} → {data.holding_end}</p>
            <p><strong>Allocation :</strong> {data.allocation_type === 'manual' ? 'Manuelle' : 'Automatique'}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {data.holdings?.map((h: any) => (
              <div key={h.crypto_detail.symbol} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                {h.crypto_detail.symbol.toUpperCase()} ({h.allocation_percentage}%)
              </div>
            ))}
          </div>
          <button
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition disabled:opacity-60"
            onClick={handleSimulate}
            disabled={launchingUI || isPolling}
          >
            {isLaunching ? 'Lancement…' : isPolling ? 'Simulation en cours…' : 'Lancer la simulation'}
          </button>
        </div>
      ) : (
         <div className="grid grid-cols-1 gap-8">
          <CryptoMiniList portfolioId={Number(portfolioId)} />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="flex flex-col gap-4 bg-white p-4 rounded-sm lg:col-span-2">
              <span className="text-primary font-medium">Répartition</span>
              <ReturnTreeMap returns={returns || []} />
            </div>
            <div className="flex flex-col gap-4 bg-white p-4 rounded-sm lg:col-span-3">
              <span className="text-primary font-medium">Rendements</span>
              <ChartReturns performances={data.performances} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="grid grid-cols-1 gap-4">
              <Titlebar title="News associées" />
              <ActuAndTopCrypto />
            </div>
            <div className="flex flex-col gap-4">
              <Titlebar title="Allocation" />
              <PortfolioPieChart holdings={data.holdings} />
            </div>
            <div className="flex flex-col gap-4">
              <Titlebar title="Indicateur de risque" />
              <RiskIndicators latestPerformance={data.performances.at(-1)} />
            </div>
          </div>
        </div>
      )}

      {/* Overlay blur uniquement pendant le POST initial */}
      {isLaunching && (
        <div className="pointer-events-none absolute inset-0 rounded-lg bg-white/40 backdrop-blur-[1px] flex items-center justify-center">
          <div className="pointer-events-auto flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm shadow">
            <Loader2 className="h-4 w-4 animate-spin" />
            Lancement de la simulation…
          </div>
        </div>
      )}
    </div>
  )
}

export default PortfolioComponent;