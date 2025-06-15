"use client"

import { useState } from "react"
import { Sidebar } from "./components/sidebar"
import { DashboardOverview } from "./components/dashboard-overview"
import { CampaignsTable } from "./components/campaigns-table"
import { ETLUpload } from "./components/etl-upload"
import { SuspensionManagement } from "./components/suspension-management"
import { CampaignPlanning } from "./components/campaign-planning"
import { DonationValidation } from "./components/donation-validation"
import type { User, DashboardMetrics, Campanha } from "./types"

// Mock data
const mockUser: User = {
  id: "1",
  name: "João Silva",
  email: "joao@connectingfood.com",
  role: "OperacaoCF",
  created_at: "2024-01-01",
  updated_at: "2024-01-01",
}

const mockMetrics: DashboardMetrics = {
  total_campanhas: 24,
  campanhas_ativas: 3,
  total_doacoes_kg: 15420,
  oscs_ativas: 89,
  oscs_suspensas: 5,
  oscs_banidas: 2,
  lojas_ativas: 156,
  taxa_confirmacao: 87,
  faltas_mes_atual: 12,
}

const mockCampaigns: Campanha[] = [
  {
    id: "1",
    nome: "Campanha Natal 2024",
    data: "2024-12-15",
    status: "ativa",
    created_at: "2024-11-01",
    updated_at: "2024-12-01",
    lojas_participantes: 45,
    oscs_confirmadas: 38,
    total_doacoes_kg: 2340,
  },
  {
    id: "2",
    nome: "Ação Solidária Novembro",
    data: "2024-11-20",
    status: "encerrada",
    created_at: "2024-10-15",
    updated_at: "2024-11-25",
    lojas_participantes: 32,
    oscs_confirmadas: 29,
    total_doacoes_kg: 1890,
  },
  {
    id: "3",
    nome: "Campanha Páscoa 2025",
    data: "2025-03-30",
    status: "planejamento",
    created_at: "2024-12-01",
    updated_at: "2024-12-01",
    lojas_participantes: 0,
    oscs_confirmadas: 0,
    total_doacoes_kg: 0,
  },
]

export default function DonationPlatform() {
  const [activeSection, setActiveSection] = useState("dashboard")

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview metrics={mockMetrics} recentCampaigns={mockCampaigns} />
      case "campanhas":
        return <CampaignsTable campaigns={mockCampaigns} userRole={mockUser.role} />
      case "planejamento":
        return <CampaignPlanning userRole={mockUser.role} />
      case "etl-upload":
        return <ETLUpload />
      case "validacao":
        return <DonationValidation userRole={mockUser.role} />
      case "suspensoes":
        return <SuspensionManagement userRole={mockUser.role} />
      case "regionais":
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Regionais</h2>
            <p className="text-gray-600">Gestão de regionais em desenvolvimento</p>
          </div>
        )
      case "lojas":
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Lojas</h2>
            <p className="text-gray-600">Gestão de lojas em desenvolvimento</p>
          </div>
        )
      case "oscs":
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">OSCs</h2>
            <p className="text-gray-600">Gestão de OSCs em desenvolvimento</p>
          </div>
        )
      case "parcerias":
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Parcerias</h2>
            <p className="text-gray-600">Gestão de parcerias em desenvolvimento</p>
          </div>
        )
      case "confirmacoes":
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Confirmações</h2>
            <p className="text-gray-600">Sistema de confirmações em desenvolvimento</p>
          </div>
        )
      case "relatorios":
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Relatórios</h2>
            <p className="text-gray-600">Sistema de relatórios em desenvolvimento</p>
          </div>
        )
      case "analytics":
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Analytics</h2>
            <p className="text-gray-600">Analytics avançados em desenvolvimento</p>
          </div>
        )
      case "configuracoes":
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Configurações</h2>
            <p className="text-gray-600">Configurações do sistema em desenvolvimento</p>
          </div>
        )
      default:
        return <DashboardOverview metrics={mockMetrics} recentCampaigns={mockCampaigns} />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} user={mockUser} />
      <main className="flex-1 overflow-auto">
        <div className="p-6">{renderContent()}</div>
      </main>
    </div>
  )
}
