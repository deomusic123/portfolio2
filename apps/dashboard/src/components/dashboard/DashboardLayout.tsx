import { Sidebar } from './Sidebar';

/**
 * DashboardLayout - Layout wrapper for dashboard pages
 * Provides consistent structure with sidebar and main content area
 */
interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-black">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
