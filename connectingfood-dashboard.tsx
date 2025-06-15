"use client"

import { useState } from "react"
import { Sidebar } from "./components/sidebar"
import { DashboardContent } from "./components/dashboard-content"

export default function ConnectingFoodDashboard() {
  const [activeSection, setActiveSection] = useState("lojas")

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <DashboardContent activeSection={activeSection} />
    </div>
  )
}
