'use client'
import { LoginForm } from "@/components/login-form"
import { Suspense } from "react"

export default function LoginPage() {
  
  return (
    <div className="bg-zinc-100 flex min-h-svh flex-col items-center justify-center p-6 md:p-10 dark:bg-zinc-800">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Suspense fallback={<div>Chargement…</div>}>
                <LoginForm />
        </Suspense>
        
      </div>
    </div>
  )
}
