"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, RefreshCw, AlertTriangle, Download, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface StoreItem {
  id: string
  name: string
  status: "ativo" | "verificar"
  bandeira: string
  lastUpdated: string
}

interface CSVStore {
  name: string
  bandeira?: string
}

const BANDEIRAS = ["Mercado Extra", "Pão de Açúcar", "Extra Hiper", "Minimercado Extra", "Extra Supermercado"]

export default function StoreManagement() {
  const [stores, setStores] = useState<StoreItem[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedBandeira, setSelectedBandeira] = useState<string>("all")
  const [csvData, setCsvData] = useState<CSVStore[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Simulated database data - replace with actual Supabase integration
  const mockDatabaseStores: StoreItem[] = [
    { id: "1", name: "Loja Centro", status: "verificar", bandeira: "Mercado Extra", lastUpdated: "2024-01-15" },
    { id: "2", name: "Loja Norte", status: "verificar", bandeira: "Pão de Açúcar", lastUpdated: "2024-01-14" },
    { id: "3", name: "Loja Sul", status: "verificar", bandeira: "Extra Hiper", lastUpdated: "2024-01-13" },
    { id: "4", name: "Loja Oeste", status: "verificar", bandeira: "Mercado Extra", lastUpdated: "2024-01-12" },
    { id: "5", name: "Loja Leste", status: "verificar", bandeira: "Extra Supermercado", lastUpdated: "2024-01-11" },
    { id: "6", name: "Loja Nova", status: "verificar", bandeira: "Mercado Extra", lastUpdated: "2024-01-10" },
  ]

  useEffect(() => {
    loadStores()
  }, [])

  const loadStores = async () => {
    setLoading(true)
    try {
      // Simulate API call - replace with actual Supabase query
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setStores(mockDatabaseStores)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar as lojas",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const parseCSV = (csvText: string): CSVStore[] => {
    const lines = csvText.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())

    const nameIndex = headers.findIndex((h) => h.includes("nome") || h.includes("name") || h.includes("loja"))
    const bandeiraIndex = headers.findIndex(
      (h) => h.includes("bandeira") || h.includes("categoria") || h.includes("grupo"),
    )

    if (nameIndex === -1) {
      throw new Error('Coluna de nome não encontrada no CSV. Use "nome", "name" ou "loja".')
    }

    const data: CSVStore[] = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))
      if (values[nameIndex]) {
        data.push({
          name: values[nameIndex],
          bandeira: bandeiraIndex !== -1 ? values[bandeiraIndex] : undefined,
        })
      }
    }

    return data
  }

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
    try {
      const text = await file.text()
      const parsedData = parseCSV(text)
      setCsvData(parsedData)

      toast({
        title: "CSV Carregado",
        description: `${parsedData.length} lojas encontradas no arquivo CSV`,
      })
    } catch (error) {
      toast({
        title: "Erro ao processar CSV",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const syncWithCSV = async () => {
    if (csvData.length === 0) {
      toast({
        title: "Erro",
        description: "Por favor, carregue um arquivo CSV primeiro",
        variant: "destructive",
      })
      return
    }

    setSyncing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Logic: Stores in CSV are active, others should be set to "verificar"
      const csvStoreNames = csvData.map((store) => store.name.toLowerCase())

      const updatedStores = stores.map((store) => {
        const isInCSV = csvStoreNames.includes(store.name.toLowerCase())
        const csvStore = csvData.find((csv) => csv.name.toLowerCase() === store.name.toLowerCase())

        return {
          ...store,
          status: isInCSV ? ("ativo" as const) : ("verificar" as const),
          bandeira: csvStore?.bandeira || store.bandeira,
          lastUpdated: new Date().toISOString().split("T")[0],
        }
      })

      setStores(updatedStores)

      const activeCount = updatedStores.filter((s) => s.status === "ativo").length
      const verifyCount = updatedStores.filter((s) => s.status === "verificar").length

      toast({
        title: "Sincronização Concluída",
        description: `${activeCount} lojas ativadas, ${verifyCount} para verificação`,
      })
    } catch (error) {
      toast({
        title: "Erro na Sincronização",
        description: "Falha ao sincronizar os dados",
        variant: "destructive",
      })
    } finally {
      setSyncing(false)
    }
  }

  const exportToCSV = () => {
    const headers = ["Nome", "Status", "Bandeira", "Última Atualização"]
    const csvContent = [
      headers.join(","),
      ...stores.map((store) =>
        [`"${store.name}"`, `"${store.status}"`, `"${store.bandeira}"`, `"${store.lastUpdated}"`].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `lojas_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Exportação Concluída",
      description: "Arquivo CSV baixado com sucesso",
    })
  }

  const updateStoreBandeira = async (storeId: string, newBandeira: string) => {
    try {
      const updatedStores = stores.map((store) =>
        store.id === storeId
          ? { ...store, bandeira: newBandeira, lastUpdated: new Date().toISOString().split("T")[0] }
          : store,
      )
      setStores(updatedStores)

      toast({
        title: "Bandeira Atualizada",
        description: "Categoria da loja foi atualizada com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar a bandeira da loja",
        variant: "destructive",
      })
    }
  }

  const filteredStores =
    selectedBandeira === "all" ? stores : stores.filter((store) => store.bandeira === selectedBandeira)

  const activeStores = stores.filter((store) => store.status === "ativo").length
  const verificationStores = stores.filter((store) => store.status === "verificar").length

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando lojas...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Lojas</h1>
          <p className="text-muted-foreground">Importe dados via CSV e gerencie categorias das lojas</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Button onClick={syncWithCSV} disabled={syncing || csvData.length === 0}>
            {syncing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Sincronizar com CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Lojas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stores.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lojas Ativas</CardTitle>
            <div className="h-4 w-4 bg-green-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeStores}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Para Verificar</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{verificationStores}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CSV Carregado</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{csvData.length}</div>
            <p className="text-xs text-muted-foreground">lojas no CSV</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Importar Arquivo CSV</CardTitle>
          <CardDescription>
            Carregue um arquivo CSV com as lojas ativas. O arquivo deve conter uma coluna "nome" ou "loja".
            Opcionalmente, pode incluir uma coluna "bandeira" para definir categorias.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
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
              <div className="flex items-center text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processando arquivo CSV...
              </div>
            )}
            {csvData.length > 0 && (
              <div className="flex items-center text-sm text-green-600">
                <FileText className="h-4 w-4 mr-2" />
                {csvData.length} lojas carregadas do CSV
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filtrar por Bandeira</CardTitle>
          <CardDescription>Selecione uma bandeira para filtrar as lojas por categoria</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedBandeira} onValueChange={setSelectedBandeira}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Selecione uma bandeira" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Bandeiras</SelectItem>
              {BANDEIRAS.map((bandeira) => (
                <SelectItem key={bandeira} value={bandeira}>
                  {bandeira}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Lojas</CardTitle>
          <CardDescription>
            Lojas presentes no CSV são marcadas como "Ativo". Lojas não presentes no CSV são marcadas para "Verificar".
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStores.map((store) => (
              <div key={store.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">{store.name}</h3>
                    <p className="text-sm text-muted-foreground">Última atualização: {store.lastUpdated}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Badge variant={store.status === "ativo" ? "default" : "secondary"}>
                    {store.status === "ativo" ? "Ativo" : "Verificar"}
                  </Badge>

                  <Select value={store.bandeira} onValueChange={(value) => updateStoreBandeira(store.id, value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BANDEIRAS.map((bandeira) => (
                        <SelectItem key={bandeira} value={bandeira}>
                          {bandeira}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
