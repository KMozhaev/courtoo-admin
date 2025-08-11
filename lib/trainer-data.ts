// Trainer management data structures and mock data

export interface TimeSlot {
  startTime: string // "09:00"
  endTime: string // "18:00"
  id: string // For deletion/editing
}

export interface WorkSchedule {
  [dayOfWeek: string]: {
    // 'monday', 'tuesday', etc.
    enabled: boolean
    timeSlots: TimeSlot[]
  }
}

export interface TrainerProfile {
  id: string
  organizationId: number // Multi-tenant support

  // Basic Information
  name: string
  phone: string
  email?: string
  hourlyRate: number
  specialization: string[]
  experienceYears?: number
  telegramUsername?: string
  adminComment?: string

  // Work Schedule
  workSchedule: WorkSchedule

  // Booking Settings
  preferredCourts: string[] // Court IDs, empty array = all courts
  sessionDurations: number[] // [60, 90, 120]
  bufferTimeMinutes: number // 0, 15, 30
  maxSessionsPerDay: number
  allowDirectClientContact: boolean
  telegramNotificationsEnabled: boolean

  // System Fields
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdByAdminId: string
}

export interface TrainerAvailability {
  trainerId: string
  date: string // "2025-08-11"
  availableSlots: Array<{
    startTime: string
    endTime: string
    courtIds: string[] // Available courts for this slot
    isBooked: boolean
    bookingId?: string
  }>
}

// Mock trainer data
export const mockTrainerData: TrainerProfile[] = [
  {
    id: "1",
    organizationId: 1,
    name: "Анна Петрова",
    phone: "+7 (916) 123-45-67",
    email: "anna.petrova@tennis.ru",
    hourlyRate: 2500,
    specialization: ["Техника удара", "Тактика игры"],
    experienceYears: 8,
    telegramUsername: "@anna_tennis",
    adminComment: "Предпочитает работать с начинающими",
    workSchedule: {
      monday: {
        enabled: true,
        timeSlots: [{ startTime: "09:00", endTime: "18:00", id: "mon_1" }],
      },
      tuesday: {
        enabled: true,
        timeSlots: [{ startTime: "10:00", endTime: "17:00", id: "tue_1" }],
      },
      wednesday: { enabled: false, timeSlots: [] },
      thursday: {
        enabled: true,
        timeSlots: [{ startTime: "09:00", endTime: "18:00", id: "thu_1" }],
      },
      friday: {
        enabled: true,
        timeSlots: [{ startTime: "09:00", endTime: "16:00", id: "fri_1" }],
      },
      saturday: {
        enabled: true,
        timeSlots: [{ startTime: "10:00", endTime: "15:00", id: "sat_1" }],
      },
      sunday: { enabled: false, timeSlots: [] },
    },
    preferredCourts: ["1", "3"],
    sessionDurations: [60, 90],
    bufferTimeMinutes: 15,
    maxSessionsPerDay: 8,
    allowDirectClientContact: true,
    telegramNotificationsEnabled: true,
    isActive: true,
    createdAt: "2025-08-01T10:00:00Z",
    updatedAt: "2025-08-01T10:00:00Z",
    createdByAdminId: "admin_1",
  },
  {
    id: "2",
    organizationId: 1,
    name: "Дмитрий Козлов",
    phone: "+7 (925) 456-78-90",
    email: "dmitry.kozlov@tennis.ru",
    hourlyRate: 3000,
    specialization: ["Подача", "Физическая подготовка"],
    experienceYears: 12,
    telegramUsername: "@dmitry_coach",
    adminComment: "",
    workSchedule: {
      monday: {
        enabled: true,
        timeSlots: [
          { startTime: "08:00", endTime: "12:00", id: "mon_1" },
          { startTime: "14:00", endTime: "20:00", id: "mon_2" },
        ],
      },
      tuesday: {
        enabled: true,
        timeSlots: [{ startTime: "09:00", endTime: "19:00", id: "tue_1" }],
      },
      wednesday: {
        enabled: true,
        timeSlots: [{ startTime: "09:00", endTime: "19:00", id: "wed_1" }],
      },
      thursday: {
        enabled: true,
        timeSlots: [{ startTime: "09:00", endTime: "19:00", id: "thu_1" }],
      },
      friday: {
        enabled: true,
        timeSlots: [{ startTime: "09:00", endTime: "17:00", id: "fri_1" }],
      },
      saturday: {
        enabled: true,
        timeSlots: [{ startTime: "08:00", endTime: "16:00", id: "sat_1" }],
      },
      sunday: { enabled: false, timeSlots: [] },
    },
    preferredCourts: ["1", "2", "3", "4"], // All courts
    sessionDurations: [60, 90, 120],
    bufferTimeMinutes: 30,
    maxSessionsPerDay: 10,
    allowDirectClientContact: true,
    telegramNotificationsEnabled: true,
    isActive: true,
    createdAt: "2025-07-15T10:00:00Z",
    updatedAt: "2025-08-01T10:00:00Z",
    createdByAdminId: "admin_1",
  },
  {
    id: "3",
    organizationId: 1,
    name: "Елена Смирнова",
    phone: "+7 (903) 789-01-23",
    email: "elena.smirnova@tennis.ru",
    hourlyRate: 2800,
    specialization: ["Детский теннис", "Начинающие"],
    experienceYears: 6,
    telegramUsername: "",
    adminComment: "Специализируется на детских группах",
    workSchedule: {
      monday: { enabled: false, timeSlots: [] },
      tuesday: {
        enabled: true,
        timeSlots: [{ startTime: "15:00", endTime: "20:00", id: "tue_1" }],
      },
      wednesday: {
        enabled: true,
        timeSlots: [{ startTime: "15:00", endTime: "20:00", id: "wed_1" }],
      },
      thursday: {
        enabled: true,
        timeSlots: [{ startTime: "15:00", endTime: "20:00", id: "thu_1" }],
      },
      friday: {
        enabled: true,
        timeSlots: [{ startTime: "15:00", endTime: "19:00", id: "fri_1" }],
      },
      saturday: {
        enabled: true,
        timeSlots: [{ startTime: "09:00", endTime: "17:00", id: "sat_1" }],
      },
      sunday: {
        enabled: true,
        timeSlots: [{ startTime: "10:00", endTime: "16:00", id: "sun_1" }],
      },
    },
    preferredCourts: ["2", "4"],
    sessionDurations: [60, 90],
    bufferTimeMinutes: 15,
    maxSessionsPerDay: 6,
    allowDirectClientContact: false,
    telegramNotificationsEnabled: false,
    isActive: true,
    createdAt: "2025-07-20T10:00:00Z",
    updatedAt: "2025-08-01T10:00:00Z",
    createdByAdminId: "admin_1",
  },
  {
    id: "4",
    organizationId: 1,
    name: "Сергей Волков",
    phone: "+7 (917) 234-56-78",
    email: "sergey.volkov@tennis.ru",
    hourlyRate: 3500,
    specialization: ["Профессиональная подготовка", "Турниры"],
    experienceYears: 15,
    telegramUsername: "@sergey_pro",
    adminComment: "Готовит к соревнованиям",
    workSchedule: {
      monday: {
        enabled: true,
        timeSlots: [{ startTime: "07:00", endTime: "11:00", id: "mon_1" }],
      },
      tuesday: {
        enabled: true,
        timeSlots: [{ startTime: "07:00", endTime: "11:00", id: "tue_1" }],
      },
      wednesday: {
        enabled: true,
        timeSlots: [{ startTime: "07:00", endTime: "11:00", id: "wed_1" }],
      },
      thursday: {
        enabled: true,
        timeSlots: [{ startTime: "07:00", endTime: "11:00", id: "thu_1" }],
      },
      friday: {
        enabled: true,
        timeSlots: [{ startTime: "07:00", endTime: "11:00", id: "fri_1" }],
      },
      saturday: {
        enabled: true,
        timeSlots: [{ startTime: "06:00", endTime: "12:00", id: "sat_1" }],
      },
      sunday: { enabled: false, timeSlots: [] },
    },
    preferredCourts: ["1", "3"], // Premium courts only
    sessionDurations: [90, 120],
    bufferTimeMinutes: 30,
    maxSessionsPerDay: 4,
    allowDirectClientContact: true,
    telegramNotificationsEnabled: true,
    isActive: true,
    createdAt: "2025-06-01T10:00:00Z",
    updatedAt: "2025-08-01T10:00:00Z",
    createdByAdminId: "admin_1",
  },
]

// Utility functions for trainer management
export function getTrainerAvailability(trainerId: string, date: string): TrainerAvailability {
  const trainer = mockTrainerData.find((t) => t.id === trainerId)
  if (!trainer) {
    return {
      trainerId,
      date,
      availableSlots: [],
    }
  }

  // Get day of week as lowercase string
  const dateObj = new Date(date)
  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
  const dayOfWeek = dayNames[dateObj.getDay()]

  const daySchedule = trainer.workSchedule[dayOfWeek]

  if (!daySchedule?.enabled || daySchedule.timeSlots.length === 0) {
    return {
      trainerId,
      date,
      availableSlots: [],
    }
  }

  // Convert time slots to availability slots
  const availableSlots = daySchedule.timeSlots.map((slot) => ({
    startTime: slot.startTime,
    endTime: slot.endTime,
    courtIds: trainer.preferredCourts.length > 0 ? trainer.preferredCourts : ["1", "2", "3", "4"],
    isBooked: false, // TODO: Check against actual bookings
    bookingId: undefined,
  }))

  return {
    trainerId,
    date,
    availableSlots,
  }
}

export function filterAvailableTrainers(
  timeSlot: { date: string; startTime: string; endTime: string },
  courtId: string,
  sessionDuration: number,
): TrainerProfile[] {
  return mockTrainerData.filter((trainer) => {
    if (!trainer.isActive) return false

    // Check if trainer accepts this session duration
    if (!trainer.sessionDurations.includes(sessionDuration)) return false

    // Check if trainer works with this court
    if (trainer.preferredCourts.length > 0 && !trainer.preferredCourts.includes(courtId)) return false

    // Check if trainer is available at this time
    const availability = getTrainerAvailability(trainer.id, timeSlot.date)
    const hasAvailableSlot = availability.availableSlots.some((slot) => {
      return (
        timeSlot.startTime >= slot.startTime &&
        timeSlot.endTime <= slot.endTime &&
        slot.courtIds.includes(courtId) &&
        !slot.isBooked
      )
    })

    return hasAvailableSlot
  })
}

export function getTrainerWorkingHours(trainer: TrainerProfile, date: string): string {
  // Get day of week as lowercase string
  const dateObj = new Date(date)
  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
  const dayOfWeek = dayNames[dateObj.getDay()]

  const daySchedule = trainer.workSchedule[dayOfWeek]

  if (!daySchedule?.enabled || daySchedule.timeSlots.length === 0) {
    return "Выходной"
  }

  const timeRanges = daySchedule.timeSlots.map((slot) => `${slot.startTime}-${slot.endTime}`)
  return timeRanges.join(", ")
}

export function isTrainerAvailableToday(trainer: TrainerProfile): boolean {
  const today = new Date().toISOString().split("T")[0]
  const availability = getTrainerAvailability(trainer.id, today)
  return availability.availableSlots.length > 0
}
