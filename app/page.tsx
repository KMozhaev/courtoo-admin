"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnhancedAdminCalendar } from "@/components/enhanced-admin-calendar"
import { AnalyticsView } from "@/components/analytics-view"
import { CoachManagement } from "@/components/coach-management"
import { ClientsManagement } from "@/components/clients-management"
// Add import for GroupBookingTab
import { GroupBookingTab } from "@/components/group-booking-tab"

// Enhanced types for Phase 2 membership system
interface TimeRestrictions {
  weekdays?: number[] // 0=Mon, 6=Sun (e.g., [0,1,2,3,4] for weekdays)
  timeSlots?: { start: string; end: string }[] // e.g., [{start: "06:00", end: "12:00"}]
  excludedDates?: string[] // Specific dates when membership doesn't apply
}

interface MembershipPlan {
  id: string
  organizationId: number
  planName: string
  benefitType: "sessions" | "discount"
  benefitValue: number // Number of sessions OR discount percentage
  validForDays: number
  price: number
  isActive: boolean
  timeRestrictions?: TimeRestrictions
}

interface ClientMembership {
  id: string
  clientId: string
  membershipPlanId: string
  membershipName: string
  benefitType: "sessions" | "discount"
  remainingSessions?: number // For session-based
  originalSessions?: number // For session-based
  discountPercentage?: number // For discount-based
  purchasedDate: string
  expiresDate: string
  status: "active" | "expired" | "suspended"
  timeRestrictions?: TimeRestrictions
}

interface MembershipTransaction {
  id: string
  membershipId: string
  transactionType: "deduction" | "adjustment" | "purchase"
  bookingId?: string
  adminId?: string
  sessionsBefore?: number
  sessionsAfter?: number
  timestamp: string
  notes: string
}

type BookingSlot = {
  id: string
  courtId: string
  date: string
  time: string
  status: string
  clientName: string
  clientPhone?: string
  trainerName?: string
  price: number
  duration: number
  // Enhanced fields for membership integration
  membershipApplied?: boolean
  membershipId?: string
  originalPrice?: number
  finalPrice?: number
  paymentStatus?: "paid" | "unpaid" | "membership_session" | "membership_discount" | "free"
}

type Client = {
  id: string
  name: string
  phone: string
}

export default function TennisAdminDashboard() {
  const [activeTab, setActiveTab] = useState("calendar")
  const [bookings, setBookings] = useState<BookingSlot[]>([
    {
      id: "demo_001",
      courtId: "1",
      date: "2025-08-10",
      time: "08:00",
      status: "court_paid",
      clientName: "Анна Петрова",
      clientPhone: "+7 916 123-45-67",
      price: 600,
      duration: 60,
      membershipApplied: true,
      membershipId: "mem_001",
      originalPrice: 600,
      finalPrice: 300,
      paymentStatus: "membership_discount",
    },
    {
      id: "demo_002",
      courtId: "2",
      date: "2025-08-10",
      time: "09:30",
      status: "training_paid",
      clientName: "Михаил Иванов",
      trainerName: "Дмитрий Козлов",
      price: 2500,
      duration: 90,
      membershipApplied: false,
      membershipId: undefined,
      originalPrice: 2500,
      finalPrice: 2500,
      paymentStatus: "paid",
    },
    {
      id: "demo_003",
      courtId: "1",
      date: "2025-08-10",
      time: "14:30",
      status: "court_unpaid",
      clientName: "Елена Смирнова",
      clientPhone: "+7 925 456-78-90",
      price: 300,
      duration: 30,
      membershipApplied: false,
      membershipId: undefined,
      originalPrice: 300,
      finalPrice: 300,
      paymentStatus: "unpaid",
    },
    {
      id: "demo_004",
      courtId: "3",
      date: "2025-08-10",
      time: "16:00",
      status: "training_unpaid",
      clientName: "Сергей Волков",
      trainerName: "Анна Петрова",
      price: 3000,
      duration: 90,
      membershipApplied: false,
      membershipId: undefined,
      originalPrice: 3000,
      finalPrice: 3000,
      paymentStatus: "unpaid",
    },
  ])

  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      name: "Анна Петрова",
      phone: "+7 916 123-45-67",
    },
    {
      id: "2",
      name: "Михаил Иванов",
      phone: "+7 925 456-78-90",
    },
    {
      id: "3",
      name: "Елена Смирнова",
      phone: "+7 903 789-01-23",
    },
    {
      id: "4",
      name: "Сергей Волков",
      phone: "+7 917 234-56-78",
    },
    {
      id: "5",
      name: "Ольга Козлова",
      phone: "+7 909 345-67-89",
    },
  ])

  return (
    <div className="main-container min-h-screen bg-gray-50">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
        {/* Mobile-First Responsive Header - Fixed with proper spacing */}
        <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 sm:px-6 py-3 sm:py-4">
            {/* Mobile Layout: Stacked */}
            <div className="block lg:hidden">
              <div className="mb-3">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">Tennis Pro Club</h1>
                <p className="text-xs sm:text-sm text-gray-600">Административная панель</p>
              </div>
              <div className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
                  <TabsTrigger value="calendar" className="text-xs sm:text-sm py-2 px-2">
                    Расписание
                  </TabsTrigger>
                  <TabsTrigger value="group" className="text-xs sm:text-sm py-2 px-2">
                    Групповые
                  </TabsTrigger>
                  <TabsTrigger value="coaches" className="text-xs sm:text-sm py-2 px-2">
                    Тренеры
                  </TabsTrigger>
                  <TabsTrigger value="clients" className="text-xs sm:text-sm py-2 px-2">
                    Клиенты
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            {/* Desktop Layout: Side by Side */}
            <div className="hidden lg:flex items-center justify-between">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">Tennis Pro Club</h1>
                <p className="text-sm text-gray-600">Административная панель</p>
              </div>

              <div className="flex-1 max-w-2xl ml-8">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="calendar">Расписание</TabsTrigger>
                  <TabsTrigger value="group">Групповые тренировки</TabsTrigger>
                  <TabsTrigger value="coaches">Тренеры</TabsTrigger>
                  <TabsTrigger value="clients">Клиенты</TabsTrigger>
                </TabsList>
              </div>
            </div>
          </div>
        </div>

        {/* Spacer to prevent content overlap with fixed header - increased heights */}
        <div className="h-[160px] sm:h-[140px] lg:h-[120px]" />

        {/* Tab Content with proper spacing for fixed header */}
        <div className="p-3 sm:p-4 lg:p-6">
          <TabsContent value="calendar" className="mt-0">
            <EnhancedAdminCalendar bookings={bookings} setBookings={setBookings} clients={clients} />
          </TabsContent>

          <TabsContent value="analytics" className="mt-0">
            <AnalyticsView />
          </TabsContent>

          <TabsContent value="coaches" className="mt-0">
            <CoachManagement />
          </TabsContent>

          <TabsContent value="clients" className="mt-0">
            <ClientsManagement />
          </TabsContent>
          <TabsContent value="group" className="mt-0">
            <GroupBookingTab
              onBookingCreated={(booking) => {
                // Handle group booking creation
                console.log("Group booking created:", booking)
                // You can add the booking to the bookings state or handle it as needed
                setBookings([...bookings, booking])
              }}
              courts={[
                { id: "1", name: "Корт 1 (Хард)", type: "hard", basePrice: 600 },
                { id: "2", name: "Корт 2 (Хард)", type: "hard", basePrice: 480 },
                { id: "3", name: "Корт 3 (Грунт)", type: "clay", basePrice: 720 },
                { id: "4", name: "Корт 4 (Грунт)", type: "clay", basePrice: 600 },
              ]}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
