import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"

import { ChartNetwork, ChartNoAxesCombined, Newspaper, Umbrella, Wallet  } from "lucide-react"
import Link from 'next/link'
const items = [
  {
    title: "Marché crypto",
    url:"/dashboard/market", 
    icon : ChartNoAxesCombined, 
  },
  {
    title: "Simulation",
    url:"/dashboard/market", 
    icon : ChartNetwork , 
  },
  {
    title: "Analyse des risques",
    url:"/dashboard/market", 
    icon : Umbrella , 
  },
  {
    title: "Actualités",
    url:"/dashboard/market", 
    icon : Newspaper  , 
  },
]



export function AppSidebar() {
  return (
    <Sidebar variant="inset" collapsible="icon"  className="bg-white">
      <SidebarHeader className="h-24">
         <SidebarMenuButton className="h-full flex justify-center">
                      <Wallet size={62}></Wallet>
                      <span className="text-2xl">POSA</span>
          </SidebarMenuButton>

         
      </SidebarHeader>
      <SidebarContent >
        {items.map(
          (item) =>(
            <SidebarMenuItem key = {item.title} className="list-none">
                <Link   href={item.url}>
                  <SidebarMenuButton >
                      <item.icon strokeWidth={2} size={42}></item.icon>
                      <span className="text-xl">{item.title}</span>
                  </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
          )
        )}
      </SidebarContent>
    </Sidebar>
  )
}