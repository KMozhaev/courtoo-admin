// Membership system data structures and mock data for Phase 2

export interface TimeRestrictions {
  weekdays?: number[] // 0=Mon, 6=Sun (e.g., [0,1,2,3,4] for weekdays)
  timeSlots?: { start: string; end: string }[] // e.g., [{start: "06:00", end: "12:00"}]
  excludedDates?: string[] // Specific dates when membership doesn't apply
}

export interface MembershipPlan {
  id: string
  organizationId: number
  planName: string
  benefitType: "sessions" | "discount"
  benefitValue: number // Number of sessions OR discount percentage
  validForDays: number
  price: number
  isActive: boolean
  timeRestrictions?: TimeRestrictions
  description?: string
}

export interface ClientMembership {
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

export interface MembershipTransaction {
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

export interface PriceCalculationResult {
  finalPrice: number
  paymentStatus: "paid" | "unpaid" | "membership_session" | "membership_discount" | "free"
  membershipApplied: boolean
  message?: string
  originalPrice: number
}

// Mock membership plans with time restrictions
export const mockMembershipPlans: MembershipPlan[] = [
  {
    id: "plan_001",
    organizationId: 1,
    planName: "Tennis 10-Pack",
    benefitType: "sessions",
    benefitValue: 10,
    validForDays: 30,
    price: 5000,
    isActive: true,
    description: "10 занятий на любое время",
    // No restrictions - can use anytime
  },
  {
    id: "plan_002",
    organizationId: 1,
    planName: "VIP Gold",
    benefitType: "discount",
    benefitValue: 20, // 20% discount
    validForDays: 90,
    price: 8000,
    isActive: true,
    description: "20% скидка на все бронирования",
    // No restrictions - can use anytime
  },
  {
    id: "plan_003",
    organizationId: 1,
    planName: "Morning Bird",
    benefitType: "discount",
    benefitValue: 30, // 30% discount
    validForDays: 30,
    price: 3000,
    timeRestrictions: {
      timeSlots: [{ start: "06:00", end: "12:00" }],
    },
    isActive: true,
    description: "30% скидка до 12:00",
  },
  {
    id: "plan_004",
    organizationId: 1,
    planName: "Weekday Tennis",
    benefitType: "sessions",
    benefitValue: 12, // 12 sessions
    validForDays: 30,
    price: 4000,
    timeRestrictions: {
      weekdays: [0, 1, 2, 3, 4], // Monday to Friday
    },
    isActive: true,
    description: "12 занятий в будние дни",
  },
  {
    id: "plan_005",
    organizationId: 1,
    planName: "Business Hours Pass",
    benefitType: "discount",
    benefitValue: 25, // 25% discount
    validForDays: 30,
    price: 3500,
    timeRestrictions: {
      weekdays: [0, 1, 2, 3, 4], // Monday to Friday
      timeSlots: [{ start: "09:00", end: "17:00" }],
    },
    isActive: true,
    description: "25% скидка в рабочие часы (Пн-Пт 9:00-17:00)",
  },
  {
    id: "plan_006",
    organizationId: 1,
    planName: "Evening Special",
    benefitType: "sessions",
    benefitValue: 8,
    validForDays: 30,
    price: 3200,
    timeRestrictions: {
      timeSlots: [{ start: "18:00", end: "22:00" }],
    },
    isActive: true,
    description: "8 занятий в вечернее время",
  },
]

// Mock client memberships
export const mockClientMemberships: ClientMembership[] = [
  {
    id: "mem_001",
    clientId: "1", // Анна Петрова
    membershipPlanId: "plan_001",
    membershipName: "Tennis 10-Pack",
    benefitType: "sessions",
    remainingSessions: 5,
    originalSessions: 10,
    purchasedDate: "2025-08-01",
    expiresDate: "2025-08-31",
    status: "active",
  },
  {
    id: "mem_002",
    clientId: "2", // Михаил Иванов
    membershipPlanId: "plan_002",
    membershipName: "VIP Gold",
    benefitType: "discount",
    discountPercentage: 20,
    purchasedDate: "2025-07-15",
    expiresDate: "2025-10-15",
    status: "active",
  },
  {
    id: "mem_003",
    clientId: "3", // Елена Смирнова
    membershipPlanId: "plan_003",
    membershipName: "Morning Bird",
    benefitType: "discount",
    discountPercentage: 30,
    purchasedDate: "2025-08-05",
    expiresDate: "2025-09-05",
    status: "active",
    timeRestrictions: {
      timeSlots: [{ start: "06:00", end: "12:00" }],
    },
  },
  {
    id: "mem_004",
    clientId: "4", // Сергей Волков
    membershipPlanId: "plan_004",
    membershipName: "Weekday Tennis",
    benefitType: "sessions",
    remainingSessions: 8,
    originalSessions: 12,
    purchasedDate: "2025-07-20",
    expiresDate: "2025-08-20",
    status: "active",
    timeRestrictions: {
      weekdays: [0, 1, 2, 3, 4], // Monday to Friday
    },
  },
  {
    id: "mem_005",
    clientId: "5", // Ольга Козлова
    membershipPlanId: "plan_005",
    membershipName: "Business Hours Pass",
    benefitType: "discount",
    discountPercentage: 25,
    purchasedDate: "2025-07-01",
    expiresDate: "2025-07-31",
    status: "expired",
    timeRestrictions: {
      weekdays: [0, 1, 2, 3, 4],
      timeSlots: [{ start: "09:00", end: "17:00" }],
    },
  },
]

// Mock membership transactions (audit trail)
export const mockMembershipTransactions: MembershipTransaction[] = [
  {
    id: "trans_001",
    membershipId: "mem_001",
    transactionType: "deduction",
    bookingId: "demo_001",
    sessionsBefore: 6,
    sessionsAfter: 5,
    timestamp: "2025-08-10T08:00:00Z",
    notes: "Court booking - Court 1, 08:00",
  },
  {
    id: "trans_002",
    membershipId: "mem_001",
    transactionType: "adjustment",
    adminId: "admin_1",
    sessionsBefore: 5,
    sessionsAfter: 7,
    timestamp: "2025-08-09T14:00:00Z",
    notes: "Manual adjustment - System error correction",
  },
  {
    id: "trans_003",
    membershipId: "mem_001",
    transactionType: "purchase",
    sessionsBefore: 0,
    sessionsAfter: 10,
    timestamp: "2025-08-01T10:00:00Z",
    notes: "Initial membership purchase",
  },
  {
    id: "trans_004",
    membershipId: "mem_004",
    transactionType: "deduction",
    bookingId: "demo_004",
    sessionsBefore: 9,
    sessionsAfter: 8,
    timestamp: "2025-08-09T16:00:00Z",
    notes: "Training session - Court 3, 16:00",
  },
]

// Utility functions for membership operations
export function getActiveMembership(clientId: string): ClientMembership | null {
  const clientMemberships = mockClientMemberships.filter((m) => m.clientId === clientId && m.status === "active")

  // Return only the most recent active membership (enforce single membership rule)
  if (clientMemberships.length === 0) return null

  return clientMemberships.sort((a, b) => new Date(b.purchasedDate).getTime() - new Date(a.purchasedDate).getTime())[0]
}

export function getAllClientMemberships(clientId: string): ClientMembership[] {
  return mockClientMemberships.filter((m) => m.clientId === clientId)
}

export function getMembershipPlan(planId: string): MembershipPlan | null {
  return mockMembershipPlans.find((p) => p.id === planId) || null
}

export function isValidForDateTime(membership: ClientMembership, dateTime: Date): boolean {
  if (!membership.timeRestrictions) return true

  const { weekdays, timeSlots } = membership.timeRestrictions

  // Check weekday restrictions (0=Monday, 6=Sunday)
  if (weekdays && weekdays.length > 0) {
    const dayOfWeek = (dateTime.getDay() + 6) % 7 // Convert Sunday=0 to Monday=0
    if (!weekdays.includes(dayOfWeek)) {
      return false
    }
  }

  // Check time slot restrictions
  if (timeSlots && timeSlots.length > 0) {
    const bookingTime = dateTime.toTimeString().slice(0, 5) // HH:MM format
    const isInValidSlot = timeSlots.some((slot) => bookingTime >= slot.start && bookingTime < slot.end)
    if (!isInValidSlot) return false
  }

  return true
}

export function calculateBookingPrice(
  basePrice: number,
  membership?: ClientMembership | null,
  bookingDateTime?: Date,
): PriceCalculationResult {
  if (!membership || membership.status !== "active") {
    return {
      finalPrice: basePrice,
      paymentStatus: "unpaid",
      membershipApplied: false,
      originalPrice: basePrice,
    }
  }

  // Check if membership is expired
  const now = new Date()
  const expiryDate = new Date(membership.expiresDate)
  if (expiryDate < now) {
    return {
      finalPrice: basePrice,
      paymentStatus: "unpaid",
      membershipApplied: false,
      originalPrice: basePrice,
      message: "Абонемент истёк",
    }
  }

  // Check time restrictions if booking time is provided
  if (bookingDateTime && !isValidForDateTime(membership, bookingDateTime)) {
    return {
      finalPrice: basePrice,
      paymentStatus: "unpaid",
      membershipApplied: false,
      originalPrice: basePrice,
      message: "Абонемент не действует в выбранное время",
    }
  }

  // Apply session-based membership
  if (membership.benefitType === "sessions" && membership.remainingSessions && membership.remainingSessions > 0) {
    return {
      finalPrice: 0,
      paymentStatus: "membership_session",
      membershipApplied: true,
      originalPrice: basePrice,
    }
  }

  // Apply discount-based membership
  if (membership.benefitType === "discount" && membership.discountPercentage) {
    const discountedPrice = Math.round(basePrice * (1 - membership.discountPercentage / 100))
    return {
      finalPrice: discountedPrice,
      paymentStatus: "membership_discount",
      membershipApplied: true,
      originalPrice: basePrice,
    }
  }

  // Fallback to regular price
  return {
    finalPrice: basePrice,
    paymentStatus: "unpaid",
    membershipApplied: false,
    originalPrice: basePrice,
  }
}

/**
 * Deducts a session from a membership after the session is completed.
 * This function should be called after the session has been successfully completed.
 * @param membershipId The ID of the membership to deduct the session from.
 * @param bookingId The ID of the booking for which the session is being deducted.
 * @returns True if the session was successfully deducted, false otherwise.
 */
export function deductMembershipSessionAfterCompletion(membershipId: string, bookingId: string): boolean {
  const membership = mockClientMemberships.find((m) => m.id === membershipId)
  if (!membership || membership.benefitType !== "sessions" || !membership.remainingSessions) {
    return false
  }

  if (membership.remainingSessions <= 0) {
    return false
  }

  // Create transaction record
  const transaction: MembershipTransaction = {
    id: `trans_${Date.now()}`,
    membershipId,
    transactionType: "deduction",
    bookingId,
    sessionsBefore: membership.remainingSessions,
    sessionsAfter: membership.remainingSessions - 1,
    timestamp: new Date().toISOString(),
    notes: `Booking deduction - ${bookingId}`,
  }

  // Update membership balance
  membership.remainingSessions -= 1

  // Add transaction to history
  mockMembershipTransactions.push(transaction)

  return true
}

export function getMembershipHistory(clientId: string): MembershipTransaction[] {
  const clientMembershipIds = mockClientMemberships.filter((m) => m.clientId === clientId).map((m) => m.id)

  return mockMembershipTransactions
    .filter((t) => clientMembershipIds.includes(t.membershipId))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

// Add this function near the other utility functions
export function createBookingDateTime(date: string, time: string): Date {
  return new Date(`${date}T${time}:00`)
}

// Add this function for generating suggested booking times
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
    const dayOfWeek = (bookingDate.getDay() + 6) % 7 // Convert Sunday=0 to Monday=0
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

// Add this function for detailed membership validation
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
      const isValidTime = membership.timeRestrictions.timeSlots.some(
        (timeSlot) => bookingTime >= timeSlot.start && bookingTime < timeSlot.end,
      )

      if (!isValidTime) {
        const validSlots = membership.timeRestrictions.timeSlots.map((s) => `${s.start}-${s.end}`).join(", ")
        return {
          isValid: false,
          reason: "Абонемент не действует в выбранное время",
          suggestions: [`Доступное время: ${validSlots}`],
        }
      }
    }
  }

  return { isValid: true }
}

// Helper functions for UI display
export function getRestrictionDisplayText(restrictions?: TimeRestrictions): string {
  if (!restrictions) return ""

  const parts: string[] = []

  if (restrictions.weekdays && restrictions.weekdays.length > 0) {
    if (restrictions.weekdays.length === 5 && restrictions.weekdays.every((d) => d >= 0 && d <= 4)) {
      parts.push("Пн-Пт")
    } else if (
      restrictions.weekdays.length === 2 &&
      restrictions.weekdays.includes(5) &&
      restrictions.weekdays.includes(6)
    ) {
      parts.push("Сб-Вс")
    } else {
      const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
      parts.push(restrictions.weekdays.map((d) => dayNames[d]).join(", "))
    }
  }

  if (restrictions.timeSlots && restrictions.timeSlots.length > 0) {
    const timeRanges = restrictions.timeSlots.map((slot) => `${slot.start}-${slot.end}`).join(", ")
    parts.push(timeRanges)
  }

  return parts.join(" • ")
}

export function getMembershipStatusColor(membership: ClientMembership, currentTime?: Date): string {
  if (membership.status === "expired") return "red"
  if (membership.status === "suspended") return "gray"

  // Check if membership is expired by date
  const now = currentTime || new Date()
  const expiryDate = new Date(membership.expiresDate)
  if (expiryDate < now) return "red"

  // Check if membership has sessions remaining (for session-based)
  if (membership.benefitType === "sessions" && (!membership.remainingSessions || membership.remainingSessions <= 0)) {
    return "red"
  }

  // Check if membership is valid for current time (if time restrictions exist)
  if (membership.timeRestrictions && currentTime) {
    if (!isValidForDateTime(membership, currentTime)) {
      return "yellow"
    }
  }

  return "green"
}

export function getMembershipBadgeText(membership: ClientMembership): string {
  if (membership.benefitType === "sessions") {
    return `${membership.remainingSessions || 0}/${membership.originalSessions || 0} занятий`
  } else {
    return `-${membership.discountPercentage || 0}%`
  }
}

// Export the arrays so they can be imported and modified by other components
