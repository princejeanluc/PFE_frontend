'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogTrigger, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'


import { useCreateHoldings, useCreatePortfolio, usePortfolios } from '../../_lib/hooks/simulation'
import { getCryptoList } from '../../_lib/api/market'
import { toast } from "sonner"
import { Badge } from '@/components/ui/badge'

const allocationTypes = [
  { value: 'manual', label: 'Allocation manuelle' },
  { value: 'autom', label: 'Allocation automatique' },
]

const objectives = [
  { value: 'max_return', label: 'Maximiser le rendement' },
  { value: 'min_volatility', label: 'Minimiser la volatilité' },
  { value: 'sharpe', label: 'Maximiser le ratio de Sharpe' },
]

export default function CreatePortfolioSheet({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
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

  useEffect(() => {
    getCryptoList().then(data => setAllCryptos(data.results))
  }, [])

  const toggleCryptoSelection = (crypto: any) => {
    const exists = selectedCryptos.find(c => c.id === crypto.id)
    if (exists) {
      setSelectedCryptos(selectedCryptos.filter(c => c.id !== crypto.id))
    } else {
      setSelectedCryptos([...selectedCryptos, crypto])
    }
  }

  const resetState = () => {
    setStep(1)
    setForm({
      name: '',
      holding_start: '',
      holding_end: '',
      initial_budget: '',
      allocation_type: 'manual',
      objective: 'sharpe',
    })
    setSelectedCryptos([])
    setHoldings([])
    setPortfolioId(null)
  }

  const handleCreatePortfolio = async () => {
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
      toast("Portefeuille créé avec succès")

      if (form.allocation_type === 'manual') {
        setStep(2)
      } else {
        try {
          console.log("selected cryptos",selectedCryptos)
          const payload = selectedCryptos.map(h => ({
            portfolio: portfolio.id,
            crypto: h.id,
            allocation_percentage: 0,
            quantity: 0
          }))
          console.log("payload = ", payload)
          for (const item of payload) {await createHoldings(item)}
          toast("Répartition enregistrée")
          setOpen(false)
        } catch {
          toast.error("Erreur lors de l’enregistrement des allocations")
        }
        resetState()
        onSuccess?.()
      }
    } catch (err) {
      toast.error("Erreur lors de la création du portefeuille")
    }
  }

  const handleAddHoldings = async () => {
    if (!portfolioId) return
    try {
      const payload = holdings.map(h => ({
        portfolio: portfolioId,
        crypto: h.crypto,
        allocation_percentage: h.allocation_percentage,
        quantity: 0
      }))
      const total = payload.reduce((sum, h) => sum + h.allocation_percentage, 0)
      if (total === 100) {
        for (const item of payload) await createHoldings(item)
        toast("Répartition enregistrée")
        setOpen(false)
        onSuccess?.()
        resetState()
      } else {
        toast.error(`La somme doit faire 100%. Actuellement: ${total}%`)
      }
    } catch {
      toast.error("Erreur lors de l’enregistrement des allocations")
    }
  }

  return (
    <Dialog open={open} onOpenChange={(value) => { setOpen(value); if (!value) resetState() }}>
      <DialogTrigger asChild>
        <Button>Créer un portefeuille</Button>
      </DialogTrigger>
      <DialogContent className="p-6 max-w-2xl">
        <DialogTitle>Nouveau portefeuille</DialogTitle>
        <DialogDescription>Configurez votre portefeuille d'investissement</DialogDescription>

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <Input placeholder="Nom" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <Input type="number" placeholder="Budget" value={form.initial_budget} onChange={e => setForm({ ...form, initial_budget: e.target.value })} />
            <Input type="date" value={form.holding_start} onChange={e => setForm({ ...form, holding_start: e.target.value })} />
            <Input type="date" value={form.holding_end} onChange={e => setForm({ ...form, holding_end: e.target.value })} />

            <Select value={form.allocation_type} onValueChange={val => setForm({ ...form, allocation_type: val })}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Méthode d'allocation" /></SelectTrigger>
              <SelectContent>{allocationTypes.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
            </Select>

            {form.allocation_type === 'autom' && (
              <Select value={form.objective} onValueChange={val => setForm({ ...form, objective: val })}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Objectif" /></SelectTrigger>
                <SelectContent>{objectives.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
              </Select>
            )}

            <div>
              <p className="text-sm text-muted-foreground mb-2">Choisissez les cryptos à inclure :</p>
              <div className="flex flex-wrap gap-2">
                {allCryptos.map(c => (
                  <Badge key={c.id} onClick={() => toggleCryptoSelection(c)} variant={selectedCryptos.find(s => s.id === c.id) ? 'default' : 'outline'}>
                    {c.symbol}
                  </Badge>
                ))}
              </div>
            </div>
            <Button onClick={handleCreatePortfolio}>Continuer</Button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Répartition manuelle</h2>
            {selectedCryptos.map(c => (
              <div key={c.id} className="flex justify-between items-center">
                <span>{c.symbol}</span>
                <Input type="number" placeholder="%" onChange={e => {
                  const updated = holdings.filter(h => h.crypto !== c.id)
                  updated.push({ crypto: c.id, allocation_percentage: parseFloat(e.target.value) })
                  setHoldings(updated)
                }} />
              </div>
            ))}
            <Button onClick={handleAddHoldings}>Valider le portefeuille</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
