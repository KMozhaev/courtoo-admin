"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Users, Plus, X } from "lucide-react"
import { ParticipantSearchModal } from "@/components/participant-search-modal"
import { getActiveMembership, type ClientMembership } from "@/lib/membership-data"

interface Participant {
  id: string
  name: string
  phone: string
  type: "client" | "trainer"
  roleInBooking: "player" | "coach"
  membership?: ClientMembership | null
}

interface GroupBookingTabProps {
  onBookingCreated: (booking: any) => void
  courts: Array<{ id: string; name: string; type: string; basePrice: number }>
  existingBooking?: any
}

const mockClients = [
  { id: "1", name: "Анна Петрова", phone: "+7 916 123-45-67" },
  { id: "2", name: "Михаил Иванов", phone: "+7 925 456-78-90" },
  { id: "3", name: "Елена Смирнова", phone: "+7 903 789-01-23" },
  { id: "4", name: "Сергей Волков", phone: "+7 917 234-56-78" },
  { id: "5", name: "Ольга Козлова", phone: "+7 909 345-67-89" },
]

const mockTrainers = [
  { id: "1", name: "Дмитрий Козлов", phone: "+7 905 111-22-33", hourlyRate: 3000 },
  { id: "2", name: "Анна Петрова", phone: "+7 916 444-55-66", hourlyRate: 2500 },
  { id: "3", name: "Елена Смирнова", phone: "+7 903 777-88-99", hourlyRate: 2800 },
]

const TIME_SLOTS = Array.from({ length: 15 }, (_, i) => {
  const hour = i + 8
  return [`${hour.toString().padStart(2, "0")}:00`, `${hour.toString().padStart(2, "0")}:30`]
}).flat()

export function GroupBookingTab({ onBookingCreated, courts, existingBooking }: GroupBookingTabProps) {
  const [formData, setFormData] = useState({
    courtId: "",
    date: new Date().toISOString().split("T")[0],
    time: "08:00",
    duration: "60",
    notes: "",
    isRecurring: false,
    recurringWeeks: "4",
  })

  const [participants, setParticipants] = useState<Participant[]>([])
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)

  const handleAddParticipant = (participant: any, role: "player" | "coach") => {
    // Check if participant already exists
    if (participants.some((p) => p.id === participant.id)) {
      return
    }

    const membership = participant.type === "client" ? getActiveMembership(participant.id) : null

    const newParticipant: Participant = {
      id: participant.id,
      name: participant.name,
      phone: participant.phone,
      type: participant.type,
      roleInBooking: role,
      membership,
    }

    setParticipants([...participants, newParticipant])
    setIsSearchModalOpen(false)
  }

  const handleRemoveParticipant = (participantId: string) => {
    setParticipants(participants.filter((p) => p.id !== participantId))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (participants.length === 0) {
      alert("Добавьте хотя бы одного участника")
      return
    }

    const trainers = participants.filter((p) => p.roleInBooking === "coach")
    if (trainers.length === 0) {
      alert("Добавьте хотя бы одного тренера")
      return
    }

    const booking = {
      courtId: formData.courtId,
      date: formData.date,
      time: formData.time,
      status: "group",
      bookingType: "group",
      duration: Number.parseInt(formData.duration),
      notes: formData.notes,
      isRecurring: formData.isRecurring,
      recurringWeeks: formData.recurringWeeks,
      participants: participants.map((p) => ({
        name: p.name,
        phone: p.phone,
        roleInBooking: p.roleInBooking,
      })),
      participantCount: participants.length,
      clientName: `Группа ${participants.length} чел.`,
      trainerName: trainers.map((t) => t.name).join(", "),
      price: 0, // Group bookings don't show price
    }

    onBookingCreated(booking)
  }

  const participantsWithMembership = participants.filter((p) => p.membership && p.membership.remainingSessions > 0)
  const totalMembershipDeductions = participantsWithMembership.length

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Групповая тренировка
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Court, Date, Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium">
                  Дата
                </Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="court" className="text-sm font-medium">
                  Корт
                </Label>
                <Select
                  value={formData.courtId}
                  onValueChange={(value) => setFormData({ ...formData, courtId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите корт" />
                  </SelectTrigger>
                  <SelectContent>
                    {courts.map((court) => (
                      <SelectItem key={court.id} value={court.id}>
                        {court.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="text-sm font-medium">
                  Время
                </Label>
                <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите время" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium">
                Продолжительность
              </Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => setFormData({ ...formData, duration: value })}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="60">1 час</SelectItem>
                  <SelectItem value="90">1.5 часа</SelectItem>
                  <SelectItem value="120">2 часа</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Participants Management */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Участники группы</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSearchModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Добавить участника
                </Button>
              </div>

              {participants.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Участники не добавлены</p>
                  <p className="text-sm">Нажмите "Добавить участника" для начала</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{participant.roleInBooking === "coach" ? "👨‍🏫" : "🎾"}</div>
                        <div>
                          <div className="font-medium">
                            {participant.name}{" "}
                            <Badge variant="secondary" className="ml-2">
                              {participant.roleInBooking === "coach" ? "Тренер" : "Клиент"}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">📱 {participant.phone}</div>
                          {participant.membership && (
                            <div className="text-sm text-purple-600">
                              💳 {participant.membership.membershipName}: {participant.membership.remainingSessions}{" "}
                              занятий осталось
                            </div>
                          )}
                          {participant.type === "client" && !participant.membership && (
                            <div className="text-sm text-orange-600">⚠️ Нет активного членства</div>
                          )}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveParticipant(participant.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recurring Settings */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Повторяющееся бронирование</Label>
              <RadioGroup
                value={formData.isRecurring ? "yes" : "no"}
                onValueChange={(value) => setFormData({ ...formData, isRecurring: value === "yes" })}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no-recurring" />
                  <Label htmlFor="no-recurring">Разовое</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes-recurring" />
                  <Label htmlFor="yes-recurring">Еженедельно</Label>
                </div>
              </RadioGroup>

              {formData.isRecurring && (
                <div className="space-y-2">
                  <Label htmlFor="weeks" className="text-sm font-medium">
                    Количество недель
                  </Label>
                  <Input
                    type="number"
                    min="2"
                    max="52"
                    value={formData.recurringWeeks}
                    onChange={(e) => setFormData({ ...formData, recurringWeeks: e.target.value })}
                    className="w-32"
                  />
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Примечания
              </Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Дополнительная информация о групповой тренировке..."
                rows={3}
              />
            </div>

            {/* Summary */}
            {participants.length > 0 && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Сводка по бронированию</h4>
                <div className="text-sm text-purple-700 space-y-1">
                  <p>👥 Участников: {participants.length}</p>
                  <p>
                    👨‍🏫 Тренеров: {participants.filter((p) => p.roleInBooking === "coach").length} | 🎾 Клиентов:{" "}
                    {participants.filter((p) => p.roleInBooking === "player").length}
                  </p>
                  <p>💳 Списания с членств: {totalMembershipDeductions} занятий</p>
                  {formData.isRecurring && <p>🔄 Повторяющееся: каждую неделю ({formData.recurringWeeks} недель)</p>}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={participants.length === 0}>
                Создать групповую тренировку
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <ParticipantSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onParticipantSelected={handleAddParticipant}
        existingParticipantIds={participants.map((p) => p.id)}
        clients={mockClients}
        trainers={mockTrainers}
      />
    </div>
  )
}
