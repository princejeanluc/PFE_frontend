"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Eye, EyeOff, Loader2 } from "lucide-react"

type Role =
  | "analyste"
  | "trader"
  | "etudiant"
  | "enseignant"
  | "portfolio_manager"
  | "autre"

export default function RegisterPage() {
  const router = useRouter()

  const [form, setForm] = useState<{
    username: string
    email: string
    password: string
    type: Role | ""
  }>({ username: "", email: "", password: "", type: "" })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof typeof form, string>>>({})
  const [showPassword, setShowPassword] = useState(false)

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setFieldErrors((errs) => ({ ...errs, [name]: undefined }))
  }

  // Petite jauge de robustesse du mot de passe (indicative, non bloquante)
  const passwordScore = useMemo(() => {
    let s = 0
    if (form.password.length >= 8) s++
    if (/[A-Z]/.test(form.password)) s++
    if (/[a-z]/.test(form.password)) s++
    if (/\d/.test(form.password)) s++
    if (/[^A-Za-z0-9]/.test(form.password)) s++
    return s // 0..5
  }, [form.password])

  const validate = () => {
    const errs: Partial<Record<keyof typeof form, string>> = {}
    if (!form.username.trim()) errs.username = "Le nom d’utilisateur est requis."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Adresse e-mail invalide."
    if (form.password.length < 8) errs.password = "Au moins 8 caractères."
    if (!form.type) errs.type = "Sélectionnez un rôle."
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!backendUrl) {
      setError("Configuration manquante : NEXT_PUBLIC_BACKEND_URL.")
      return
    }
    if (!validate()) return

    setLoading(true)
    try {
      // Étape 1 : inscription via API Django
      const res = await fetch(`${backendUrl}/api/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        // Essaye de lire les erreurs de l’API (email/username déjà pris, etc.)
        let msg = "Erreur à l'inscription."
        try {
          const data = await res.json()
          msg =
            data?.email?.[0] ||
            data?.username?.[0] ||
            data?.detail ||
            data?.message ||
            msg
        } catch {
          /* ignore JSON parse error */
        }
        throw new Error(msg)
      }

      // Étape 2 : connexion via NextAuth (credentials)
      // redirect:false => on contrôle la navigation nous-mêmes
      const loginRes = await signIn("credentials", {
        redirect: false,
        username: form.username,
        password: form.password,
        // on utilise ensuite router.push ci-dessous
      })

      if (!loginRes || loginRes.error) {
        throw new Error(
          "Inscription réussie, mais échec de connexion" +
            (loginRes?.error ? ` : ${loginRes.error}` : ".")
        )
      }

      router.push("/dashboard/market")
    } catch (err: any) {
      setError(err?.message || "Une erreur est survenue.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-b from-background to-muted/30 flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md shadow-lg border border-border/60">
        <CardHeader className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-center">
            Créer un compte
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            Rejoignez la plateforme en quelques secondes.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Nom d’utilisateur</Label>
              <Input
                id="username"
                name="username"
                autoComplete="username"
                placeholder="ex. jdoe"
                value={form.username}
                onChange={handleChange}
                aria-invalid={!!fieldErrors.username}
                aria-describedby={fieldErrors.username ? "username-error" : undefined}
                disabled={loading}
                required
              />
              {fieldErrors.username && (
                <p id="username-error" className="text-sm text-red-500">
                  {fieldErrors.username}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="vous@exemple.com"
                value={form.email}
                onChange={handleChange}
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
                disabled={loading}
                required
              />
              {fieldErrors.email && (
                <p id="email-error" className="text-sm text-red-500">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label>Rôle</Label>
              <Select
                value={form.type}
                onValueChange={(value: Role) => {
                  setForm((f) => ({ ...f, type: value }))
                  setFieldErrors((errs) => ({ ...errs, type: undefined }))
                }}
                disabled={loading}
                required
              >
                <SelectTrigger className="w-full" aria-invalid={!!fieldErrors.type}>
                  <SelectValue placeholder="Sélectionnez un rôle" />
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
              {fieldErrors.type && (
                <p className="text-sm text-red-500">{fieldErrors.type}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={
                    fieldErrors.password ? "password-error" : "password-help"
                  }
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Jauge (indicative) */}
              <div className="h-1 w-full rounded bg-muted overflow-hidden" id="password-help">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${(passwordScore / 5) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Utilisez idéalement 8+ caractères, avec majuscules, chiffres et symboles.
              </p>

              {fieldErrors.password && (
                <p id="password-error" className="text-sm text-red-500">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Error global */}
            {error && (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  Création…
                </span>
              ) : (
                "Créer un compte"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Vous avez déjà un compte ?</span>
          <div className="flex items-center gap-2">
            {/* Lien vers la page de connexion de ton app */}
            <Link href="/login" className="text-primary hover:underline">
              Se connecter
            </Link>
            {/* Ou déclencher NextAuth directement si tu préfères :
            <Button variant="ghost" size="sm" onClick={() => signIn()}>
              Se connecter
            </Button>
            */}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
