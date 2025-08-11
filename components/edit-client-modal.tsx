"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { User, Phone, Mail, FileText } from "lucide-react"

interface EditClientForm {
  name: string
  phone: string
  email?: string
  notes?: string
}

interface EditClientModalProps {
  isOpen: boolean
  onClose: () => void
  client: any
  onClientUpdated: () => void
}

export function EditClientModal({ isOpen, onClose, client, onClientUpdated }: EditClientModalProps) {
  const [formData, setFormData] = useState<EditClientForm>({
    name: "",
    phone: "",
    email: "",
    notes: "",
  })
  const [errors, setErrors] = useState<Partial<EditClientForm>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || "",
        phone: client.phone || "",
        email: client.email || "",
        notes: client.notes || "",
      })
      setErrors({})
    }
  }, [client])

  const validateForm = (): boolean => {
    const newErrors: Partial<EditClientForm> = {}

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update the client object directly (in a real app, this would be an API call)
      if (client) {
        client.name = formData.name
        client.phone = formData.phone
        client.email = formData.email
        client.notes = formData.notes
      }

      console.log("Updated client:", {
        id: client.id,
        ...formData,
      })

      // Show success message
      alert("Данные клиента успешно обновлены")

      onClientUpdated()
    } catch (error) {
      console.error("Error updating client:", error)
      alert("Ошибка при обновлении данных клиента")
    } finally {
      setIsSubmitting(false)
    }
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
  }

  if (!client) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Редактировать клиента: {client.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Имя клиента *
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

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Телефон *
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="+7 XXX XXX-XX-XX"
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
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

          {/* Notes Field */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Примечания
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Дополнительная информация о клиенте..."
              rows={3}
            />
          </div>

          {/* Client Stats Display */}
          {client.activeMembership && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Активный абонемент</h4>
              <div className="text-sm text-blue-700">
                <div>{client.activeMembership.membershipName}</div>
                <div className="text-xs text-blue-600 mt-1">
                  {client.activeMembership.benefitType === "sessions"
                    ? `Осталось: ${client.activeMembership.remainingSessions} занятий`
                    : `Скидка: ${client.activeMembership.discountPercentage}%`}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
