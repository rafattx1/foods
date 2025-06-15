"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Store {
  id: string
  codigo: string
  loja: string
  bandeira: string
  parcerias: number
  cidade: string
  uf: string
  bairro: string
  inauguracao: string
  status: "ativo" | "inativo" | "pendente"
}

const mockStores: Store[] = [
  {
    id: "1",
    codigo: "001",
    loja: "Mercado Extra Centro",
    bandeira: "Extra",
    parcerias: 0,
    cidade: "São Paulo",
    uf: "SP",
    bairro: "Centro",
    inauguracao: "01/01/1900",
    status: "ativo",
  },
  {
    id: "2",
    codigo: "002",
    loja: "Pão de Açúcar Vila Madalena",
    bandeira: "Pão de Açúcar",
    parcerias: 0,
    cidade: "São Paulo",
    uf: "SP",
    bairro: "Vila Madalena",
    inauguracao: "01/01/1900",
    status: "ativo",
  },
  {
    id: "3",
    codigo: "003",
    loja: "Extra Hiper Osasco",
    bandeira: "Extra Hiper",
    parcerias: 0,
    cidade: "Osasco",
    uf: "SP",
    bairro: "Centro",
    inauguracao: "01/01/1900",
    status: "pendente",
  },
  {
    id: "4",
    codigo: "004",
    loja: "Minimercado Extra Jardins",
    bandeira: "Minimercado Extra",
    parcerias: 0,
    cidade: "São Paulo",
    uf: "SP",
    bairro: "Jardins",
    inauguracao: "01/01/1900",
    status: "inativo",
  },
  {
    id: "5",
    codigo: "005",
    loja: "Extra Supermercado ABC",
    bandeira: "Extra Supermercado",
    parcerias: 0,
    cidade: "Santo André",
    uf: "SP",
    bairro: "Centro",
    inauguracao: "01/01/1900",
    status: "ativo",
  },
]

export function StoresTable() {
  const [stores, setStores] = useState<Store[]>(mockStores)

  const updateStoreStatus = (storeId: string, newStatus: "ativo" | "inativo" | "pendente") => {
    setStores(stores.map((store) => (store.id === storeId ? { ...store, status: newStatus } : store)))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ativo":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>
      case "inativo":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Inativo</Badge>
      case "pendente":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendente</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Lojas</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Example</span>
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
            <Plus className="w-4 h-4 mr-2" />
            Nova Loja
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loja</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bandeira
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #Parcerias
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cidade</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UF</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bairro</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inauguração
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stores.map((store) => (
              <tr key={store.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{store.codigo}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{store.loja}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{store.bandeira}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{store.parcerias}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{store.cidade}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{store.uf}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{store.bairro}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{store.inauguracao}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <Select
                    value={store.status}
                    onValueChange={(value: "ativo" | "inativo" | "pendente") => updateStoreStatus(store.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
