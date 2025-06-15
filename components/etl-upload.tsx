"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, CheckCircle, AlertTriangle, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ETLResult {
  total_records: number
  valid_records: number
  invalid_records: number
  warnings: string[]
  errors: string[]
}

export function ETLUpload() {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [etlResult, setEtlResult] = useState<ETLResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

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
      }, 200)

      // Simulate processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      setUploadProgress(100)

      // Mock ETL result
      const mockResult: ETLResult = {
        total_records: 150,
        valid_records: 142,
        invalid_records: 8,
        warnings: [
          "5 lojas com endereços incompletos - marcadas para verificação",
          "3 regionais não encontradas - criadas automaticamente",
        ],
        errors: ["2 registros com CNPJ inválido", "6 registros duplicados removidos"],
      }

      setEtlResult(mockResult)

      toast({
        title: "Upload Concluído",
        description: `${mockResult.valid_records} registros processados com sucesso`,
      })
    } catch (error) {
      toast({
        title: "Erro no Upload",
        description: "Falha ao processar o arquivo",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const downloadTemplate = () => {
    const csvContent = [
      "nome_loja,endereco_principal,regional,ativo",
      "Loja Exemplo 1,Rua das Flores 123,Regional Sul,true",
      "Loja Exemplo 2,Av. Principal 456,Regional Norte,true",
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "template_lojas.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Upload ETL - Lojas e Regionais</h2>
        <p className="text-gray-600">Atualize dados de lojas e regionais via arquivo CSV</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload de Arquivo</CardTitle>
            <CardDescription>Selecione um arquivo CSV com os dados das lojas e regionais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
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
                  <span>Processando arquivo...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}

            <div className="flex space-x-2">
              <Button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex-1">
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? "Processando..." : "Selecionar Arquivo"}
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
            <CardTitle>Instruções</CardTitle>
            <CardDescription>Formato esperado do arquivo CSV</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <FileText className="w-4 h-4 mt-0.5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Colunas obrigatórias:</p>
                  <p className="text-xs text-gray-600">nome_loja, endereco_principal, regional, ativo</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 mt-0.5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Validações automáticas:</p>
                  <p className="text-xs text-gray-600">Duplicatas, endereços, regionais existentes</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Divergências:</p>
                  <p className="text-xs text-gray-600">Registros com problemas são marcados para verificação</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {etlResult && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado do Processamento</CardTitle>
            <CardDescription>Resumo da importação de dados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{etlResult.total_records}</div>
                <div className="text-sm text-blue-600">Total de Registros</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{etlResult.valid_records}</div>
                <div className="text-sm text-green-600">Registros Válidos</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{etlResult.invalid_records}</div>
                <div className="text-sm text-red-600">Registros com Erro</div>
              </div>
            </div>

            {etlResult.warnings.length > 0 && (
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium mb-2">Avisos:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {etlResult.warnings.map((warning, index) => (
                      <li key={index} className="text-sm">
                        {warning}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {etlResult.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium mb-2">Erros:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {etlResult.errors.map((error, index) => (
                      <li key={index} className="text-sm">
                        {error}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
