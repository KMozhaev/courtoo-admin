"use client"

import { useEffect } from "react"
import { CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BookingSuccessDetails {
  courtName: string
  date: string
  time: string
  participantCount?: number
  membershipDeductions?: number
  recurringInfo?: string
  trainerName?: string
  clientName?: string
}

interface SuccessNotificationProps {
  isOpen: boolean
  onClose: () => void
  bookingType: "individual" | "group"
  details: BookingSuccessDetails
}

export function SuccessNotification({ isOpen, onClose, bookingType, details }: SuccessNotificationProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 8000) // Auto-close after 8 seconds
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg z-50 max-w-sm animate-in slide-in-from-top-2">
      <div className="flex items-start gap-3">
        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-medium text-green-900 mb-1">
            {bookingType === "group" ? "Групповая тренировка создана!" : "Тренировка создана!"}
          </h4>
          <div className="text-sm text-green-700 space-y-1">
            <p>
              📅 {details.courtName}, {details.date}, {details.time}
            </p>
            {bookingType === "group" ? (
              <>
                <p>👥 {details.participantCount} участников</p>
                {details.membershipDeductions && details.membershipDeductions > 0 && (
                  <p>💳 Списано: {details.membershipDeductions} занятий</p>
                )}
                {details.recurringInfo && <p>🔄 {details.recurringInfo}</p>}
              </>
            ) : (
              <>
                <p>
                  👤 {details.clientName} с тренером {details.trainerName}
                </p>
                <p>💳 Списано: 1 занятие с абонемента</p>
              </>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0 text-green-600 hover:text-green-700 hover:bg-green-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
