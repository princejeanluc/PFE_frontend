"use client";

import * as React from "react";
import { SessionProvider } from "next-auth/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { queryClient } from "@/app/lib/queryclient";
import { AuthTokensBridge } from "@/core/auth/tokens";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthTokensBridge />
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
      <Toaster richColors position="top-right" />
    </SessionProvider>
  );
}
