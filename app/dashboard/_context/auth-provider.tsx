// dashboard/_context/auth-provider.tsx
"use client";

import React from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { setAuthTokens, clearAuthTokens } from "../_lib/axiosinstance";

function TokensBridge() {
  const { data } = useSession();

  React.useEffect(() => {
    const at = (data as any)?.accessToken || data?.user && (data as any).accessToken;
    const rt = (data as any)?.refreshToken || data?.user && (data as any).refreshToken;

    if (at && rt) {
      setAuthTokens(at, rt);
    } else {
      clearAuthTokens();
    }
  }, [data]);

  return null;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TokensBridge />
      {children}
    </SessionProvider>
  );
}
