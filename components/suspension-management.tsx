"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Ban, RotateCcw, Search, Filter, Eye, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import type { OSC, SuspensionAction } from "../types"

interface SuspensionManagementProps {
  userRole: string
}

const mockOSCs: OSC[] = [
  {
    id: "1",
    cnpj: "12.345.678/0001-90",
    nome: "Instituto Solidário",
    ativo: true,
    status_banimento: "ativo",
    created_at: "2024-01-15",
    updated_at: "2024-01-15",
    faltas_count: 2,
  },
  {
    id: "2",
    cnpj: "98.765.432/0001-10",
    nome: "ONG Esperança",
    ativo: false,
    status_banimento: "suspenso",
    justificativa_suspensao: "5 faltas consecutivas sem justificativa",
    created_at: "2024-01-10",
    updated_at: "2024-12-01",
    faltas_count: 5,
  },
  {
    id: "3",
    cnpj: "11.222.333/0001-44",
    nome: "Associação Vida Nova",
    ativo: true,
    status_banimento: "ativo",
    created_at: "2024-02-01",
    updated_at: "2024-02-01",
    faltas_count: 4,
  },
  {
    id: "4",
    cnpj: "55.666.777/0001-88",
    nome: "Centro Comunitário Unidos",
    ativo: false,
    status_banimento: "banido",
    justificativa_suspensao: "Comportamento inadequado e múltiplas violações",
    created_at: "2024-01-05",
    updated_at: "2024-11-15",
    faltas_count: 8,
  },
]

export function SuspensionManagement({ userRole }: SuspensionManagementProps) {
  const [oscs, setOSCs] = useState<OSC[]>(mockOSCs)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOSC, setSelectedOSC] = useState<OSC | null>(null)
  const [suspensionAction, setSuspensionAction] = useState<SuspensionAction>({
    osc_id: "",
    action: "suspend",
    justificativa: "",
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const canManageSuspensions = userRole !== "ClienteGPA"

  const filteredOSCs = oscs.filter((osc) => {
    const matchesSearch = osc.nome.toLowerCase().includes(searchTerm.toLowerCase()) || osc.cnpj.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || osc.status_banimento === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string, faltasCount = 0) => {
    switch (status) {
      case "ativo":
        if (faltasCount >= 4) {
          return (
            <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50">Ativo - Risco</Badge>
          )
        }
        return <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50">Ativo</Badge>
      case "suspenso":
        return <Badge className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50">Suspenso</Badge>
      case "banido":
        return <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50">Banido</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleSuspensionAction = async () => {
    if (!selectedOSC || !suspensionAction.justificativa.trim()) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedOSCs = oscs.map((osc) => {
        if (osc.id === selectedOSC.id) {
          let newStatus: OSC["status_banimento"] = osc.status_banimento
          let newAtivo = osc.ativo

          switch (suspensionAction.action) {
            case "suspend":
              newStatus = "suspenso"
              newAtivo = false
              break
            case "ban":
              newStatus = "banido"
              newAtivo = false
              break
            case "reactivate":
              newStatus = "ativo"
              newAtivo = true
              break
          }

          return {
            ...osc,
            status_banimento: newStatus,
            ativo: newAtivo,
            justificativa_suspensao: suspensionAction.justificativa,
            updated_at: new Date().toISOString(),
          }
        }
        return osc
      })

      setOSCs(updatedOSCs)
      setIsDialogOpen(false)
      setSuspensionAction({ osc_id: "", action: "suspend", justificativa: "" })
      setSelectedOSC(null)

      toast({
        title: "Ação Executada",
        description: `OSC ${suspensionAction.action === "suspend" ? "suspensa" : suspensionAction.action === "ban" ? "banida" : "reativada"} com sucesso`,
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao executar a ação",
        variant: "destructive",
      })
    }
  }

  const openSuspensionDialog = (osc: OSC, action: SuspensionAction["action"]) => {
    setSelectedOSC(osc)
    setSuspensionAction({
      osc_id: osc.id,
      action,
      justificativa: "",
      faltas_count: osc.faltas_count,
    })
    setIsDialogOpen(true)
  }

  const automaticSuspensionCandidates = oscs.filter(
    (osc) => osc.status_banimento === "ativo" && (osc.faltas_count || 0) >= 5,
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Controle de Suspensões</h1>
          <p className="text-sm text-gray-600 mt-1">Gerencie suspensões e banimentos de OSCs</p>
        </div>
      </div>

      {/* Alertas de Suspensão Automática */}
      {automaticSuspensionCandidates.length > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription>
            <div className="font-medium text-orange-800 mb-2">
              {automaticSuspensionCandidates.length} OSC(s) com 5+ faltas - Suspensão Automática Pendente
            </div>
            <div className="space-y-1">
              {automaticSuspensionCandidates.map((osc) => (
                <div key={osc.id} className="text-sm text-orange-700">
                  • {osc.nome} ({osc.faltas_count} faltas)
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">OSCs Ativas</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">
                  {oscs.filter((osc) => osc.status_banimento === "ativo").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">OSCs Suspensas</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">
                  {oscs.filter((osc) => osc.status_banimento === "suspenso").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">OSCs Banidas</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">
                  {oscs.filter((osc) => osc.status_banimento === "banido").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Em Risco</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">
                  {oscs.filter((osc) => osc.status_banimento === "ativo" && (osc.faltas_count || 0) >= 4).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por nome ou CNPJ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 border-gray-200">
            <Filter className="w-4 h-4 mr-2 text-gray-400" />
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="suspenso">Suspenso</SelectItem>
            <SelectItem value="banido">Banido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabela de OSCs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OSC</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CNPJ</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Faltas
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Atualização
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOSCs.map((osc) => (
                <tr key={osc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{osc.nome}</div>
                      {osc.justificativa_suspensao && (
                        <div className="text-xs text-gray-500 mt-1">{osc.justificativa_suspensao}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{osc.cnpj}</td>
                  <td className="px-6 py-4">{getStatusBadge(osc.status_banimento, osc.faltas_count)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-900">{osc.faltas_count || 0}</span>
                      {(osc.faltas_count || 0) >= 4 && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(osc.updated_at).toLocaleDateString("pt-BR")}
                  </td>
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
                        {canManageSuspensions && (
                          <>
                            {osc.status_banimento === "ativo" && (
                              <>
                                <DropdownMenuItem onClick={() => openSuspensionDialog(osc, "suspend")}>
                                  <Ban className="mr-2 h-4 w-4" />
                                  Suspender
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openSuspensionDialog(osc, "ban")}>
                                  <AlertTriangle className="mr-2 h-4 w-4" />
                                  Banir
                                </DropdownMenuItem>
                              </>
                            )}
                            {(osc.status_banimento === "suspenso" || osc.status_banimento === "banido") && (
                              <DropdownMenuItem onClick={() => openSuspensionDialog(osc, "reactivate")}>
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Reativar
                              </DropdownMenuItem>
                            )}
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog de Ação de Suspensão */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {suspensionAction.action === "suspend"
                ? "Suspender OSC"
                : suspensionAction.action === "ban"
                  ? "Banir OSC"
                  : "Reativar OSC"}
            </DialogTitle>
            <DialogDescription>
              {suspensionAction.action === "suspend"
                ? "A OSC será suspensa temporariamente"
                : suspensionAction.action === "ban"
                  ? "A OSC será banida permanentemente"
                  : "A OSC será reativada no sistema"}
            </DialogDescription>
          </DialogHeader>

          {selectedOSC && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium">{selectedOSC.nome}</div>
                <div className="text-sm text-gray-600">CNPJ: {selectedOSC.cnpj}</div>
                <div className="text-sm text-gray-600">Faltas: {selectedOSC.faltas_count || 0}</div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="justificativa">Justificativa *</Label>
                <Textarea
                  id="justificativa"
                  placeholder="Descreva o motivo da ação..."
                  value={suspensionAction.justificativa}
                  onChange={(e) => setSuspensionAction({ ...suspensionAction, justificativa: e.target.value })}
                  rows={4}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleSuspensionAction}
                  variant={suspensionAction.action === "ban" ? "destructive" : "default"}
                >
                  Confirmar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
