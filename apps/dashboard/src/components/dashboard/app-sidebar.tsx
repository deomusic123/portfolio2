"use client"

import * as React from "react"
import {
  Command,
  PieChart,
  Users,
  Zap,
  Settings2,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@portfolio2/ui"

// Datos de navegación (Centralizados)
const data = {
  user: {
    name: "Admin Agency",
    email: "admin@portfolio2.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Portfolio2 HQ",
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: PieChart,
      isActive: true,
    },
    {
      title: "Leads Engine",
      url: "/dashboard/leads",
      icon: Users, // Aquí vivirá el Kanban y el Enriquecimiento
    },
    {
      title: "Automatizaciones",
      url: "/dashboard/automations",
      icon: Zap, // Aquí veremos el estado de n8n
    },
    {
      title: "Configuración",
      url: "/dashboard/settings",
      icon: Settings2,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Command className="size-4" />
              </div>
              <div className="flex flex-col flex-1 text-left text-sm leading-tight overflow-hidden">
                <span className="truncate font-semibold">AgencyOS</span>
                <span className="truncate text-xs text-sidebar-foreground/70">v1.0.0</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent className="px-2 py-4">
         <SidebarMenu className="gap-1">
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  isActive={item.isActive}
                  className="w-full justify-start"
                >
                  <a href={item.url} className="flex items-center gap-3">
                    <item.icon className="size-5" />
                    <span className="flex-1">{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
         </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-sidebar-border mt-auto">
        <div className="p-3 text-xs text-sidebar-foreground/70">
          user: admin
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
