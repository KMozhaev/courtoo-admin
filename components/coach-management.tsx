"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockTrainers.map((trainer) => (
          <Card key={trainer.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-start gap-4">
                <img
                  src={trainer.avatar || "/placeholder.svg"}
                  alt={trainer.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-1">
                  <CardTitle className="text-xl mb-1">{trainer.name}</CardTitle>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{trainer.rating}</span>
                    <span className="text-gray-500 text-sm">({trainer.totalLessons} уроков)</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{trainer.hourlyRate.toLocaleString()} ₽/час</div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Специализация</h4>
                <div className="flex flex-wrap gap-2">
                  {trainer.specialization.map((spec) => (
                    <Badge key={spec} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Опыт:</span>
                  <div className="font-medium">{trainer.experience}</div>
                </div>
                <div>
                  <span className="text-gray-600">Активные клиенты:</span>
                  <div className="font-medium">{trainer.activeClients}</div>
                </div>
              </div>

              <div className="text-sm">
                <span className="text-gray-600">Рабочие часы:</span>
                <div className="font-medium">{trainer.workingHours}</div>
              </div>

              <div className="flex items-center gap-4 pt-2 border-t">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Phone className="h-4 w-4 mr-2" />
                  Позвонить
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Mail className="h-4 w-4 mr-2" />
                  Написать
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
