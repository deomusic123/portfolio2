"use client"

import * as React from "react"
import {
  Command,
  PieChart,
  Users,
  Zap,
  Settings2,
  FolderKanban,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

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
import { ROUTES } from "@/lib/constants"

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
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  const navMain = React.useMemo(
    () => [
      {
        title: "Overview",
        url: ROUTES.DASHBOARD,
        icon: PieChart,
      },
      {
        title: "Leads Engine",
        url: ROUTES.LEADS,
        icon: Users,
      },
      {
        title: "Projects",
        url: ROUTES.PROJECTS,
        icon: FolderKanban,
      },
      {
        title: "Automatizaciones",
        url: "/dashboard/automations",
        icon: Zap,
      },
      {
        title: "Configuración",
        url: "/dashboard/settings",
        icon: Settings2,
      },
    ],
    []
  )

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
            {navMain.map((item) => {
              const isActive = pathname.startsWith(item.url)
              return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive}
                  className="w-full justify-start"
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    <item.icon className="size-5" />
                    <span className="flex-1">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              )
            })}
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
