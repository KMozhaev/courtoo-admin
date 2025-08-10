"use client"

import { Badge } from "@/components/ui/badge"
import { Clock, AlertCircle, CheckCircle } from "lucide-react"
import {
  type ClientMembership,
  getMembershipStatusColor,
  getMembershipBadgeText,
  getRestrictionDisplayText,
} from "@/lib/membership-data"

interface MembershipBadgeProps {
  membership: ClientMembership
  currentTime?: Date
  showRestrictions?: boolean
  size?: "sm" | "md" | "lg"
  onClick?: () => void
}

export function MembershipBadge({
  membership,
  currentTime,
  showRestrictions = false,
  size = "md",
  onClick,
}: MembershipBadgeProps) {
  const statusColor = getMembershipStatusColor(membership, currentTime)
  const badgeText = getMembershipBadgeText(membership)
  const restrictionText = getRestrictionDisplayText(membership.timeRestrictions)

  const getStatusIcon = () => {
    switch (statusColor) {
      case "green":
        return <CheckCircle className="h-3 w-3" />
      case "yellow":
        return <AlertCircle className="h-3 w-3" />
      case "red":
        return <AlertCircle className="h-3 w-3" />
      default:
        return null
    }
  }

  const getStatusMessage = () => {
    switch (statusColor) {
      case "green":
        return "Активен"
      case "yellow":
        return "Ограничен по времени"
      case "red":
        return membership.status === "expired" ? "Истёк" : "Недоступен"
      default:
        return "Неизвестно"
    }
  }

  const getBadgeVariant = () => {
    switch (statusColor) {
      case "green":
        return "default"
      case "yellow":
        return "secondary"
      case "red":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getBadgeClassName = () => {
    const baseClasses = "flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"

    switch (statusColor) {
      case "green":
        return `${baseClasses} bg-green-100 text-green-800 border-green-300 hover:bg-green-200`
      case "yellow":
        return `${baseClasses} bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200`
      case "red":
        return `${baseClasses} bg-red-100 text-red-800 border-red-300 hover:bg-red-200`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200`
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-xs px-2 py-1"
      case "lg":
        return "text-sm px-3 py-2"
      default:
        return "text-xs px-2.5 py-1.5"
    }
  }

  return (
    <div className="space-y-1">
      <Badge variant={getBadgeVariant()} className={`${getBadgeClassName()} ${getSizeClasses()}`} onClick={onClick}>
        {getStatusIcon()}
        <span className="font-medium">{membership.membershipName}</span>
        <span className="text-xs opacity-80">({badgeText})</span>
      </Badge>

      {showRestrictions && restrictionText && (
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Clock className="h-3 w-3" />
          <span>{restrictionText}</span>
        </div>
      )}

      {size === "lg" && (
        <div className="text-xs text-gray-500 mt-1">
          Статус: {getStatusMessage()}
          {membership.expiresDate && (
            <span className="ml-2">• Истекает: {new Date(membership.expiresDate).toLocaleDateString("ru-RU")}</span>
          )}
        </div>
      )}
    </div>
  )
}

// Compact version for use in lists
export function MembershipBadgeCompact({
  membership,
  currentTime,
}: {
  membership: ClientMembership
  currentTime?: Date
}) {
  const statusColor = getMembershipStatusColor(membership, currentTime)
  const badgeText = getMembershipBadgeText(membership)

  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-2 h-2 rounded-full ${
          statusColor === "green" ? "bg-green-500" : statusColor === "yellow" ? "bg-yellow-500" : "bg-red-500"
        }`}
      />
      <span className="text-sm font-medium">{membership.membershipName}</span>
      <span className="text-xs text-gray-600">({badgeText})</span>
    </div>
  )
}

// Multiple memberships display
export function MembershipBadgeGroup({
  memberships,
  currentTime,
  maxDisplay = 2,
}: {
  memberships: ClientMembership[]
  currentTime?: Date
  maxDisplay?: number
}) {
  const activeMemberships = memberships.filter((m) => m.status === "active")
  const displayMemberships = activeMemberships.slice(0, maxDisplay)
  const remainingCount = activeMemberships.length - maxDisplay

  if (activeMemberships.length === 0) {
    return <div className="text-xs text-gray-500 italic">Нет активных абонементов</div>
  }

  return (
    <div className="space-y-1">
      {displayMemberships.map((membership) => (
        <MembershipBadgeCompact key={membership.id} membership={membership} currentTime={currentTime} />
      ))}

      {remainingCount > 0 && <div className="text-xs text-gray-500">+{remainingCount} ещё</div>}
    </div>
  )
}
