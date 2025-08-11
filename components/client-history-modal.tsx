"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, CreditCard, MapPin } from "lucide-react"

interface ClientHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  client: any
}

// Mock booking history data
const mockBookingHistory = [
  {
    id: "book_001",
    date: "2025-08-10",
    time: "09:00",
    duration: 90,
    courtName: "Корт 1",
    trainerName: "Анна Петрова",
    price: 2250,
    originalPrice: 2500,
    membershipApplied: true,
    status: "completed",
    notes: "Работали над подачей",
  },
  {
    id: "book_002",
    date: "2025-08-08",
    time: "14:30",
    duration: 60,
    courtName: "Корт 2",
    price: 600,
    originalPrice: 600,
    membershipApplied: false,
    status: "completed",
    notes: "Свободная игра",
  },
  {
    id: "book_003",
    date: "2025-08-05",
    time: "16:00",
    duration: 90,
    courtName: "Корт 3",
    trainerName: "Дмитрий Козлов",
    price: 0,
    originalPrice: 3000,
    membershipApplied: true,
    status: "completed",
    notes: "Тренировка техники ударов",
  },
]

// Mock membership history data
const mockMembershipHistory = [
  {
    id: "mem_001",
    name: "10 занятий",
    benefitType: "sessions",
    originalSessions: 10,
    remainingSessions: 7,
    purchasedDate: "2025-08-01",
    expiresDate: "2025-08-31",
    price: 15000,
    status: "active",
    usageHistory: [
      { date: "2025-08-10", action: "deduction", sessions: 1, reason: "Тренировка с Анной Петровой" },
      { date: "2025-08-05", action: "deduction", sessions: 1, reason: "Тренировка с Дмитрием Козловым" },
      { date: "2025-08-03", action: "deduction", sessions: 1, reason: "Корт 1" },
    ],
  },
  {
    id: "mem_002",
    name: "VIP Gold",
    benefitType: "discount",
    discountPercentage: 20,
    purchasedDate: "2025-07-01",
    expiresDate: "2025-07-31",
    price: 8000,
    status: "expired",
  },
]

export function ClientHistoryModal({ isOpen, onClose, client }: ClientHistoryModalProps) {
  if (!client) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Завершено
          </Badge>
        )
      case "cancelled":
        return <Badge variant="destructive">Отменено</Badge>
      case "upcoming":
        return <Badge variant="secondary">Предстоит</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getMembershipStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Активен
          </Badge>
        )
      case "expired":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            Истёк
          </Badge>
        )
      case "suspended":
        return <Badge variant="destructive">Приостановлен</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            История клиента: {client.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bookings">История бронирований</TabsTrigger>
            <TabsTrigger value="memberships">История абонементов</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              Всего бронирований: {mockBookingHistory.length} • Общая сумма:{" "}
              {mockBookingHistory.reduce((sum, booking) => sum + booking.price, 0).toLocaleString()} ₽
            </div>

            <div className="space-y-3">
              {mockBookingHistory.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">
                            {new Date(booking.date).toLocaleDateString("ru-RU", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>
                            {booking.time}-
                            {new Date(new Date(`2000-01-01T${booking.time}`).getTime() + booking.duration * 60000)
                              .toTimeString()
                              .slice(0, 5)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{booking.courtName}</span>
                        </div>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>

                    {booking.trainerName && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <User className="h-4 w-4" />
                        <span>Тренер: {booking.trainerName}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gray-500" />
                        <div className="flex items-center gap-2">
                          {booking.membershipApplied && booking.originalPrice !== booking.price && (
                            <span className="text-sm text-gray-400 line-through">
                              {booking.originalPrice.toLocaleString()} ₽
                            </span>
                          )}
                          <span
                            className={`text-sm font-medium ${booking.price === 0 ? "text-green-600" : "text-gray-900"}`}
                          >
                            {booking.price.toLocaleString()} ₽
                          </span>
                          {booking.membershipApplied && (
                            <Badge variant="secondary" className="text-xs">
                              {booking.price === 0 ? "Абонемент" : "Скидка"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">💬 "{booking.notes}"</div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="memberships" className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              Всего абонементов: {mockMembershipHistory.length} • Общая стоимость:{" "}
              {mockMembershipHistory.reduce((sum, membership) => sum + membership.price, 0).toLocaleString()} ₽
            </div>

            <div className="space-y-4">
              {mockMembershipHistory.map((membership) => (
                <Card key={membership.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-lg">{membership.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span>
                            {new Date(membership.purchasedDate).toLocaleDateString("ru-RU")} -{" "}
                            {new Date(membership.expiresDate).toLocaleDateString("ru-RU")}
                          </span>
                          <span className="font-medium text-blue-600">{membership.price.toLocaleString()} ₽</span>
                        </div>
                      </div>
                      {getMembershipStatusBadge(membership.status)}
                    </div>

                    {membership.benefitType === "sessions" ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span>Использовано:</span>
                          <span className="font-medium">
                            {(membership.originalSessions || 0) - (membership.remainingSessions || 0)}/
                            {membership.originalSessions} занятий
                          </span>
                        </div>

                        {membership.usageHistory && membership.usageHistory.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-700">История использования:</h4>
                            {membership.usageHistory.map((usage, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between text-xs text-gray-600 p-2 bg-gray-50 rounded"
                              >
                                <div className="flex items-center gap-2">
                                  <span>{new Date(usage.date).toLocaleDateString("ru-RU")}</span>
                                  <span>•</span>
                                  <span>{usage.reason}</span>
                                </div>
                                <span className="font-medium">-{usage.sessions} занятие</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600">
                        Скидка: {membership.discountPercentage}% на все бронирования
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>Закрыть</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
