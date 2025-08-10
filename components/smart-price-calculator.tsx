"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Calculator, Clock, AlertCircle, CheckCircle, Lightbulb, TrendingDown, Gift } from "lucide-react"
import {
  type ClientMembership,
  type PriceCalculationResult,
  calculateBookingPrice,
  validateMembershipForBooking,
  getSuggestedBookingTimes,
  getRestrictionDisplayText,
  createBookingDateTime,
} from "@/lib/membership-data"

interface SmartPriceCalculatorProps {
  basePrice: number
  membership?: ClientMembership | null
  bookingDate: string
  bookingTime: string
  onTimeChange?: (newTime: string) => void
  availableSlots?: string[]
}

export function SmartPriceCalculator({
  basePrice,
  membership,
  bookingDate,
  bookingTime,
  onTimeChange,
  availableSlots = [],
}: SmartPriceCalculatorProps) {
  const [priceCalculation, setPriceCalculation] = useState<PriceCalculationResult | null>(null)
  const [validation, setValidation] = useState<{
    isValid: boolean
    reason?: string
    suggestions?: string[]
  } | null>(null)
  const [suggestedTimes, setSuggestedTimes] = useState<string[]>([])

  useEffect(() => {
    if (!membership) {
      setPriceCalculation({
        finalPrice: basePrice,
        paymentStatus: "unpaid",
        membershipApplied: false,
        originalPrice: basePrice,
      })
      setValidation(null)
      setSuggestedTimes([])
      return
    }

    // Calculate price with membership
    const bookingDateTime = createBookingDateTime(bookingDate, bookingTime)
    const priceResult = calculateBookingPrice(basePrice, membership, bookingDateTime)
    setPriceCalculation(priceResult)

    // Validate membership
    const membershipValidation = validateMembershipForBooking(membership, bookingDate, bookingTime)
    setValidation(membershipValidation)

    // Get suggested times if invalid
    if (!membershipValidation.isValid && membership.timeRestrictions && availableSlots.length > 0) {
      const suggestions = getSuggestedBookingTimes(membership, bookingDate, availableSlots)
      setSuggestedTimes(suggestions.slice(0, 6))
    } else {
      setSuggestedTimes([])
    }
  }, [basePrice, membership, bookingDate, bookingTime, availableSlots])

  if (!priceCalculation) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-gray-500">
            <Calculator className="h-4 w-4" />
            <span>Расчёт стоимости...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={`${
        membership && validation?.isValid
          ? "border-purple-200 bg-purple-50"
          : membership && !validation?.isValid
            ? "border-yellow-200 bg-yellow-50"
            : "border-gray-200"
      }`}
    >
      <CardContent className="p-4 space-y-4">
        {/* Membership Status */}
        {membership && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${validation?.isValid ? "bg-green-500" : "bg-yellow-500"}`} />
              <span className="font-medium">{membership.membershipName}</span>
              <Badge variant="secondary" className="text-xs">
                {membership.benefitType === "sessions"
                  ? `${membership.remainingSessions}/${membership.originalSessions}`
                  : `-${membership.discountPercentage}%`}
              </Badge>
            </div>

            {membership.timeRestrictions && (
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {getRestrictionDisplayText(membership.timeRestrictions)}
              </Badge>
            )}
          </div>
        )}

        {/* Validation Messages */}
        {membership && validation && (
          <>
            {validation.isValid ? (
              <div className="flex items-center gap-2 text-green-700 text-sm">
                <CheckCircle className="h-4 w-4" />
                <span>Абонемент применяется к этому бронированию</span>
              </div>
            ) : (
              <Alert className="bg-yellow-100 border-yellow-300">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-yellow-800">
                  <div className="font-medium">{validation.reason}</div>
                  {validation.suggestions && (
                    <div className="mt-1 text-sm space-y-1">
                      {validation.suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <span className="w-1 h-1 bg-yellow-600 rounded-full" />
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </>
        )}

        {/* Price Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Базовая цена:</span>
            <span className={`${priceCalculation.membershipApplied ? "line-through text-gray-400" : "font-medium"}`}>
              {priceCalculation.originalPrice}₽
            </span>
          </div>

          {priceCalculation.membershipApplied && membership && (
            <>
              {membership.benefitType === "discount" && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-purple-600">
                    <TrendingDown className="h-3 w-3" />
                    <span>Скидка {membership.discountPercentage}%:</span>
                  </div>
                  <span className="text-purple-600 font-medium">
                    -{priceCalculation.originalPrice - priceCalculation.finalPrice}₽
                  </span>
                </div>
              )}

              {membership.benefitType === "sessions" && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-purple-600">
                    <Gift className="h-3 w-3" />
                    <span>Списание занятия:</span>
                  </div>
                  <span className="text-purple-600 font-medium">-{priceCalculation.originalPrice}₽</span>
                </div>
              )}
            </>
          )}

          <div className="flex items-center justify-between text-lg font-bold border-t pt-3">
            <span>К оплате:</span>
            <div className="text-right">
              <div className={`${priceCalculation.finalPrice === 0 ? "text-green-600" : "text-blue-600"}`}>
                {priceCalculation.finalPrice}₽
              </div>
              {priceCalculation.finalPrice === 0 && (
                <div className="text-xs text-green-600 font-normal">Полностью покрыто абонементом</div>
              )}
            </div>
          </div>
        </div>

        {/* Session Balance Update Preview */}
        {priceCalculation.membershipApplied && membership?.benefitType === "sessions" && (
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            После бронирования: {(membership.remainingSessions || 1) - 1} занятий
          </div>
        )}

        {/* Suggested Times */}
        {!validation?.isValid && suggestedTimes.length > 0 && onTimeChange && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700 text-sm font-medium mb-2">
              <Lightbulb className="h-4 w-4" />
              <span>Доступное время для абонемента:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedTimes.map((time) => (
                <Button
                  key={time}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 bg-white hover:bg-blue-100 border-blue-200"
                  onClick={() => onTimeChange(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Simplified version for quick price display
export function QuickPriceDisplay({
  basePrice,
  membership,
  bookingDate,
  bookingTime,
}: {
  basePrice: number
  membership?: ClientMembership | null
  bookingDate: string
  bookingTime: string
}) {
  const [finalPrice, setFinalPrice] = useState(basePrice)
  const [membershipApplied, setMembershipApplied] = useState(false)

  useEffect(() => {
    if (!membership) {
      setFinalPrice(basePrice)
      setMembershipApplied(false)
      return
    }

    const bookingDateTime = createBookingDateTime(bookingDate, bookingTime)
    const result = calculateBookingPrice(basePrice, membership, bookingDateTime)
    setFinalPrice(result.finalPrice)
    setMembershipApplied(result.membershipApplied)
  }, [basePrice, membership, bookingDate, bookingTime])

  return (
    <div className="flex items-center gap-2">
      {membershipApplied && basePrice !== finalPrice && (
        <span className="text-sm text-gray-400 line-through">{basePrice}₽</span>
      )}
      <span
        className={`font-bold ${
          finalPrice === 0 ? "text-green-600" : membershipApplied ? "text-purple-600" : "text-gray-900"
        }`}
      >
        {finalPrice}₽
      </span>
      {membershipApplied && (
        <Badge variant="secondary" className="text-xs">
          {membership?.benefitType === "sessions" ? "Занятие" : "Скидка"}
        </Badge>
      )}
    </div>
  )
}
