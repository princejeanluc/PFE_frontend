// app/(...)/layout.tsx
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./_components/ui/app-sidebar"
import { cookies } from "next/headers"
import { QueryClientProvider } from "@tanstack/react-query"
import AuthProvider from "../_context/auth-provider"
import { queryClient } from "../lib/queryclient"

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "false"

  return (
    <AuthProvider> {/* <-- déplace ICI, au-dessus de AppSidebar */}
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />  {/* maintenant dans le SessionProvider */}
        <SidebarInset>
          <main className="font-sans">
            <SidebarTrigger />
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  )
}
