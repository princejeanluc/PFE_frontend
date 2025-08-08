'use client'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"

import { ChartNetwork, ChartNoAxesCombined, Newspaper, Umbrella, Wallet  } from 'lucide-react'
import Link from 'next/link'
const items = [
  {
    title: "Marché crypto",
    url:"/dashboard/market", 
    icon :  <ChartNoAxesCombined className="h-32 w-32" strokeWidth={2} />, 
  },
  {
    title: "Simulation",
    url:"/dashboard/simulation", 
    icon :  <ChartNetwork style={{height: 16, width:16}} strokeWidth={2} />, 
  },
  {
    title: "Analyse des risques",
    url:"/dashboard/risk", 
    icon :  <Umbrella style={{height: 16, width:16}} strokeWidth={2} />, 
  },
  {
    title: "Actualités",
    url:"/dashboard/market", 
    icon : <Newspaper style={{height: 16, width:16}} strokeWidth={2} /> , 
  },
]



export function AppSidebar() {
  return (
    <Sidebar variant="inset" collapsible="icon"  className="bg-white">
      <SidebarHeader className="h-24">
         <SidebarMenuButton className="h-full flex justify-center">
                      <Wallet className="h-32 w-32"></Wallet>
                      <span className="text-2xl">POSA</span>
          </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent >
        {items.map(
          (item) =>(
            <SidebarMenuItem key = {item.title} className="list-none">
                <Link   href={item.url}>
                  <SidebarMenuButton className="h-12" >
                      {item.icon}
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