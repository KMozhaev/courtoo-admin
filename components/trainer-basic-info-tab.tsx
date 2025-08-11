"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Plus } from "lucide-react"
import { useState } from "react"
import type { TrainerProfile } from "@/lib/trainer-data"

interface TrainerBasicInfoTabProps {
  formData: Partial<TrainerProfile>
  setFormData: (data: Partial<TrainerProfile>) => void
  validationErrors: Record<string, string>
}

const PREDEFINED_SPECIALIZATIONS = [
  "Техника удара",
  "Тактика игры",
  "Подача",
  "Физическая подготовка",
  "Начинающие",
  "Детский теннис",
  "Профессиональная подготовка",
]

export function TrainerBasicInfoTab({ formData, setFormData, validationErrors }: TrainerBasicInfoTabProps) {
  const [newSpecialization, setNewSpecialization] = useState("")

  const handleInputChange = (field: keyof TrainerProfile, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  const handlePhoneChange = (value: string) => {
    // Auto-format phone number
    let formatted = value.replace(/\D/g, "")
    if (formatted.startsWith("7")) {
      formatted = formatted.substring(1)
    }
    if (formatted.startsWith("8")) {
      formatted = formatted.substring(1)
    }

    if (formatted.length >= 10) {
      formatted = `+7 (${formatted.substring(0, 3)}) ${formatted.substring(3, 6)}-${formatted.substring(6, 8)}-${formatted.substring(8, 10)}`
    }

    handleInputChange("phone", formatted)
  }

  const addSpecialization = (spec: string) => {
    const current = formData.specialization || []
    if (!current.includes(spec)) {
      handleInputChange("specialization", [...current, spec])
    }
  }

  const removeSpecialization = (spec: string) => {
    const current = formData.specialization || []
    handleInputChange(
      "specialization",
      current.filter((s) => s !== spec),
    )
  }

  const addCustomSpecialization = () => {
    if (newSpecialization.trim()) {
      addSpecialization(newSpecialization.trim())
      setNewSpecialization("")
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Required Fields */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Обязательные поля</h3>

          <div>
            <Label htmlFor="name">Имя тренера *</Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Введите имя тренера"
              className={validationErrors.name ? "border-red-500" : ""}
            />
            {validationErrors.name && <p className="text-sm text-red-600 mt-1">{validationErrors.name}</p>}
          </div>

          <div>
            <Label htmlFor="phone">Телефон *</Label>
            <Input
              id="phone"
              value={formData.phone || ""}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="+7 (999) 123-45-67"
              className={validationErrors.phone ? "border-red-500" : ""}
            />
            {validationErrors.phone && <p className="text-sm text-red-600 mt-1">{validationErrors.phone}</p>}
          </div>

          <div>
            <Label htmlFor="hourlyRate">Почасовая ставка (₽) *</Label>
            <Input
              id="hourlyRate"
              type="number"
              min="500"
              max="10000"
              value={formData.hourlyRate || ""}
              onChange={(e) => handleInputChange("hourlyRate", Number(e.target.value))}
              placeholder="2500"
              className={validationErrors.hourlyRate ? "border-red-500" : ""}
            />
            {validationErrors.hourlyRate && <p className="text-sm text-red-600 mt-1">{validationErrors.hourlyRate}</p>}
            <p className="text-xs text-gray-500 mt-1">От 500 до 10000 рублей</p>
          </div>
        </div>

        {/* Optional Fields */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Дополнительная информация</h3>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="trainer@example.com"
              className={validationErrors.email ? "border-red-500" : ""}
            />
            {validationErrors.email && <p className="text-sm text-red-600 mt-1">{validationErrors.email}</p>}
          </div>

          <div>
            <Label htmlFor="experienceYears">Опыт работы (лет)</Label>
            <Input
              id="experienceYears"
              type="number"
              min="0"
              max="50"
              value={formData.experienceYears || ""}
              onChange={(e) => handleInputChange("experienceYears", Number(e.target.value))}
              placeholder="5"
            />
          </div>

          <div>
            <Label htmlFor="telegramUsername">Telegram Username</Label>
            <Input
              id="telegramUsername"
              value={formData.telegramUsername || ""}
              onChange={(e) => handleInputChange("telegramUsername", e.target.value)}
              placeholder="@username"
            />
            <p className="text-xs text-gray-500 mt-1">Для будущей интеграции с ботом</p>
          </div>
        </div>
      </div>

      {/* Specializations */}
      <div>
        <Label>Специализации</Label>
        <div className="mt-2 space-y-3">
          {/* Current specializations */}
          {formData.specialization && formData.specialization.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.specialization.map((spec) => (
                <Badge key={spec} variant="secondary" className="flex items-center gap-1">
                  {spec}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeSpecialization(spec)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}

          {/* Predefined options */}
          <div className="flex flex-wrap gap-2">
            {PREDEFINED_SPECIALIZATIONS.filter((spec) => !formData.specialization?.includes(spec)).map((spec) => (
              <Button key={spec} variant="outline" size="sm" onClick={() => addSpecialization(spec)} className="h-8">
                <Plus className="h-3 w-3 mr-1" />
                {spec}
              </Button>
            ))}
          </div>

          {/* Custom specialization input */}
          <div className="flex gap-2">
            <Input
              value={newSpecialization}
              onChange={(e) => setNewSpecialization(e.target.value)}
              placeholder="Добавить свою специализацию"
              className="flex-1"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addCustomSpecialization()
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={addCustomSpecialization}
              disabled={!newSpecialization.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Admin Comment */}
      <div>
        <Label htmlFor="adminComment">Комментарий администратора</Label>
        <Textarea
          id="adminComment"
          value={formData.adminComment || ""}
          onChange={(e) => handleInputChange("adminComment", e.target.value)}
          placeholder="Внутренние заметки о тренере..."
          rows={3}
        />
        <p className="text-xs text-gray-500 mt-1">Видно только администраторам</p>
      </div>
    </div>
  )
}
