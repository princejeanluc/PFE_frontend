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
import { Skeleton } from '@/components/ui/skeleton'
import { useCryptoList } from '../../_lib/hooks/market'
import { useRiskSimulation } from '../../_lib/hooks/risk'
import { Button } from '@/components/ui/button'

// ------- helpers (same as before) -------
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
  for (let i = 0; i < data.history.timestamps.length; i++) {
    rows.push({ time: data.history.timestamps[i], hist: data.history.prices[i] })
  }
  const nSims = data.paths.length
  const show = Math.min(sampleSims, nSims)
  for (let t = 0; t < data.forecast_timestamps.length; t++) {
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
  data.forecast_timestamps.map((time: string, i: number) => ({ time, vol: data.vol[i] }))

// ------- component -------
export default function RiskSimulatorCard() {
  // crypto list
  const { data: cryptos, isLoading: loadingCryptos } = useCryptoList()

  // controlled inputs
  const [symbol, setSymbol] = React.useState<string>('BTC')
  const [horizon, setHorizon] = React.useState<number>(72) // 3 days (hours)
  const [nSims, setNSims] = React.useState<number>(200)

  // when cryptos load, default to first available if BTC not present
  React.useEffect(() => {
    if (!loadingCryptos && (cryptos.results)?.length) {
      const hasCurrent = (cryptos.results).some((c: any) => c.symbol === symbol)
      if (!hasCurrent) setSymbol((cryptos.results)[0].symbol)
    }
  }, [loadingCryptos, cryptos]) // eslint-disable-line

  // fetch risk data
  const { data, isLoading, isError, isFetching, refetch , error } = useRiskSimulation(symbol, horizon, nSims)

   const safeData = data ?? {
    history: { timestamps: [], prices: [] },
    forecast_timestamps: [],
    paths: [],
    vol: [],
    metrics: { var_95: 0, es_95: 0, sharpe: 0 }
  }

  let priceRows: any[] = []
  let volRows: any[] = []
  try {
    priceRows = buildPriceRows(safeData, 8)
    volRows = buildVolRows(safeData)
  } catch {
    // En cas de shape inattendue, on évite de crasher le rendu
    priceRows = []
    volRows = []
  }
  // Empty state si pas de cryptos
  if (!loadingCryptos && (!(cryptos.results) || (cryptos.results).length === 0)) {
    return (
      <div className="p-6 rounded-lg border bg-white">
        <p className="text-sm text-muted-foreground">
          Aucune crypto disponible. Vérifie la configuration backend / pagination.
        </p>
      </div>
    )
  }

  // Erreur de simulation (ex: minimisation NGARCH)
  const backendMsg =
    (error as any)?.response?.data?.error ||
    (error as any)?.message ||
    (isError ? "La simulation a échoué. Réessaie avec d'autres paramètres." : null)
    
  // basic skeleton UI for first load
  if (isLoading && !data) {
    return (
      <Card className="w-full">
        <CardHeader className="gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-28" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-56 w-full" />
            <Skeleton className="h-56 w-full" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-8 w-40" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full h-full ">
      {/* subtle top-right fetching indicator */}
      {isFetching && (
        <div className="absolute right-3 top-3 text-xs text-muted-foreground">Mise à jour…</div>
      )}

      <CardHeader className="gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Crypto selector from backend */}
          <Select value={symbol} onValueChange={setSymbol} disabled={loadingCryptos}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Actif" />
            </SelectTrigger>
            <SelectContent>
              {((cryptos.results) ?? []).map((c: any) => (
                <SelectItem key={c.id} value={c.symbol}>
                  {c.symbol} — {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Horizon selector */}
          <Select value={String(horizon)} onValueChange={(v) => setHorizon(Number(v))}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Horizon" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24">1 jour</SelectItem>
              <SelectItem value="48">2 jours</SelectItem>
              <SelectItem value="72">3 jours</SelectItem>
            </SelectContent>
          </Select>

          {/* Number of simulations (capped at 2000) */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Simulations</span>
            <Input
              type="number"
              className="w-24"
              value={nSims}
              min={50}
              max={2000}
              step={50}
              onChange={(e) => {
                const v = Math.max(50, Math.min(2000, Number(e.target.value || 0)))
                setNSims(v)
              }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {backendMsg && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 flex items-center justify-between">
            <span>{backendMsg}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => refetch()}>Réessayer</Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  // Petit “fallback” : réduire horizon et/ou nSims pour améliorer la convergence
                  setHorizon((h) => Math.min(h, 48))
                  setNSims((n) => Math.min(Math.max(100, n - 100), 2000))
                  refetch()
                }}
              >
                Assouplir paramètres
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Prix chart */}
          <div className="rounded-lg border p-2">
            <CardTitle className="mb-2 text-sm">Prix</CardTitle>
            <div className="h-11/12">
              {priceRows.length === 0 ? (
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
                    {Array.from({ length: Math.min(8, (safeData?.paths.length ?? 0)) }).map((_, i) => (
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

          {/* Vol chart */}

          <div className="rounded-lg border p-2">
            <CardTitle className="mb-2 text-sm">Volatilité prévisionnelle</CardTitle>
            <div className="h-56">
              {isError ? (
                <div className="text-red-500 text-sm p-2">Erreur lors du chargement.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={volRows} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
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

        {/* Metrics */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Métriques prévisionnelles</div>
          {!data ? (
            <div className="flex gap-2">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-8 w-56" />
              <Skeleton className="h-8 w-40" />
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-sm">
                VaR (95%)&nbsp;{(data.metrics.var_95 * 100).toFixed(1)}%
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Expected Shortfall (95%)&nbsp;{(data.metrics.es_95 * 100).toFixed(1)}%
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Sharpe Ratio&nbsp;{data.metrics.sharpe.toFixed(2)}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
