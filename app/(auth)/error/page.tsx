// app/(auth)/error/page.tsx  <-- SERVER PARENT (pas "use client")
import React, { Suspense } from "react";
import ErrorClient from "@/app/(auth)/error/ErrorClient"

export default function Page() {
  return (
    <div>
      <h1>Erreur (pré-rendu)</h1>
      <Suspense fallback={<div>Chargement…</div>}>
        <ErrorClient />
      </Suspense>
    </div>
  );
}
