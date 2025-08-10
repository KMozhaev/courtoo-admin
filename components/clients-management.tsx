"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Phone, Plus, User } from "lucide-react"

const mockClients = [
  {
    id: "1",
    name: "Анна Петрова",
    phone: "+7 916 123-45-67",
    email: "anna.petrova@email.ru",
    totalBookings: 24,
    totalSpent: 48600,
    status: "vip",
    lastBooking: "2025-08-08",
    joinDate: "2024-03-15",
    favoriteTrainer: "Дмитрий Козлов",
    notes: "Предпочитает утренние тренировки",
  },
  {
    id: "2",
    name: "Михаил Иванов",
    phone: "+7 925 456-78-90",
    email: "mikhail.ivanov@email.ru",
    totalBookings: 18,
    totalSpent: 35400,
    status: "active",
    lastBooking: "2025-08-09",
    joinDate: "2024-05-20",
    favoriteTrainer: "Анна Петрова",
    notes: "Играет в парном разряде",
  },
  {
    id: "3",
    name: "Елена Смирнова",
    phone: "+7 903 789-01-23",
    email: "elena.smirnova@email.ru",
    totalBookings: 31,
    totalSpent: 62800,
    status: "vip",
    lastBooking: "2025-08-07",
    joinDate: "2023-11-10",
    favoriteTrainer: "Сергей Волков",
    notes: "Участвует в турнирах",
  },
  {
    id: "4",
    name: "Сергей Волков",
    phone: "+7 917 234-56-78",
    email: "sergey.volkov@email.ru",
    totalBookings: 8,
    totalSpent: 12800,
    status: "active",
    lastBooking: "2025-08-05",
    joinDate: "2025-01-22",
    favoriteTrainer: "Елена Смирнова",
    notes: "Новичок, изучает основы",
  },
  {
    id: "5",
    name: "Ольга Козлова",
    phone: "+7 909 345-67-89",
    email: "olga.kozlova@email.ru",
    totalBookings: 3,
    totalSpent: 4500,
    status: "inactive",
    lastBooking: "2025-07-15",
    joinDate: "2025-06-01",
    favoriteTrainer: "Анна Петрова",
    notes: "Временно приостановила занятия",
  },
]

export function ClientsManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "vip":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "vip":
        return "VIP"
      case "active":
        return "Активный"
      case "inactive":
        return "Неактивный"
      default:
        return status
    }
  }

  const filteredClients = mockClients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || client.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Управление клиентами</h2>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Добавить клиента
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Поиск по имени, телефону или email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Статус клиента" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все клиенты</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
            <SelectItem value="active">Активные</SelectItem>
            <SelectItem value="inactive">Неактивные</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">73</div>
                <div className="text-sm text-gray-600">Всего клиентов</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-gray-600">VIP клиентов</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">58</div>
                <div className="text-sm text-gray-600">Активных</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-gray-600">Неактивных</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{client.name}</CardTitle>
                  <div className="text-sm text-gray-600 mt-1">{client.phone}</div>
                </div>
                <Badge className={getStatusColor(client.status)}>{getStatusLabel(client.status)}</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Бронирований:</span>
                  <div className="font-medium">{client.totalBookings}</div>
                </div>
                <div>
                  <span className="text-gray-600">Потрачено:</span>
                  <div className="font-medium">{client.totalSpent.toLocaleString()} ₽</div>
                </div>
              </div>

              <div className="text-sm">
                <span className="text-gray-600">Любимый тренер:</span>
                <div className="font-medium">{client.favoriteTrainer}</div>
              </div>

              <div className="text-sm">
                <span className="text-gray-600">Последнее бронирование:</span>
                <div className="font-medium">{new Date(client.lastBooking).toLocaleDateString("ru-RU")}</div>
              </div>

              {client.notes && (
                <div className="text-sm">
                  <span className="text-gray-600">Примечания:</span>
                  <div className="text-gray-800 mt-1">{client.notes}</div>
                </div>
              )}

              <div className="flex gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Phone className="h-4 w-4 mr-2" />
                  Позвонить
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  История
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">Клиенты не найдены. Попробуйте изменить параметры поиска.</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
