import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./_components/ui/app-sidebar"
import { cookies } from "next/headers"
import {  QueryClientProvider } from "@tanstack/react-query"
import AuthProvider from "../_context/auth-provider"
import { queryClient } from "../lib/queryclient"



export default async  function Layout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "false"
  return (
    <SidebarProvider defaultOpen={defaultOpen} >
      <AppSidebar />
      <SidebarInset >
      <main className="font-sans">
        <SidebarTrigger />
        <AuthProvider>
         <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
        </AuthProvider>
      </main>
      </SidebarInset>
      
    </SidebarProvider>
  )
}