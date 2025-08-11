"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { getActiveMembership } from "@/lib/membership-data"

interface ParticipantSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onParticipantSelected: (participant: any, role: "player" | "coach") => void
  existingParticipantIds: string[]
  clients: Array<{ id: string; name: string; phone: string }>
  trainers: Array<{ id: string; name: string; phone: string; hourlyRate: number }>
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

  // Combine clients and trainers for search
  const allParticipants = [
    ...clients.map((client) => ({ ...client, type: "client" as const })),
    ...trainers.map((trainer) => ({ ...trainer, type: "trainer" as const })),
  ]

  // Filter participants based on search query and exclude existing ones
  const filteredParticipants = allParticipants.filter((participant) => {
    const matchesSearch =
      participant.name.toLowerCase().includes(searchQuery.toLowerCase()) || participant.phone.includes(searchQuery)
    const notAlreadyAdded = !existingParticipantIds.includes(participant.id)
    return matchesSearch && notAlreadyAdded
  })

  const handleParticipantSelect = (participant: any, role: "player" | "coach") => {
    onParticipantSelected(participant, role)
    setSearchQuery("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Добавить участника
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Поиск по имени или телефону..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Search Results */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredParticipants.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchQuery ? "Участники не найдены" : "Начните вводить для поиска"}
              </div>
            ) : (
              filteredParticipants.map((participant) => {
                const membership = participant.type === "client" ? getActiveMembership(participant.id) : null

                return (
                  <div key={participant.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{participant.type === "trainer" ? "👨‍🏫" : "🎾"}</span>
                          <span className="font-medium">{participant.name}</span>
                          <Badge variant="outline">{participant.type === "trainer" ? "Тренер" : "Клиент"}</Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">📱 {participant.phone}</div>

                        {participant.type === "trainer" && "hourlyRate" in participant && (
                          <div className="text-sm text-blue-600">💰 {participant.hourlyRate} ₽/час</div>
                        )}

                        {participant.type === "client" && membership && (
                          <div className="text-sm text-purple-600">
                            💳 {membership.membershipName}: {membership.remainingSessions} занятий осталось
                          </div>
                        )}

                        {participant.type === "client" && !membership && (
                          <div className="text-sm text-orange-600">⚠️ Нет активного членства</div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleParticipantSelect(participant, "player")}
                          className="text-xs"
                        >
                          Выбрать как клиента
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleParticipantSelect(participant, "coach")}
                          className="text-xs"
                        >
                          Выбрать как тренера
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
