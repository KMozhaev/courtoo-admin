"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, CreditCard, Gift } from "lucide-react"
import { mockMembershipPlans, type MembershipPlan, type ClientMembership } from "@/lib/membership-data"

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
  const [customMembership, setCustomMembership] = useState(false)
  const [formData, setFormData] = useState({
    membershipName: "",
    benefitType: "sessions" as "sessions" | "discount",
    benefitValue: "",
    purchasedDate: new Date().toISOString().split("T")[0],
    validForDays: "30",
    price: "",
    hasTimeRestrictions: false,
    weekdays: [] as number[],
    timeSlots: [{ start: "06:00", end: "22:00" }],
    notes: "",
  })

  const handlePlanSelect = (plan: MembershipPlan) => {
    setSelectedPlan(plan)
    setCustomMembership(false)
    setFormData({
      membershipName: plan.planName,
      benefitType: plan.benefitType,
      benefitValue: plan.benefitValue.toString(),
      purchasedDate: new Date().toISOString().split("T")[0],
      validForDays: plan.validForDays.toString(),
      price: plan.price.toString(),
      hasTimeRestrictions: !!plan.timeRestrictions,
      weekdays: plan.timeRestrictions?.weekdays || [],
      timeSlots: plan.timeRestrictions?.timeSlots || [{ start: "06:00", end: "22:00" }],
      notes: "",
    })
  }

  const handleCustomMembership = () => {
    setCustomMembership(true)
    setSelectedPlan(null)
    setFormData({
      membershipName: "",
      benefitType: "sessions",
      benefitValue: "",
      purchasedDate: new Date().toISOString().split("T")[0],
      validForDays: "30",
      price: "",
      hasTimeRestrictions: false,
      weekdays: [],
      timeSlots: [{ start: "06:00", end: "22:00" }],
      notes: "",
    })
  }

  const handleWeekdayToggle = (day: number) => {
    const newWeekdays = formData.weekdays.includes(day)
      ? formData.weekdays.filter((d) => d !== day)
      : [...formData.weekdays, day].sort()
    setFormData({ ...formData, weekdays: newWeekdays })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const expiryDate = new Date(formData.purchasedDate)
    expiryDate.setDate(expiryDate.getDate() + Number.parseInt(formData.validForDays))

    const newMembership: ClientMembership = {
      id: `mem_${Date.now()}`,
      clientId: client.id,
      membershipPlanId: selectedPlan?.id || "custom",
      membershipName: formData.membershipName,
      benefitType: formData.benefitType,
      remainingSessions: formData.benefitType === "sessions" ? Number.parseInt(formData.benefitValue) : undefined,
      originalSessions: formData.benefitType === "sessions" ? Number.parseInt(formData.benefitValue) : undefined,
      discountPercentage: formData.benefitType === "discount" ? Number.parseInt(formData.benefitValue) : undefined,
      purchasedDate: formData.purchasedDate,
      expiresDate: expiryDate.toISOString().split("T")[0],
      status: "active",
      timeRestrictions: formData.hasTimeRestrictions
        ? {
            weekdays: formData.weekdays.length > 0 ? formData.weekdays : undefined,
            timeSlots: formData.timeSlots,
          }
        : undefined,
    }

    // In a real app, this would save to the backend
    console.log("New membership:", newMembership)

    onMembershipAdded()
  }

  const weekdayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]

  if (!client) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Добавить абонемент для {client.name}</DialogTitle>
        </DialogHeader>

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

              {/* Custom Membership Option */}
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  customMembership ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={handleCustomMembership}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="h-5 w-5 text-purple-600" />
                  <h3 className="font-medium">Индивидуальный абонемент</h3>
                </div>
                <p className="text-sm text-gray-600">Создать абонемент с индивидуальными условиями</p>
              </div>
            </div>
          </div>

          {/* Custom Membership Form */}
          {(selectedPlan || customMembership) && (
            <div className="space-y-4 border-t pt-4">
              <Label className="text-base font-medium">Параметры абонемента</Label>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="membershipName">Название абонемента</Label>
                  <Input
                    id="membershipName"
                    value={formData.membershipName}
                    onChange={(e) => setFormData({ ...formData, membershipName: e.target.value })}
                    placeholder="Введите название"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="price">Стоимость (₽)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Тип льготы</Label>
                  <RadioGroup
                    value={formData.benefitType}
                    onValueChange={(value: "sessions" | "discount") => setFormData({ ...formData, benefitType: value })}
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sessions" id="sessions" />
                      <Label htmlFor="sessions">Занятия</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="discount" id="discount" />
                      <Label htmlFor="discount">Скидка</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="benefitValue">
                    {formData.benefitType === "sessions" ? "Количество занятий" : "Размер скидки (%)"}
                  </Label>
                  <Input
                    id="benefitValue"
                    type="number"
                    value={formData.benefitValue}
                    onChange={(e) => setFormData({ ...formData, benefitValue: e.target.value })}
                    placeholder={formData.benefitType === "sessions" ? "10" : "20"}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="validForDays">Срок действия (дней)</Label>
                  <Input
                    id="validForDays"
                    type="number"
                    value={formData.validForDays}
                    onChange={(e) => setFormData({ ...formData, validForDays: e.target.value })}
                    placeholder="30"
                    required
                  />
                </div>
              </div>

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

                <div>
                  <Label>Дата истечения</Label>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>
                      {new Date(
                        new Date(formData.purchasedDate).getTime() +
                          Number.parseInt(formData.validForDays || "30") * 24 * 60 * 60 * 1000,
                      ).toLocaleDateString("ru-RU")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Time Restrictions */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasTimeRestrictions"
                    checked={formData.hasTimeRestrictions}
                    onCheckedChange={(checked) => setFormData({ ...formData, hasTimeRestrictions: checked as boolean })}
                  />
                  <Label htmlFor="hasTimeRestrictions">Ограничения по времени</Label>
                </div>

                {formData.hasTimeRestrictions && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">Дни недели (оставьте пустым для всех дней)</Label>
                      <div className="flex gap-2 mt-2">
                        {weekdayNames.map((day, index) => (
                          <Button
                            key={index}
                            type="button"
                            variant={formData.weekdays.includes(index) ? "default" : "outline"}
                            size="sm"
                            className="w-12 h-8 text-xs"
                            onClick={() => handleWeekdayToggle(index)}
                          >
                            {day}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Время действия</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <Label htmlFor="timeStart" className="text-xs">
                            С
                          </Label>
                          <Input
                            id="timeStart"
                            type="time"
                            value={formData.timeSlots[0]?.start || "06:00"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                timeSlots: [{ ...formData.timeSlots[0], start: e.target.value }],
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="timeEnd" className="text-xs">
                            До
                          </Label>
                          <Input
                            id="timeEnd"
                            type="time"
                            value={formData.timeSlots[0]?.end || "22:00"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                timeSlots: [{ ...formData.timeSlots[0], end: e.target.value }],
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="notes">Примечания</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Дополнительная информация об абонементе..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Summary */}
          {(selectedPlan || customMembership) && formData.membershipName && (
            <div className="border-t pt-4">
              <Label className="text-base font-medium">Итого</Label>
              <div className="mt-2 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{formData.membershipName}</span>
                  <Badge variant="secondary">
                    {formData.benefitType === "sessions"
                      ? `${formData.benefitValue} занятий`
                      : `-${formData.benefitValue}%`}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Стоимость: {Number.parseInt(formData.price || "0").toLocaleString()} ₽</div>
                  <div>
                    Срок действия: {formData.validForDays} дней (до{" "}
                    {new Date(
                      new Date(formData.purchasedDate).getTime() +
                        Number.parseInt(formData.validForDays || "30") * 24 * 60 * 60 * 1000,
                    ).toLocaleDateString("ru-RU")}
                    )
                  </div>
                  {formData.hasTimeRestrictions && (
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
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!formData.membershipName || !formData.price || !formData.benefitValue}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Добавить абонемент
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
