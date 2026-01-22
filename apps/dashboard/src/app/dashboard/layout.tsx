import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@portfolio2/ui"
import { Separator, Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@portfolio2/ui"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    // defaultOpen={true} fuerza que arranque abierto y evita parpadeos
    <SidebarProvider defaultOpen={true}>
      
      {/* WRAPPER FLEX: Esto es lo que arregla el overlap. 
          Obliga a los hijos a estar uno al lado del otro. */}
      <div className="flex h-screen w-full overflow-hidden bg-zinc-950">
        
        {/* 1. SIDEBAR (Izquierda) */}
        <AppSidebar />
        
        {/* 2. CONTENIDO (Derecha) 
            SidebarInset ya maneja el flex-1, pero nos aseguramos. */}
        <SidebarInset className="flex-1 overflow-y-auto bg-zinc-950 transition-all duration-300 ease-in-out">
          
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-white/5 px-4 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger className="-ml-1 text-zinc-400" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-zinc-700" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white">Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          
          <div className="flex flex-1 flex-col gap-4 p-4">
            {children}
          </div>

        </SidebarInset>
      </div>
      
    </SidebarProvider>
  )
}
