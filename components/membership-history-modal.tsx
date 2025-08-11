"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, CreditCard, TrendingDown, User } from "lucide-react"
import { MembershipBadge } from "@/components/membership-badge"
import {
  getAllClientMemberships,
  getMembershipHistory,
  type ClientMembership,
  mockClientMemberships,
  mockMembershipTransactions,
} from "@/lib/membership-data"
import { BalanceAdjustment } from "@/components/balance-adjustment"

interface MembershipHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  client: any
}

export function MembershipHistoryModal({ isOpen, onClose, client }: MembershipHistoryModalProps) {
  if (!client) return null

  const clientMemberships = getAllClientMemberships(client.id)
  const membershipHistory = getMembershipHistory(client.id)

  const activeMemberships = clientMemberships.filter((m) => m.status === "active")
  const expiredMemberships = clientMemberships.filter((m) => m.status === "expired")

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "purchase":
        return <CreditCard className="h-4 w-4 text-green-600" />
      case "deduction":
        return <TrendingDown className="h-4 w-4 text-blue-600" />
      case "adjustment":
        return <User className="h-4 w-4 text-orange-600" />
      default:
        return <Calendar className="h-4 w-4 text-gray-600" />
    }
  }

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case "purchase":
        return "Покупка"
      case "deduction":
        return "Списание"
      case "adjustment":
        return "Корректировка"
      default:
        return type
    }
  }

  const calculateMembershipUtilization = (membership: ClientMembership) => {
    if (membership.benefitType !== "sessions" || !membership.originalSessions) return 0
    const used = membership.originalSessions - (membership.remainingSessions || 0)
    return Math.round((used / membership.originalSessions) * 100)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>История абонементов - {client.name}</DialogTitle>
          </div>
        </DialogHeader>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active">Активные ({activeMemberships.length})</TabsTrigger>
            <TabsTrigger value="history">История ({expiredMemberships.length})</TabsTrigger>
            <TabsTrigger value="transactions">Операции</TabsTrigger>
            <TabsTrigger value="balance">Баланс</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeMemberships.length > 0 ? (
              activeMemberships.map((membership) => (
                <Card key={membership.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <MembershipBadge
                          membership={membership}
                          currentTime={new Date()}
                          showRestrictions={true}
                          size="lg"
                        />
                      </div>
                      <Button variant="outline" size="sm">
                        <User className="h-4 w-4 mr-2" />
                        Управление
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Куплен:</span>
                        <div className="font-medium">
                          {new Date(membership.purchasedDate).toLocaleDateString("ru-RU")}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Истекает:</span>
                        <div className="font-medium">
                          {new Date(membership.expiresDate).toLocaleDateString("ru-RU")}
                        </div>
                      </div>
                      {membership.benefitType === "sessions" && (
                        <>
                          <div>
                            <span className="text-gray-600">Использовано:</span>
                            <div className="font-medium">{calculateMembershipUtilization(membership)}%</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Осталось:</span>
                            <div className="font-medium">{membership.remainingSessions} занятий</div>
                          </div>
                        </>
                      )}
                      {membership.benefitType === "discount" && (
                        <>
                          <div>
                            <span className="text-gray-600">Скидка:</span>
                            <div className="font-medium">{membership.discountPercentage}%</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Статус:</span>
                            <div className="font-medium text-green-600">Активна</div>
                          </div>
                        </>
                      )}
                    </div>

                    {membership.timeRestrictions && (
                      <div className="mt-3 p-2 bg-orange-50 rounded text-sm">
                        <div className="flex items-center gap-1 text-orange-700">
                          <Clock className="h-3 w-3" />
                          <span className="font-medium">Ограничения:</span>
                        </div>
                        <div className="mt-1 text-orange-600">
                          {membership.timeRestrictions.weekdays && (
                            <span>
                              Дни:{" "}
                              {membership.timeRestrictions.weekdays
                                .map((d) => ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][d])
                                .join(", ")}
                            </span>
                          )}
                          {membership.timeRestrictions.timeSlots && (
                            <span className="ml-2">
                              Время:{" "}
                              {membership.timeRestrictions.timeSlots.map((s) => `${s.start}-${s.end}`).join(", ")}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">Нет активных абонементов</div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {expiredMemberships.length > 0 ? (
              expiredMemberships.map((membership) => (
                <Card key={membership.id} className="opacity-75">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-gray-700">{membership.membershipName}</h3>
                          <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                            Истёк
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          {membership.benefitType === "sessions"
                            ? `${membership.originalSessions} занятий`
                            : `${membership.discountPercentage}% скидка`}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Период:</span>
                        <div className="font-medium">
                          {new Date(membership.purchasedDate).toLocaleDateString("ru-RU")} -{" "}
                          {new Date(membership.expiresDate).toLocaleDateString("ru-RU")}
                        </div>
                      </div>
                      {membership.benefitType === "sessions" && (
                        <div>
                          <span className="text-gray-600">Использовано:</span>
                          <div className="font-medium">{calculateMembershipUtilization(membership)}%</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">Нет истории абонементов</div>
            )}
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            {membershipHistory.length > 0 ? (
              <div className="space-y-3">
                {membershipHistory.map((transaction) => (
                  <Card key={transaction.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">{getTransactionIcon(transaction.transactionType)}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{getTransactionLabel(transaction.transactionType)}</span>
                            <span className="text-sm text-gray-500">
                              {new Date(transaction.timestamp).toLocaleString("ru-RU")}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">{transaction.notes}</div>
                          {transaction.sessionsBefore !== undefined && transaction.sessionsAfter !== undefined && (
                            <div className="text-xs text-gray-500">
                              Баланс: {transaction.sessionsBefore} → {transaction.sessionsAfter} занятий
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">Нет операций</div>
            )}
          </TabsContent>

          <TabsContent value="balance" className="space-y-4">
            {activeMemberships.filter((m) => m.benefitType === "sessions").length > 0 ? (
              <div className="space-y-4">
                {activeMemberships
                  .filter((m) => m.benefitType === "sessions")
                  .map((membership) => (
                    <BalanceAdjustment
                      key={membership.id}
                      membership={{
                        id: membership.id,
                        membershipName: membership.membershipName,
                        remainingSessions: membership.remainingSessions || 0,
                        benefitType: membership.benefitType,
                      }}
                      onBalanceUpdate={(newBalance, reason) => {
                        // Update membership balance directly in the mock data
                        const membershipToUpdate = mockClientMemberships.find((m) => m.id === membership.id)
                        if (membershipToUpdate) {
                          const previousBalance = membershipToUpdate.remainingSessions || 0
                          membershipToUpdate.remainingSessions = newBalance

                          // Create transaction record
                          const transaction = {
                            id: `trans_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                            membershipId: membership.id,
                            transactionType: "adjustment" as const,
                            sessionsBefore: previousBalance,
                            sessionsAfter: newBalance,
                            timestamp: new Date().toISOString(),
                            notes: reason,
                          }

                          // Add to transaction history
                          mockMembershipTransactions.push(transaction)

                          console.log(`Balance updated for ${membership.id}: ${previousBalance} -> ${newBalance}`)

                          // Show success message and close modal to refresh
                          alert(`Баланс обновлён: ${previousBalance} -> ${newBalance} занятий`)
                          onClose()
                        }
                      }}
                    />
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Нет активных абонементов с занятиями для корректировки баланса
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>Закрыть</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
