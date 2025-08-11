"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Settings } from "lucide-react"
import { TrainerCreationModal } from "@/components/trainer-creation-modal"
import {
  mockTrainerData,
  type TrainerProfile,
  isTrainerAvailableToday,
  getTrainerWorkingHours,
} from "@/lib/trainer-data"
import { useState } from "react"

export function CoachManagement() {
  const [trainers, setTrainers] = useState<TrainerProfile[]>(mockTrainerData)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingTrainer, setEditingTrainer] = useState<TrainerProfile | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Управление тренерами</h2>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить тренера
        </Button>
      </div>

      {/* Coaches List as Compact Rows */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Тренеры ({trainers.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {trainers.map((trainer) => {
              const isAvailableToday = isTrainerAvailableToday(trainer)
              const todayHours = getTrainerWorkingHours(trainer, new Date().toISOString().split("T")[0])

              return (
                <div key={trainer.id} className="p-3 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    {/* Trainer Info - Enhanced */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-sm truncate">{trainer.name}</h3>
                          <div
                            className={`w-2 h-2 rounded-full ${isAvailableToday ? "bg-green-500" : "bg-gray-400"}`}
                            title={isAvailableToday ? "Доступен сегодня" : "Недоступен сегодня"}
                          />
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-bold text-blue-600">
                            {trainer.hourlyRate.toLocaleString()} ₽/ч
                          </span>
                          <span className="text-xs text-gray-500 hidden sm:inline">
                            {trainer.specialization[0] || "Тренер"}
                          </span>
                        </div>

                        <div className="text-xs text-gray-500 mt-1">Сегодня: {todayHours}</div>
                      </div>
                    </div>

                    {/* Actions - Enhanced */}
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          setEditingTrainer(trainer)
                          setIsCreateModalOpen(true)
                        }}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Trainer Creation Modal */}
      <TrainerCreationModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          setEditingTrainer(null)
        }}
        editingTrainer={editingTrainer}
        onTrainerCreate={(trainer) => {
          if (editingTrainer) {
            // Update existing trainer
            setTrainers(trainers.map((t) => (t.id === editingTrainer.id ? trainer : t)))
          } else {
            // Add new trainer
            setTrainers([...trainers, trainer])
          }
        }}
      />
    </div>
  )
}
