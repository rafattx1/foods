"use client"

import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Building2,
  Store,
  Users,
  Handshake,
  Megaphone,
  FileText,
  BarChart3,
  Settings,
  Upload,
  CheckSquare,
  AlertTriangle,
  UserCheck,
} from "lucide-react"
import type { User } from "../types"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  user: User
}

const getMenuItems = (role: User["role"]) => {
  const baseItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "campanhas", label: "Campanhas", icon: Megaphone },
    { id: "regionais", label: "Regionais", icon: Building2 },
    { id: "lojas", label: "Lojas", icon: Store },
    { id: "oscs", label: "OSCs", icon: Users },
    { id: "parcerias", label: "Parcerias", icon: Handshake },
  ]

  const operationalItems = [
    { id: "etl-upload", label: "Upload ETL", icon: Upload },
    { id: "validacao", label: "Validação Doações", icon: CheckSquare },
    { id: "suspensoes", label: "Suspensões", icon: AlertTriangle },
    { id: "confirmacoes", label: "Confirmações", icon: UserCheck },
    { id: "relatorios", label: "Relatórios", icon: FileText },
  ]

  const adminItems = [
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "configuracoes", label: "Configurações", icon: Settings },
  ]

  switch (role) {
    case "SuperAdmin":
      return [...baseItems, ...operationalItems, ...adminItems]
    case "OperacaoCF":
      return [...baseItems, ...operationalItems]
    case "ClienteGPA":
      return [baseItems[0], baseItems[1], { id: "relatorios", label: "Relatórios", icon: FileText }]
    default:
      return baseItems
  }
}

export function Sidebar({ activeSection, onSectionChange, user }: SidebarProps) {
  const menuItems = getMenuItems(user.role)

  return (
    <div className="w-64 bg-white h-full flex flex-col border-r border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Handshake className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-gray-900">GPA + CF</h1>
            <p className="text-xs text-gray-500">Gestão de Campanhas</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id

            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-blue-600" : "text-gray-400")} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600">{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-500">{user.role}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
