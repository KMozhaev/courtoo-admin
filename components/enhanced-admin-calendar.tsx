"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Plus } from "lucide-react"
import { BookingModal } from "@/components/booking-modal"
import { GroupBookingEditModal } from "@/components/group-booking-edit-modal"
import { SuccessNotification } from "@/components/success-notification"

interface BookingSlot {
  id: string
  courtId: string
  date: string
  time: string
  status: "free" | "court_paid" | "court_unpaid" | "training_paid" | "training_unpaid" | "blocked" | "group"
  clientName?: string
  clientPhone?: string
  trainerName?: string
  price?: number
  duration?: number
  notes?: string
  isRecurring?: boolean
  recurringWeeks?: string
  bookingType?: "individual" | "group"
  participants?: Array<{
    name: string
    phone: string
    roleInBooking: "player" | "coach"
  }>
  participantCount?: number
}

interface EnhancedAdminCalendarProps {
  bookings: BookingSlot[]
  setBookings: (bookings: BookingSlot[]) => void
  clients?: Array<{ id: string; name: string; phone: string }>
}

const COURTS = [
  { id: "1", name: "Корт 1 (Хард)", type: "hard", basePrice: 600 },
  { id: "2", name: "Корт 2 (Хард)", type: "hard", basePrice: 480 },
  { id: "3", name: "Корт 3 (Грунт)", type: "clay", basePrice: 720 },
  { id: "4", name: "Корт 4 (Грунт)", type: "clay", basePrice: 600 },
]

const TIME_SLOTS = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
]

export function EnhancedAdminCalendar({ bookings, setBookings, clients }: EnhancedAdminCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [courtFilter, setCourtFilter] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<{ courtId: string; time: string } | null>(null)
  const [editingBooking, setEditingBooking] = useState<BookingSlot | null>(null)
  const [selectedGroupBooking, setSelectedGroupBooking] = useState<BookingSlot | null>(null)
  const [showGroupEditModal, setShowGroupEditModal] = useState(false)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [successDetails, setSuccessDetails] = useState<any>(null)

  const getBookingForSlot = (courtId: string, time: string) => {
    return bookings.find((booking) => {
      if (booking.courtId !== courtId || booking.date !== selectedDate.toISOString().split("T")[0]) {
        return false
      }

      // Check if this time slot is within the booking duration
      const bookingStartTime = booking.time
      const bookingDuration = booking.duration || 60
      const bookingStartMinutes =
        Number.parseInt(bookingStartTime.split(":")[0]) * 60 + Number.parseInt(bookingStartTime.split(":")[1])
      const slotMinutes = Number.parseInt(time.split(":")[0]) * 60 + Number.parseInt(time.split(":")[1])

      return slotMinutes >= bookingStartMinutes && slotMinutes < bookingStartMinutes + bookingDuration
    })
  }

  const getStatusColor = (status: BookingSlot["status"]) => {
    switch (status) {
      case "court_paid":
        return "bg-green-100 border-green-300 text-green-800"
      case "court_unpaid":
        return "bg-yellow-100 border-yellow-300 text-yellow-800"
      case "training_paid":
      case "training_unpaid":
        return "bg-blue-100 border-blue-300 text-blue-800"
      case "group":
        return "bg-purple-100 border-purple-300 text-purple-800"
      case "blocked":
        return "bg-gray-100 border-gray-300 text-gray-600"
      default:
        return "bg-white border-gray-200 hover:bg-gray-50"
    }
  }

  const handleSlotClick = (courtId: string, time: string) => {
    const existingBooking = getBookingForSlot(courtId, time)
    if (existingBooking) {
      if (existingBooking.bookingType === "group") {
        // Open group booking edit modal
        setSelectedGroupBooking(existingBooking)
        setShowGroupEditModal(true)
        return
      }
      // Edit existing individual booking
      setSelectedSlot({ courtId, time })
      setEditingBooking(existingBooking)
      setIsModalOpen(true)
    } else {
      // Create new booking
      setSelectedSlot({ courtId, time })
      setEditingBooking(null)
      setIsModalOpen(true)
    }
  }

  const handleBookingCreate = (booking: any) => {
    const selectedCourt = COURTS.find((court) => court.id === booking.courtId)

    if (editingBooking) {
      // Update existing booking
      setBookings(bookings.map((b) => (b.id === editingBooking.id ? { ...booking, id: editingBooking.id } : b)))
    } else {
      // Create new booking(s)
      if (booking.isRecurring) {
        const newBookings = []
        const formDate = new Date(booking.date)
        for (let week = 0; week < Number.parseInt(booking.recurringWeeks); week++) {
          const bookingDate = new Date(formDate)
          bookingDate.setDate(bookingDate.getDate() + week * 7)
          newBookings.push({
            ...booking,
            id: `${Date.now()}_${week}`,
            date: bookingDate.toISOString().split("T")[0],
          })
        }
        setBookings([...bookings, ...newBookings])
      } else {
        // Single booking
        setBookings([...bookings, { ...booking, id: Date.now().toString() }])
      }

      // Show success notification
      const bookingType = booking.bookingType === "group" ? "group" : "individual"
      const participantsWithMembership =
        booking.participants?.filter((p: any) => p.membership?.remainingSessions > 0) || []

      setSuccessDetails({
        courtName: selectedCourt?.name || "Корт",
        date: new Date(booking.date).toLocaleDateString("ru-RU"),
        time: `${booking.time} - ${booking.time.split(":")[0]}:${(Number.parseInt(booking.time.split(":")[1]) + booking.duration).toString().padStart(2, "0")}`,
        participantCount: booking.participantCount,
        membershipDeductions: participantsWithMembership.length,
        recurringInfo: booking.isRecurring
          ? `${booking.recurringWeeks} недель по ${new Date(booking.date).toLocaleDateString("ru-RU", { weekday: "long" })}`
          : undefined,
        trainerName: booking.trainerName,
        clientName: booking.clientName,
      })
      setShowSuccessNotification(true)
    }

    setIsModalOpen(false)
    setSelectedSlot(null)
    setEditingBooking(null)
  }

  const filteredCourts = courtFilter === "all" ? COURTS : COURTS.filter((court) => court.type === courtFilter)

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Mobile-Optimized Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <input
              type="date"
              value={selectedDate.toISOString().split("T")[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-md text-sm min-w-[140px]"
            />
          </div>

          <Select value={courtFilter} onValueChange={setCourtFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Фильтр по кортам" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все корты</SelectItem>
              <SelectItem value="hard">Хард</SelectItem>
              <SelectItem value="clay">Грунт</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 touch-manipulation"
          size="lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Бронирование
        </Button>
      </div>

      {/* Mobile-Optimized Calendar Grid */}
      <Card className="p-3 sm:p-6 overflow-x-auto">
        <div
          className="calendar-grid min-w-[600px]"
          style={{ gridTemplateColumns: `80px repeat(${filteredCourts.length}, 1fr)` }}
        >
          {/* Header */}
          <div></div>
          {filteredCourts.map((court) => (
            <div key={court.id} className="text-center p-2 bg-gray-50 rounded-lg">
              <div className="font-semibold text-xs sm:text-sm">{court.name}</div>
              <div className="text-xs text-gray-600">{court.basePrice} ₽/час</div>
            </div>
          ))}

          {/* Time slots */}
          {TIME_SLOTS.map((time) => (
            <>
              <div key={time} className="flex items-center justify-center font-medium text-xs text-gray-600 py-2">
                {time}
              </div>
              {filteredCourts.map((court) => {
                const booking = getBookingForSlot(court.id, time)
                const isBookingStart = booking && booking.time === time

                return (
                  <div
                    key={`${court.id}-${time}`}
                    className={`calendar-slot min-h-[40px] sm:min-h-[50px] p-1 border rounded-lg cursor-pointer transition-colors touch-manipulation ${
                      booking ? getStatusColor(booking.status) : "bg-white border-gray-200 hover:bg-gray-50"
                    } ${booking?.bookingType === "group" ? "border-l-4 border-l-purple-500" : ""}`}
                    onClick={() => handleSlotClick(court.id, time)}
                  >
                    {booking && isBookingStart && (
                      <div className="text-xs">
                        <div className="font-semibold booking-info truncate">
                          {booking.bookingType === "group" ? (
                            <>
                              <span className="mr-1">👥</span>
                              {booking.participantCount || 0} чел.
                            </>
                          ) : (
                            booking.clientName
                          )}
                        </div>
                        {booking.trainerName &&
                          (booking.status === "training_paid" || booking.status === "training_unpaid") && (
                            <div className="text-gray-600 booking-info truncate">с {booking.trainerName}</div>
                          )}
                        {booking.bookingType === "group" && booking.participants && (
                          <div className="text-gray-600 booking-info truncate">
                            {booking.participants
                              .filter((p) => p.roleInBooking === "coach")
                              .map((p) => p.name)
                              .join(", ")}
                          </div>
                        )}
                        {booking.bookingType !== "group" && (
                          <>
                            <div className="font-medium">{booking.price} ₽</div>
                            <div className="text-gray-500">{booking.duration}мин</div>
                          </>
                        )}
                        {booking.bookingType === "group" && <div className="text-gray-500">{booking.duration}мин</div>}
                      </div>
                    )}
                    {booking && !isBookingStart && <div className="text-xs text-center text-gray-500">↑</div>}
                  </div>
                )
              })}
            </>
          ))}
        </div>
      </Card>

      {/* Mobile-Optimized Legend */}
      <div className="grid grid-cols-1 sm:flex sm:items-center gap-3 sm:gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded flex-shrink-0"></div>
          <span>Корт оплачен</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded flex-shrink-0"></div>
          <span>Корт не оплачен</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded flex-shrink-0"></div>
          <span>Тренировка</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded flex-shrink-0"></div>
          <span>Групповая тренировка</span>
        </div>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedSlot(null)
          setEditingBooking(null)
        }}
        selectedSlot={selectedSlot}
        selectedDate={selectedDate.toISOString().split("T")[0]}
        courts={COURTS}
        editingBooking={editingBooking}
        onBookingCreate={handleBookingCreate}
        onBookingDelete={(bookingId) => {
          setBookings(bookings.filter((b) => b.id !== bookingId))
          setIsModalOpen(false)
          setSelectedSlot(null)
          setEditingBooking(null)
        }}
        clients={clients}
      />

      <GroupBookingEditModal
        booking={selectedGroupBooking}
        isOpen={showGroupEditModal}
        onClose={() => {
          setShowGroupEditModal(false)
          setSelectedGroupBooking(null)
        }}
        onBookingDeleted={(bookingId) => {
          setBookings(bookings.filter((b) => b.id !== bookingId))
          setShowGroupEditModal(false)
          setSelectedGroupBooking(null)
        }}
        courts={COURTS}
      />

      <SuccessNotification
        isOpen={showSuccessNotification}
        onClose={() => setShowSuccessNotification(false)}
        bookingType={successDetails?.participantCount ? "group" : "individual"}
        details={successDetails || {}}
      />
    </div>
  )
}
