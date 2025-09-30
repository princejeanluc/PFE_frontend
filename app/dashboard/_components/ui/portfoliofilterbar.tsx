import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function PortfolioFilterBar({ onFilter }:{onFilter:any}) {
  const [name, setName] = useState("")
  const [crypto, setCrypto] = useState("")
  
  return (
    <div className="flex gap-2">
      <Input placeholder="Nom du portefeuille" value={name} onChange={(e) => setName(e.target.value)} />
      <Input placeholder="Crypto (ex: BTC)" value={crypto} onChange={(e) => setCrypto(e.target.value)} />
      <Button onClick={() => onFilter({ name, crypto })}>Rechercher</Button>
    </div>
  )
}
