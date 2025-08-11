"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Edit, UserCheck, Trash2 } from "lucide-react"

interface GroupBooking {
  id: string
  courtId: string
  date: string
  time: string
  duration: number
  participants: Array<{
    name: string
    phone: string
    roleInBooking: "player" | "coach"
  }>
  isRecurring?: boolean
  recurringWeeks?: string
  notes?: string
}

interface GroupBookingEditModalProps {
  booking: GroupBooking | null
  isOpen: boolean
  onClose: () => void
  onBookingUpdated?: (booking: GroupBooking) => void
  onBookingDeleted?: (bookingId: string) => void
  courts: Array<{ id: string; name: string; type: string; basePrice: number }>
}

export function GroupBookingEditModal({
  booking,
  isOpen,
  onClose,
  onBookingUpdated,
  onBookingDeleted,
  courts,
}: GroupBookingEditModalProps) {
  const [editMode, setEditMode] = useState<"view" | "edit" | "attendance">("view")

  if (!booking) return null

  const selectedCourt = courts.find((court) => court.id === booking.courtId)
  const trainers = booking.participants.filter((p) => p.roleInBooking === "coach")
  const clients = booking.participants.filter((p) => p.roleInBooking === "player")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ru-RU", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (time: string, duration: number) => {
    const [hours, minutes] = time.split(":").map(Number)
    const endHours = Math.floor((hours * 60 + minutes + duration) / 60)
    const endMinutes = (hours * 60 + minutes + duration) % 60
    return `${time} - ${endHours.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`
  }

  const handleDelete = () => {
    if (confirm("Вы уверены, что хотите отменить эту групповую тренировку?")) {
      onBookingDeleted?.(booking.id)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Групповая тренировка - Детали
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Booking Details */}
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h3 className="font-medium text-purple-900 mb-3">Информация о бронировании</h3>
            <div className="space-y-2 text-sm">
              <p>📅 {formatDate(booking.date)}</p>
              <p>🏟️ {selectedCourt?.name}</p>
              <p>
                ⏰ {formatTime(booking.time, booking.duration)} ({booking.duration} минут)
              </p>
              {booking.isRecurring && <p>🔄 Повторяющееся: каждую неделю (осталось {booking.recurringWeeks} недель)</p>}
            </div>
          </div>

          {/* Participants */}
          <div>
            <h3 className="font-medium mb-4">👥 Участники ({booking.participants.length} человек):</h3>
            <div className="space-y-3">
              {/* Trainers */}
              {trainers.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Тренеры:</h4>
                  {trainers.map((trainer, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <span className="text-xl">👨‍🏫</span>
                      <div>
                        <div className="font-medium">{trainer.name}</div>
                        <div className="text-sm text-gray-600">📱 {trainer.phone}</div>
                      </div>
                      <Badge variant="secondary">Тренер</Badge>
                    </div>
                  ))}
                </div>
              )}

              {/* Clients */}
              {clients.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Клиенты:</h4>
                  <div className="space-y-2">
                    {clients.map((client, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <span className="text-xl">🎾</span>
                        <div>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-sm text-gray-600">📱 {client.phone}</div>
                        </div>
                        <Badge variant="secondary">Клиент</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {booking.notes && (
            <div>
              <h3 className="font-medium mb-2">📝 Примечания:</h3>
              <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded-lg">{booking.notes}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setEditMode("edit")} className="flex items-center gap-2" disabled>
              <Edit className="h-4 w-4" />
              Редактировать участников
            </Button>
            <Button
              variant="outline"
              onClick={() => setEditMode("attendance")}
              className="flex items-center gap-2"
              disabled
            >
              <UserCheck className="h-4 w-4" />
              Посещаемость
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Отменить бронирование
            </Button>
          </div>

          {/* Disabled Features Notice */}
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ℹ️ Редактирование участников и отметка посещаемости будут добавлены в следующих обновлениях
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
