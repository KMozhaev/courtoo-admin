"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Search, Users } from "lucide-react"
import { getActiveMembership } from "@/lib/membership-data"

interface ParticipantSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onParticipantSelected: (participant: any, role: "player" | "coach") => void
  existingParticipantIds: string[]
  clients: Array<{ id: string; name: string; phone: string; type: "client" }>
  trainers: Array<{ id: string; name: string; phone: string; type: "trainer"; hourlyRate?: number }>
}

export function ParticipantSearchModal({
  isOpen,
  onClose,
  onParticipantSelected,
  existingParticipantIds,
  clients,
  trainers,
}: ParticipantSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const allParticipants = [...clients, ...trainers]

  const filteredParticipants = allParticipants.filter((participant) => {
    if (existingParticipantIds.includes(participant.id)) {
      return false
    }

    const query = searchQuery.toLowerCase()
    return participant.name.toLowerCase().includes(query) || participant.phone.toLowerCase().includes(query)
  })

  const handleParticipantSelect = (participant: any, role: "player" | "coach") => {
    onParticipantSelected(participant, role)
    setSearchQuery("")
  }

  const getMembershipStatus = (participant: any) => {
    if (participant.type !== "client") return null

    const membership = getActiveMembership(participant.id)
    if (!membership) {
      return "⚠️ Нет активного абонемента"
    }

    if (membership.benefitType === "sessions") {
      return `💳 ${membership.membershipName}: ${membership.remainingSessions} занятий осталось`
    } else {
      return `💳 ${membership.membershipName}: скидка ${membership.discountPercentage}%`
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Добавить участника
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Поиск по имени или телефону</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                type="text"
                placeholder="Введите имя или номер телефона..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredParticipants.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Участники не найдены</p>
                <p className="text-sm">Попробуйте изменить поисковый запрос</p>
              </div>
            ) : (
              filteredParticipants.map((participant) => (
                <div key={participant.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{participant.type === "trainer" ? "👨‍🏫" : "🎾"}</span>
                        <span className="font-medium">{participant.name}</span>
                        <Badge variant={participant.type === "trainer" ? "default" : "secondary"}>
                          {participant.type === "trainer" ? "Тренер" : "Клиент"}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">📱 {participant.phone}</div>
                      {participant.type === "client" && (
                        <div className="text-sm">{getMembershipStatus(participant)}</div>
                      )}
                      {participant.type === "trainer" && participant.hourlyRate && (
                        <div className="text-sm text-gray-600">💰 {participant.hourlyRate} ₽/час</div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleParticipantSelect(participant, "player")}
                      className="flex-1"
                    >
                      Выбрать как клиента
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleParticipantSelect(participant, "coach")}
                      className="flex-1"
                    >
                      Выбрать как тренера
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Отмена
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
