import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./_components/ui/app-sidebar"
import { cookies } from "next/headers"


export default async  function Layout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "false"
  return (
    <SidebarProvider defaultOpen={defaultOpen} >
      <AppSidebar />
      <SidebarInset >
      <main>
        <SidebarTrigger />
        {children}
      </main>
      </SidebarInset>
      
    </SidebarProvider>
  )
}