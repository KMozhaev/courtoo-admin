"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrainerBasicInfoTab } from "./trainer-basic-info-tab"
import { TrainerScheduleTab } from "./trainer-schedule-tab"
import type { TrainerProfile } from "@/lib/trainer-data"

interface TrainerCreationModalProps {
  isOpen: boolean
  onClose: () => void
  onTrainerCreate: (trainer: TrainerProfile) => void
  editingTrainer?: TrainerProfile | null
}

export function TrainerCreationModal({ isOpen, onClose, onTrainerCreate, editingTrainer }: TrainerCreationModalProps) {
  const [activeTab, setActiveTab] = useState("basic")
  const [formData, setFormData] = useState<Partial<TrainerProfile>>(() => {
    if (editingTrainer) {
      return { ...editingTrainer }
    }
    return {
      name: "",
      phone: "",
      email: "",
      hourlyRate: 2500,
      specialization: [],
      experienceYears: 0,
      telegramUsername: "",
      adminComment: "",
      workSchedule: {
        monday: { enabled: false, timeSlots: [] },
        tuesday: { enabled: false, timeSlots: [] },
        wednesday: { enabled: false, timeSlots: [] },
        thursday: { enabled: false, timeSlots: [] },
        friday: { enabled: false, timeSlots: [] },
        saturday: { enabled: false, timeSlots: [] },
        sunday: { enabled: false, timeSlots: [] },
      },
      preferredCourts: [],
      sessionDurations: [60, 90],
      bufferTimeMinutes: 15,
      maxSessionsPerDay: 8,
      allowDirectClientContact: true,
      telegramNotificationsEnabled: false,
      isActive: true,
    }
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    // Basic info validation
    if (!formData.name || formData.name.length < 2) {
      errors.name = "Имя тренера обязательно (минимум 2 символа)"
    }

    if (!formData.phone) {
      errors.phone = "Телефон обязателен"
    } else if (!/^\+7\s$$\d{3}$$\s\d{3}-\d{2}-\d{2}$/.test(formData.phone)) {
      errors.phone = "Неверный формат телефона. Используйте: +7 (999) 123-45-67"
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Неверный формат email"
    }

    if (!formData.hourlyRate || formData.hourlyRate < 500 || formData.hourlyRate > 10000) {
      errors.hourlyRate = "Ставка должна быть от 500 до 10000 рублей"
    }

    // Schedule validation - at least one day with time slots
    const hasWorkingDays =
      formData.workSchedule &&
      Object.values(formData.workSchedule).some((day) => day.enabled && day.timeSlots.length > 0)

    if (!hasWorkingDays) {
      errors.schedule = "Необходимо указать хотя бы один рабочий день с временными слотами"
    }

    // Court validation - at least one court selected
    if (!formData.preferredCourts || formData.preferredCourts.length === 0) {
      errors.courts = "Необходимо выбрать хотя бы один корт"
    }

    // Session duration validation
    if (!formData.sessionDurations || formData.sessionDurations.length === 0) {
      errors.sessionDurations = "Необходимо выбрать хотя бы одну длительность сессии"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const trainerData: TrainerProfile = {
        id: editingTrainer?.id || `trainer_${Date.now()}`,
        organizationId: 1,
        name: formData.name!,
        phone: formData.phone!,
        email: formData.email,
        hourlyRate: formData.hourlyRate!,
        specialization: formData.specialization || [],
        experienceYears: formData.experienceYears,
        telegramUsername: formData.telegramUsername,
        adminComment: formData.adminComment,
        workSchedule: formData.workSchedule!,
        preferredCourts: formData.preferredCourts || [],
        sessionDurations: formData.sessionDurations || [60, 90],
        bufferTimeMinutes: formData.bufferTimeMinutes || 15,
        maxSessionsPerDay: formData.maxSessionsPerDay || 8,
        allowDirectClientContact: formData.allowDirectClientContact ?? true,
        telegramNotificationsEnabled: formData.telegramNotificationsEnabled ?? false,
        isActive: formData.isActive ?? true,
        createdAt: editingTrainer?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdByAdminId: "admin_1",
      }

      onTrainerCreate(trainerData)
      onClose()

      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        hourlyRate: 2500,
        specialization: [],
        workSchedule: {
          monday: { enabled: false, timeSlots: [] },
          tuesday: { enabled: false, timeSlots: [] },
          wednesday: { enabled: false, timeSlots: [] },
          thursday: { enabled: false, timeSlots: [] },
          friday: { enabled: false, timeSlots: [] },
          saturday: { enabled: false, timeSlots: [] },
          sunday: { enabled: false, timeSlots: [] },
        },
        preferredCourts: [],
        sessionDurations: [60, 90],
        bufferTimeMinutes: 15,
        maxSessionsPerDay: 8,
        allowDirectClientContact: true,
        telegramNotificationsEnabled: false,
        isActive: true,
      })
      setValidationErrors({})
      setActiveTab("basic")
    } catch (error) {
      console.error("Error saving trainer:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
    setValidationErrors({})
    setActiveTab("basic")
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {editingTrainer ? `Редактировать тренера: ${editingTrainer.name}` : "Добавить тренера"}
          </DialogTitle>
        </DialogHeader>

        {Object.keys(validationErrors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-red-800 mb-2">Исправьте ошибки:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              {Object.values(validationErrors).map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Основная информация</TabsTrigger>
            <TabsTrigger value="schedule">Расписание и настройки</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-6">
            <TrainerBasicInfoTab formData={formData} setFormData={setFormData} validationErrors={validationErrors} />
          </TabsContent>

          <TabsContent value="schedule" className="mt-6">
            <TrainerScheduleTab formData={formData} setFormData={setFormData} validationErrors={validationErrors} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
            {isLoading ? "Сохранение..." : "Сохранить"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
