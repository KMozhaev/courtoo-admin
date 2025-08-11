"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ParticipantSearchModal } from "@/components/participant-search-modal"
import { Users, Plus, Trash2, Calendar, MapPin } from "lucide-react"
import { getActiveMembership, type ClientMembership } from "@/lib/membership-data"

interface Participant {
  id: string
  name: string
  phone: string
  type: "client" | "trainer"
  roleInBooking: "player" | "coach"
  membership?: ClientMembership
  useMembership: boolean
}

interface GroupBookingTabProps {
  onBookingCreated: (booking: any) => void
  courts: Array<{ id: string; name: string; type: string; basePrice: number }>
  existingBooking?: any
}

const TIME_SLOTS = Array.from({ length: 15 }, (_, i) => {
  const hour = i + 8
  return [`${hour.toString().padStart(2, "0")}:00`, `${hour.toString().padStart(2, "0")}:30`]
}).flat()

export function GroupBookingTab({ onBookingCreated, courts, existingBooking }: GroupBookingTabProps) {
  const [formData, setFormData] = useState({
    courtId: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "08:00",
    duration: "90",
    groupNotes: "",
    isRecurring: false,
    recurringWeeks: "4",
  })

  const [participants, setParticipants] = useState<Participant[]>([])
  const [showParticipantModal, setShowParticipantModal] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  // Mock clients and trainers data
  const mockClients = [
    { id: "1", name: "Анна Петрова", phone: "+7 916 123-45-67", type: "client" as const },
    { id: "2", name: "Михаил Иванов", phone: "+7 925 456-78-90", type: "client" as const },
    { id: "3", name: "Елена Смирнова", phone: "+7 903 789-01-23", type: "client" as const },
    { id: "4", name: "Сергей Волков", phone: "+7 917 234-56-78", type: "client" as const },
    { id: "5", name: "Ольга Козлова", phone: "+7 909 345-67-89", type: "client" as const },
  ]

  const mockTrainers = [
    { id: "t1", name: "Дмитрий Козлов", phone: "+7 905 111-22-33", type: "trainer" as const, hourlyRate: 3000 },
    { id: "t2", name: "Анна Петрова", phone: "+7 916 222-33-44", type: "trainer" as const, hourlyRate: 2500 },
    { id: "t3", name: "Елена Смирнова", phone: "+7 903 333-44-55", type: "trainer" as const, hourlyRate: 2800 },
  ]

  const selectedCourt = courts.find((court) => court.id === formData.courtId)

  const validateForm = (): boolean => {
    const errors: string[] = []

    if (!formData.courtId) errors.push("Выберите корт")
    if (!formData.date) errors.push("Выберите дату")
    if (!formData.startTime) errors.push("Выберите время")
    if (participants.length === 0) errors.push("Добавьте хотя бы одного участника")

    const trainers = participants.filter((p) => p.roleInBooking === "coach")
    if (trainers.length === 0) errors.push("Необходимо добавить хотя бы одного тренера")

    // Check membership sessions for participants using membership
    participants.forEach((participant) => {
      if (participant.useMembership && participant.membership) {
        if (!participant.membership.remainingSessions || participant.membership.remainingSessions <= 0) {
          errors.push(`У ${participant.name} недостаточно занятий по абонементу`)
        }
      }
    })

    setValidationErrors(errors)
    return errors.length === 0
  }

  const handleAddParticipant = (participant: any, role: "player" | "coach") => {
    // Check if participant already added
    if (participants.find((p) => p.id === participant.id)) {
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
      useMembership: !!membership && membership.status === "active",
    }

    setParticipants([...participants, newParticipant])
    setShowParticipantModal(false)
  }

  const handleRemoveParticipant = (participantId: string) => {
    setParticipants(participants.filter((p) => p.id !== participantId))
  }

  const getMembershipDeductions = () => {
    return participants.filter((p) => p.useMembership && p.membership).length
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const endTime = new Date(`2000-01-01T${formData.startTime}:00`)
    endTime.setMinutes(endTime.getMinutes() + Number.parseInt(formData.duration))
    const endTimeString = endTime.toTimeString().slice(0, 5)

    const booking = {
      id: Date.now().toString(),
      courtId: formData.courtId,
      date: formData.date,
      time: formData.startTime,
      endTime: endTimeString,
      status: "group",
      bookingType: "group",
      participants: participants,
      duration: Number.parseInt(formData.duration),
      notes: formData.groupNotes,
      isRecurring: formData.isRecurring,
      recurringWeeks: formData.recurringWeeks,
      membershipDeductions: getMembershipDeductions(),
      createdAt: new Date().toISOString(),
    }

    onBookingCreated(booking)
  }

  const getParticipantIcon = (participant: Participant) => {
    if (participant.roleInBooking === "coach") {
      return "👨‍🏫"
    }
    return "🎾"
  }

  const getParticipantRoleText = (participant: Participant) => {
    return participant.roleInBooking === "coach" ? "Тренер" : "Клиент"
  }

  const getMembershipStatusText = (participant: Participant) => {
    if (!participant.membership) {
      return "⚠️ Нет активного абонемента"
    }

    if (participant.membership.benefitType === "sessions") {
      return `💳 Абонемент: ${participant.membership.remainingSessions} занятий осталось`
    } else {
      return `💳 Абонемент: скидка ${participant.membership.discountPercentage}%`
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Групповая тренировка</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Court & Time Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Корт и время
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Дата</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="court">Корт</Label>
                <Select
                  value={formData.courtId}
                  onValueChange={(value) => setFormData({ ...formData, courtId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите корт" />
                  </SelectTrigger>
                  <SelectContent>
                    {courts.map((court) => (
                      <SelectItem key={court.id} value={court.id}>
                        {court.name} - {court.basePrice} ₽/час
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Время начала</Label>
                <Select
                  value={formData.startTime}
                  onValueChange={(value) => setFormData({ ...formData, startTime: value })}
                >
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Продолжительность</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => setFormData({ ...formData, duration: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="60">1 час</SelectItem>
                    <SelectItem value="90">1.5 часа</SelectItem>
                    <SelectItem value="120">2 часа</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Participants Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Участники группы ({participants.length})
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowParticipantModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить участника
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {participants.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Участники не добавлены</p>
                <p className="text-sm">Нажмите "Добавить участника" для начала</p>
              </div>
            ) : (
              <div className="space-y-3">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getParticipantIcon(participant)}</span>
                        <span className="font-medium">{participant.name}</span>
                        <Badge variant={participant.roleInBooking === "coach" ? "default" : "secondary"}>
                          {getParticipantRoleText(participant)}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">📱 {participant.phone}</div>
                      <div className="text-sm">{getMembershipStatusText(participant)}</div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveParticipant(participant.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recurring Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Повторяющееся бронирование
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="recurring"
                checked={formData.isRecurring}
                onCheckedChange={(checked) => setFormData({ ...formData, isRecurring: checked })}
              />
              <Label htmlFor="recurring">Создать серию повторяющихся занятий</Label>
            </div>

            {formData.isRecurring && (
              <div className="space-y-2">
                <Label htmlFor="weeks">Количество недель</Label>
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
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Примечания</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.groupNotes}
              onChange={(e) => setFormData({ ...formData, groupNotes: e.target.value })}
              placeholder="Дополнительная информация о групповой тренировке..."
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-red-800">
                <h4 className="font-medium mb-2">Исправьте ошибки:</h4>
                <ul className="text-sm space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Booking Summary */}
        {participants.length > 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Подтверждение бронирования</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p>
                    <strong>Корт:</strong> {selectedCourt?.name}
                  </p>
                  <p>
                    <strong>Дата:</strong>{" "}
                    {new Date(formData.date).toLocaleDateString("ru-RU", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p>
                    <strong>Время:</strong> {formData.startTime} - {(() => {
                      const endTime = new Date(`2000-01-01T${formData.startTime}:00`)
                      endTime.setMinutes(endTime.getMinutes() + Number.parseInt(formData.duration))
                      return endTime.toTimeString().slice(0, 5)
                    })()} ({formData.duration} минут)
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Участники:</strong> {participants.length} человек
                  </p>
                  <p>
                    <strong>• Тренеры:</strong> {participants.filter((p) => p.roleInBooking === "coach").length}
                  </p>
                  <p>
                    <strong>• Клиенты:</strong> {participants.filter((p) => p.roleInBooking === "player").length}
                  </p>
                  <p>
                    <strong>Списания с абонементов:</strong> {getMembershipDeductions()} занятий
                  </p>
                </div>
              </div>

              {formData.isRecurring && (
                <div className="text-sm text-blue-700 bg-blue-100 p-2 rounded">
                  🔄 Повторяющееся: каждую неделю ({formData.recurringWeeks} недель)
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700" size="lg">
            <Users className="h-4 w-4 mr-2" />
            Создать групповую тренировку
          </Button>
        </div>
      </form>

      {/* Participant Search Modal */}
      <ParticipantSearchModal
        isOpen={showParticipantModal}
        onClose={() => setShowParticipantModal(false)}
        onParticipantSelected={handleAddParticipant}
        existingParticipantIds={participants.map((p) => p.id)}
        clients={mockClients}
        trainers={mockTrainers}
      />
    </div>
  )
}
