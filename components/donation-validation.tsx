"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, AlertTriangle, Eye, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Doacao } from "../types"

interface DonationValidationProps {
  userRole: string
}

interface ValidationResult {
  total_records: number
  valid_records: number
  invalid_records: number
  total_kg_recebido: number
  total_kg_validado: number
  divergencias: Array<{
    loja: string
    osc: string
    kg_recebido: number
    kg_validado: number
    diferenca: number
    motivo: string
  }>
}

const mockDoacoes: Doacao[] = [
  {
    id: "1",
    campanha_loja_id: "1",
    quantidade_recebida_kg: 150,
    quantidade_validada_kg: 145,
    modo_validacao: "completa",
    created_at: "2024-12-01",
    updated_at: "2024-12-01",
  },
  {
    id: "2",
    campanha_loja_id: "2",
    quantidade_recebida_kg: 200,
    quantidade_validada_kg: 180,
    modo_validacao: "amostragem",
    created_at: "2024-12-01",
    updated_at: "2024-12-01",
  },
  {
    id: "3",
    campanha_loja_id: "3",
    quantidade_recebida_kg: 75,
    quantidade_validada_kg: 75,
    modo_validacao: "completa",
    created_at: "2024-12-01",
    updated_at: "2024-12-01",
  },
]

export function DonationValidation({ userRole }: DonationValidationProps) {
  const [doacoes, setDoacoes] = useState<Doacao[]>(mockDoacoes)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [selectedValidationMode, setSelectedValidationMode] = useState<"completa" | "amostragem">("completa")
  const [selectedCampanha, setSelectedCampanha] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const canValidate = userRole !== "ClienteGPA"

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo CSV",
        variant: "destructive",
      })
      return
    }

    if (!selectedCampanha) {
      toast({
        title: "Erro",
        description: "Selecione uma campanha antes de fazer o upload",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 300)

      // Simulate processing
      await new Promise((resolve) => setTimeout(resolve, 4000))

      setUploadProgress(100)

      // Mock validation result
      const mockResult: ValidationResult = {
        total_records: 25,
        valid_records: 22,
        invalid_records: 3,
        total_kg_recebido: 3250,
        total_kg_validado: selectedValidationMode === "completa" ? 3180 : 3200,
        divergencias: [
          {
            loja: "Extra Centro",
            osc: "Instituto Solidário",
            kg_recebido: 150,
            kg_validado: 145,
            diferenca: -5,
            motivo: "Produtos vencidos identificados na validação",
          },
          {
            loja: "Pão de Açúcar Vila",
            osc: "ONG Esperança",
            kg_recebido: 200,
            kg_validado: 180,
            diferenca: -20,
            motivo: "Embalagens danificadas",
          },
          {
            loja: "Extra Norte",
            osc: "Associação Vida Nova",
            kg_recebido: 120,
            kg_validado: 125,
            diferenca: 5,
            motivo: "Ajuste de pesagem - balança descalibrada",
          },
        ],
      }

      setValidationResult(mockResult)

      // Create new donation records
      const newDoacoes: Doacao[] = Array.from({ length: mockResult.valid_records }, (_, index) => ({
        id: `new-${Date.now()}-${index}`,
        campanha_loja_id: `cl-${index}`,
        quantidade_recebida_kg: Math.floor(Math.random() * 200) + 50,
        quantidade_validada_kg: Math.floor(Math.random() * 190) + 45,
        modo_validacao: selectedValidationMode,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }))

      setDoacoes([...doacoes, ...newDoacoes])

      toast({
        title: "Validação Concluída",
        description: `${mockResult.valid_records} doações validadas com sucesso`,
      })
    } catch (error) {
      toast({
        title: "Erro na Validação",
        description: "Falha ao processar o arquivo",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const downloadTemplate = () => {
    const csvContent = [
      "loja,osc,quantidade_recebida_kg,observacoes",
      "Extra Centro,Instituto Solidário,150,",
      "Pão de Açúcar Vila,ONG Esperança,200,",
      "Extra Norte,Associação Vida Nova,120,Produtos em bom estado",
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "template_validacao_doacoes.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportDivergencias = () => {
    if (!validationResult) return

    const csvContent = [
      "loja,osc,kg_recebido,kg_validado,diferenca,motivo",
      ...validationResult.divergencias.map(
        (d) => `"${d.loja}","${d.osc}",${d.kg_recebido},${d.kg_validado},${d.diferenca},"${d.motivo}"`,
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `divergencias_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Exportação Concluída",
      description: "Relatório de divergências baixado com sucesso",
    })
  }

  const getValidationBadge = (modo: string) => {
    switch (modo) {
      case "completa":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Validação Completa</Badge>
      case "amostragem":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Amostragem</Badge>
      default:
        return <Badge variant="secondary">{modo}</Badge>
    }
  }

  const totalKgRecebido = doacoes.reduce((sum, d) => sum + d.quantidade_recebida_kg, 0)
  const totalKgValidado = doacoes.reduce((sum, d) => sum + d.quantidade_validada_kg, 0)
  const taxaValidacao = totalKgRecebido > 0 ? (totalKgValidado / totalKgRecebido) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Validação de Doações</h2>
          <p className="text-gray-600">Valide doações recebidas com verificação completa ou por amostragem</p>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Recebido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalKgRecebido.toLocaleString()} kg</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Validado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalKgValidado.toLocaleString()} kg</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Taxa Validação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{taxaValidacao.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Doações Processadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{doacoes.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Upload de Validação */}
      {canValidate && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload de Dados</CardTitle>
              <CardDescription>Faça upload dos dados de doação para validação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campanha">Campanha *</Label>
                <Select value={selectedCampanha} onValueChange={setSelectedCampanha}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma campanha" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="campanha-1">Campanha Natal 2024</SelectItem>
                    <SelectItem value="campanha-2">Ação Solidária Novembro</SelectItem>
                    <SelectItem value="campanha-3">Campanha Páscoa 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="modo-validacao">Modo de Validação *</Label>
                <Select
                  value={selectedValidationMode}
                  onValueChange={(value: "completa" | "amostragem") => setSelectedValidationMode(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completa">Validação Completa</SelectItem>
                    <SelectItem value="amostragem">Validação por Amostragem</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="csv-file">Arquivo CSV</Label>
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </div>

              {uploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Validando doações...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || !selectedCampanha}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? "Processando..." : "Fazer Upload"}
                </Button>
                <Button variant="outline" onClick={downloadTemplate}>
                  <Download className="w-4 h-4 mr-2" />
                  Template
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Instruções de Validação</CardTitle>
              <CardDescription>Como funciona o processo de validação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Validação Completa:</p>
                    <p className="text-xs text-gray-600">Todos os itens são verificados individualmente</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <FileText className="w-4 h-4 mt-0.5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Validação por Amostragem:</p>
                    <p className="text-xs text-gray-600">Verificação estatística de uma amostra representativa</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium">Divergências:</p>
                    <p className="text-xs text-gray-600">
                      Diferenças entre recebido e validado são registradas automaticamente
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Resultado da Validação */}
      {validationResult && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado da Validação</CardTitle>
            <CardDescription>Resumo do processo de validação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{validationResult.total_records}</div>
                <div className="text-sm text-blue-600">Total Registros</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{validationResult.valid_records}</div>
                <div className="text-sm text-green-600">Válidos</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{validationResult.invalid_records}</div>
                <div className="text-sm text-red-600">Inválidos</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {validationResult.total_kg_recebido.toLocaleString()}
                </div>
                <div className="text-sm text-purple-600">kg Recebidos</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {validationResult.total_kg_validado.toLocaleString()}
                </div>
                <div className="text-sm text-orange-600">kg Validados</div>
              </div>
            </div>

            {validationResult.divergencias.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Divergências Encontradas</h4>
                  <Button size="sm" variant="outline" onClick={exportDivergencias}>
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Divergências
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Loja</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">OSC</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Recebido (kg)
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Validado (kg)
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Diferença</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Motivo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {validationResult.divergencias.map((div, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-900">{div.loja}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{div.osc}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{div.kg_recebido}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{div.kg_validado}</td>
                          <td className="px-4 py-2">
                            <Badge variant={div.diferenca < 0 ? "destructive" : "default"}>
                              {div.diferenca > 0 ? "+" : ""}
                              {div.diferenca} kg
                            </Badge>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-600">{div.motivo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Histórico de Doações */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Doações Validadas</CardTitle>
          <CardDescription>Últimas doações processadas pelo sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recebido (kg)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Validado (kg)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modo Validação</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Eficiência</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {doacoes.slice(0, 10).map((doacao) => {
                  const eficiencia = (doacao.quantidade_validada_kg / doacao.quantidade_recebida_kg) * 100

                  return (
                    <tr key={doacao.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {new Date(doacao.created_at).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">{doacao.quantidade_recebida_kg}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">{doacao.quantidade_validada_kg}</td>
                      <td className="px-4 py-4">{getValidationBadge(doacao.modo_validacao)}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-900">{eficiencia.toFixed(1)}%</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${eficiencia >= 95 ? "bg-green-500" : eficiencia >= 85 ? "bg-yellow-500" : "bg-red-500"}`}
                              style={{ width: `${Math.min(eficiencia, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
