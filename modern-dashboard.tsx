"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  Megaphone,
  FolderOpen,
  FileText,
  Settings,
  Plus,
  Send,
  Search,
  Filter,
  Bell,
  MoreHorizontal,
  Users,
  Target,
  Calendar,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"

interface Project {
  id: string
  name: string
  status: "em_andamento" | "concluido" | "pausado" | "atrasado"
  responsible: string
  completion: number
  deadline: string
  priority: "alta" | "media" | "baixa"
}

interface Campaign {
  id: string
  name: string
  status: "ativa" | "pausada" | "finalizada"
  reach: number
  budget: number
  performance: number
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "Campanha Digital Q4",
    status: "em_andamento",
    responsible: "Ana Silva",
    completion: 75,
    deadline: "2024-12-30",
    priority: "alta",
  },
  {
    id: "2",
    name: "Redesign Website",
    status: "concluido",
    responsible: "Carlos Santos",
    completion: 100,
    deadline: "2024-12-15",
    priority: "media",
  },
  {
    id: "3",
    name: "Análise de Mercado",
    status: "atrasado",
    responsible: "Maria Costa",
    completion: 45,
    deadline: "2024-12-20",
    priority: "alta",
  },
  {
    id: "4",
    name: "Treinamento Equipe",
    status: "pausado",
    responsible: "João Oliveira",
    completion: 30,
    deadline: "2025-01-15",
    priority: "baixa",
  },
]

const mockCampaigns: Campaign[] = [
  { id: "1", name: "Black Friday 2024", status: "ativa", reach: 15420, budget: 50000, performance: 87 },
  { id: "2", name: "Natal Solidário", status: "ativa", reach: 8930, budget: 30000, performance: 92 },
  { id: "3", name: "Volta às Aulas", status: "finalizada", reach: 12500, budget: 25000, performance: 78 },
]

export default function ModernDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "campanhas", label: "Campanhas", icon: Megaphone },
    { id: "projetos", label: "Projetos", icon: FolderOpen },
    { id: "relatorios", label: "Relatórios", icon: FileText },
    { id: "configuracoes", label: "Configurações", icon: Settings },
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      em_andamento: { color: "bg-blue-50 text-blue-700 border-blue-200", label: "Em Andamento" },
      concluido: { color: "bg-green-50 text-green-700 border-green-200", label: "Concluído" },
      pausado: { color: "bg-yellow-50 text-yellow-700 border-yellow-200", label: "Pausado" },
      atrasado: { color: "bg-red-50 text-red-700 border-red-200", label: "Atrasado" },
      ativa: { color: "bg-green-50 text-green-700 border-green-200", label: "Ativa" },
      finalizada: { color: "bg-gray-50 text-gray-700 border-gray-200", label: "Finalizada" },
      alta: { color: "bg-red-50 text-red-700 border-red-200", label: "Alta" },
      media: { color: "bg-yellow-50 text-yellow-700 border-yellow-200", label: "Média" },
      baixa: { color: "bg-green-50 text-green-700 border-green-200", label: "Baixa" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: "bg-gray-50 text-gray-700 border-gray-200",
      label: status,
    }

    return <Badge className={`${config.color} hover:${config.color}`}>{config.label}</Badge>
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Projetos Ativos</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">24</p>
                <p className="text-xs text-blue-600 mt-1">+12% vs mês anterior</p>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Taxa de Conclusão</p>
                <p className="text-3xl font-bold text-green-900 mt-2">87%</p>
                <p className="text-xs text-green-600 mt-1">+5% vs mês anterior</p>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Campanhas Ativas</p>
                <p className="text-3xl font-bold text-purple-900 mt-2">8</p>
                <p className="text-xs text-purple-600 mt-1">2 finalizadas esta semana</p>
              </div>
              <div className="w-12 h-12 bg-purple-200 rounded-xl flex items-center justify-center">
                <Megaphone className="w-6 h-6 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Equipe Ativa</p>
                <p className="text-3xl font-bold text-orange-900 mt-2">156</p>
                <p className="text-xs text-orange-600 mt-1">8 novos membros</p>
              </div>
              <div className="w-12 h-12 bg-orange-200 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos de Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Performance Mensal</CardTitle>
            <CardDescription>Comparativo dos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"].map((month, index) => {
                const value = Math.floor(Math.random() * 40) + 60
                return (
                  <div key={month} className="flex items-center space-x-4">
                    <div className="w-8 text-sm font-medium text-gray-600">{month}</div>
                    <div className="flex-1">
                      <Progress value={value} className="h-3" />
                    </div>
                    <div className="w-12 text-sm font-medium text-gray-900">{value}%</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Campanhas em Destaque</CardTitle>
            <CardDescription>Top 3 campanhas por performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCampaigns.slice(0, 3).map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{campaign.name}</div>
                    <div className="text-sm text-gray-600">Alcance: {campaign.reach.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-600">{campaign.performance}%</div>
                    <div className="text-xs text-gray-500">Performance</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderProjetos = () => (
    <div className="space-y-6">
      {/* Header com Ações */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Projetos</h2>
          <p className="text-sm text-gray-600 mt-1">Gerencie todos os projetos da organização</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Send className="w-4 h-4 mr-2" />
            Enviar Relatório
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nova Campanha
          </Button>
        </div>
      </div>

      {/* Tabela de Projetos */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Projeto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Responsável
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conclusão
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prazo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioridade
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{project.name}</div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(project.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {project.responsible
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <span className="text-sm text-gray-900">{project.responsible}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <Progress value={project.completion} className="w-20 h-2" />
                        <span className="text-sm font-medium text-gray-900">{project.completion}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(project.deadline).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(project.priority)}</td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard()
      case "projetos":
        return renderProjetos()
      case "campanhas":
        return (
          <div className="text-center py-12">
            <Megaphone className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Campanhas</h3>
            <p className="text-gray-600">Seção em desenvolvimento</p>
          </div>
        )
      case "relatorios":
        return (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Relatórios</h3>
            <p className="text-gray-600">Seção em desenvolvimento</p>
          </div>
        )
      case "configuracoes":
        return (
          <div className="text-center py-12">
            <Settings className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Configurações</h3>
            <p className="text-gray-600">Seção em desenvolvimento</p>
          </div>
        )
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
              <p className="text-xs text-gray-500">Gestão Moderna</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-100"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">JS</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">João Silva</p>
              <p className="text-xs text-gray-500">Administrador</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar projetos, campanhas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 border-gray-200">
                  <Filter className="w-4 h-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="em_andamento">Em Andamento</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="pausado">Pausado</SelectItem>
                  <SelectItem value="atrasado">Atrasado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </Button>
              <Button variant="ghost" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Hoje
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">{renderContent()}</main>

        {/* Bottom Summary */}
        <footer className="bg-white border-t border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">24</div>
              <div className="text-sm text-gray-600">Projetos Ativos</div>
              <Progress value={75} className="mt-2 h-2" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">87%</div>
              <div className="text-sm text-gray-600">Taxa de Sucesso</div>
              <Progress value={87} className="mt-2 h-2" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-sm text-gray-600">Membros da Equipe</div>
              <Progress value={92} className="mt-2 h-2" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">8</div>
              <div className="text-sm text-gray-600">Campanhas Ativas</div>
              <Progress value={65} className="mt-2 h-2" />
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
