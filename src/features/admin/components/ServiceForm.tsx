'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  createServiceSchema,
  type CreateServiceFormData,
} from '../schema/serviceSchema'
import type { Service } from '../types/service'

interface ServiceFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateServiceFormData) => void
  service?: Service | null
  title: string
  description: string
}

export function ServiceForm({
  open,
  onOpenChange,
  onSubmit,
  service,
  title,
  description,
}: ServiceFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      name: '',
      price: 0,
      token: 0,
    },
  })

  // Sync form with incoming service/open changes
  useEffect(() => {
    if (service) {
      reset({
        name: service?.name ?? '',
        price: Number(service?.price ?? 0),
        token: service?.token ?? 0,
      })
    } else {
      reset({ name: '', price: 0, token: 0 })
    }
  }, [service, open, reset])

  const handleFormSubmit = async (data: CreateServiceFormData) => {
    await onSubmit(data)
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom du service</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Ex: Assistance Visa Basique"
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="price">Prix (€)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              {...register('price')}
              placeholder="0.00"
            />
            {errors.price && (
              <p className="text-sm text-destructive mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="token">Nombre de tokens</Label>
            <Input
              id="token"
              type="number"
              min="1"
              {...register('token', { valueAsNumber: true })}
              placeholder="10"
            />
            {errors.token && (
              <p className="text-sm text-destructive mt-1">
                {errors.token.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
