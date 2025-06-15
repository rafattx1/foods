"use client"

import { DashboardJsonViewer } from "./components/dashboard-json-viewer"

export default function DashboardJsonPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <DashboardJsonViewer />
      </div>
    </div>
  )
}
