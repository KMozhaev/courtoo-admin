"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Phone, Mail, FileText, CreditCard, AlertTriangle } from "lucide-react"

interface CreateClientForm {
  name: string
  phone: string
  email?: string
  notes?: string
}

interface CreateClientModalProps {
  isOpen: boolean
  onClose: () => void
  onClientCreated: (client: any) => void
  existingClients: any[]
}

export function CreateClientModal({ isOpen, onClose, onClientCreated, existingClients }: CreateClientModalProps) {
  const [formData, setFormData] = useState<CreateClientForm>({
    name: "",
    phone: "",
    email: "",
    notes: "",
  })

  const [errors, setErrors] = useState<Partial<CreateClientForm>>({})
  const [duplicateClient, setDuplicateClient] = useState<any>(null)
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateClientForm> = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Имя обязательно"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Имя должно содержать минимум 2 символа"
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Телефон обязателен"
    } else if (!/^\+7\s?\d{3}\s?\d{3}-?\d{2}-?\d{2}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Неверный формат телефона"
    }

    // Email validation (optional)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Неверный формат email"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const checkPhoneDuplicate = (phone: string) => {
    const normalizedPhone = phone.replace(/\D/g, "")
    const duplicate = existingClients.find((client) => {
      const clientPhone = client.phone.replace(/\D/g, "")
      return clientPhone === normalizedPhone
    })

    if (duplicate) {
      setDuplicateClient(duplicate)
      setShowDuplicateDialog(true)
      return true
    }
    return false
  }

  const handlePhoneChange = (value: string) => {
    // Auto-format phone number
    let formatted = value.replace(/\D/g, "")
    if (formatted.startsWith("7")) {
      formatted = `+7 ${formatted.slice(1, 4)} ${formatted.slice(4, 7)}-${formatted.slice(7, 9)}-${formatted.slice(9, 11)}`
    } else if (formatted.startsWith("8")) {
      formatted = `+7 ${formatted.slice(1, 4)} ${formatted.slice(4, 7)}-${formatted.slice(7, 9)}-${formatted.slice(9, 11)}`
    }
    setFormData({ ...formData, phone: formatted })

    // Clear duplicate dialog when phone changes
    if (showDuplicateDialog) {
      setShowDuplicateDialog(false)
      setDuplicateClient(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Check for phone duplicates
    if (checkPhoneDuplicate(formData.phone)) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create new client
      const newClient = {
        id: `client_${Date.now()}`,
        name: formData.name.trim(),
        phone: formData.phone,
        email: formData.email?.trim() || undefined,
        notes: formData.notes?.trim() || undefined,
        totalBookings: 0,
        totalSpent: 0,
        lastBooking: new Date().toISOString().split("T")[0],
        joinDate: new Date().toISOString().split("T")[0],
        membershipTotalSpent: 0,
      }

      console.log("Created client:", newClient)

      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        notes: "",
      })
      setErrors({})
      setShowDuplicateDialog(false)
      setDuplicateClient(null)

      onClientCreated(newClient)
    } catch (error) {
      console.error("Error creating client:", error)
      alert("Ошибка при создании клиента")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenExistingProfile = () => {
    // Close modal and highlight existing client
    onClose()
    // In a real app, you'd scroll to and highlight the existing client
    console.log("Opening profile for existing client:", duplicateClient)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Добавить нового клиента
          </DialogTitle>
        </DialogHeader>

        {/* Duplicate Client Warning */}
        {showDuplicateDialog && duplicateClient && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-3">
                <div className="font-medium text-yellow-800">⚠️ Клиент с таким номером уже существует</div>

                <div className="flex items-center gap-3 p-3 bg-white rounded border">
                  <User className="h-8 w-8 text-gray-400" />
                  <div>
                    <div className="font-medium">{duplicateClient.name}</div>
                    <div className="text-sm text-gray-600">{duplicateClient.phone}</div>
                    <div className="text-xs text-gray-500">
                      Добавлен: {new Date(duplicateClient.joinDate).toLocaleDateString("ru-RU")}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={handleOpenExistingProfile}>
                    Открыть профиль
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="min-h-[500px]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Основная информация</Label>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Имя *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Введите имя"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Телефон *
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="+7 (___) ___-__-__"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email (необязательно)
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Примечания (необязательно)
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Дополнительная информация о клиенте..."
                  rows={3}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || showDuplicateDialog}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  "Создание..."
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Создать клиента
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
