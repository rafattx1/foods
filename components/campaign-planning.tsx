"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CalendarIcon, Plus, Star, Users, Store, CheckCircle, Eye, Megaphone } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"
import type { Campanha, Loja, OSC, Parceria, CampanhaLoja } from "../types"

interface CampaignPlanningProps {
  userRole: string
}

const mockLojas: Loja[] = [
  {
    id: "1",
    nome: "Extra Centro",
    endereco_principal: "Rua A, 123",
    ativo: true,
    regional_id: "1",
    created_at: "",
    updated_at: "",
  },
  {
    id: "2",
    nome: "Pão de Açúcar Vila",
    endereco_principal: "Av. B, 456",
    ativo: true,
    regional_id: "1",
    created_at: "",
    updated_at: "",
  },
  {
    id: "3",
    nome: "Extra Norte",
    endereco_principal: "Rua C, 789",
    ativo: true,
    regional_id: "2",
    created_at: "",
    updated_at: "",
  },
]

const mockOSCs: OSC[] = [
  {
    id: "1",
    cnpj: "12.345.678/0001-90",
    nome: "Instituto Solidário",
    ativo: true,
    status_banimento: "ativo",
    created_at: "",
    updated_at: "",
  },
  {
    id: "2",
    cnpj: "98.765.432/0001-10",
    nome: "ONG Esperança",
    ativo: true,
    status_banimento: "ativo",
    created_at: "",
    updated_at: "",
  },
  {
    id: "3",
    cnpj: "11.222.333/0001-44",
    nome: "Associação Vida Nova",
    ativo: true,
    status_banimento: "ativo",
    created_at: "",
    updated_at: "",
  },
]

const mockParcerias: Parceria[] = [
  {
    id: "1",
    loja_id: "1",
    osc_id: "1",
    favorita: true,
    ativa: true,
    status_suspensao: false,
    created_at: "",
    updated_at: "",
  },
  {
    id: "2",
    loja_id: "1",
    osc_id: "2",
    favorita: false,
    ativa: true,
    status_suspensao: false,
    created_at: "",
    updated_at: "",
  },
  {
    id: "3",
    loja_id: "2",
    osc_id: "1",
    favorita: true,
    ativa: true,
    status_suspensao: false,
    created_at: "",
    updated_at: "",
  },
  {
    id: "4",
    loja_id: "2",
    osc_id: "3",
    favorita: false,
    ativa: true,
    status_suspensao: false,
    created_at: "",
    updated_at: "",
  },
  {
    id: "5",
    loja_id: "3",
    osc_id: "2",
    favorita: true,
    ativa: true,
    status_suspensao: false,
    created_at: "",
    updated_at: "",
  },
]

export function CampaignPlanning({ userRole }: CampaignPlanningProps) {
  const [campanhas, setCampanhas] = useState<Campanha[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [selectedCampanha, setSelectedCampanha] = useState<Campanha | null>(null)
  const [campanhaLoja, setCampanhaLoja] = useState<CampanhaLoja[]>([])
  const [newCampanha, setNewCampanha] = useState({
    nome: "",
    data: undefined as Date | undefined,
    status: "planejamento" as const,
  })
  const { toast } = useToast()

  const canCreateCampaigns = userRole !== "ClienteGPA"

  const createCampanha = async () => {
    if (!newCampanha.nome || !newCampanha.data) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    try {
      const campanha: Campanha = {
        id: Date.now().toString(),
        nome: newCampanha.nome,
        data: newCampanha.data.toISOString(),
        status: "planejamento",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Alocação automática de OSCs favoritas
      const alocacaoAutomatica: CampanhaLoja[] = []

      mockLojas.forEach((loja) => {
        const parceriasFavoritas = mockParcerias.filter(
          (p) => p.loja_id === loja.id && p.favorita && p.ativa && !p.status_suspensao,
        )

        parceriasFavoritas.forEach((parceria) => {
          const osc = mockOSCs.find((o) => o.id === parceria.osc_id && o.ativo && o.status_banimento === "ativo")
          if (osc) {
            alocacaoAutomatica.push({
              id: `${campanha.id}-${loja.id}-${osc.id}`,
              campanha_id: campanha.id,
              loja_id: loja.id,
              osc_id: osc.id,
              confirmada: false,
              status_prospecao: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
          }
        })
      })

      setCampanhas([...campanhas, campanha])
      setCampanhaLoja([...campanhaLoja, ...alocacaoAutomatica])
      setNewCampanha({ nome: "", data: undefined, status: "planejamento" })
      setIsCreating(false)

      toast({
        title: "Campanha Criada",
        description: `${alocacaoAutomatica.length} OSCs favoritas alocadas automaticamente`,
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao criar campanha",
        variant: "destructive",
      })
    }
  }

  const getCampanhaDetails = (campanha: Campanha) => {
    const campanhaLojas = campanhaLoja.filter((cl) => cl.campanha_id === campanha.id)
    const lojas = campanhaLojas.map((cl) => mockLojas.find((l) => l.id === cl.loja_id)).filter(Boolean)
    const oscs = campanhaLojas.map((cl) => mockOSCs.find((o) => o.id === cl.osc_id)).filter(Boolean)
    const confirmadas = campanhaLojas.filter((cl) => cl.confirmada).length

    return {
      campanhaLojas,
      lojas: lojas as Loja[],
      oscs: oscs as OSC[],
      confirmadas,
      total: campanhaLojas.length,
    }
  }

  const updateProspeccao = (campanhaLojaId: string, status: boolean, observacao?: string) => {
    setCampanhaLoja(
      campanhaLoja.map((cl) =>
        cl.id === campanhaLojaId
          ? { ...cl, status_prospecao: status, observacao_prospecao: observacao, updated_at: new Date().toISOString() }
          : cl,
      ),
    )
  }

  const ativarCampanha = (campanhaId: string) => {
    setCampanhas(
      campanhas.map((c) =>
        c.id === campanhaId ? { ...c, status: "ativa" as const, updated_at: new Date().toISOString() } : c,
      ),
    )

    toast({
      title: "Campanha Ativada",
      description: "A campanha foi ativada com sucesso",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Planejamento de Campanhas</h2>
          <p className="text-gray-600">Crie e gerencie campanhas com alocação automática de OSCs</p>
        </div>
        {canCreateCampaigns && (
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nova Campanha
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Campanha</DialogTitle>
                <DialogDescription>OSCs favoritas serão alocadas automaticamente para cada loja</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da Campanha *</Label>
                  <Input
                    id="nome"
                    placeholder="Ex: Campanha Natal 2024"
                    value={newCampanha.nome}
                    onChange={(e) => setNewCampanha({ ...newCampanha, nome: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Data da Campanha *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newCampanha.data ? format(newCampanha.data, "PPP", { locale: ptBR }) : "Selecione a data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newCampanha.data}
                        onSelect={(date) => setNewCampanha({ ...newCampanha, data: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Após criar a campanha, OSCs favoritas de cada loja serão automaticamente alocadas. Você poderá fazer
                    ajustes manuais antes de ativar a campanha.
                  </AlertDescription>
                </Alert>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreating(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={createCampanha}>Criar Campanha</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Lista de Campanhas */}
      <div className="grid gap-6">
        {campanhas.map((campanha) => {
          const details = getCampanhaDetails(campanha)

          return (
            <Card key={campanha.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span>{campanha.nome}</span>
                      <Badge
                        variant={
                          campanha.status === "ativa"
                            ? "default"
                            : campanha.status === "planejamento"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {campanha.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>Data: {format(new Date(campanha.data), "PPP", { locale: ptBR })}</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedCampanha(selectedCampanha?.id === campanha.id ? null : campanha)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {selectedCampanha?.id === campanha.id ? "Ocultar" : "Detalhes"}
                    </Button>
                    {campanha.status === "planejamento" && canCreateCampaigns && (
                      <Button
                        size="sm"
                        onClick={() => ativarCampanha(campanha.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Ativar Campanha
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{details.lojas.length}</div>
                    <div className="text-sm text-blue-600">Lojas</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{details.oscs.length}</div>
                    <div className="text-sm text-green-600">OSCs Alocadas</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{details.confirmadas}</div>
                    <div className="text-sm text-yellow-600">Confirmadas</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {details.total > 0 ? Math.round((details.confirmadas / details.total) * 100) : 0}%
                    </div>
                    <div className="text-sm text-purple-600">Taxa Confirmação</div>
                  </div>
                </div>

                {/* Detalhes da Campanha */}
                {selectedCampanha?.id === campanha.id && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Alocações por Loja</h4>
                    <div className="space-y-4">
                      {details.lojas.map((loja) => {
                        const lojaCampanhas = details.campanhaLojas.filter((cl) => cl.loja_id === loja.id)

                        return (
                          <div key={loja.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <Store className="w-4 h-4 text-gray-500" />
                                <span className="font-medium">{loja.nome}</span>
                              </div>
                              <Badge variant="outline">
                                {lojaCampanhas.length} OSC{lojaCampanhas.length !== 1 ? "s" : ""}
                              </Badge>
                            </div>

                            <div className="space-y-2">
                              {lojaCampanhas.map((cl) => {
                                const osc = mockOSCs.find((o) => o.id === cl.osc_id)
                                const parceria = mockParcerias.find(
                                  (p) => p.loja_id === loja.id && p.osc_id === cl.osc_id,
                                )

                                return (
                                  <div key={cl.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <div className="flex items-center space-x-2">
                                      <Users className="w-4 h-4 text-gray-400" />
                                      <span className="text-sm">{osc?.nome}</span>
                                      {parceria?.favorita && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Badge variant={cl.status_prospecao ? "default" : "secondary"}>
                                        {cl.status_prospecao ? "Prospecção OK" : "Pendente"}
                                      </Badge>
                                      <Badge variant={cl.confirmada ? "default" : "outline"}>
                                        {cl.confirmada ? "Confirmada" : "Não Confirmada"}
                                      </Badge>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}

        {campanhas.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Megaphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma campanha criada</h3>
              <p className="text-gray-600 mb-4">Crie sua primeira campanha para começar</p>
              {canCreateCampaigns && (
                <Button onClick={() => setIsCreating(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeira Campanha
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
