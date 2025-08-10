// Additional utility functions for membership system

import {
  type ClientMembership,
  mockClientMemberships,
  mockMembershipTransactions,
  type MembershipTransaction,
} from "./membership-data"

// Enhanced client interface with membership data
export interface EnhancedClient {
  id: string
  name: string
  phone: string
  email?: string
  totalBookings: number
  totalSpent: number
  status: "vip" | "active" | "inactive"
  lastBooking: string
  joinDate: string
  favoriteTrainer?: string
  notes?: string

  // New membership fields
  activeMembership?: ClientMembership
  membershipHistory: MembershipTransaction[]
  membershipTotalSpent: number
  lastMembershipUsage?: string
}

// Time validation helpers
export function createBookingDateTime(date: string, time: string): Date {
  return new Date(`${date}T${time}:00`)
}

export function isWeekday(date: Date): boolean {
  const day = (date.getDay() + 6) % 7 // Convert Sunday=0 to Monday=0
  return day >= 0 && day <= 4
}

export function isWeekend(date: Date): boolean {
  return !isWeekday(date)
}

export function getTimeSlotValidation(
  timeSlots: { start: string; end: string }[],
  bookingTime: string,
): { isValid: boolean; validSlots: string[] } {
  const isValid = timeSlots.some((slot) => bookingTime >= slot.start && bookingTime < slot.end)

  const validSlots = timeSlots.map((slot) => `${slot.start}-${slot.end}`)

  return { isValid, validSlots }
}

// Membership validation with detailed feedback
export function validateMembershipForBooking(
  membership: ClientMembership,
  bookingDate: string,
  bookingTime: string,
): {
  isValid: boolean
  reason?: string
  suggestions?: string[]
} {
  // Check if membership is active
  if (membership.status !== "active") {
    return {
      isValid: false,
      reason: `Абонемент ${membership.status === "expired" ? "истёк" : "приостановлен"}`,
    }
  }

  // Check expiry date
  const now = new Date()
  const expiryDate = new Date(membership.expiresDate)
  if (expiryDate < now) {
    return {
      isValid: false,
      reason: "Абонемент истёк",
    }
  }

  // Check session balance for session-based memberships
  if (membership.benefitType === "sessions" && (!membership.remainingSessions || membership.remainingSessions <= 0)) {
    return {
      isValid: false,
      reason: "Занятия закончились",
    }
  }

  // Check time restrictions
  if (membership.timeRestrictions) {
    const bookingDateTime = createBookingDateTime(bookingDate, bookingTime)

    // Check weekday restrictions
    if (membership.timeRestrictions.weekdays) {
      const dayOfWeek = (bookingDateTime.getDay() + 6) % 7
      if (!membership.timeRestrictions.weekdays.includes(dayOfWeek)) {
        const validDays = membership.timeRestrictions.weekdays
          .map((d) => {
            const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
            return days[d]
          })
          .join(", ")

        return {
          isValid: false,
          reason: "Абонемент не действует в выбранный день",
          suggestions: [`Доступные дни: ${validDays}`],
        }
      }
    }

    // Check time slot restrictions
    if (membership.timeRestrictions.timeSlots) {
      const validation = getTimeSlotValidation(membership.timeRestrictions.timeSlots, bookingTime)

      if (!validation.isValid) {
        return {
          isValid: false,
          reason: "Абонемент не действует в выбранное время",
          suggestions: [`Доступное время: ${validation.validSlots.join(", ")}`],
        }
      }
    }
  }

  return { isValid: true }
}

// Generate suggested booking times for restricted memberships
export function getSuggestedBookingTimes(
  membership: ClientMembership,
  date: string,
  availableSlots: string[],
): string[] {
  if (!membership.timeRestrictions) {
    return availableSlots
  }

  const bookingDate = new Date(date)
  const suggestions: string[] = []

  // Filter by weekday restrictions
  if (membership.timeRestrictions.weekdays) {
    const dayOfWeek = (bookingDate.getDay() + 6) % 7
    if (!membership.timeRestrictions.weekdays.includes(dayOfWeek)) {
      return [] // No valid times on this day
    }
  }

  // Filter by time slot restrictions
  if (membership.timeRestrictions.timeSlots) {
    for (const slot of availableSlots) {
      const isValidTime = membership.timeRestrictions.timeSlots.some(
        (timeSlot) => slot >= timeSlot.start && slot < timeSlot.end,
      )
      if (isValidTime) {
        suggestions.push(slot)
      }
    }
    return suggestions
  }

  return availableSlots
}

// Membership analytics helpers
export function calculateMembershipUtilization(membership: ClientMembership): number {
  if (membership.benefitType !== "sessions" || !membership.originalSessions) {
    return 0
  }

  const used = membership.originalSessions - (membership.remainingSessions || 0)
  return Math.round((used / membership.originalSessions) * 100)
}

export function getMembershipValue(membership: ClientMembership): number {
  // Get the original plan to calculate value
  const plan = mockMembershipPlans.find((p) => p.id === membership.membershipPlanId)
  if (!plan) return 0

  if (membership.benefitType === "sessions" && membership.remainingSessions) {
    // Calculate remaining value based on sessions left
    const valuePerSession = plan.price / plan.benefitValue
    return Math.round(valuePerSession * membership.remainingSessions)
  }

  // For discount memberships, return full plan price as value
  return plan.price
}

// Audit trail helpers
export function createMembershipTransaction(
  membershipId: string,
  type: "deduction" | "adjustment" | "purchase",
  details: {
    bookingId?: string
    adminId?: string
    sessionsBefore?: number
    sessionsAfter?: number
    notes: string
  },
): MembershipTransaction {
  return {
    id: `trans_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    membershipId,
    transactionType: type,
    ...details,
    timestamp: new Date().toISOString(),
  }
}

// Enhanced client data with membership integration
export function enhanceClientWithMembership(client: any): EnhancedClient {
  const activeMembership = mockClientMemberships.find((m) => m.clientId === client.id && m.status === "active")

  const membershipHistory = mockMembershipTransactions.filter((t) => {
    const membership = mockClientMemberships.find((m) => m.id === t.membershipId)
    return membership?.clientId === client.id
  })

  const membershipTotalSpent = mockClientMemberships
    .filter((m) => m.clientId === client.id)
    .reduce((total, membership) => {
      const plan = mockMembershipPlans.find((p) => p.id === membership.membershipPlanId)
      return total + (plan?.price || 0)
    }, 0)

  const lastMembershipUsage = membershipHistory
    .filter((t) => t.transactionType === "deduction")
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]?.timestamp

  return {
    ...client,
    activeMembership,
    membershipHistory,
    membershipTotalSpent,
    lastMembershipUsage,
  }
}

// Mock data for testing
import { mockMembershipPlans } from "./membership-data"

// Export commonly used functions
export {
  getActiveMembership,
  getAllClientMemberships,
  getMembershipPlan,
  isValidForDateTime,
  calculateBookingPrice,
  deductMembershipSession,
  getMembershipHistory,
  getRestrictionDisplayText,
  getMembershipStatusColor,
  getMembershipBadgeText,
} from "./membership-data"
