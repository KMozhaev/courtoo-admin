"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnhancedAdminCalendar } from "@/components/enhanced-admin-calendar"
import { AnalyticsView } from "@/components/analytics-view"
import { CoachManagement } from "@/components/coach-management"
import { ClientsManagement } from "@/components/clients-management"

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
    },
  ])

  const currentDate = new Date().toLocaleDateString("ru-RU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="main-container min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tennis Pro Club</h1>
            <p className="text-gray-600">Административная панель</p>
          </div>
          <div className="text-sm text-gray-500 capitalize">{currentDate}</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="calendar">Расписание</TabsTrigger>
            <TabsTrigger value="analytics">Аналитика</TabsTrigger>
            <TabsTrigger value="coaches">Тренеры</TabsTrigger>
            <TabsTrigger value="clients">Клиенты</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <EnhancedAdminCalendar bookings={bookings} setBookings={setBookings} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsView />
          </TabsContent>

          <TabsContent value="coaches">
            <CoachManagement />
          </TabsContent>

          <TabsContent value="clients">
            <ClientsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
