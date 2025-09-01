'use client'

import React from 'react'
import {
  ResponsiveContainer, ComposedChart, LineChart,
  Line, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useCryptoList } from '../../_lib/hooks/market'
import { useRiskSimulation } from '../../_lib/hooks/risk'
import { Button } from '@/components/ui/button'
import { Loader2, XCircle } from 'lucide-react'

type PriceRow = { time: string; hist?: number; lower?: number; range?: number; median?: number } & {
  [k: `sim${number}`]: number
}

const quantile = (arr: number[], q: number) => {
  if (!arr.length) return NaN
  const a = [...arr].sort((x, y) => x - y)
  const pos = (a.length - 1) * q, base = Math.floor(pos), rest = pos - base
  return a[base + 1] !== undefined ? a[base] + rest * (a[base + 1] - a[base]) : a[base]
}

const buildPriceRows = (data: any, sampleSims = 8): PriceRow[] => {
  const rows: PriceRow[] = []
  for (let i = 0; i < (data.history?.timestamps?.length ?? 0); i++) {
    rows.push({ time: data.history.timestamps[i], hist: data.history.prices[i] })
  }
  const nSims = data.paths?.length ?? 0
  const show = Math.min(sampleSims, nSims)
  for (let t = 0; t < (data.forecast_timestamps?.length ?? 0); t++) {
    const col = Array.from({ length: nSims }, (_, s) => data.paths[s][t])
    const lower = quantile(col, 0.05)
    const upper = quantile(col, 0.95)
    const median = quantile(col, 0.5)
    const row: any = { time: data.forecast_timestamps[t], lower, range: upper - lower, median }
    for (let s = 0; s < show; s++) row[`sim${s}`] = data.paths[s][t]
    rows.push(row)
  }
  return rows
}

const buildVolRows = (data: any) =>
  (data.forecast_timestamps ?? []).map((time: string, i: number) => ({ time, vol: data.vol?.[i] }))

export default function RiskSimulatorCard() {
  // 1) Liste des cryptos
  const { data: cryptos, isLoading: loadingCryptos } = useCryptoList()

  // 2) États "formulaires" (modifiables sans déclencher de requête)
  const [formSymbol, setFormSymbol] = React.useState<string>('BTC')
  const [formHorizon, setFormHorizon] = React.useState<number>(72)
  const [formNSims, setFormNSims] = React.useState<number>(200)

  // 3) Params réellement engagés (déclenchent la requête)
  const [params, setParams] = React.useState<{symbol: string; horizon: number; nSims: number} | null>(null)

  // Charger un symbole par défaut existant
  React.useEffect(() => {
    if (!loadingCryptos && cryptos?.results?.length) {
      const hasCurrent = cryptos.results.some((c: any) => c.symbol === formSymbol)
      if (!hasCurrent) setFormSymbol(cryptos.results[0].symbol)
    }
  }, [loadingCryptos, cryptos]) // eslint-disable-line

  // 4) Récupération (garde l'ancien résultat visible pendant un fetch)
  const { data, isLoading, isError, isFetching, refetch, error, cancel } =
    useRiskSimulation(params?.symbol, params?.horizon, params?.nSims, {
      enabled: !!params,                // pas d'auto-run au montage
      keepPreviousData: true,           // UX: pas de flash vide
      refetchOnWindowFocus: false,
      retry: 0,
    })

  const safeData = data ?? {
    history: { timestamps: [], prices: [] },
    forecast_timestamps: [],
    paths: [],
    vol: [],
    metrics: { var_95: 0, es_95: 0, sharpe: 0 }
  }

  // 5) Détection de modifications non appliquées
  const dirty = React.useMemo(() => {
     //  !params ==  true au premier affichage: rien lancé
    return !params || params.symbol !== formSymbol || params.horizon !== formHorizon || params.nSims !== formNSims
  }, [params, formSymbol, formHorizon, formNSims])

  // 6) Lancer / Annuler
  const onRun = async () => {
    setParams({ symbol: formSymbol, horizon: formHorizon, nSims: formNSims })
  }
  const onCancel = () => {
    cancel?.() // nécessite support dans le hook (AbortController / axios cancel)
  }

  // 7) Lignes de graphes
  let priceRows: any[] = [], volRows: any[] = []
  try { priceRows = buildPriceRows(safeData, 8); volRows = buildVolRows(safeData) } catch { /* no-op */ }

  // 8) Messages / UI
  const backendMsg =
    (error as any)?.response?.data?.error ||
    (error as any)?.message ||
    (isError ? "La simulation a échoué. Réessaie avec d'autres paramètres." : null)

  const computeLoad = formHorizon * formNSims // micro-copie charge

  // Empty state si pas de cryptos
  if (!loadingCryptos && (!cryptos?.results || cryptos.results.length === 0)) {
    return (
      <div className="p-6 rounded-lg border bg-white">
        <p className="text-sm text-muted-foreground">
          Aucune crypto disponible. Vérifie la configuration backend / pagination.
        </p>
      </div>
    )
  }

  return (
    <Card className="w-full h-full relative">
      {/* Bandeau de contexte + actions */}
      <CardHeader className="gap-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex items-center gap-2">
            <Select value={formSymbol} onValueChange={setFormSymbol} disabled={loadingCryptos || isFetching}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Actif" />
              </SelectTrigger>
              <SelectContent>
                {(cryptos?.results ?? []).map((c: any) => (
                  <SelectItem key={c.id} value={c.symbol}>
                    {c.symbol} — {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={String(formHorizon)} onValueChange={(v) => setFormHorizon(Number(v))} disabled={isFetching}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Horizon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24">1 jour (24h)</SelectItem>
                <SelectItem value="48">2 jours (48h)</SelectItem>
                <SelectItem value="72">3 jours (72h)</SelectItem>
                <SelectItem value="120">5 jours (120h)</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Simulations</span>
              <Input
                type="number"
                className="w-28"
                value={formNSims}
                min={50}
                max={2000}
                step={50}
                onChange={(e) => {
                  const v = Math.max(50, Math.min(2000, Number(e.target.value || 0)))
                  setFormNSims(v)
                }}
                disabled={isFetching}
              />
            </div>
          </div>

          <div className="md:ml-auto flex items-center gap-2">
            {dirty && <Badge variant="outline" className="text-xs">Modifié</Badge>}
            <span className="hidden sm:inline text-xs text-muted-foreground">
              Charge estimée : <strong>{computeLoad.toLocaleString()}</strong> pas (horizon × sims)
            </span>

            <Button onClick={onRun} disabled={isFetching || !dirty} className="min-w-40">
              {isFetching ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Calcul en cours…
                </span>
              ) : 'Lancer la simulation'}
            </Button>

            {isFetching && (
              <Button variant="outline" onClick={onCancel} className="min-w-28">
                <XCircle className="h-4 w-4 mr-1" /> Annuler
              </Button>
            )}
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Projection basée sur {params?.symbol ?? formSymbol} • intervalle prédictif (5%–95%) et médiane.
          Les anciens résultats restent visibles pendant le recalcul.
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {backendMsg && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {backendMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Prix */}
          <div className="rounded-lg border p-2">
            <CardTitle className="mb-2 text-sm">Prix</CardTitle>
            <div className="h-72">
              {(!data && !isFetching) ? (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                  Configurez les paramètres puis cliquez sur <strong className="ml-1">Lancer la simulation</strong>.
                </div>
              ) : priceRows.length === 0 ? (
                <div className="text-sm text-muted-foreground p-2">Pas de données à afficher.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={priceRows} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" hide />
                    <YAxis domain={['auto', 'auto']} />
                    <Tooltip
                      labelFormatter={(v) => new Date(v).toLocaleString()}
                      formatter={(v: any, name) => [Number(v).toFixed(2), name]}
                    />
                    <Line type="monotone" dataKey="hist" stroke="var(--foreground)" dot={false} />
                    <Area dataKey="lower" stackId="band" stroke="none" fill="transparent" isAnimationActive={false} />
                    <Area dataKey="range" stackId="band" stroke="none" fill="rgba(0,0,0,0.10)" isAnimationActive={false} />
                    <Line type="monotone" dataKey="median" stroke="var(--chart-1)" dot={false} />
                    {Array.from({ length: Math.min(8, (safeData?.paths?.length ?? 0)) }).map((_, i) => (
                      <Line
                        key={i}
                        type="monotone"
                        dataKey={`sim${i}`}
                        strokeOpacity={0.5}
                        strokeWidth={1}
                        dot={false}
                        stroke={`hsl(${(i * 47) % 360} 70% 50%)`}
                      />
                    ))}
                    <Legend />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Vol */}
          <div className="rounded-lg border p-2">
            <CardTitle className="mb-2 text-sm">Volatilité prévisionnelle</CardTitle>
            <div className="h-72">
              {!data && !isFetching ? (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                  Lancez une simulation pour afficher la volatilité prévue.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={buildVolRows(safeData)} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" hide />
                    <YAxis domain={['auto', 'auto']} />
                    <Tooltip
                      labelFormatter={(v) => new Date(v).toLocaleString()}
                      formatter={(v: any) => [Number(v).toFixed(4), 'σ']}
                    />
                    <Line type="monotone" dataKey="vol" stroke="var(--chart-2)" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* KPIs */}
        {data && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Métriques prévisionnelles</div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-sm">
                VaR (95%)&nbsp;{(safeData.metrics.var_95 * 100).toFixed(1)}%
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Expected Shortfall (95%)&nbsp;{(safeData.metrics.es_95 * 100).toFixed(1)}%
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Sharpe Ratio&nbsp;{(safeData.metrics.sharpe ?? 0).toFixed(2)}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>

      {/* Overlay “calcul en cours” discret (garde le contenu accessible) */}
      {isFetching && (
        <div className="pointer-events-none absolute inset-0 rounded-lg bg-white/40 backdrop-blur-[1px] flex items-center justify-center">
          <div className="pointer-events-auto flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm shadow">
            <Loader2 className="h-4 w-4 animate-spin" />
            Simulation en cours…
          </div>
        </div>
      )}
    </Card>
  )
}
