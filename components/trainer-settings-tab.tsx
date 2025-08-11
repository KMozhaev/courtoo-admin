"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { TrainerProfile } from "@/lib/trainer-data"

interface TrainerSettingsTabProps {
  formData: Partial<TrainerProfile>
  setFormData: (data: Partial<TrainerProfile>) => void
  validationErrors: Record<string, string>
}

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

export function TrainerSettingsTab({ formData, setFormData, validationErrors }: TrainerSettingsTabProps) {
  const handleInputChange = (field: keyof TrainerProfile, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleCourtToggle = (courtId: string, checked: boolean) => {
    const currentCourts = formData.preferredCourts || []
    if (checked) {
      handleInputChange("preferredCourts", [...currentCourts, courtId])
    } else {
      handleInputChange(
        "preferredCourts",
        currentCourts.filter((id) => id !== courtId),
      )
    }
  }

  const handleSessionDurationToggle = (duration: number, checked: boolean) => {
    const currentDurations = formData.sessionDurations || []
    if (checked) {
      handleInputChange(
        "sessionDurations",
        [...currentDurations, duration].sort((a, b) => a - b),
      )
    } else {
      handleInputChange(
        "sessionDurations",
        currentDurations.filter((d) => d !== duration),
      )
    }
  }

  const handleAllCourtsToggle = (checked: boolean) => {
    if (checked) {
      handleInputChange(
        "preferredCourts",
        AVAILABLE_COURTS.map((court) => court.id),
      )
    } else {
      handleInputChange("preferredCourts", [])
    }
  }

  const isAllCourtsSelected = (formData.preferredCourts || []).length === AVAILABLE_COURTS.length
  const isIndeterminate = (formData.preferredCourts || []).length > 0 && !isAllCourtsSelected

  return (
    <div className="space-y-8">
      {/* Court Preferences */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Предпочтения по кортам</h3>

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
              onValueChange={(value) => handleInputChange("bufferTimeMinutes", Number(value))}
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

          {/* Max Sessions Per Day */}
          <div>
            <Label htmlFor="maxSessions" className="text-sm font-medium">
              Максимум сессий в день
            </Label>
            <Input
              id="maxSessions"
              type="number"
              min="1"
              max="12"
              value={formData.maxSessionsPerDay || 8}
              onChange={(e) => handleInputChange("maxSessionsPerDay", Number(e.target.value))}
              className="w-32 mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">От 1 до 12 сессий в день</p>
          </div>
        </div>
      </div>

      {/* Communication Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Настройки связи</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label className="font-medium">Прямой контакт клиентов</Label>
              <p className="text-sm text-gray-500">Разрешить клиентам связываться с тренером напрямую</p>
            </div>
            <Switch
              checked={formData.allowDirectClientContact ?? true}
              onCheckedChange={(checked) => handleInputChange("allowDirectClientContact", checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label className="font-medium">Уведомления в Telegram</Label>
              <p className="text-sm text-gray-500">
                Получать уведомления о новых бронированиях (требует настройки бота)
              </p>
            </div>
            <Switch
              checked={formData.telegramNotificationsEnabled ?? false}
              onCheckedChange={(checked) => handleInputChange("telegramNotificationsEnabled", checked)}
              disabled={!formData.telegramUsername}
            />
          </div>

          {formData.telegramNotificationsEnabled && !formData.telegramUsername && (
            <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
              ⚠️ Для уведомлений в Telegram необходимо указать username в основной информации
            </p>
          )}
        </div>
      </div>

      {/* Settings Summary */}
      <div className="bg-gray-50 border rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Сводка настроек</h4>
        <div className="text-sm text-gray-700 space-y-2">
          <div>
            <strong>Корты:</strong>{" "}
            {(formData.preferredCourts || []).length === 0
              ? "Не выбраны"
              : (formData.preferredCourts || []).length === AVAILABLE_COURTS.length
                ? "Все корты"
                : `${(formData.preferredCourts || []).length} из ${AVAILABLE_COURTS.length}`}
          </div>
          <div>
            <strong>Длительность сессий:</strong>{" "}
            {(formData.sessionDurations || []).length === 0
              ? "Не выбрана"
              : (formData.sessionDurations || []).map((d) => `${d} мин`).join(", ")}
          </div>
          <div>
            <strong>Перерыв:</strong> {formData.bufferTimeMinutes || 15} минут
          </div>
          <div>
            <strong>Макс. сессий в день:</strong> {formData.maxSessionsPerDay || 8}
          </div>
          <div>
            <strong>Прямой контакт:</strong> {formData.allowDirectClientContact ? "Разрешен" : "Запрещен"}
          </div>
          <div>
            <strong>Telegram уведомления:</strong> {formData.telegramNotificationsEnabled ? "Включены" : "Отключены"}
          </div>
        </div>
      </div>
    </div>
  )
}
