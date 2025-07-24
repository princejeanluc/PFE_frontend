'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogTrigger, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'


import { useCreateHoldings, useCreatePortfolio } from '../../_lib/hooks/simulation'
import { getCryptoList } from '../../_lib/api/market'
import { toast } from "sonner"

const allocationTypes = [
  { value: 'manual', label: 'Manuelle' },
  { value: 'static_opt', label: 'Optimisation statique' },
  { value: 'dynamic_opt', label: 'Optimisation dynamique' },
]

export default function CreatePortfolioSheet() {
    const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [portfolioId, setPortfolioId] = useState<number | null>(null)

  const [form, setForm] = useState({
    name: '',
    holding_start: '',
    holding_end: '',
    initial_budget: '',
    allocation_type: 'manual',
  })

  const [availableCryptos, setAvailableCryptos] = useState<any[]>([])
  const [holdings, setHoldings] = useState<{ crypto_id: string; percentage: number }[]>([])

  const { mutateAsync: createPortfolio } = useCreatePortfolio()
  const { mutateAsync: createHoldings } = useCreateHoldings()

  // Fetch cryptos à l'étape 2 si allocation manuelle
  useEffect(  () => {
    if (step === 2 && form.allocation_type === 'manual') {
      getCryptoList().then((data)=>{
        setAvailableCryptos(data.results)
      }) 
    }
  }, [step])

  const handleCreatePortfolio = async () => {
    try {
      const portfolio = await createPortfolio({
        name: form.name,
        holding_start: form.holding_start,
        holding_end: form.holding_end,
        initial_budget: parseFloat(form.initial_budget),
        allocation_type: form.allocation_type as any,
      })
      setPortfolioId(portfolio.id)
      console.log(" aloc",form.allocation_type)

      if (form.allocation_type === 'manual') {
        setStep(2)
      } else {
        setOpen(false)
        toast("Portfolio has been created", {
          description: "Sunday, December 03, 2023 at 9:00 AM",
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
      }
    } catch (err) {
      toast.error("Erreur lors de la création du portefeuille")
    }
  }

  const handleAddHolding = async () => {
    if (!portfolioId) return
    try {
      const payload = holdings.map(h => ({
        portfolio: portfolioId,
        crypto: h.crypto_id,
        allocation_percentage: h.percentage,
        quantity:0
      }))
      let sum_percent = 0
      let tmp = 0
      for (let i=0; i< payload.length;i++){
        tmp = payload[i].allocation_percentage || 0 
        sum_percent+= tmp
      }
      if(sum_percent===100){
        for (let i=0; i< payload.length;i++){
            if (payload[i].allocation_percentage && payload[i].allocation_percentage ==0){
                await createHoldings(payload[i])
            }
      }
        toast("Portfolio a été crée avec succès", {
          description: "Sunday, December 03, 2023 at 9:00 AM",
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
        setOpen(false)
      }
      else{
        toast.error(`la somme des allocations n'est pas de 100 % . pourcentage actuelle ${sum_percent} %`)
      }
      
    } catch (err) {
      toast.error('Erreur lors de l’enregistrement des holdings')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Créer un portefeuille</Button>
      </DialogTrigger>
      <DialogContent className="p-6 max-w-xl">
        <DialogTitle>Création portefeuille</DialogTitle>
        <DialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
        </DialogDescription>
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Nom"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Budget initial"
              value={form.initial_budget}
              onChange={(e) => setForm({ ...form, initial_budget: e.target.value })}
            />
            <Input
              type="date"
              placeholder="Début"
              value={form.holding_start}
              onChange={(e) => setForm({ ...form, holding_start: e.target.value })}
            />
            <Input
              type="date"
              placeholder="Fin"
              value={form.holding_end}
              onChange={(e) => setForm({ ...form, holding_end: e.target.value })}
            />
            <Select
              value={form.allocation_type}
              onValueChange={(value) => setForm({ ...form, allocation_type: value })}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="manual" />
                </SelectTrigger>
                <SelectContent>
                    {allocationTypes.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
              
            </Select>
            <Button onClick={handleCreatePortfolio}>Suivant</Button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Répartition manuelle</h2>
            {availableCryptos.map((crypto) => (
              <div key={crypto.id} className="flex justify-between items-center gap-2">
                <span>{crypto.symbol}</span>
                <Input
                  type="number"
                  placeholder="%"
                  onChange={(e) => {
                    const updated = holdings.filter((h) => h.crypto_id !== crypto.id)
                    updated.push({
                      crypto_id: crypto.id,
                      percentage: parseFloat(e.target.value),
                    })
                    setHoldings(updated)
                  }}
                />
              </div>
            ))}
            <Button onClick={handleAddHolding}>Valider le portefeuille</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
