import { Sidebar } from '@/components/layout/sidebar'
import { DashboardGuard } from '@/components/layout/dashboard-guard'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardGuard>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64 flex flex-col min-h-screen">
          {children}
        </div>
      </div>
    </DashboardGuard>
  )
}
