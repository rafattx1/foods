"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import {
  BarChart3,
  Users,
  Store,
  AlertTriangle,
  Clock,
  TrendingUp,
  Download,
  Search,
  Eye,
  RefreshCw,
  FileText,
  Settings,
} from "lucide-react"
import dashboardData from "../data/dashboard-data.json"

export function DashboardJsonViewer() {
  const [selectedSection, setSelectedSection] = useState<string>("dashboard_overview")
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const sections = [
    { key: "dashboard_overview", label: "Visão Geral", icon: BarChart3, color: "bg-blue-50 text-blue-700" },
    { key: "acoes_rapidas", label: "Ações Rápidas", icon: Clock, color: "bg-orange-50 text-orange-700" },
    { key: "participantes_campanha", label: "Participantes", icon: Users, color: "bg-green-50 text-green-700" },
    { key: "lojas_participantes", label: "Lojas", icon: Store, color: "bg-purple-50 text-purple-700" },
    { key: "historico_doacoes", label: "Histórico", icon: FileText, color: "bg-indigo-50 text-indigo-700" },
    { key: "alertas_sistema", label: "Alertas", icon: AlertTriangle, color: "bg-red-50 text-red-700" },
    { key: "relatorios_disponiveis", label: "Relatórios", icon: Download, color: "bg-gray-50 text-gray-700" },
    { key: "usuarios_sistema", label: "Usuários", icon: Users, color: "bg-teal-50 text-teal-700" },
    { key: "estatisticas_tempo_real", label: "Tempo Real", icon: TrendingUp, color: "bg-emerald-50 text-emerald-700" },
    { key: "configuracoes_sistema", label: "Configurações", icon: Settings, color: "bg-slate-50 text-slate-700" },
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ativo: { color: "bg-green-50 text-green-700 border-green-200", label: "Ativo" },
      inativo: { color: "bg-red-50 text-red-700 border-red-200", label: "Inativo" },
      pendente: { color: "bg-yellow-50 text-yellow-700 border-yellow-200", label: "Pendente" },
      confirmado: { color: "bg-green-50 text-green-700 border-green-200", label: "Confirmado" },
      rejeitado: { color: "bg-red-50 text-red-700 border-red-200", label: "Rejeitado" },
      em_analise: { color: "bg-blue-50 text-blue-700 border-blue-200", label: "Em Análise" },
      validado: { color: "bg-green-50 text-green-700 border-green-200", label: "Validado" },
      manutencao: { color: "bg-orange-50 text-orange-700 border-orange-200", label: "Manutenção" },
      disponivel: { color: "bg-blue-50 text-blue-700 border-blue-200", label: "Disponível" },
      processando: { color: "bg-yellow-50 text-yellow-700 border-yellow-200", label: "Processando" },
      critico: { color: "bg-red-50 text-red-700 border-red-200", label: "Crítico" },
      aviso: { color: "bg-yellow-50 text-yellow-700 border-yellow-200", label: "Aviso" },
      info: { color: "bg-blue-50 text-blue-700 border-blue-200", label: "Info" },
      resolvido: { color: "bg-gray-50 text-gray-700 border-gray-200", label: "Resolvido" },
      alta: { color: "bg-red-50 text-red-700 border-red-200", label: "Alta" },
      media: { color: "bg-yellow-50 text-yellow-700 border-yellow-200", label: "Média" },
      baixa: { color: "bg-green-50 text-green-700 border-green-200", label: "Baixa" },
      atrasado: { color: "bg-red-50 text-red-700 border-red-200", label: "Atrasado" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: "bg-gray-50 text-gray-700 border-gray-200",
      label: status,
    }

    return <Badge className={`${config.color} hover:${config.color}`}>{config.label}</Badge>
  }

  const simulateApiCall = async (sectionKey: string) => {
    setIsLoading(true)
    setSelectedSection(sectionKey)
    setSelectedItem(null)
    await new Promise((resolve) => setTimeout(resolve, 600))
    setIsLoading(false)
  }

  const renderSectionContent = (sectionKey: string) => {
    const data = dashboardData[sectionKey as keyof typeof dashboardData]

    if (sectionKey === "dashboard_overview") {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">{data.metrics.total_alimentos}</div>
              <div className="text-sm text-blue-600">Total Alimentos</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">{data.metrics.total_ativos}</div>
              <div className="text-sm text-green-600">Total Ativos</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">{data.metrics.campanhas_ativas}</div>
              <div className="text-sm text-purple-600">Campanhas Ativas</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-700">{data.metrics.taxa_sucesso}</div>
              <div className="text-sm text-orange-600">Taxa de Sucesso</div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{data.campanha_dezembro_2024.nome}</CardTitle>
              <CardDescription>Status: {getStatusBadge(data.campanha_dezembro_2024.status)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-lg font-semibold">{data.campanha_dezembro_2024.total_participantes}</div>
                  <div className="text-sm text-gray-600">Total Participantes</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-green-600">{data.campanha_dezembro_2024.confirmados}</div>
                  <div className="text-sm text-gray-600">Confirmados</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-yellow-600">{data.campanha_dezembro_2024.pendentes}</div>
                  <div className="text-sm text-gray-600">Pendentes</div>
                </div>
                <div>
                  <div className="text-lg font-semibold">{data.campanha_dezembro_2024.data_inicio}</div>
                  <div className="text-sm text-gray-600">Data Início</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    if (sectionKey === "estatisticas_tempo_real") {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Hoje</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Doações (kg)</span>
                    <span className="font-semibold">{data.doacoes_hoje.quantidade_kg}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Coletas</span>
                    <span className="font-semibold">{data.doacoes_hoje.numero_coletas}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">OSCs Ativas</span>
                    <span className="font-semibold">{data.doacoes_hoje.oscs_ativas}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Esta Semana</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Doações (kg)</span>
                    <span className="font-semibold">{data.esta_semana.quantidade_kg.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Coletas</span>
                    <span className="font-semibold">{data.esta_semana.numero_coletas}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">OSCs Ativas</span>
                    <span className="font-semibold">{data.esta_semana.oscs_ativas}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Este Mês</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Doações (kg)</span>
                    <span className="font-semibold">{data.este_mes.quantidade_kg.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Coletas</span>
                    <span className="font-semibold">{data.este_mes.numero_coletas}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Crescimento</span>
                    <span className="font-semibold text-green-600">{data.comparativo_mes_anterior.crescimento_kg}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    if (!Array.isArray(data)) return null

    const filteredData = data.filter((item: any) => {
      if (!searchTerm) return true
      const searchableFields = [item.nome, item.titulo, item.descricao, item.email, item.tipo, item.status]
      return searchableFields.some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()))
    })

    return (
      <div className="space-y-4">
        {filteredData.map((item: any, index: number) => (
          <div
            key={item.id || index}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => setSelectedItem(item)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {item.nome || item.titulo || item.loja || `Item ${index + 1}`}
                </div>
                {item.descricao && <div className="text-sm text-gray-600 mt-1">{item.descricao}</div>}
                {item.endereco && <div className="text-sm text-gray-600 mt-1">{item.endereco}</div>}
                {item.email && <div className="text-sm text-gray-600 mt-1">{item.email}</div>}
                {item.observacoes && <div className="text-sm text-gray-500 mt-1">{item.observacoes}</div>}
              </div>
              <div className="flex items-center space-x-2">
                {item.status && getStatusBadge(item.status)}
                {item.prioridade && getStatusBadge(item.prioridade)}
                {item.tipo && <Badge variant="outline">{item.tipo}</Badge>}
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard JSON - Dados Reais</h1>
          <p className="text-sm text-gray-600 mt-1">Visualização completa dos dados do sistema baseado nas telas</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Section Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {sections.map((section) => {
          const Icon = section.icon
          const isSelected = selectedSection === section.key
          const data = dashboardData[section.key as keyof typeof dashboardData]
          const count = Array.isArray(data) ? data.length : 1

          return (
            <Card
              key={section.key}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => simulateApiCall(section.key)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${section.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{section.label}</div>
                    <div className="text-lg font-semibold text-gray-900">{count}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Data Display */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    {selectedSection && (
                      <>
                        {(() => {
                          const section = sections.find((s) => s.key === selectedSection)
                          const Icon = section?.icon || BarChart3
                          return <Icon className="w-5 h-5" />
                        })()}
                        <span>{sections.find((s) => s.key === selectedSection)?.label || "Dados"}</span>
                      </>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {selectedSection
                      ? `Dados detalhados de ${sections.find((s) => s.key === selectedSection)?.label.toLowerCase()}`
                      : "Selecione uma seção para visualizar os dados"}
                  </CardDescription>
                </div>
                {selectedSection && Array.isArray(dashboardData[selectedSection as keyof typeof dashboardData]) && (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Carregando dados...</span>
                </div>
              ) : selectedSection ? (
                <ScrollArea className="h-96">{renderSectionContent(selectedSection)}</ScrollArea>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Selecione uma seção para visualizar os dados</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Item Details */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Detalhes JSON</CardTitle>
              <CardDescription>
                {selectedItem ? "Dados completos do item selecionado" : "Clique em um item para ver os detalhes"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedItem ? (
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Item Selecionado</h3>
                      <Button variant="outline" size="sm" onClick={() => setSelectedItem(null)}>
                        Fechar
                      </Button>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <pre className="text-sm text-gray-800 whitespace-pre-wrap overflow-auto">
                        {JSON.stringify(selectedItem, null, 2)}
                      </pre>
                    </div>
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhum item selecionado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Full JSON View */}
      <Card>
        <CardHeader>
          <CardTitle>JSON Completo do Dashboard</CardTitle>
          <CardDescription>Estrutura completa de todos os dados baseados nas telas do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="formatted" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="formatted">Formatado</TabsTrigger>
              <TabsTrigger value="raw">Raw JSON</TabsTrigger>
            </TabsList>

            <TabsContent value="formatted" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sections.map((section) => {
                  const Icon = section.icon
                  const data = dashboardData[section.key as keyof typeof dashboardData]
                  const count = Array.isArray(data) ? data.length : 1

                  return (
                    <div key={section.key} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Icon className="w-4 h-4 text-gray-600" />
                        <span className="font-medium">{section.label}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {count} item{count !== 1 ? "s" : ""}
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="raw">
              <ScrollArea className="h-96">
                <pre className="text-xs text-gray-800 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                  {JSON.stringify(dashboardData, null, 2)}
                </pre>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
