"use client"

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Plus, X, Copy } from "lucide-react"
import type { TrainerProfile, WorkSchedule, TimeSlot } from "@/lib/trainer-data"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const AVAILABLE_COURTS = [
  { id: "1", name: "Корт 1 (Хард)", type: "hard" },
  { id: "2", name: "Корт 2 (Хард)", type: "hard" },
  { id: "3", name: "Корт 3 (Грунт)", type: "clay" },
  { id: "4", name: "Корт 4 (Грунт)", type: "clay" },
]

const SESSION_DURATIONS = [
  { value: 60, label: "60 минут" },
  { value: 90, label: "90 минут" },
  { value: 120, label: "120 минут" },
]

const BUFFER_TIME_OPTIONS = [
  { value: 0, label: "Без перерыва" },
  { value: 15, label: "15 минут" },
  { value: 30, label: "30 минут" },
]

const DAYS_OF_WEEK = [
  { key: "monday", label: "Понедельник" },
  { key: "tuesday", label: "Вторник" },
  { key: "wednesday", label: "Среда" },
  { key: "thursday", label: "Четверг" },
  { key: "friday", label: "Пятница" },
  { key: "saturday", label: "Суббота" },
  { key: "sunday", label: "Воскресенье" },
]

interface TrainerScheduleTabProps {
  formData: Partial<TrainerProfile>
  setFormData: (data: Partial<TrainerProfile>) => void
  validationErrors: Record<string, string>
}

export function TrainerScheduleTab({ formData, setFormData, validationErrors }: TrainerScheduleTabProps) {
  const updateFormData = (field: keyof TrainerProfile, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleCourtToggle = (courtId: string, checked: boolean) => {
    const currentCourts = formData.preferredCourts || []
    if (checked) {
      updateFormData("preferredCourts", [...currentCourts, courtId])
    } else {
      updateFormData(
        "preferredCourts",
        currentCourts.filter((id) => id !== courtId),
      )
    }
  }

  const handleSessionDurationToggle = (duration: number, checked: boolean) => {
    const currentDurations = formData.sessionDurations || []
    if (checked) {
      updateFormData(
        "sessionDurations",
        [...currentDurations, duration].sort((a, b) => a - b),
      )
    } else {
      updateFormData(
        "sessionDurations",
        currentDurations.filter((d) => d !== duration),
      )
    }
  }

  const handleAllCourtsToggle = (checked: boolean) => {
    if (checked) {
      updateFormData(
        "preferredCourts",
        AVAILABLE_COURTS.map((court) => court.id),
      )
    } else {
      updateFormData("preferredCourts", [])
    }
  }

  const isAllCourtsSelected = (formData.preferredCourts || []).length === AVAILABLE_COURTS.length
  const isIndeterminate = (formData.preferredCourts || []).length > 0 && !isAllCourtsSelected

  const updateWorkSchedule = (updates: Partial<WorkSchedule>) => {
    setFormData({
      ...formData,
      workSchedule: {
        ...formData.workSchedule,
        ...updates,
      },
    })
  }

  const toggleDay = (dayKey: string, enabled: boolean) => {
    updateWorkSchedule({
      [dayKey]: {
        enabled,
        timeSlots: enabled ? [{ startTime: "09:00", endTime: "18:00", id: `${dayKey}_${Date.now()}` }] : [],
      },
    })
  }

  const addTimeSlot = (dayKey: string) => {
    const currentDay = formData.workSchedule?.[dayKey]
    if (!currentDay) return

    const newSlot: TimeSlot = {
      startTime: "09:00",
      endTime: "18:00",
      id: `${dayKey}_${Date.now()}`,
    }

    updateWorkSchedule({
      [dayKey]: {
        ...currentDay,
        timeSlots: [...currentDay.timeSlots, newSlot],
      },
    })
  }

  const removeTimeSlot = (dayKey: string, slotId: string) => {
    const currentDay = formData.workSchedule?.[dayKey]
    if (!currentDay) return

    updateWorkSchedule({
      [dayKey]: {
        ...currentDay,
        timeSlots: currentDay.timeSlots.filter((slot) => slot.id !== slotId),
      },
    })
  }

  const updateTimeSlot = (dayKey: string, slotId: string, field: "startTime" | "endTime", value: string) => {
    const currentDay = formData.workSchedule?.[dayKey]
    if (!currentDay) return

    updateWorkSchedule({
      [dayKey]: {
        ...currentDay,
        timeSlots: currentDay.timeSlots.map((slot) => (slot.id === slotId ? { ...slot, [field]: value } : slot)),
      },
    })
  }

  const copyScheduleFrom = (sourceDayKey: string, targetDayKey: string) => {
    const sourceDay = formData.workSchedule?.[sourceDayKey]
    if (!sourceDay || !sourceDay.enabled) return

    const copiedTimeSlots = sourceDay.timeSlots.map((slot) => ({
      ...slot,
      id: `${targetDayKey}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }))

    updateWorkSchedule({
      [targetDayKey]: {
        enabled: true,
        timeSlots: copiedTimeSlots,
      },
    })
  }

  const validateTimeSlot = (startTime: string, endTime: string): string | null => {
    if (startTime >= endTime) {
      return "Время окончания должно быть позже времени начала"
    }
    return null
  }

  const hasWorkingDays =
    formData.workSchedule && Object.values(formData.workSchedule).some((day) => day.enabled && day.timeSlots.length > 0)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Рабочие дни и часы</h3>

        {validationErrors.schedule && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-600">{validationErrors.schedule}</p>
          </div>
        )}

        <div className="space-y-4">
          {DAYS_OF_WEEK.map(({ key, label }) => {
            const daySchedule = formData.workSchedule?.[key] || { enabled: false, timeSlots: [] }

            return (
              <div key={key} className="border rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Switch checked={daySchedule.enabled} onCheckedChange={(enabled) => toggleDay(key, enabled)} />
                    <Label className="font-medium">{label}</Label>
                  </div>

                  {daySchedule.enabled && (
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => addTimeSlot(key)} className="h-8">
                        <Plus className="h-3 w-3 mr-1" />
                        Добавить слот
                      </Button>

                      {/* Copy from other days */}
                      <div className="relative group">
                        <Button variant="outline" size="sm" className="h-8 bg-transparent">
                          <Copy className="h-3 w-3" />
                        </Button>
                        <div className="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg p-2 hidden group-hover:block z-10 min-w-[150px]">
                          <p className="text-xs text-gray-600 mb-2">Копировать из:</p>
                          {DAYS_OF_WEEK.filter((d) => d.key !== key).map(({ key: sourceKey, label: sourceLabel }) => {
                            const sourceDay = formData.workSchedule?.[sourceKey]
                            const canCopy = sourceDay?.enabled && sourceDay.timeSlots.length > 0

                            return (
                              <Button
                                key={sourceKey}
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start h-8 text-xs"
                                disabled={!canCopy}
                                onClick={() => copyScheduleFrom(sourceKey, key)}
                              >
                                {sourceLabel}
                              </Button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {daySchedule.enabled && (
                  <div className="space-y-2">
                    {daySchedule.timeSlots.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">Нет временных слотов</p>
                    ) : (
                      daySchedule.timeSlots.map((slot) => {
                        const error = validateTimeSlot(slot.startTime, slot.endTime)

                        return (
                          <div key={slot.id} className="flex items-center gap-2">
                            <Input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) => updateTimeSlot(key, slot.id, "startTime", e.target.value)}
                              className={`w-32 ${error ? "border-red-500" : ""}`}
                            />
                            <span className="text-gray-500">—</span>
                            <Input
                              type="time"
                              value={slot.endTime}
                              onChange={(e) => updateTimeSlot(key, slot.id, "endTime", e.target.value)}
                              className={`w-32 ${error ? "border-red-500" : ""}`}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTimeSlot(key, slot.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            {error && <p className="text-xs text-red-600 ml-2">{error}</p>}
                          </div>
                        )
                      })
                    )}
                  </div>
                )}

                {!daySchedule.enabled && <p className="text-sm text-gray-500 italic">Выходной день</p>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Schedule Summary */}
      {hasWorkingDays && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Сводка расписания</h4>
          <div className="text-sm text-blue-800 space-y-1">
            {DAYS_OF_WEEK.map(({ key, label }) => {
              const daySchedule = formData.workSchedule?.[key]
              if (!daySchedule?.enabled || daySchedule.timeSlots.length === 0) return null

              return (
                <div key={key}>
                  <strong>{label}:</strong>{" "}
                  {daySchedule.timeSlots.map((slot) => `${slot.startTime}-${slot.endTime}`).join(", ")}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Court Preferences */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Предпочтения по кортам</h3>

        {validationErrors.courts && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-600">{validationErrors.courts}</p>
          </div>
        )}

        <div className="space-y-4">
          {/* All courts toggle */}
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            <Checkbox
              id="all-courts"
              checked={isAllCourtsSelected}
              onCheckedChange={handleAllCourtsToggle}
              className={isIndeterminate ? "data-[state=checked]:bg-blue-600" : ""}
            />
            <Label htmlFor="all-courts" className="font-medium">
              Все корты
            </Label>
            <span className="text-sm text-gray-500 ml-auto">
              ({formData.preferredCourts?.length || 0} из {AVAILABLE_COURTS.length})
            </span>
          </div>

          {/* Individual courts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {AVAILABLE_COURTS.map((court) => (
              <div key={court.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                <Checkbox
                  id={`court-${court.id}`}
                  checked={(formData.preferredCourts || []).includes(court.id)}
                  onCheckedChange={(checked) => handleCourtToggle(court.id, checked as boolean)}
                />
                <Label htmlFor={`court-${court.id}`} className="flex-1">
                  {court.name}
                </Label>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    court.type === "hard" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {court.type === "hard" ? "Хард" : "Грунт"}
                </span>
              </div>
            ))}
          </div>

          {(formData.preferredCourts || []).length === 0 && (
            <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
              ⚠️ Не выбран ни один корт. Тренер не будет доступен для бронирования.
            </p>
          )}
        </div>
      </div>

      {/* Session Configuration */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Настройки сессий</h3>

        <div className="space-y-6">
          {/* Session Durations */}
          <div>
            <Label className="text-sm font-medium">Длительность сессий</Label>
            <div className="mt-2 space-y-2">
              {SESSION_DURATIONS.map((duration) => (
                <div key={duration.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`duration-${duration.value}`}
                    checked={(formData.sessionDurations || []).includes(duration.value)}
                    onCheckedChange={(checked) => handleSessionDurationToggle(duration.value, checked as boolean)}
                  />
                  <Label htmlFor={`duration-${duration.value}`}>{duration.label}</Label>
                </div>
              ))}
            </div>
            {(formData.sessionDurations || []).length === 0 && (
              <p className="text-sm text-amber-600 mt-2">Выберите хотя бы одну длительность сессии</p>
            )}
          </div>

          {/* Buffer Time */}
          <div>
            <Label htmlFor="bufferTime" className="text-sm font-medium">
              Перерыв между сессиями
            </Label>
            <Select
              value={String(formData.bufferTimeMinutes || 15)}
              onValueChange={(value) => updateFormData("bufferTimeMinutes", Number(value))}
            >
              <SelectTrigger className="w-full mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BUFFER_TIME_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">Время между окончанием одной сессии и началом следующей</p>
          </div>
        </div>
      </div>
    </div>
  )
}
