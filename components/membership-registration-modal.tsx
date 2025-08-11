"use client"

import type React from "react"
import { Clock } from "lucide-react" // Import Clock component
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard } from "lucide-react"
import { Badge } from "@/components/ui/badge" // Import Badge component
import {
  mockMembershipPlans,
  type MembershipPlan,
  type ClientMembership,
  mockClientMemberships,
} from "@/lib/membership-data"

interface MembershipRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  client: any
  onMembershipAdded: () => void
}

export function MembershipRegistrationModal({
  isOpen,
  onClose,
  client,
  onMembershipAdded,
}: MembershipRegistrationModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null)
  const [formData, setFormData] = useState({
    purchasedDate: new Date().toISOString().split("T")[0],
  })

  const handlePlanSelect = (plan: MembershipPlan) => {
    setSelectedPlan(plan)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPlan) {
      return
    }

    const expiryDate = new Date(formData.purchasedDate)
    expiryDate.setDate(expiryDate.getDate() + Number.parseInt(selectedPlan.validForDays.toString()))

    // Check if client has active membership and expire it
    const existingActiveMembership = mockClientMemberships.find(
      (m) => m.clientId === client.id && m.status === "active",
    )

    if (existingActiveMembership) {
      // Set existing membership to expired
      existingActiveMembership.status = "expired"
      console.log("Expiring existing membership:", existingActiveMembership.id)
    }

    const newMembership: ClientMembership = {
      id: `mem_${Date.now()}`,
      clientId: client.id,
      membershipPlanId: selectedPlan?.id || "custom",
      membershipName: selectedPlan.planName,
      benefitType: selectedPlan.benefitType,
      remainingSessions:
        selectedPlan.benefitType === "sessions" ? Number.parseInt(selectedPlan.benefitValue.toString()) : undefined,
      originalSessions:
        selectedPlan.benefitType === "sessions" ? Number.parseInt(selectedPlan.benefitValue.toString()) : undefined,
      discountPercentage:
        selectedPlan.benefitType === "discount" ? Number.parseInt(selectedPlan.benefitValue.toString()) : undefined,
      purchasedDate: formData.purchasedDate,
      expiresDate: expiryDate.toISOString().split("T")[0],
      status: "active",
      timeRestrictions: selectedPlan.timeRestrictions,
    }

    // Add to memberships array
    mockClientMemberships.push(newMembership)

    console.log("New membership created:", newMembership)

    if (existingActiveMembership) {
      alert(`Предыдущий абонемент "${existingActiveMembership.membershipName}" был автоматически завершён.`)
    }

    onMembershipAdded()
  }

  if (!client) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Добавить абонемент для {client.name}</DialogTitle>
        </DialogHeader>

        {/* Active Membership Warning */}
        {(() => {
          const activeMembership = mockClientMemberships.find((m) => m.clientId === client.id && m.status === "active")
          return activeMembership ? (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
              <div className="text-sm text-yellow-800">
                ⚠️ У клиента уже есть активный абонемент "{activeMembership.membershipName}". При добавлении нового
                абонемента, текущий будет автоматически завершён.
              </div>
            </div>
          ) : null
        })()}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Plan Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Выберите тип абонемента</Label>

            {/* Predefined Plans */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mockMembershipPlans
                .filter((plan) => plan.isActive)
                .map((plan) => (
                  <div
                    key={plan.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPlan?.id === plan.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handlePlanSelect(plan)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">{plan.planName}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {plan.benefitType === "sessions" ? `${plan.benefitValue} занятий` : `-${plan.benefitValue}%`}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">{plan.description}</p>

                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-blue-600">{plan.price.toLocaleString()} ₽</span>
                      <span className="text-gray-500">{plan.validForDays} дней</span>
                    </div>

                    {plan.timeRestrictions && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-orange-600">
                        <Clock className="h-3 w-3" />
                        <span>Ограничения по времени</span>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {selectedPlan && (
            <div className="space-y-4 border-t pt-4">
              <Label className="text-base font-medium">Параметры абонемента</Label>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="purchasedDate">Дата покупки</Label>
                  <Input
                    id="purchasedDate"
                    type="date"
                    value={formData.purchasedDate}
                    onChange={(e) => setFormData({ ...formData, purchasedDate: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          {selectedPlan && (
            <div className="border-t pt-4">
              <Label className="text-base font-medium">Итого</Label>
              <div className="mt-2 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{selectedPlan.planName}</span>
                  <Badge variant="secondary">
                    {selectedPlan.benefitType === "sessions"
                      ? `${selectedPlan.benefitValue} занятий`
                      : `-${selectedPlan.benefitValue}%`}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Стоимость: {Number.parseInt(selectedPlan.price.toString() || "0").toLocaleString()} ₽</div>
                  <div>
                    Срок действия: {selectedPlan.validForDays} дней (до{" "}
                    {new Date(
                      new Date(formData.purchasedDate).getTime() +
                        Number.parseInt(selectedPlan.validForDays.toString() || "30") * 24 * 60 * 60 * 1000,
                    ).toLocaleDateString("ru-RU")}
                    )
                  </div>
                  {selectedPlan.timeRestrictions && (
                    <div className="flex items-center gap-1 text-orange-600">
                      <Clock className="h-3 w-3" />
                      <span>С ограничениями по времени</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={!selectedPlan}>
              <CreditCard className="h-4 w-4 mr-2" />
              Добавить абонемент
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
