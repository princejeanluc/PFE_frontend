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

function clampNSims(v: number) {
  if (Number.isNaN(v)) return 1000
  return Math.max(100, Math.min(2000, Math.round(v)))
}

export default function OptionPricingCard() {
  // cryptos depuis backend (pagination gérée)
  const { data: cryptos, isLoading: loadingCryptos } = useCryptoList()

  // formulaire contrôlé
  const [optionType, setOptionType] = React.useState<'call' | 'put'>('call')
  const [symbol, setSymbol] = React.useState('BTC')
  const [strike, setStrike] = React.useState<number | ''>('')
  const [riskFree, setRiskFree] = React.useState<number | ''>('') // ex 0.02
  const [useDates, setUseDates] = React.useState(false)
  const [currentDate, setCurrentDate] = React.useState<string>('')
  const [maturityDate, setMaturityDate] = React.useState<string>('')
  const [horizonHours, setHorizonHours] = React.useState<number | ''>(72)
  const [nSims, setNSims] = React.useState<number>(1000)

  // par défaut, pick première crypto si BTC introuvable
  React.useEffect(() => {
    if (!loadingCryptos && (cryptos.results)?.length) {
      const exists = (cryptos.results).some((c: any) => c.symbol === symbol)
      if (!exists) setSymbol((cryptos.results)[0].symbol)
    }
  }, [loadingCryptos, cryptos]) // eslint-disable-line

  const pricing = useOptionPricing()

  const canSubmit =
    !!symbol &&
    (typeof strike === 'number' && strike > 0) &&
    ((useDates && currentDate && maturityDate) || (!useDates && typeof horizonHours === 'number' && horizonHours > 0))

  const handleSubmit = () => {
    if (!canSubmit) return
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

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>Pricing d’option (Monte Carlo)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* Type */}
        <div className="space-y-2">
          <Label>Type</Label>
          <RadioGroup defaultValue='call' value={optionType} onValueChange={(v) => setOptionType(v as any)} className="flex gap-4">
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

        {/* Strike */}
        <div className="space-y-1">
          <Label>Prix d’exercice ($)</Label>
          <Input
            inputMode="decimal"
            type="number"
            min="0"
            step="0.01"
            value={strike}
            onChange={(e) => setStrike(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="Ex: 65000"
          />
        </div>

        {/* Dates vs Horizon */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              id="useDates"
              type="checkbox"
              checked={useDates}
              onChange={(e) => setUseDates(e.target.checked)}
            />
            <Label htmlFor="useDates">Utiliser des dates (sinon horizon en heures)</Label>
          </div>

          {useDates ? (
            <div className="grid grid-cols-1 gap-2">
              <div>
                <Label>Date courante</Label>
                <Input type="datetime-local" value={currentDate} onChange={(e) => setCurrentDate(e.target.value)} />
              </div>
              <div>
                <Label>Date de maturité</Label>
                <Input type="datetime-local" value={maturityDate} onChange={(e) => setMaturityDate(e.target.value)} />
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <Label>Horizon (heures)</Label>
              <Input
                type="number"
                min={1}
                max={24 * 7}
                step={1}
                value={horizonHours}
                onChange={(e) => setHorizonHours(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Ex: 72"
              />
            </div>
          )}
        </div>

        {/* r sans risque */}
        <div className="space-y-1">
          <Label>Taux sans risque (annuel)</Label>
          <Input
            inputMode="decimal"
            type="number"
            step="0.001"
            placeholder="Ex: 0.02"
            value={riskFree}
            onChange={(e) => setRiskFree(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </div>

        {/* Actif */}
        <div className="space-y-1">
          <Label>Actif</Label>
          {loadingCryptos ? (
            <Skeleton className="h-9 w-full" />
          ) : (
            <Select value={symbol} onValueChange={setSymbol}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir un actif" />
              </SelectTrigger>
              <SelectContent>
                {((cryptos.results) ?? []).map((c: any) => (
                  <SelectItem key={c.id} value={c.symbol}>
                    {c.symbol} — {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* n_sims */}
        <div className="space-y-1">
          <Label>Nombre de simulations (≤ 2000)</Label>
          <Input
            type="number"
            min={100}
            max={2000}
            step={100}
            value={nSims}
            onChange={(e) => setNSims(clampNSims(Number(e.target.value)))}
          />
        </div>

        <Button className="w-full" onClick={handleSubmit} disabled={!canSubmit || pricing.isPending}>
          {pricing.isPending ? 'Calcul en cours…' : 'Calculer'}
        </Button>

        {/* Résultat */}
        {pricing.isError && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {(pricing.error as any)?.response?.data?.error ??
              (pricing.error as any)?.message ??
              "Échec du pricing. Réessaie."}
          </div>
        )}

        {pricing.isSuccess && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Résultat</div>
            <div className="rounded-md border p-3">
              <div className="text-2xl font-semibold">
                {pricing.data.price.toFixed(2)} $
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                IC 95% : {pricing.data.ci95[0].toFixed(2)} $ — {pricing.data.ci95[1].toFixed(2)} $
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Modèle : {pricing.data.diagnostics.model_used} • σ via simu • n={pricing.data.n_sims}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
