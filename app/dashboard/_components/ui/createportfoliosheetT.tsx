'use client'

import { Dialog, DialogContent, DialogTrigger, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'


import { useCreateHoldings, useCreatePortfolio, usePortfolios } from '../../_lib/hooks/simulation'
import { getCryptoList } from '../../_lib/api/market'
import { toast } from "sonner"
import { Badge } from '@/components/ui/badge'


import { useState, useEffect, useMemo } from 'react'
import { Loader2 } from 'lucide-react'





export default function CreatePortfolioSheet({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [portfolioId, setPortfolioId] = useState<number | null>(null)

  const [form, setForm] = useState({
    name: '',
    holding_start: '',
    holding_end: '',
    initial_budget: '',
    allocation_type: 'manual',
    objective: 'sharpe',
  })

  const [allCryptos, setAllCryptos] = useState<any[]>([])
  const [selectedCryptos, setSelectedCryptos] = useState<any[]>([])
  const [holdings, setHoldings] = useState<{ crypto: string; allocation_percentage: number }[]>([])

  const { mutateAsync: createPortfolio } = useCreatePortfolio()
  const { mutateAsync: createHoldings } = useCreateHoldings()

  useEffect(() => { getCryptoList().then(d => setAllCryptos(d.results)) }, [])

  const totalAlloc = useMemo(() =>
    holdings.reduce((s, h) => s + (Number(h.allocation_percentage) || 0), 0), [holdings])

  const toggleCryptoSelection = (crypto: any) => {
    setSelectedCryptos((prev) => {
      const exists = prev.some(c => c.id === crypto.id)
      const next = exists ? prev.filter(c => c.id !== crypto.id) : [...prev, crypto]
      // si manuel, maintiens holdings cohérents
      setHoldings((h) => exists ? h.filter(x => x.crypto !== crypto.id) : h)
      return next
    })
  }

  const resetState = () => {
    setStep(1); setSubmitting(false); setPortfolioId(null)
    setForm({ name: '', holding_start: '', holding_end: '', initial_budget: '', allocation_type: 'manual', objective: 'sharpe' })
    setSelectedCryptos([]); setHoldings([])
  }

  const validStep1 = useMemo(() => {
    const budgetOk = Number(form.initial_budget) > 0
    const nameOk = form.name.trim().length > 0
    const datesOk = form.holding_start && form.holding_end && (new Date(form.holding_end) >= new Date(form.holding_start))
    const cryptosOk = selectedCryptos.length > 0
    return budgetOk && nameOk && datesOk && cryptosOk
  }, [form, selectedCryptos])

  const distributeEqually = () => {
    if (selectedCryptos.length === 0) return
    const eq = +(100 / selectedCryptos.length).toFixed(2)
    const last = 100 - eq * (selectedCryptos.length - 1)
    const arr = selectedCryptos.map((c, i) => ({ crypto: c.id, allocation_percentage: i === selectedCryptos.length - 1 ? last : eq }))
    setHoldings(arr)
  }

  const handleCreatePortfolio = async () => {
    if (!validStep1) { toast.error('Vérifie le nom, budget, dates et sélection de cryptos.'); return }
    setSubmitting(true)
    try {
      const portfolio = await createPortfolio({
        name: form.name,
        holding_start: form.holding_start,
        holding_end: form.holding_end,
        initial_budget: parseFloat(form.initial_budget),
        allocation_type: form.allocation_type as any,
        objective: form.allocation_type === 'autom' ? form.objective : null
      })
      setPortfolioId(portfolio.id)
      toast.success('Portefeuille créé')
      if (form.allocation_type === 'manual') {
        setStep(2)
      } else {
        // auto : crée juste les lignes holdings (alloc% = 0, backend optimisera)
        const payload = selectedCryptos.map(c => ({ portfolio: portfolio.id, crypto: c.id, allocation_percentage: 0, quantity: 0 }))
        await Promise.all(payload.map(item => createHoldings(item))) // ⚡️ parallèle
        toast.success('Répartition enregistrée')
        setOpen(false); resetState(); onSuccess?.()
      }
    } catch (e:any) {
      toast.error(e?.response?.data?.error ?? 'Erreur lors de la création')
    } finally { setSubmitting(false) }
  }

  const handleAddHoldings = async () => {
    if (!portfolioId) return
    if (Math.round(totalAlloc) !== 100) { toast.error(`La somme doit faire 100%. Actuellement: ${totalAlloc.toFixed(2)}%`); return }
    setSubmitting(true)
    try {
      const payload = holdings.map(h => ({ portfolio: portfolioId, crypto: h.crypto, allocation_percentage: Number(h.allocation_percentage), quantity: 0 }))
      await Promise.all(payload.map(item => createHoldings(item)))
      toast.success('Répartition enregistrée')
      setOpen(false); resetState(); onSuccess?.()
    } catch { toast.error('Erreur lors de l’enregistrement des allocations') }
    finally { setSubmitting(false) }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetState() }}>
      <DialogTrigger asChild><Button>Créer un portefeuille</Button></DialogTrigger>
      <DialogContent className="p-6 max-w-2xl ">
        <DialogTitle>Nouveau portefeuille</DialogTitle>
        <DialogDescription>Configurez votre portefeuille d’investissement</DialogDescription>

        {/* Stepper */}
        <div className="mt-2 mb-4 flex items-center gap-2 text-xs">
          <span className={`px-2 py-1 rounded ${step===1?'bg-primary text-white':'bg-gray-100'}`}>1. Infos</span>
          <span className="text-gray-300">→</span>
          <span className={`px-2 py-1 rounded ${step===2?'bg-primary text-white':'bg-gray-100'}`}>2. Répartition</span>
        </div>

        {step === 1 && (
          <div className="flex flex-col gap-3">
            <Input placeholder="Nom" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <Input type="number" placeholder="Budget ($)" value={form.initial_budget} onChange={e => setForm({ ...form, initial_budget: e.target.value })} />
            <div className="grid grid-cols-2 gap-2">
              <Input type="date" value={form.holding_start} onChange={e => setForm({ ...form, holding_start: e.target.value })} />
              <Input type="date" value={form.holding_end} onChange={e => setForm({ ...form, holding_end: e.target.value })} />
            </div>

            <Select value={form.allocation_type} onValueChange={val => setForm({ ...form, allocation_type: val })}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Méthode d'allocation" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Allocation manuelle</SelectItem>
                <SelectItem value="autom">Allocation automatique</SelectItem>
              </SelectContent>
            </Select>

            {form.allocation_type === 'autom' && (
              <Select value={form.objective} onValueChange={val => setForm({ ...form, objective: val })}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Objectif" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="max_return">Maximiser le rendement</SelectItem>
                  <SelectItem value="min_volatility">Minimiser la volatilité</SelectItem>
                  <SelectItem value="sharpe">Maximiser le ratio de Sharpe</SelectItem>
                </SelectContent>
              </Select>
            )}

            <div>
              <p className="text-sm text-muted-foreground mb-2">Choisissez les cryptos à inclure :</p>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-auto">
                {allCryptos.map(c => (
                  <Badge
                    key={c.id}
                    onClick={() => toggleCryptoSelection(c)}
                    className="cursor-pointer"
                    variant={selectedCryptos.find(s => s.id === c.id) ? 'default' : 'outline'}
                  >
                    {c.symbol}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreatePortfolio} disabled={!validStep1 || submitting}>
                {submitting ? <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Création…</span> : 'Continuer'}
              </Button>
              <Button variant="outline" onClick={resetState} disabled={submitting}>Réinitialiser</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Répartition manuelle</h2>
              <div className="text-xs text-gray-600">Somme : <strong className={Math.round(totalAlloc)===100 ? 'text-green-600' : 'text-red-600'}>{totalAlloc.toFixed(2)}%</strong></div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={distributeEqually}>Répartir équitablement</Button>
              <Button size="sm" variant="outline" onClick={() => { setHoldings([]); setSelectedCryptos([]) }}>Vider</Button>
            </div>

            {selectedCryptos.length === 0 && (
              <div className="text-sm text-gray-500">Aucune crypto sélectionnée à l’étape 1.</div>
            )}

            {selectedCryptos.map(c => {
              const val = holdings.find(h => h.crypto === c.id)?.allocation_percentage ?? 0
              return (
                <div key={c.id} className="flex items-center justify-between gap-3">
                  <span className="w-24">{c.symbol}</span>
                  <Input
                    type="number" min={0} max={100} step={0.5}
                    value={val}
                    onChange={(e) => {
                      const v = Number(e.target.value)
                      setHoldings((prev) => {
                        const rest = prev.filter(h => h.crypto !== c.id)
                        return [...rest, { crypto: c.id, allocation_percentage: v }]
                      })
                    }}
                    className="w-28"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              )
            })}

            <Button onClick={handleAddHoldings} disabled={submitting || Math.round(totalAlloc) !== 100}>
              {submitting ? <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Enregistrement…</span> : 'Valider le portefeuille'}
            </Button>
          </div>
        )}

        {/* Overlay blur pendant opérations */}
        {submitting && (
          <div className="pointer-events-none absolute inset-0 rounded-lg bg-white/40 backdrop-blur-[1px] flex items-center justify-center">
            <div className="pointer-events-auto flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm shadow">
              <Loader2 className="h-4 w-4 animate-spin" />
              Traitement en cours…
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}