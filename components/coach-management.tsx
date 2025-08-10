"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Phone, Mail, Plus } from "lucide-react"

const mockTrainers = [
  {
    id: "1",
    name: "Анна Петрова",
    hourlyRate: 2500,
    rating: 4.9,
    specialization: ["Техника удара", "Тактика игры"],
    experience: "8 лет",
    phone: "+7 916 123-45-67",
    email: "anna.petrova@tennis.ru",
    workingHours: "09:00 - 21:00",
    avatar: "/placeholder.svg?height=80&width=80",
    totalLessons: 1240,
    activeClients: 15,
  },
  {
    id: "2",
    name: "Дмитрий Козлов",
    hourlyRate: 3000,
    rating: 4.8,
    specialization: ["Подача", "Физическая подготовка"],
    experience: "12 лет",
    phone: "+7 925 456-78-90",
    email: "dmitry.kozlov@tennis.ru",
    workingHours: "08:00 - 20:00",
    avatar: "/placeholder.svg?height=80&width=80",
    totalLessons: 2180,
    activeClients: 22,
  },
  {
    id: "3",
    name: "Елена Смирнова",
    hourlyRate: 2800,
    rating: 4.7,
    specialization: ["Детский теннис", "Начинающие"],
    experience: "6 лет",
    phone: "+7 903 789-01-23",
    email: "elena.smirnova@tennis.ru",
    workingHours: "10:00 - 18:00",
    avatar: "/placeholder.svg?height=80&width=80",
    totalLessons: 890,
    activeClients: 18,
  },
  {
    id: "4",
    name: "Сергей Волков",
    hourlyRate: 3500,
    rating: 4.9,
    specialization: ["Профессиональная подготовка", "Турниры"],
    experience: "15 лет",
    phone: "+7 917 234-56-78",
    email: "sergey.volkov@tennis.ru",
    workingHours: "07:00 - 19:00",
    avatar: "/placeholder.svg?height=80&width=80",
    totalLessons: 3200,
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
                    <img
                      src={trainer.avatar || "/placeholder.svg"}
                      alt={trainer.name}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm truncate">{trainer.name}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium">{trainer.rating}</span>
                        </div>
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
                    <div className="text-center hidden sm:block">
                      <div className="font-medium text-gray-900">{trainer.experience}</div>
                      <div>опыт</div>
                    </div>
                  </div>

                  {/* Actions - Compact */}
                  <div className="flex items-center gap-1 ml-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Статистика тренеров</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">4</div>
              <div className="text-sm text-gray-600">Всего тренеров</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">67</div>
              <div className="text-sm text-gray-600">Активные клиенты</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">4.8</div>
              <div className="text-sm text-gray-600">Средний рейтинг</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">2,950 ₽</div>
              <div className="text-sm text-gray-600">Средняя ставка</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
