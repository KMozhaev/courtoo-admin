"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RotateCcw } from "lucide-react"

interface BalanceAdjustmentProps {
  membership: {
    id: string
    membershipName: string
    remainingSessions: number
    benefitType: "sessions" | "discount"
  }
  onBalanceUpdate: (newBalance: number, reason: string) => void
}

export function BalanceAdjustment({ membership, onBalanceUpdate }: BalanceAdjustmentProps) {
  const [newBalance, setNewBalance] = useState(membership.remainingSessions)
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Only show for session-based memberships
  if (membership.benefitType !== "sessions") {
    return null
  }

  const currentBalance = membership.remainingSessions
  const balanceChange = newBalance - currentBalance

  const handleSubmit = async () => {
    if (!reason.trim()) {
      alert("Укажите причину изменения баланса")
      return
    }

    if (balanceChange === 0) {
      alert("Изменение баланса должно быть отличным от нуля")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create audit trail entry
      const auditEntry = {
        membershipId: membership.id,
        action: balanceChange > 0 ? "increase" : "decrease",
        previousBalance: currentBalance,
        newBalance: newBalance,
        reason: reason.trim(),
        timestamp: new Date().toISOString(),
        adminName: "Администратор",
      }

      console.log("Balance adjustment audit:", auditEntry)

      onBalanceUpdate(newBalance, reason.trim())

      // Reset form
      setReason("")
    } catch (error) {
      console.error("Error updating balance:", error)
      alert("Ошибка при обновлении баланса")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setNewBalance(currentBalance)
    setReason("")
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Корректировка баланса</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Balance Display */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium text-blue-900">Текущий баланс:</span>
          <span className="text-lg font-bold text-blue-600">{currentBalance} занятий</span>
        </div>

        {/* New Balance Input */}
        <div className="space-y-2">
          <Label htmlFor="newBalance" className="text-sm font-medium">
            Новый баланс:
          </Label>
          <Input
            id="newBalance"
            type="number"
            min="0"
            value={newBalance}
            onChange={(e) => setNewBalance(Number.parseInt(e.target.value) || 0)}
            placeholder="Введите количество занятий"
            className="text-center text-lg font-medium"
          />
        </div>

        {/* Balance Change Preview */}
        {balanceChange !== 0 && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Изменение:</span>
            <span className={`text-lg font-bold ${balanceChange > 0 ? "text-green-600" : "text-red-600"}`}>
              {balanceChange > 0 ? "+" : ""}
              {balanceChange} занятий
            </span>
          </div>
        )}

        {/* Reason Input */}
        <div className="space-y-2">
          <Label htmlFor="reason" className="text-sm font-medium">
            Причина изменения: *
          </Label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Укажите причину корректировки баланса..."
            rows={3}
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isSubmitting || (balanceChange === 0 && !reason)}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Сбросить
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || balanceChange === 0 || !reason.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? "Обновление..." : "Обновить баланс"}
          </Button>
        </div>

        {/* Warning for negative adjustments */}
        {balanceChange < 0 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-sm text-yellow-800">
              ⚠️ Внимание: Вы уменьшаете количество занятий на {Math.abs(balanceChange)}. Убедитесь, что это правильное
              действие.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
