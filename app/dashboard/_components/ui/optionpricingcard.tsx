'use client'
import * as React from 'react'

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useCryptoList } from '../../_lib/hooks/market'
import { useOptionPricing } from '../../_lib/hooks/risk'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, Loader2, XCircle } from 'lucide-react'

function clampNSims(v: number) {
  if (Number.isNaN(v)) return 1000
  return Math.max(100, Math.min(2000, Math.round(v)))
}

export default function OptionPricingCard() {
  const { data: cryptos, isLoading: loadingCryptos } = useCryptoList()

  const [optionType, setOptionType] = React.useState<'call' | 'put'>('call')
  const [symbol, setSymbol] = React.useState('BTC')
  const [strike, setStrike] = React.useState<number | ''>('')
  const [riskFree, setRiskFree] = React.useState<number | ''>('')   // annuel, ex: 0.02
  const [useDates, setUseDates] = React.useState(false)
  const [currentDate, setCurrentDate] = React.useState<string>('')
  const [maturityDate, setMaturityDate] = React.useState<string>('')
  const [horizonHours, setHorizonHours] = React.useState<number | ''>(72)
  const [nSims, setNSims] = React.useState<number>(1000)

  // pour accordéon "détails"
  const [showDetails, setShowDetails] = React.useState(false)

  // symbole par défaut si BTC absent
  React.useEffect(() => {
    if (!loadingCryptos && cryptos?.results?.length) {
      const exists = cryptos.results.some((c: any) => c.symbol === symbol)
      if (!exists) setSymbol(cryptos.results[0].symbol)
    }
  }, [loadingCryptos, cryptos]) // eslint-disable-line

  // hook tarification
  const pricing = useOptionPricing()  // mutation: { mutate, isPending, isError, isSuccess, data, error, cancel? }

  // helpers
  const canSubmit =
    !!symbol &&
    (typeof strike === 'number' && strike > 0) &&
    ((useDates && currentDate && maturityDate) || (!useDates && typeof horizonHours === 'number' && horizonHours > 0))

  const handleSubmit = () => {
    if (!canSubmit || pricing.isPending) return
    const payload: any = {
      symbol,
      option_type: optionType,
      strike: Number(strike),
      risk_free: riskFree === '' ? 0 : Number(riskFree),
      n_sims: clampNSims(nSims),
    }
    if (useDates) {
      payload.current_date = new Date(currentDate).toISOString()
      payload.maturity_date = new Date(maturityDate).toISOString()
    } else {
      payload.horizon_hours = Number(horizonHours)
    }
    pricing.mutate(payload)
  }

  // presets horizon
  const setPresetH = (h: number) => { setUseDates(false); setHorizonHours(h) }

  // ATM rapide (si le prix spot est dispo dans ta liste; adapte selon ton schéma)
  const spot = React.useMemo(() => {
    // essaie de trouver un champ "current_price" si ton hook le donne; sinon null
    const row = cryptos?.results?.find((c: any) => c.symbol === symbol)
    return row?.latest_info?.current_price ?? row?.price ?? null
  }, [cryptos, symbol])
  const setATM = () => { if (spot != null) setStrike(Number(spot.toFixed(2))) }

  // temps à maturité (si dates)
  const tMeta = React.useMemo(() => {
    if (!useDates || !currentDate || !maturityDate) return null
    const cur = new Date(currentDate).getTime()
    const mat = new Date(maturityDate).getTime()
    const diffH = Math.max(0, (mat - cur) / 36e5)
    const tYears = diffH / (24 * 365)    // affichage indicatif
    return { hours: diffH, years: tYears }
  }, [useDates, currentDate, maturityDate])

  // micro-copie charge
  const computeLoad = (useDates && tMeta ? Math.round(tMeta.hours) : (typeof horizonHours === 'number' ? horizonHours : 0)) * nSims

  return (
    <Card className="w-full relative">
      <CardHeader className="gap-2">
        <div className="flex items-center justify-between">
          <CardTitle>Pricing d’option (Monte Carlo)</CardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline">n_sims: {nSims}</Badge>
            <Badge variant="outline">
              horizon: {useDates ? (tMeta ? `${tMeta.hours.toFixed(0)}h` : '—') : `${horizonHours || '—'}h`}
            </Badge>
            <span className="hidden md:inline">Charge estimée: <strong>{computeLoad.toLocaleString()}</strong></span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Type & Actif */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-2">
            <Label>Type</Label>
            <RadioGroup value={optionType} onValueChange={(v) => setOptionType(v as any)} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="opt-call" value="call" />
                <Label htmlFor="opt-call">Call</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="opt-put" value="put" />
                <Label htmlFor="opt-put">Put</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Actif</Label>
            {loadingCryptos ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              <Select value={symbol} onValueChange={setSymbol} disabled={pricing.isPending}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir un actif" />
                </SelectTrigger>
                <SelectContent>
                  {(cryptos?.results ?? []).map((c: any) => (
                    <SelectItem key={c.id} value={c.symbol}>
                      {c.symbol} — {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {spot != null && (
              <div className="text-xs text-muted-foreground">Spot estimé: ${spot.toFixed(2)}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Prix d’exercice</Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <Input
                inputMode="decimal"
                type="number"
                min="0"
                step="0.01"
                className="pl-6"
                value={strike}
                onChange={(e) => setStrike(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder={spot ? `${spot.toFixed(2)} (ATM?)` : 'Ex: 65000'}
                disabled={pricing.isPending}
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={setATM} disabled={spot == null || pricing.isPending}>
                ATM
              </Button>
              <Button size="sm" variant="outline" onClick={() => strike && setStrike(Number(strike) * 0.9)} disabled={!strike || pricing.isPending}>-10%</Button>
              <Button size="sm" variant="outline" onClick={() => strike && setStrike(Number(strike) * 1.1)} disabled={!strike || pricing.isPending}>+10%</Button>
            </div>
          </div>
        </div>

        {/* Dates vs Horizon */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1 md:col-span-2">
            <div className="flex items-center gap-2">
              <input id="useDates" type="checkbox" checked={useDates} onChange={(e) => setUseDates(e.target.checked)} disabled={pricing.isPending}/>
              <Label htmlFor="useDates">Utiliser des dates (sinon saisir un horizon en heures)</Label>
            </div>

            {useDates ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <Label>Date courante</Label>
                  <Input type="datetime-local" value={currentDate} onChange={(e) => setCurrentDate(e.target.value)} disabled={pricing.isPending}/>
                </div>
                <div>
                  <Label>Date de maturité</Label>
                  <Input type="datetime-local" value={maturityDate} onChange={(e) => setMaturityDate(e.target.value)} disabled={pricing.isPending}/>
                </div>
                <div className="md:col-span-2 text-xs text-muted-foreground">
                  {tMeta ? <>T ≈ {tMeta.hours.toFixed(0)}h ({tMeta.years.toFixed(4)} an(s))</> : 'Renseignez les deux dates.'}
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <Label>Horizon</Label>
                <div className="relative w-full md:w-56">
                  <Input
                    type="number"
                    min={1}
                    max={24 * 14}
                    step={1}
                    value={horizonHours}
                    onChange={(e) => setHorizonHours(e.target.value === '' ? '' : Number(e.target.value))}
                    disabled={pricing.isPending}
                  />
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">h</span>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button size="sm" variant="secondary" onClick={() => setPresetH(24)} disabled={pricing.isPending}>1j</Button>
                  <Button size="sm" variant="secondary" onClick={() => setPresetH(72)} disabled={pricing.isPending}>3j</Button>
                  <Button size="sm" variant="secondary" onClick={() => setPresetH(168)} disabled={pricing.isPending}>7j</Button>
                </div>
              </div>
            )}
          </div>

          {/* n_sims + r */}
          <div className="space-y-2">
            <Label>Nombre de simulations (≤ 2000)</Label>
            <Input
              type="number"
              min={100}
              max={2000}
              step={100}
              value={nSims}
              onChange={(e) => setNSims(clampNSims(Number(e.target.value)))}
              disabled={pricing.isPending}
            />
            <Label className="mt-2">Taux sans risque (annuel)</Label>
            <div className="relative">
              <Input
                inputMode="decimal"
                type="number"
                step="0.001"
                placeholder="Ex: 0.02"
                value={riskFree}
                onChange={(e) => setRiskFree(e.target.value === '' ? '' : Number(e.target.value))}
                disabled={pricing.isPending}
              />
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">/an</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button className="min-w-40" onClick={handleSubmit} disabled={!canSubmit || pricing.isPending}>
            {pricing.isPending ? (<span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin"/>&nbsp;Calcul en cours…</span>) : 'Calculer'}
          </Button>
          {pricing.isPending && (
            <Button variant="ghost" onClick={() => pricing.cancel?.()}>
                Annuler
            </Button>
            )}
          <Button variant="outline" onClick={() => { setStrike(''); setRiskFree(''); setUseDates(false); setCurrentDate(''); setMaturityDate(''); setHorizonHours(72); setNSims(1000); }} disabled={pricing.isPending}>
            Réinitialiser
          </Button>
          {typeof (pricing as any).cancel === 'function' && pricing.isPending && (
            <Button variant="ghost" onClick={() => (pricing as any).cancel()}><XCircle className="h-4 w-4 mr-1"/> Annuler</Button>
          )}
        </div>

        {/* Messages */}
        {pricing.isError && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {(pricing.error as any)?.response?.data?.error ?? (pricing.error as any)?.message ?? "Échec du pricing. Réessaie."}
          </div>
        )}

        {/* Résultat */}
        {pricing.isSuccess && (
          <div className="space-y-3">
            <div className="rounded-md border p-3 bg-white">
              <div className="text-2xl font-semibold">${pricing.data.price.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground mt-1">
                IC 95% : ${pricing.data.ci95[0].toFixed(2)} — ${pricing.data.ci95[1].toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Modèle : {pricing.data.diagnostics?.model_used ?? '—'} • n = {pricing.data.n_sims}
              </div>
            </div>

            {/* Détails repliables */}
            <button
              type="button"
              className="text-sm text-muted-foreground inline-flex items-center gap-1"
              onClick={() => setShowDetails(v => !v)}
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
              Détails (diagnostics)
            </button>
            {showDetails && (
              <div className="rounded-md border p-3 text-xs text-muted-foreground space-y-1">
                <div>Model : {String(pricing.data.diagnostics?.model_used ?? '—')}</div>
              </div>
            )}
          </div>
        )}
      </CardContent>

      {/* Overlay blur pendant le pricing */}
      {pricing.isPending && (
        <div className="pointer-events-none absolute inset-0 rounded-lg bg-white/40 backdrop-blur-[1px] flex items-center justify-center">
          <div className="pointer-events-auto flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm shadow">
            <Loader2 className="h-4 w-4 animate-spin" />
            Tarification en cours…
          </div>
        </div>
      )}
    </Card>
  )
}
