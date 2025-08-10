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
    time: selectedSlot?.time || "",
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

  // Update form data when selectedSlot or editingBooking changes
  useEffect(() => {
    if (editingBooking) {
      // Find matching client if exists
      const matchingClient = mockClients.find(
        (client) => client.name === editingBooking.clientName || client.phone === editingBooking.clientPhone,
      )

      setFormData({
        courtId: editingBooking.courtId,
        time: editingBooking.time,
        clientId: matchingClient?.id || "",
        clientName: editingBooking.clientName || "",
        clientPhone: editingBooking.clientPhone || "",
        trainerId: mockTrainers.find((t) => t.name === editingBooking.trainerName)?.id || "",
        duration: editingBooking.duration?.toString() || "60",
        paymentStatus: editingBooking.status?.includes("paid") ? "paid" : "unpaid",
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
        time: selectedSlot.time,
      }))
      // Reset to defaults for new bookings
      setClientType("new")
      setBookingType("court")
    }
  }, [selectedSlot, editingBooking])

  const selectedCourt = courts.find((court) => court.id === formData.courtId)
  const selectedTrainer = mockTrainers.find((trainer) => trainer.id === formData.trainerId)

  const calculatePrice = () => {
    if (bookingType === "training" && selectedTrainer) {
      return selectedTrainer.hourlyRate * (Number.parseInt(formData.duration) / 60)
    }
    if (selectedCourt) {
      return selectedCourt.basePrice * (Number.parseInt(formData.duration) / 60)
    }
    return 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const booking = {
      courtId: formData.courtId,
      date: selectedDate,
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
      price: calculatePrice(),
      duration: Number.parseInt(formData.duration),
      notes: formData.notes,
      isRecurring: formData.isRecurring,
      recurringWeeks: formData.recurringWeeks,
    }

    onBookingCreate(booking)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingBooking ? "Редактировать бронирование" : "Новое бронирование"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs value={bookingType} onValueChange={setBookingType}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="court">Бронирование корта</TabsTrigger>
              <TabsTrigger value="training">Тренировка с тренером</TabsTrigger>
            </TabsList>

            <TabsContent value="court" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
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

                <div>
                  <Label htmlFor="time">Время</Label>
                  <div className="flex items-center gap-1">
                    <Select
                      value={formData.time.split(":")[0]}
                      onValueChange={(hour) => {
                        const currentMinute = formData.time.split(":")[1] || "00"
                        setFormData({ ...formData, time: `${hour}:${currentMinute}` })
                      }}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue placeholder="Час" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 15 }, (_, i) => i + 8).map((hour) => (
                          <SelectItem key={hour} value={hour.toString().padStart(2, "0")}>
                            {hour.toString().padStart(2, "0")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <span className="text-gray-500">:</span>

                    <Select
                      value={formData.time.split(":")[1] || "00"}
                      onValueChange={(minute) => {
                        const currentHour = formData.time.split(":")[0] || "08"
                        setFormData({ ...formData, time: `${currentHour}:${minute}` })
                      }}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue placeholder="Мин" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="00">00</SelectItem>
                        <SelectItem value="30">30</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Тип клиента</Label>
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
                    className="flex gap-4 mt-2"
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
                  <div className="space-y-2">
                    <Label htmlFor="clientSearch">Поиск клиента</Label>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clientName">Имя клиента</Label>
                      <Input
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        placeholder="Введите имя"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientPhone">Телефон</Label>
                      <Input
                        value={formData.clientPhone}
                        onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                        placeholder="+7 XXX XXX-XX-XX"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="training" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
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
                          {court.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="time">Время</Label>
                  <div className="flex items-center gap-1">
                    <Select
                      value={formData.time.split(":")[0]}
                      onValueChange={(hour) => {
                        const currentMinute = formData.time.split(":")[1] || "00"
                        setFormData({ ...formData, time: `${hour}:${currentMinute}` })
                      }}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue placeholder="Час" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 15 }, (_, i) => i + 8).map((hour) => (
                          <SelectItem key={hour} value={hour.toString().padStart(2, "0")}>
                            {hour.toString().padStart(2, "0")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <span className="text-gray-500">:</span>

                    <Select
                      value={formData.time.split(":")[1] || "00"}
                      onValueChange={(minute) => {
                        const currentHour = formData.time.split(":")[0] || "08"
                        setFormData({ ...formData, time: `${currentHour}:${minute}` })
                      }}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue placeholder="Мин" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="00">00</SelectItem>
                        <SelectItem value="30">30</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="trainer">Тренер</Label>
                <Select
                  value={formData.trainerId}
                  onValueChange={(value) => setFormData({ ...formData, trainerId: value })}
                >
                  <SelectTrigger>
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

              <div className="space-y-4">
                <div>
                  <Label>Тип клиента</Label>
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
                    className="flex gap-4 mt-2"
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
                  <div className="space-y-2">
                    <Label htmlFor="clientSearch">Поиск клиента</Label>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clientName">Имя клиента</Label>
                      <Input
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        placeholder="Введите имя"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientPhone">Телефон</Label>
                      <Input
                        value={formData.clientPhone}
                        onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                        placeholder="+7 XXX XXX-XX-XX"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Продолжительность</Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => setFormData({ ...formData, duration: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 минут</SelectItem>
                  <SelectItem value="60">1 час</SelectItem>
                  <SelectItem value="90">1.5 часа</SelectItem>
                  <SelectItem value="120">2 часа</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Статус оплаты</Label>
              <RadioGroup
                value={formData.paymentStatus}
                onValueChange={(value) => setFormData({ ...formData, paymentStatus: value })}
                className="flex gap-4 mt-2"
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

          {!editingBooking && (
            <div>
              <Label>Повторяющееся бронирование</Label>
              <div className="space-y-3 mt-2">
                <RadioGroup
                  value={formData.isRecurring ? "yes" : "no"}
                  onValueChange={(value) => setFormData({ ...formData, isRecurring: value === "yes" })}
                  className="flex gap-4"
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
                  <div>
                    <Label htmlFor="weeks">Количество недель</Label>
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

          <div>
            <Label htmlFor="notes">Примечания</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Дополнительная информация..."
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-lg font-semibold">Итого: {calculatePrice()} ₽</div>
            <div className="flex gap-3">
              {editingBooking && onBookingDelete && (
                <Button type="button" variant="destructive" onClick={() => onBookingDelete(editingBooking.id)}>
                  Удалить
                </Button>
              )}
              <Button type="button" variant="outline" onClick={onClose}>
                Отмена
              </Button>
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
