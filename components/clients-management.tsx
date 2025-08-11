"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Settings, FileText } from "lucide-react"
import { MembershipRegistrationModal } from "@/components/membership-registration-modal"
import { MembershipHistoryModal } from "@/components/membership-history-modal"
import { getActiveMembership, type ClientMembership } from "@/lib/membership-data"
import { EditClientModal } from "@/components/edit-client-modal"
import { CreateClientModal } from "@/components/create-client-modal"

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

// Initialize with existing clients and dynamically get membership data
const initialMockClients: EnhancedClient[] = [
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
  const [clients, setClients] = useState<EnhancedClient[]>(initialMockClients)
  const [searchTerm, setSearchTerm] = useState("")
  const [membershipFilter, setMembershipFilter] = useState("all")
  const [selectedClient, setSelectedClient] = useState<EnhancedClient | null>(null)
  const [showMembershipModal, setShowMembershipModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Refresh client membership data
  const refreshClientMemberships = () => {
    setClients((prevClients) =>
      prevClients.map((client) => ({
        ...client,
        activeMembership: getActiveMembership(client.id),
      })),
    )
  }

  const filteredClients = clients.filter((client) => {
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

  const handleEditClient = (client: EnhancedClient) => {
    setSelectedClient(client)
    setShowEditModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Управление клиентами</h2>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowCreateModal(true)}>
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

      {/* Clients List as Compact Rows */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Клиенты ({filteredClients.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleViewHistory(client)}
              >
                <div className="flex items-center justify-between">
                  {/* Client Info - Compact */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm truncate">{client.name}</h3>
                      <span className="text-xs text-gray-500 hidden sm:inline">{client.phone}</span>
                    </div>

                    {/* Membership - Enhanced Display */}
                    <div className="mt-1">
                      {client.activeMembership ? (
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              client.activeMembership.status === "active"
                                ? new Date(client.activeMembership.expiresDate) > new Date()
                                  ? "bg-green-500"
                                  : "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                          />
                          <span className="text-xs font-medium">{client.activeMembership.membershipName}</span>
                          <span className="text-xs text-gray-600">
                            {client.activeMembership.benefitType === "sessions"
                              ? `Осталось: ${client.activeMembership.remainingSessions}`
                              : `-${client.activeMembership.discountPercentage}%`}
                          </span>
                          <span className="text-xs text-gray-500">
                            До: {new Date(client.activeMembership.expiresDate).toLocaleDateString("ru-RU")}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Нет абонемента</span>
                      )}
                    </div>
                  </div>

                  {/* Stats - Compact */}
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <div className="text-center">
                      <div className="font-medium text-gray-900">{client.totalBookings}</div>
                    </div>
                    <div className="text-center hidden sm:block">
                      <div className="font-medium text-gray-900">
                        {new Date(client.lastBooking).toLocaleDateString("ru-RU", {
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Actions - Compact */}
                  <div className="flex items-center gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAddMembership(client)
                      }}
                      title="Добавить абонемент"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditClient(client)
                      }}
                      title="Редактировать клиента"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewHistory(client)
                      }}
                      title="История и управление"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredClients.length === 0 && (
            <div className="p-6 text-center text-gray-500 text-sm">
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
          refreshClientMemberships()
        }}
        client={selectedClient}
        onMembershipAdded={() => {
          setShowMembershipModal(false)
          setSelectedClient(null)
          refreshClientMemberships()
        }}
      />

      <MembershipHistoryModal
        isOpen={showHistoryModal}
        onClose={() => {
          setShowHistoryModal(false)
          setSelectedClient(null)
          refreshClientMemberships()
        }}
        client={selectedClient}
      />
      <EditClientModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedClient(null)
        }}
        client={selectedClient}
        onClientUpdated={() => {
          setShowEditModal(false)
          setSelectedClient(null)
          refreshClientMemberships()
        }}
      />
      <CreateClientModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onClientCreated={(newClient) => {
          // Add to the beginning of the clients list
          setClients((prevClients) => [newClient, ...prevClients])

          // Show success message
          const membershipText = newClient.activeMembership
            ? ` с абонементом "${newClient.activeMembership.membershipName}"`
            : ""
          alert(`Клиент ${newClient.name} добавлен${membershipText}`)

          setShowCreateModal(false)
          refreshClientMemberships()
        }}
        existingClients={clients}
      />
    </div>
  )
}
