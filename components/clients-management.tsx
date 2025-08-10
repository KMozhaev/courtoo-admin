"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, User, CreditCard, History, Settings } from "lucide-react"
import { MembershipBadge } from "@/components/membership-badge"
import { MembershipRegistrationModal } from "@/components/membership-registration-modal"
import { MembershipHistoryModal } from "@/components/membership-history-modal"
import { getActiveMembership, type ClientMembership } from "@/lib/membership-data"

// Enhanced client interface with membership data
interface EnhancedClient {
  id: string
  name: string
  phone: string
  email?: string
  totalBookings: number
  totalSpent: number
  lastBooking: string
  joinDate: string
  favoriteTrainer?: string
  notes?: string
  // New membership fields
  activeMembership?: ClientMembership
  membershipTotalSpent: number
  lastMembershipUsage?: string
}

const mockClients: EnhancedClient[] = [
  {
    id: "1",
    name: "Анна Петрова",
    phone: "+7 916 123-45-67",
    email: "anna.petrova@email.ru",
    totalBookings: 24,
    totalSpent: 48600,
    lastBooking: "2025-08-08",
    joinDate: "2024-03-15",
    favoriteTrainer: "Дмитрий Козлов",
    notes: "Предпочитает утренние тренировки",
    activeMembership: getActiveMembership("1"),
    membershipTotalSpent: 15000,
    lastMembershipUsage: "2025-08-10T08:00:00Z",
  },
  {
    id: "2",
    name: "Михаил Иванов",
    phone: "+7 925 456-78-90",
    email: "mikhail.ivanov@email.ru",
    totalBookings: 18,
    totalSpent: 35400,
    lastBooking: "2025-08-09",
    joinDate: "2024-05-20",
    favoriteTrainer: "Анна Петрова",
    notes: "Играет в парном разряде",
    activeMembership: getActiveMembership("2"),
    membershipTotalSpent: 8000,
    lastMembershipUsage: "2025-08-05T14:30:00Z",
  },
  {
    id: "3",
    name: "Елена Смирнова",
    phone: "+7 903 789-01-23",
    email: "elena.smirnova@email.ru",
    totalBookings: 31,
    totalSpent: 62800,
    lastBooking: "2025-08-07",
    joinDate: "2023-11-10",
    favoriteTrainer: "Сергей Волков",
    notes: "Участвует в турнирах",
    activeMembership: getActiveMembership("3"),
    membershipTotalSpent: 12000,
    lastMembershipUsage: "2025-08-07T09:00:00Z",
  },
  {
    id: "4",
    name: "Сергей Волков",
    phone: "+7 917 234-56-78",
    email: "sergey.volkov@email.ru",
    totalBookings: 8,
    totalSpent: 12800,
    lastBooking: "2025-08-05",
    joinDate: "2025-01-22",
    favoriteTrainer: "Елена Смирнова",
    notes: "Новичок, изучает основы",
    activeMembership: getActiveMembership("4"),
    membershipTotalSpent: 4000,
    lastMembershipUsage: "2025-08-05T16:00:00Z",
  },
  {
    id: "5",
    name: "Ольга Козлова",
    phone: "+7 909 345-67-89",
    email: "olga.kozlova@email.ru",
    totalBookings: 3,
    totalSpent: 4500,
    lastBooking: "2025-07-15",
    joinDate: "2025-06-01",
    favoriteTrainer: "Анна Петрова",
    notes: "Временно приостановила занятия",
    activeMembership: getActiveMembership("5"),
    membershipTotalSpent: 3500,
    lastMembershipUsage: "2025-07-15T11:00:00Z",
  },
]

export function ClientsManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [membershipFilter, setMembershipFilter] = useState("all")
  const [selectedClient, setSelectedClient] = useState<EnhancedClient | null>(null)
  const [showMembershipModal, setShowMembershipModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)

  const filteredClients = mockClients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesMembership = (() => {
      switch (membershipFilter) {
        case "all":
          return true
        case "active":
          return client.activeMembership?.status === "active"
        case "expired":
          return !client.activeMembership || client.activeMembership.status === "expired"
        case "sessions":
          return client.activeMembership?.benefitType === "sessions"
        case "discount":
          return client.activeMembership?.benefitType === "discount"
        default:
          return true
      }
    })()

    return matchesSearch && matchesMembership
  })

  const handleAddMembership = (client: EnhancedClient) => {
    setSelectedClient(client)
    setShowMembershipModal(true)
  }

  const handleViewHistory = (client: EnhancedClient) => {
    setSelectedClient(client)
    setShowHistoryModal(true)
  }

  // Calculate statistics
  const stats = {
    total: mockClients.length,
    withMemberships: mockClients.filter((c) => c.activeMembership?.status === "active").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Управление клиентами</h2>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Добавить клиента
        </Button>
      </div>

      {/* Enhanced Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Поиск по имени, телефону или email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={membershipFilter} onValueChange={setMembershipFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Абонементы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все абонементы</SelectItem>
            <SelectItem value="active">Активные</SelectItem>
            <SelectItem value="expired">Истёкшие</SelectItem>
            <SelectItem value="sessions">Занятия</SelectItem>
            <SelectItem value="discount">Скидки</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-gray-600">Всего клиентов</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <CreditCard className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.withMemberships}</div>
                <div className="text-sm text-gray-600">Абонемент</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients List as Rows */}
      <Card>
        <CardHeader>
          <CardTitle>Клиенты ({filteredClients.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="p-3 sm:p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleViewHistory(client)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  {/* Client Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <h3 className="font-medium text-base sm:text-lg">{client.name}</h3>
                      <span className="text-sm text-gray-600">{client.phone}</span>
                    </div>

                    {/* Membership Display */}
                    <div className="mt-2">
                      {client.activeMembership ? (
                        <MembershipBadge
                          membership={client.activeMembership}
                          currentTime={new Date()}
                          showRestrictions={false}
                          size="sm"
                          onClick={() => handleViewHistory(client)}
                        />
                      ) : (
                        <span className="text-xs text-gray-500 italic">Нет активных абонементов</span>
                      )}
                    </div>
                  </div>

                  {/* Statistics - Mobile: Row, Desktop: Column */}
                  <div className="flex items-center justify-between sm:justify-center sm:flex-col gap-4 sm:gap-2 text-sm">
                    <div className="text-center">
                      <div className="font-medium">{client.totalBookings}</div>
                      <div className="text-gray-600 text-xs">Бронирований</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-xs">
                        {new Date(client.lastBooking).toLocaleDateString("ru-RU")}
                      </div>
                      <div className="text-gray-600 text-xs">Последнее</div>
                    </div>
                  </div>

                  {/* Action Buttons - Mobile: Full width, Desktop: Side by side */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2 sm:ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent touch-manipulation"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewHistory(client)
                      }}
                    >
                      <History className="h-4 w-4 mr-1" />
                      История
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent touch-manipulation"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Редактировать
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredClients.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Клиенты не найдены. Попробуйте изменить параметры поиска.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <MembershipRegistrationModal
        isOpen={showMembershipModal}
        onClose={() => {
          setShowMembershipModal(false)
          setSelectedClient(null)
        }}
        client={selectedClient}
        onMembershipAdded={() => {
          // Refresh client data
          setShowMembershipModal(false)
          setSelectedClient(null)
        }}
      />

      <MembershipHistoryModal
        isOpen={showHistoryModal}
        onClose={() => {
          setShowHistoryModal(false)
          setSelectedClient(null)
        }}
        client={selectedClient}
      />
    </div>
  )
}
