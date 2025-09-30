// app/context/SessionContext.tsx
'use client';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import type { Session } from "next-auth";
const SessionContext = createContext<Session | null>(null);

export const SessionProvider = ({ children }:{children?:ReactNode}) => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setSession(session);
    };
    fetchSession();
  }, []);

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => useContext(SessionContext);
