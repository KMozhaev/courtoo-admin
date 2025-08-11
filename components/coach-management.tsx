"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Settings } from "lucide-react"

const mockTrainers = [
  {
    id: "1",
    name: "Анна Петрова",
    hourlyRate: 2500,
    specialization: ["Техника удара", "Тактика игры"],
    phone: "+7 916 123-45-67",
    email: "anna.petrova@tennis.ru",
    comment: "Предпочитает работать с начинающими",
    activeClients: 15,
  },
  {
    id: "2",
    name: "Дмитрий Козлов",
    hourlyRate: 3000,
    specialization: ["Подача", "Физическая подготовка"],
    phone: "+7 925 456-78-90",
    email: "dmitry.kozlov@tennis.ru",
    comment: "",
    activeClients: 22,
  },
  {
    id: "3",
    name: "Елена Смирнова",
    hourlyRate: 2800,
    specialization: ["Детский теннис", "Начинающие"],
    phone: "+7 903 789-01-23",
    email: "elena.smirnova@tennis.ru",
    comment: "Специализируется на детских группах",
    activeClients: 18,
  },
  {
    id: "4",
    name: "Сергей Волков",
    hourlyRate: 3500,
    specialization: ["Профессиональная подготовка", "Турниры"],
    phone: "+7 917 234-56-78",
    email: "sergey.volkov@tennis.ru",
    comment: "Готовит к соревнованиям",
    activeClients: 12,
  },
]

export function CoachManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Управление тренерами</h2>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Добавить тренера
        </Button>
      </div>

      {/* Coaches List as Compact Rows */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Тренеры ({mockTrainers.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {mockTrainers.map((trainer) => (
              <div key={trainer.id} className="p-3 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  {/* Trainer Info - Compact */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm truncate">{trainer.name}</h3>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-bold text-blue-600">
                          {trainer.hourlyRate.toLocaleString()} ₽/ч
                        </span>
                        <span className="text-xs text-gray-500 hidden sm:inline">{trainer.specialization[0]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats - Compact */}
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <div className="text-center">
                      <div className="font-medium text-gray-900">{trainer.activeClients}</div>
                      <div>клиенты</div>
                    </div>
                  </div>

                  {/* Actions - Compact */}
                  <div className="flex items-center gap-1 ml-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
