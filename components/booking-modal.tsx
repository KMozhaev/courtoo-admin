"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"

import {
  getActiveMembership,
  calculateBookingPrice,
  validateMembershipForBooking,
  getSuggestedBookingTimes,
  createBookingDateTime,
  deductMembershipSession,
  type ClientMembership,
  type PriceCalculationResult,
} from "@/lib/membership-data"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  selectedSlot: { courtId: string; time: string } | null
  selectedDate: string
  courts: Array<{ id: string; name: string; type: string; basePrice: number }>
  editingBooking?: any
  onBookingCreate: (booking: any) => void
  onBookingDelete?: (bookingId: string) => void
}

const mockTrainers = [
  { id: "1", name: "Анна Петрова", hourlyRate: 2500 },
  { id: "2", name: "Дмитрий Козлов", hourlyRate: 3000 },
  { id: "3", name: "Елена Смирнова", hourlyRate: 2800 },
]

const mockClients = [
  { id: "1", name: "Анна Петрова", phone: "+7 916 123-45-67" },
  { id: "2", name: "Михаил Иванов", phone: "+7 925 456-78-90" },
  { id: "3", name: "Елена Смирнова", phone: "+7 903 789-01-23" },
  { id: "4", name: "Сергей Волков", phone: "+7 917 234-56-78" },
  { id: "5", name: "Ольга Козлова", phone: "+7 909 345-67-89" },
]

const TIME_SLOTS = Array.from({ length: 15 }, (_, i) => {
  const hour = i + 8
  return [`${hour.toString().padStart(2, "0")}:00`, `${hour.toString().padStart(2, "0")}:30`]
}).flat()

export function BookingModal({
  isOpen,
  onClose,
  selectedSlot,
  selectedDate,
  courts,
  editingBooking,
  onBookingCreate,
  onBookingDelete,
}: BookingModalProps) {
  const [bookingType, setBookingType] = useState("court")
  const [clientType, setClientType] = useState("new")
  const [formData, setFormData] = useState({
    courtId: selectedSlot?.courtId || "",
    date: selectedDate,
    time: selectedSlot?.time || "08:00",
    clientId: "",
    clientName: "",
    clientPhone: "",
    trainerId: "",
    duration: "60",
    paymentStatus: "unpaid",
    notes: "",
    isRecurring: false,
    recurringWeeks: "4",
  })

  const [membership, setMembership] = useState<ClientMembership | null>(null)
  const [priceCalculation, setPriceCalculation] = useState<PriceCalculationResult | null>(null)
  const [membershipValidation, setMembershipValidation] = useState<{
    isValid: boolean
    reason?: string
    suggestions?: string[]
  } | null>(null)
  const [suggestedTimes, setSuggestedTimes] = useState<string[]>([])

  const selectedCourt = courts.find((court) => court.id === formData.courtId)
  const selectedTrainer = mockTrainers.find((trainer) => trainer.id === formData.trainerId)

  // Update form data when selectedSlot or editingBooking changes
  useEffect(() => {
    if (editingBooking) {
      // Find matching client if exists
      const matchingClient = mockClients.find(
        (client) => client.name === editingBooking.clientName || client.phone === editingBooking.clientPhone,
      )

      // Determine payment status from existing booking status - preserve original state
      let paymentStatus = "unpaid" // Default to unpaid
      if (editingBooking.status === "court_paid" || editingBooking.status === "training_paid") {
        paymentStatus = "paid"
      }

      setFormData({
        courtId: editingBooking.courtId,
        date: editingBooking.date || selectedDate,
        time: editingBooking.time || "08:00",
        clientId: matchingClient?.id || "",
        clientName: editingBooking.clientName || "",
        clientPhone: editingBooking.clientPhone || "",
        trainerId: mockTrainers.find((t) => t.name === editingBooking.trainerName)?.id || "",
        duration: editingBooking.duration?.toString() || "60",
        paymentStatus: paymentStatus,
        notes: editingBooking.notes || "",
        isRecurring: false,
        recurringWeeks: "4",
      })
      setBookingType(editingBooking.trainerName ? "training" : "court")
      setClientType(matchingClient ? "existing" : "new")
    } else if (selectedSlot) {
      setFormData((prev) => ({
        ...prev,
        courtId: selectedSlot.courtId,
        date: selectedDate,
        time: selectedSlot.time || "08:00",
        // Reset other fields for new bookings
        clientId: "",
        clientName: "",
        clientPhone: "",
        trainerId: "",
        duration: "60",
        paymentStatus: "unpaid",
        notes: "",
      }))
      // Reset to defaults for new bookings
      setClientType("new")
      setBookingType("court")
    }
  }, [selectedSlot, editingBooking, selectedDate])

  // Add this after the existing useEffect
  useEffect(() => {
    if (formData.clientName && (selectedSlot || editingBooking)) {
      // Find client by name to get membership
      const matchingClient = mockClients.find((client) => client.name === formData.clientName)

      if (matchingClient) {
        const activeMembership = getActiveMembership(matchingClient.id)
        setMembership(activeMembership)

        if (activeMembership) {
          // Calculate price with membership based on duration
          const bookingDateTime = createBookingDateTime(formData.date, formData.time)
          const durationHours = Number.parseInt(formData.duration) / 60
          const basePrice = (selectedCourt?.basePrice || 0) * durationHours
          const priceResult = calculateBookingPrice(basePrice, activeMembership, bookingDateTime)
          setPriceCalculation(priceResult)

          // Validate membership for this booking
          const validation = validateMembershipForBooking(activeMembership, formData.date, formData.time)
          setMembershipValidation(validation)

          // Get suggested times if membership is restricted
          if (!validation.isValid && activeMembership.timeRestrictions) {
            const availableSlots = TIME_SLOTS
            const suggestions = getSuggestedBookingTimes(activeMembership, formData.date, availableSlots)
            setSuggestedTimes(suggestions.slice(0, 6))
          }
        } else {
          // No membership - regular pricing
          const durationHours = Number.parseInt(formData.duration) / 60
          const basePrice = (selectedCourt?.basePrice || 0) * durationHours
          setPriceCalculation({
            finalPrice: basePrice,
            paymentStatus: "unpaid",
            membershipApplied: false,
            originalPrice: basePrice,
          })
          setMembershipValidation(null)
          setSuggestedTimes([])
        }
      } else {
        // Clear membership when no client is found
        setMembership(null)
        setPriceCalculation(null)
        setMembershipValidation(null)
        setSuggestedTimes([])
      }
    } else {
      // Clear membership when client name is empty
      setMembership(null)
      setPriceCalculation(null)
      setMembershipValidation(null)
      setSuggestedTimes([])
    }
  }, [formData.clientName, formData.time, formData.duration, formData.date, selectedCourt])

  const calculatePrice = () => {
    const durationHours = Number.parseInt(formData.duration) / 60
    if (bookingType === "training" && selectedTrainer) {
      return selectedTrainer.hourlyRate * durationHours
    }
    if (selectedCourt) {
      return selectedCourt.basePrice * durationHours
    }
    return 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const finalPrice = priceCalculation?.finalPrice === 0 ? 0 : priceCalculation?.finalPrice || calculatePrice()
    const membershipApplied = priceCalculation?.membershipApplied || false

    const booking = {
      courtId: formData.courtId,
      date: formData.date, // Use form date instead of selectedDate
      time: formData.time,
      status:
        bookingType === "training"
          ? formData.paymentStatus === "paid"
            ? "training_paid"
            : "training_unpaid"
          : formData.paymentStatus === "paid"
            ? "court_paid"
            : "court_unpaid",
      clientName: formData.clientName,
      clientPhone: formData.clientPhone,
      trainerName: selectedTrainer?.name,
      price: finalPrice,
      duration: Number.parseInt(formData.duration),
      notes: formData.notes,
      isRecurring: formData.isRecurring,
      recurringWeeks: formData.recurringWeeks,

      // New membership fields
      membershipApplied,
      membershipId: membershipApplied ? membership?.id : undefined,
      originalPrice: priceCalculation?.originalPrice || calculatePrice(),
      finalPrice,
      paymentStatus: priceCalculation?.paymentStatus || "unpaid",
    }

    // Deduct session if membership was applied - ONLY for new bookings
    if (membershipApplied && membership?.benefitType === "sessions" && membership.id && !editingBooking) {
      deductMembershipSession(membership.id, `booking_${Date.now()}`)
    }

    onBookingCreate(booking)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {editingBooking ? "Редактировать бронирование" : "Новое бронирование"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Tabs value={bookingType} onValueChange={setBookingType}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="court">Бронирование корта</TabsTrigger>
              <TabsTrigger value="training">Тренировка с тренером</TabsTrigger>
            </TabsList>

            <TabsContent value="court" className="space-y-6">
              {/* Date, Court, Time Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium">
                    Дата
                  </Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="court" className="text-sm font-medium">
                    Корт
                  </Label>
                  <Select
                    value={formData.courtId}
                    onValueChange={(value) => setFormData({ ...formData, courtId: value })}
                  >
                    <SelectTrigger className="w-full">
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
                  <Label htmlFor="time" className="text-sm font-medium">
                    Время
                  </Label>
                  <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })}>
                    <SelectTrigger className="w-full">
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

              {/* Client Type Section */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-3 block">Тип клиента</Label>
                  <RadioGroup
                    value={clientType}
                    onValueChange={(value) => {
                      setClientType(value)
                      if (value === "existing") {
                        setFormData({ ...formData, clientName: "", clientPhone: "", clientId: "" })
                      } else {
                        setFormData({ ...formData, clientId: "" })
                      }
                    }}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="new" id="new-client" />
                      <Label htmlFor="new-client">Новый клиент</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="existing" id="existing-client" />
                      <Label htmlFor="existing-client">Существующий клиент</Label>
                    </div>
                  </RadioGroup>
                </div>

                {clientType === "existing" ? (
                  <div className="space-y-3">
                    <Label htmlFor="clientSearch" className="text-sm font-medium">
                      Поиск клиента
                    </Label>
                    <div className="relative">
                      <Input
                        id="clientSearch"
                        value={formData.clientName}
                        onChange={(e) => {
                          const searchValue = e.target.value
                          setFormData({ ...formData, clientName: searchValue, clientPhone: "", clientId: "" })

                          // Find matching client by name OR phone
                          const matchingClient = mockClients.find(
                            (client) =>
                              client.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                              client.phone.includes(searchValue),
                          )

                          if (
                            matchingClient &&
                            (matchingClient.name === searchValue || matchingClient.phone === searchValue)
                          ) {
                            setFormData({
                              ...formData,
                              clientId: matchingClient.id,
                              clientName: matchingClient.name,
                              clientPhone: matchingClient.phone,
                            })
                          }
                        }}
                        placeholder="Начните вводить имя или телефон..."
                        required
                        className="w-full"
                      />

                      {/* Show filtered suggestions */}
                      {formData.clientName && !formData.clientId && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                          {mockClients
                            .filter(
                              (client) =>
                                (client.name.toLowerCase().includes(formData.clientName.toLowerCase()) ||
                                  client.phone.includes(formData.clientName)) &&
                                formData.clientName.length > 0,
                            )
                            .map((client) => (
                              <div
                                key={client.id}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    clientId: client.id,
                                    clientName: client.name,
                                    clientPhone: client.phone,
                                  })
                                }}
                              >
                                {client.name} - {client.phone}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>

                    {formData.clientPhone && formData.clientId && (
                      <div className="text-sm text-gray-600">Телефон: {formData.clientPhone}</div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="clientName" className="text-sm font-medium">
                        Имя клиента
                      </Label>
                      <Input
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        placeholder="Введите имя"
                        required
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientPhone" className="text-sm font-medium">
                        Телефон
                      </Label>
                      <Input
                        value={formData.clientPhone}
                        onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                        placeholder="+7 XXX XXX-XX-XX"
                        required
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="training" className="space-y-6">
              {/* Date, Court, Time Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium">
                    Дата
                  </Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="court" className="text-sm font-medium">
                    Корт
                  </Label>
                  <Select
                    value={formData.courtId}
                    onValueChange={(value) => setFormData({ ...formData, courtId: value })}
                  >
                    <SelectTrigger className="w-full">
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
                    <SelectTrigger className="w-full">
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

              {/* Trainer Selection */}
              <div className="space-y-2">
                <Label htmlFor="trainer" className="text-sm font-medium">
                  Тренер
                </Label>
                <Select
                  value={formData.trainerId}
                  onValueChange={(value) => setFormData({ ...formData, trainerId: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите тренера" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTrainers.map((trainer) => (
                      <SelectItem key={trainer.id} value={trainer.id}>
                        {trainer.name} - {trainer.hourlyRate} ₽/час
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Client Type Section - Same as court booking */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-3 block">Тип клиента</Label>
                  <RadioGroup
                    value={clientType}
                    onValueChange={(value) => {
                      setClientType(value)
                      if (value === "existing") {
                        setFormData({ ...formData, clientName: "", clientPhone: "", clientId: "" })
                      } else {
                        setFormData({ ...formData, clientId: "" })
                      }
                    }}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="new" id="new-client-training" />
                      <Label htmlFor="new-client-training">Новый клиент</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="existing" id="existing-client-training" />
                      <Label htmlFor="existing-client-training">Существующий клиент</Label>
                    </div>
                  </RadioGroup>
                </div>

                {clientType === "existing" ? (
                  <div className="space-y-3">
                    <Label htmlFor="clientSearch" className="text-sm font-medium">
                      Поиск клиента
                    </Label>
                    <div className="relative">
                      <Input
                        id="clientSearch"
                        value={formData.clientName}
                        onChange={(e) => {
                          const searchValue = e.target.value
                          setFormData({ ...formData, clientName: searchValue, clientPhone: "", clientId: "" })

                          const matchingClient = mockClients.find(
                            (client) =>
                              client.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                              client.phone.includes(searchValue),
                          )

                          if (
                            matchingClient &&
                            (matchingClient.name === searchValue || matchingClient.phone === searchValue)
                          ) {
                            setFormData({
                              ...formData,
                              clientId: matchingClient.id,
                              clientName: matchingClient.name,
                              clientPhone: matchingClient.phone,
                            })
                          }
                        }}
                        placeholder="Начните вводить имя или телефон..."
                        required
                        className="w-full"
                      />

                      {formData.clientName && !formData.clientId && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                          {mockClients
                            .filter(
                              (client) =>
                                (client.name.toLowerCase().includes(formData.clientName.toLowerCase()) ||
                                  client.phone.includes(formData.clientName)) &&
                                formData.clientName.length > 0,
                            )
                            .map((client) => (
                              <div
                                key={client.id}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    clientId: client.id,
                                    clientName: client.name,
                                    clientPhone: client.phone,
                                  })
                                }}
                              >
                                {client.name} - {client.phone}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>

                    {formData.clientPhone && formData.clientId && (
                      <div className="text-sm text-gray-600">Телефон: {formData.clientPhone}</div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="clientName" className="text-sm font-medium">
                        Имя клиента
                      </Label>
                      <Input
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        placeholder="Введите имя"
                        required
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientPhone" className="text-sm font-medium">
                        Телефон
                      </Label>
                      <Input
                        value={formData.clientPhone}
                        onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                        placeholder="+7 XXX XXX-XX-XX"
                        required
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Compact Membership Section */}
          {membership && (
            <div className="flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${membershipValidation?.isValid ? "bg-green-500" : "bg-yellow-500"}`}
                />
                <span className="text-sm font-medium">{membership.membershipName}</span>
                <Badge variant="secondary" className="text-xs">
                  {membership.benefitType === "sessions"
                    ? `${membership.remainingSessions}/${membership.originalSessions}`
                    : `-${membership.discountPercentage}%`}
                </Badge>
                {membershipValidation?.isValid ? (
                  <span className="text-xs text-green-700">Применяется</span>
                ) : (
                  <span className="text-xs text-yellow-700">{membershipValidation?.reason}</span>
                )}
              </div>
              {priceCalculation?.membershipApplied && (
                <span className="text-sm font-medium text-purple-600">{priceCalculation.finalPrice}₽</span>
              )}
            </div>
          )}

          {/* Duration and Payment Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium">
                Продолжительность
              </Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => setFormData({ ...formData, duration: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="60">1 час</SelectItem>
                  <SelectItem value="90">1.5 часа</SelectItem>
                  <SelectItem value="120">2 часа</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Статус оплаты</Label>
              <RadioGroup
                value={formData.paymentStatus}
                onValueChange={(value) => setFormData({ ...formData, paymentStatus: value })}
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paid" id="paid" />
                  <Label htmlFor="paid">Оплачено</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unpaid" id="unpaid" />
                  <Label htmlFor="unpaid">Не оплачено</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Recurring Booking Section */}
          {!editingBooking && (
            <div className="space-y-4">
              <Label className="text-sm font-medium">Повторяющееся бронирование</Label>
              <div className="space-y-4">
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
                      placeholder="Введите количество недель"
                      className="w-32"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes Section */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Примечания
            </Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Дополнительная информация..."
              rows={3}
              className="w-full"
            />
          </div>

          {/* Footer with Price and Actions */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="text-lg font-semibold">
              Итого: {priceCalculation?.finalPrice === 0 ? 0 : priceCalculation?.finalPrice || calculatePrice()} ₽
              {priceCalculation?.membershipApplied && (
                <div className="text-sm font-normal text-gray-600">
                  {membership?.benefitType === "sessions"
                    ? `Списано: 1 занятие (осталось ${(membership?.remainingSessions || 1) - 1})`
                    : `Применена скидка ${membership?.discountPercentage}%`}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              {editingBooking && onBookingDelete && (
                <Button type="button" variant="destructive" onClick={() => onBookingDelete(editingBooking.id)}>
                  Отменить бронирование
                </Button>
              )}
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {editingBooking ? "Сохранить" : "Создать бронирование"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
