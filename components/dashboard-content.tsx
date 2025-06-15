"use client"

import { StoresTable } from "./stores-table"

interface DashboardContentProps {
  activeSection: string
}

export function DashboardContent({ activeSection }: DashboardContentProps) {
  const renderContent = () => {
    switch (activeSection) {
      case "lojas":
        return <StoresTable />
      case "regionais":
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Regionais</h2>
            <p className="text-gray-600">Seção em desenvolvimento</p>
          </div>
        )
      case "oscs":
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">OSCs</h2>
            <p className="text-gray-600">Seção em desenvolvimento</p>
          </div>
        )
      case "parcerias":
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Parcerias</h2>
            <p className="text-gray-600">Seção em desenvolvimento</p>
          </div>
        )
      case "campanhas":
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Campanhas</h2>
            <p className="text-gray-600">Seção em desenvolvimento</p>
          </div>
        )
      default:
        return <StoresTable />
    }
  }

  return <div className="flex-1 p-6 bg-gray-50">{renderContent()}</div>
}
