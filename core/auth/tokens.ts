"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { clearAuthTokens, setAuthState, setAuthTokens } from "../http/client";

export function AuthTokensBridge() {
  const { data } = useSession();

  React.useEffect(() => {
    const at = (data as any)?.accessToken || (data?.user && (data as any).accessToken);
    const rt = (data as any)?.refreshToken || (data?.user && (data as any).refreshToken);

    if (at && rt) {
      setAuthTokens(at, rt);
      setAuthState(true);
    } else {
      clearAuthTokens();
      setAuthState(false);
    }
  }, [data]);

  return null;
}
