"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Users, Megaphone, Scale, CheckCircle, AlertTriangle, Calendar, ArrowUpRight } from "lucide-react"
import type { DashboardMetrics, Campanha } from "../types"

interface DashboardOverviewProps {
  metrics: DashboardMetrics
  recentCampaigns: Campanha[]
}

export function DashboardOverview({ metrics, recentCampaigns }: DashboardOverviewProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Visão geral das campanhas e operações</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Últimos 30 dias
          </Button>
          <Button size="sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            Relatório
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Campanhas Ativas</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">{metrics.campanhas_ativas}</p>
                <p className="text-xs text-gray-500 mt-1">de {metrics.total_campanhas} campanhas</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <Megaphone className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Doações</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">
                  {metrics.total_doacoes_kg.toLocaleString()} kg
                </p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="w-3 h-3 text-green-500 mr-1" />
                  <p className="text-xs text-green-600">+12% vs mês anterior</p>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Scale className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">OSCs Ativas</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">{metrics.oscs_ativas}</p>
                <p className="text-xs text-gray-500 mt-1">{metrics.oscs_suspensas} suspensas</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa Confirmação</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">{metrics.taxa_confirmacao}%</p>
                <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${metrics.taxa_confirmacao}%` }}
                  />
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campanhas e Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Campanhas Recentes */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Campanhas Recentes</CardTitle>
                <CardDescription className="text-sm text-gray-600">Últimas campanhas criadas</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                Ver todas
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentCampaigns.map((campanha) => (
              <div key={campanha.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Calendar className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{campanha.nome}</p>
                    <p className="text-xs text-gray-500">{new Date(campanha.data).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>
                <Badge
                  variant={
                    campanha.status === "ativa"
                      ? "default"
                      : campanha.status === "planejamento"
                        ? "secondary"
                        : "outline"
                  }
                  className="text-xs"
                >
                  {campanha.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Alertas e Notificações */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Alertas</CardTitle>
                <CardDescription className="text-sm text-gray-600">Itens que requerem atenção</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                Ver todos
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-yellow-900 text-sm">5 OSCs pendentes de validação</p>
                <p className="text-xs text-yellow-700 mt-1">Requer aprovação manual</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-blue-900 text-sm">Nova campanha disponível</p>
                <p className="text-xs text-blue-700 mt-1">Campanha Natal 2024 criada</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg border border-red-100">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-red-900 text-sm">3 OSCs com faltas excessivas</p>
                <p className="text-xs text-red-700 mt-1">Próximas da suspensão automática</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
