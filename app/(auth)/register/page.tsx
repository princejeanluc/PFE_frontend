"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: "", email: "", password: "" , type:""})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    console.log(1)
    try {
        if (!form.type) {
            setError("Veuillez sélectionner un type d'utilisateur.")
            setLoading(false)
            return
            }
        console.log(2)
      // Étape 1 : inscription via ton API Django
      console.log(process.env.NEXT_PUBLIC_BACKEND_URL)
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      console.log(3)
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data?.email?.[0] || data?.username?.[0] || "Erreur à l'inscription")
      }
      console.log(6)
      // Étape 2 : connexion immédiate via next-auth
      const loginRes = await signIn("credentials", {
        redirect: true,
        username: form.username,
        password: form.password,
        callbackUrl:"/dashboard/market"
      })
      if (loginRes?.error) {
        throw new Error("Inscription réussie, mais échec de connexion : " + loginRes.error)
      }

      router.push("/") // Redirige vers la page d’accueil
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-bold text-center">Créer un compte</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="username" placeholder="Nom d’utilisateur" onChange={handleChange} required />
        <Input type="email" name="email" placeholder="Email" onChange={handleChange} required />

        <Select required onValueChange={(value) => setForm({ ...form, type: value })} >
        <SelectTrigger className="w-[180px]" name="type">
            <SelectValue placeholder="Sélectionnez un rôle"/>
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="analyste">Analyste</SelectItem>
            <SelectItem value="trader">Trader</SelectItem>
            <SelectItem value="etudiant">Étudiant</SelectItem>
            <SelectItem value="enseignant">Enseignant</SelectItem>
            <SelectItem value="portfolio_manager">Portfolio Manager</SelectItem>
            <SelectItem value="autre">Autre</SelectItem>
        </SelectContent>
        </Select>

        <Input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} required />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Création..." : "Créer un compte"}
        </Button>
      </form>
    </div>
  )
}
