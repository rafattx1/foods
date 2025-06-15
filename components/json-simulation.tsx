"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Database,
  Users,
  Building2,
  Store,
  Handshake,
  Megaphone,
  Scale,
  AlertTriangle,
  RefreshCw,
  Download,
  Eye,
  CheckCircle,
} from "lucide-react"
import mockData from "../data/mock-data.json"

export function JsonSimulation() {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Simulate API loading
  const simulateApiCall = async (entityType: string) => {
    setIsLoading(true)
    setSelectedEntity(entityType)
    setSelectedItem(null)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsLoading(false)
  }

  const getEntityIcon = (entityType: string) => {
    const icons = {
      users: Users,
      regionais: Building2,
      lojas: Store,
      oscs: Users,
      parcerias: Handshake,
      campanhas: Megaphone,
      doacoes: Scale,
      faltas: AlertTriangle,
      dashboard_metrics: Database,
      etl_logs: RefreshCw,
      validation_results: CheckCircle,
    }
    return icons[entityType as keyof typeof icons] || Database
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ativo: { color: "bg-green-50 text-green-700 border-green-200", label: "Ativo" },
      inativo: { color: "bg-red-50 text-red-700 border-red-200", label: "Inativo" },
      suspenso: { color: "bg-orange-50 text-orange-700 border-orange-200", label: "Suspenso" },
      banido: { color: "bg-red-50 text-red-700 border-red-200", label: "Banido" },
      planejamento: { color: "bg-blue-50 text-blue-700 border-blue-200", label: "Planejamento" },
      ativa: { color: "bg-green-50 text-green-700 border-green-200", label: "Ativa" },
      encerrada: { color: "bg-gray-50 text-gray-700 border-gray-200", label: "Encerrada" },
      concluido: { color: "bg-green-50 text-green-700 border-green-200", label: "Concluído" },
      erro: { color: "bg-red-50 text-red-700 border-red-200", label: "Erro" },
      completa: { color: "bg-blue-50 text-blue-700 border-blue-200", label: "Completa" },
      amostragem: { color: "bg-purple-50 text-purple-700 border-purple-200", label: "Amostragem" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: "bg-gray-50 text-gray-700 border-gray-200",
      label: status,
    }

    return <Badge className={`${config.color} hover:${config.color}`}>{config.label}</Badge>
  }

  const entityTypes = [
    { key: "users", label: "Usuários", count: mockData.users.length },
    { key: "regionais", label: "Regionais", count: mockData.regionais.length },
    { key: "lojas", label: "Lojas", count: mockData.lojas.length },
    { key: "oscs", label: "OSCs", count: mockData.oscs.length },
    { key: "parcerias", label: "Parcerias", count: mockData.parcerias.length },
    { key: "campanhas", label: "Campanhas", count: mockData.campanhas.length },
    { key: "doacoes", label: "Doações", count: mockData.doacoes.length },
    { key: "faltas", label: "Faltas", count: mockData.faltas.length },
    { key: "dashboard_metrics", label: "Métricas", count: 1 },
    { key: "etl_logs", label: "Logs ETL", count: mockData.etl_logs.length },
    { key: "validation_results", label: "Validações", count: mockData.validation_results.length },
  ]

  const renderEntityList = (entityType: string) => {
    const data = mockData[entityType as keyof typeof mockData]

    if (entityType === "dashboard_metrics") {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(data as any).map(([key, value]) => (
              <div key={key} className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-600 capitalize">{key.replace(/_/g, " ")}</div>
                <div className="text-lg font-semibold text-gray-900">
                  {typeof value === "number" ? value.toLocaleString() : String(value)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (!Array.isArray(data)) return null

    return (
      <div className="space-y-2">
        {data.map((item: any, index: number) => (
          <div
            key={item.id || index}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => setSelectedItem(item)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {item.nome || item.name || item.arquivo || `Item ${index + 1}`}
                </div>
                {item.email && <div className="text-sm text-gray-600">{item.email}</div>}
                {item.cnpj && <div className="text-sm text-gray-600">CNPJ: {item.cnpj}</div>}
                {item.endereco_principal && <div className="text-sm text-gray-600">{item.endereco_principal}</div>}
              </div>
              <div className="flex items-center space-x-2">
                {item.status && getStatusBadge(item.status)}
                {item.ativo !== undefined && getStatusBadge(item.ativo ? "ativo" : "inativo")}
                {item.status_banimento && getStatusBadge(item.status_banimento)}
                {item.modo_validacao && getStatusBadge(item.modo_validacao)}
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

  const renderItemDetails = (item: any) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Detalhes do Item</h3>
          <Button variant="outline" size="sm" onClick={() => setSelectedItem(null)}>
            Fechar
          </Button>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <pre className="text-sm text-gray-800 whitespace-pre-wrap overflow-auto">{JSON.stringify(item, null, 2)}</pre>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Simulação JSON</h1>
          <p className="text-sm text-gray-600 mt-1">Visualize todos os dados JSON do sistema</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar JSON
          </Button>
          <Button size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Recarregar
          </Button>
        </div>
      </div>

      {/* Entity Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {entityTypes.map((entity) => {
          const Icon = getEntityIcon(entity.key)
          const isSelected = selectedEntity === entity.key

          return (
            <Card
              key={entity.key}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => simulateApiCall(entity.key)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isSelected ? "bg-blue-100" : "bg-gray-100"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? "text-blue-600" : "text-gray-600"}`} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{entity.label}</div>
                    <div className="text-lg font-semibold text-gray-900">{entity.count}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Data Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Entity List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {selectedEntity && (
                  <>
                    {(() => {
                      const Icon = getEntityIcon(selectedEntity)
                      return <Icon className="w-5 h-5" />
                    })()}
                    <span>{entityTypes.find((e) => e.key === selectedEntity)?.label || "Dados"}</span>
                  </>
                )}
                {!selectedEntity && <span>Selecione uma entidade</span>}
              </CardTitle>
              <CardDescription>
                {selectedEntity
                  ? `Visualize todos os registros de ${entityTypes.find((e) => e.key === selectedEntity)?.label.toLowerCase()}`
                  : "Clique em uma das entidades acima para visualizar os dados"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Carregando dados...</span>
                </div>
              ) : selectedEntity ? (
                <ScrollArea className="h-96">{renderEntityList(selectedEntity)}</ScrollArea>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Database className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhuma entidade selecionada</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Item Details */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>JSON Raw</CardTitle>
              <CardDescription>
                {selectedItem ? "Dados completos do item selecionado" : "Selecione um item para ver os detalhes"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedItem ? (
                <ScrollArea className="h-96">{renderItemDetails(selectedItem)}</ScrollArea>
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

      {/* JSON Structure Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Estrutura Completa do JSON</CardTitle>
          <CardDescription>Visão geral de toda a estrutura de dados do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="structure" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="structure">Estrutura</TabsTrigger>
              <TabsTrigger value="raw">JSON Completo</TabsTrigger>
            </TabsList>

            <TabsContent value="structure" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {entityTypes.map((entity) => {
                  const Icon = getEntityIcon(entity.key)
                  return (
                    <div key={entity.key} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Icon className="w-4 h-4 text-gray-600" />
                        <span className="font-medium">{entity.label}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {entity.count} registro{entity.count !== 1 ? "s" : ""}
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="raw">
              <ScrollArea className="h-96">
                <pre className="text-xs text-gray-800 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                  {JSON.stringify(mockData, null, 2)}
                </pre>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
