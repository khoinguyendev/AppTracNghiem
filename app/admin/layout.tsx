"use client"

import Sidebar from "@/components/admin/Sidebar"
import ProtectedRouteAdmin from "@/components/ProtectedRouterAdmin"

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRouteAdmin>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header (nếu có) */}
          {/* <Header /> */}

          <main className="flex-1 overflow-auto bg-gray-100 p-4">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRouteAdmin>

  )
}