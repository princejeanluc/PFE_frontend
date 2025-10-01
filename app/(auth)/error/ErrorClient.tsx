// app/(auth)/error/ErrorClient.tsx  <-- CLIENT COMPONENT
"use client";
import React from "react";
import { useSearchParams } from "next/navigation";

export default function ErrorClient() {
  const searchParams = useSearchParams();
  const err = searchParams?.get("error");

  // exemple de redirection client après 3s
  // React.useEffect(() => {
  //   const t = setTimeout(() => router.push("/login"), 3000);
  //   return () => clearTimeout(t);
  // }, [router]);

  return (
    <div>
      <p>Erreur (client) : {err ?? "Aucun détail"}</p>
    </div>
  );
}
