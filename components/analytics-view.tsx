"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, Calendar, DollarSign } from "lucide-react"

export function AnalyticsView() {
  const todayStats = {
    revenue: 15600,
    bookings: 12,
    utilization: 75,
    newClients: 3,
  }

  const weekStats = {
    revenue: 89400,
    bookings: 67,
    utilization: 68,
    newClients: 15,
  }

  const monthStats = {
    revenue: 342800,
    bookings: 234,
    utilization: 72,
    newClients: 48,
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Сегодня</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-600">Выручка</span>
              </div>
              <span className="font-semibold">{todayStats.revenue.toLocaleString()} ₽</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-600">Бронирований</span>
              </div>
              <span className="font-semibold">{todayStats.bookings}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-600" />
                <span className="text-sm text-gray-600">Загрузка кортов</span>
              </div>
              <span className="font-semibold">{todayStats.utilization}%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-gray-600">Новые клиенты</span>
              </div>
              <span className="font-semibold">{todayStats.newClients}</span>
            </div>
          </CardContent>
        </Card>

        {/* Week */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Неделя</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-600">Выручка</span>
              </div>
              <span className="font-semibold">{weekStats.revenue.toLocaleString()} ₽</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-600">Бронирований</span>
              </div>
              <span className="font-semibold">{weekStats.bookings}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-600" />
                <span className="text-sm text-gray-600">Загрузка кортов</span>
              </div>
              <span className="font-semibold">{weekStats.utilization}%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-gray-600">Новые клиенты</span>
              </div>
              <span className="font-semibold">{weekStats.newClients}</span>
            </div>
          </CardContent>
        </Card>

        {/* Month */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Месяц</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-600">Выручка</span>
              </div>
              <span className="font-semibold">{monthStats.revenue.toLocaleString()} ₽</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-600">Бронирований</span>
              </div>
              <span className="font-semibold">{monthStats.bookings}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-600" />
                <span className="text-sm text-gray-600">Загрузка кортов</span>
              </div>
              <span className="font-semibold">{monthStats.utilization}%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-gray-600">Новые клиенты</span>
              </div>
              <span className="font-semibold">{monthStats.newClients}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
