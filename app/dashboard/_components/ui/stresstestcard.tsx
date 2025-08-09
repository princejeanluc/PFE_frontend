'use client'

import * as React from 'react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { usePortfolios } from '../../_lib/hooks/simulation'
import { useApplyStress, useStressScenarios } from '../../_lib/hooks/risk'

import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'

function Pct({ value }: { value: number }) {
  const pct = (value * 100).toFixed(1) + ' %'
  const cls = value < 0 ? 'text-red-600' : value > 0 ? 'text-emerald-600' : 'text-muted-foreground'
  return <span className={cn('font-medium', cls)}>{value > 0 ? '+' : ''}{pct}</span>
}

function currency(n: number) {
  try {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
  } catch {
    return `${Math.round(n).toLocaleString('fr-FR')} $`
  }
}

type ApplyResult = {
  portfolio_id: number
  scenario: { name: string; type: string }
  base_value: number
  stressed_value: number
  pnl: number
  pnl_pct: number
  by_asset: { symbol: string; weight: number; return: number; contribution: number }[]
  notes?: string[]
}

function ResultPanel({ result }: { result: ApplyResult | null }) {
  if (!result) {
    // Espace “rempli” quand pas encore de simulation
    return (
      <div className="hidden md:flex flex-col gap-3 p-4 rounded-lg border bg-muted/20">
        <div className="text-sm text-muted-foreground">
          Lance une simulation pour voir le résumé ici.
        </div>
      </div>
    )
  }

  const contribData = [...result.by_asset]
    .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
    .slice(0, 8) // top 8
    .map(d => ({ symbol: d.symbol, contribution_pct: Math.round(d.contribution * 1000) / 10 }))

  const delta = result.stressed_value - result.base_value

  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg border bg-white">
      <div>
        <div className="text-sm text-muted-foreground">Scénario</div>
        <div className="font-semibold">{result.scenario.name}</div>
        <div className="text-xs text-muted-foreground uppercase">{result.scenario.type}</div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-md border p-3">
          <div className="text-xs text-muted-foreground">Valeur actuelle</div>
          <div className="text-base font-semibold">{currency(result.base_value)}</div>
        </div>
        <div className="rounded-md border p-3">
          <div className="text-xs text-muted-foreground">Valeur stressée</div>
          <div className="text-base font-semibold">{currency(result.stressed_value)}</div>
        </div>
        <div className="rounded-md border p-3">
          <div className="text-xs text-muted-foreground">Variation</div>
          <div className="text-base font-semibold">
            <Pct value={result.pnl_pct} /> <span className="text-xs text-muted-foreground">({delta > 0 ? '+' : ''}{currency(delta)})</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium">Contributions principales</div>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={contribData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="symbol" />
              <YAxis tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v: any) => [`${v}%`, 'Contribution']} />
              <Bar dataKey="contribution_pct" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {!!(result.notes && result.notes.length) && (
        <div className="space-y-1">
          <div className="text-sm font-medium">Notes</div>
          <ul className="list-disc pl-5 text-sm text-muted-foreground">
            {result.notes.map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function StressTestsCard() {
  // ---- paramètres du hook paginé
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  const [search, setSearch] = React.useState('')
  const [start, setStart] = React.useState('')
  const [end, setEnd] = React.useState('')

  // ---- portefeuilles (paginated)
  const { data: pfData, isLoading: loadingPfs } = usePortfolios({ page, pageSize, search, start, end })
  const portfolios: any[] = React.useMemo(() => {
    if (!pfData) return []
    // @ts-expect-error support deux formats
    return Array.isArray(pfData) ? pfData : (pfData.results ?? [])
  }, [pfData])

  const [portfolioId, setPortfolioId] = React.useState<number | null>(null)
  React.useEffect(() => {
    if (!loadingPfs && portfolios.length && !portfolioId) {
      setPortfolioId(portfolios[0].id)
    }
  }, [loadingPfs, portfolios, portfolioId])

  // ---- scénarios
  const { data: scenarios, isLoading: loadingSc } = useStressScenarios()

  // ---- apply
  const mutation = useApplyStress()
  const [rowResult, setRowResult] = React.useState<Record<number, { pnl_pct: number } | null>>({})
  const [lastResult, setLastResult] = React.useState<ApplyResult | null>(null)

  const handleSimulate = async (scenarioId: number) => {
    if (!portfolioId) return
    setRowResult((r) => ({ ...r, [scenarioId]: null }))
    try {
      const res = await mutation.mutateAsync({
        portfolio_id: portfolioId,
        scenario: { id: scenarioId },
      }) as unknown as ApplyResult
      setRowResult((r) => ({ ...r, [scenarioId]: { pnl_pct: res.pnl_pct } }))
      setLastResult(res)
    } catch {
      setRowResult((r) => ({ ...r, [scenarioId]: { pnl_pct: NaN } }))
    }
  }

  const isBusy = mutation.isPending

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle>Stress tests</CardTitle>

        <div className="flex items-center gap-2">
          {loadingPfs ? (
            <Skeleton className="h-9 w-56" />
          ) : (
            <Select
              value={portfolioId ? String(portfolioId) : undefined}
              onValueChange={(v) => setPortfolioId(Number(v))}
            >
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Choisir un portefeuille" />
              </SelectTrigger>
              <SelectContent>
                {portfolios.map((p: any) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.name ?? `Portfolio #${p.id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {!loadingPfs && (
            <div className="hidden sm:flex items-center gap-1">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((x) => Math.max(1, x - 1))}>
                ←
              </Button>
              <span className="text-sm text-muted-foreground px-1">Page {page}</span>
              <Button variant="outline" size="sm" onClick={() => setPage((x) => x + 1)}>
                →
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-[1fr,420px] gap-4">
          {/* Colonne gauche: liste scénarios */}
          <div>
            <div className="grid grid-cols-[1fr,180px,120px] items-center border-b py-2 text-sm font-medium text-muted-foreground">
              <div>Scénario</div>
              <div className="text-center">Variation du portefeuille</div>
              <div className="text-right pr-2">Action</div>
            </div>

            {loadingSc ? (
              <div className="space-y-2 py-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <div className="divide-y">
                {(scenarios ?? []).map((sc: any) => {
                  const res = rowResult[sc.id]
                  const showValue =
                    res === undefined ? null : res === null ? 'loading' : Number.isNaN(res.pnl_pct) ? 'error' : res.pnl_pct

                  return (
                    <div key={sc.id} className="grid grid-cols-[1fr,180px,120px] items-center py-2">
                      <div className="truncate">
                        <div className="font-medium">{sc.name}</div>
                        <div className="text-xs text-muted-foreground uppercase">{sc.type}</div>
                      </div>

                      <div className="text-center">
                        {showValue === null && <span className="text-muted-foreground">—</span>}
                        {showValue === 'loading' && <span className="text-muted-foreground">…</span>}
                        {showValue === 'error' && <span className="text-red-600">Erreur</span>}
                        {typeof showValue === 'number' && <Pct value={showValue as number} />}
                      </div>

                      <div className="text-right pr-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={!portfolioId || isBusy}
                          onClick={() => handleSimulate(sc.id)}
                        >
                          {isBusy && rowResult[sc.id] === null ? '…' : 'Simuler'}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Colonne droite: panneau résultat / contributions */}
          <ResultPanel result={lastResult} />
        </div>
      </CardContent>
    </Card>
  )
}
