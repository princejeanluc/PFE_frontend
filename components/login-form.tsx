'use client'

import { useState, useMemo } from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard/market'

  const [identifiant, setIdentifiant] = useState("") // email ou nom d’utilisateur
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const disabled = useMemo(
    () => loading || !identifiant.trim() || password.length === 0,
    [loading, identifiant, password]
  )

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      // Credentials: on envoie 'email' si l’input contient '@', sinon 'username'
      const payload: Record<string, any> = {
        redirect: false,
        password,
      }
      if (identifiant.includes('@')) payload.email = identifiant.trim()
      else payload.username = identifiant.trim()

      const res = await signIn("credentials", payload)

      if (!res || res.error) {
        throw new Error("Identifiants incorrects ou compte introuvable.")
      }

      router.push(callbackUrl)
    } catch (err: any) {
      setError(err?.message ?? "Une erreur est survenue.")
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    setError(null)
    try {
      // Laisse NextAuth gérer la redirection
      await signIn("google", { callbackUrl })
    } catch (err:unknown) {
      setError( `Impossible de démarrer la connexion Google.${err}`)
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={onSubmit} noValidate>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Bon retour 👋</h1>
                <p className="text-zinc-500 text-balance dark:text-zinc-400">
                  Connectez-vous à votre compte
                </p>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="identifiant">E-mail ou nom d’utilisateur</Label>
                <Input
                  id="identifiant"
                  name="identifiant"
                  inputMode="email"
                  autoComplete="username"
                  placeholder="vous@exemple.com ou jdupont"
                  value={identifiant}
                  onChange={(e) => setIdentifiant(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Link
                    href="/reset-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={disabled}>
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="animate-spin" size={16} />
                    Connexion…
                  </span>
                ) : (
                  "Se connecter"
                )}
              </Button>

              <div className="after:border-zinc-200 relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t dark:after:border-zinc-800">
                <span className="bg-white text-zinc-500 relative z-10 px-2 dark:bg-zinc-950 dark:text-zinc-400">
                  Ou continuer avec
                </span>
              </div>

              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={signInWithGoogle}
                  disabled={loading}
                  className="px-4 py-2 border flex items-center gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150"
                >
                  <Image
                    alt="Google"
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    width={20}
                    height={20}
                  />
                  <span>Se connecter avec Google</span>
                </Button>
              </div>

              <div className="text-center text-sm">
                Pas encore de compte ?{" "}
                <Link href="/register" className="underline underline-offset-4">
                  Créer un compte
                </Link>
              </div>
            </div>
          </form>

          <div className="bg-zinc-100 relative hidden md:block dark:bg-zinc-800">
            <Image
              src="/landing/auth.png"
              alt="Illustration d’authentification"
              width={1020}
              height={1020}
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              priority
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-zinc-500 *:[a]:hover:text-zinc-900 text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4 dark:text-zinc-400 dark:*:[a]:hover:text-zinc-50">
        En continuant, vous acceptez nos <a href="/terms">Conditions d’utilisation</a>{" "}
        et notre <a href="/privacy">Politique de confidentialité</a>.
      </div>
    </div>
  )
}
