'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package } from 'lucide-react'
import { createPackSchema, type CreatePackFormData } from '../schema/packSchema'
import { useGetServicesQuery } from '../services/packApi'
import type { Pack, Service } from '../types/pack'

interface PackFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreatePackFormData) => void
  pack?: Pack | null
  title: string
  description: string
}

export function PackForm({
  open,
  onOpenChange,
  onSubmit,
  pack,
  title,
  description,
}: PackFormProps) {
  const { data: services = [], isLoading: servicesLoading } =
    useGetServicesQuery()

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreatePackFormData>({
    resolver: zodResolver(createPackSchema),
    defaultValues: {
      name: '',
      price: 0,
      startedAt: '',
      expiredAt: '',
      services: [],
    },
  })

  const selectedServices = watch('services')

  // Calculate total price based on selected services
  const totalServicePrice =
    selectedServices?.reduce((total, serviceId) => {
      const service = services.find((s) => s.id === serviceId)
      return total + (service ? Number(service.price) : 0)
    }, 0) || 0

  useEffect(() => {
    if (pack) {
      let serviceIds: number[] = []
      if (Array.isArray(pack.services)) {
        serviceIds = pack.services.map((service: Service | number) =>
          typeof service === 'number' ? service : service.id
        )
      } else if (typeof pack.services === 'object') {
        serviceIds = Object.values(pack.services).map(
          (service: Service | number) =>
            typeof service === 'number' ? service : service.id
        )
      }

      // Format dates for datetime-local input
      const formatDateForInput = (dateString?: string) => {
        if (!dateString) return ''
        try {
          const date = new Date(dateString)
          return date.toISOString().slice(0, 16)
        } catch {
          return ''
        }
      }

      reset({
        name: pack.name || '',
        price: Number(pack.price) || 0,
        startedAt: formatDateForInput(pack.startedAt),
        expiredAt: formatDateForInput(pack.expiredAt),
        services: serviceIds,
      })
    } else {
      reset({
        name: '',
        price: 0,
        startedAt: '',
        expiredAt: '',
        services: [],
      })
    }
  }, [pack, open, reset])

  const handleFormSubmit = async (data: CreatePackFormData) => {
    const formattedData = {
      ...data,
      price: Number(data.price), // Explicit conversion to number
    }

    await onSubmit(formattedData)
    reset()
    onOpenChange(false)
  }

  if (servicesLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-7xl">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">Chargement des services...</div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom du pack</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Ex: Pack Dubai Starter"
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="price">Prix personnalisé (€)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                {...register('price', { valueAsNumber: true })}
                placeholder={`Prix suggéré: ${totalServicePrice.toFixed(2)}€`}
              />
              {errors.price && (
                <p className="text-sm text-destructive mt-1">
                  {errors.price.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Prix total des services: {totalServicePrice.toFixed(2)}€
              </p>
            </div>

            <div>
              <Label htmlFor="startedAt">Date de début</Label>
              <Input
                id="startedAt"
                type="datetime-local"
                {...register('startedAt')}
              />
              {errors.startedAt && (
                <p className="text-sm text-destructive mt-1">
                  {errors.startedAt.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="expiredAt">Date de fin</Label>
              <Input
                id="expiredAt"
                type="datetime-local"
                {...register('expiredAt')}
              />
              {errors.expiredAt && (
                <p className="text-sm text-destructive mt-1">
                  {errors.expiredAt.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label className="text-base font-semibold">Services inclus</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Sélectionnez les services à inclure dans ce pack
            </p>
            {errors.services && (
              <p className="text-sm text-destructive mb-4">
                {errors.services.message}
              </p>
            )}

            <div className="space-y-2 max-h-96 overflow-y-auto border rounded-lg p-4">
              {services.map((service) => (
                <Controller
                  key={service.id}
                  name="services"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors border">
                      <Checkbox
                        checked={field.value?.includes(service.id) || false}
                        onCheckedChange={(checked) => {
                          const currentServices = field.value || []
                          if (checked) {
                            field.onChange([...currentServices, service.id])
                          } else {
                            field.onChange(
                              currentServices.filter((id) => id !== service.id)
                            )
                          }
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 leading-tight">
                          {service.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {Number(service.price) === 0
                              ? 'Gratuit'
                              : `${service.price}€`}
                          </Badge>
                          {(service.token || service.tokens) && (
                            <span className="text-xs text-muted-foreground">
                              {service.token || service.tokens} tokens
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                />
              ))}
            </div>
          </div>

          {selectedServices?.length > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-sm text-blue-700">
                  Résumé du pack
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">
                      {selectedServices.length}
                    </span>{' '}
                    service(s) sélectionné(s)
                  </p>
                  <p className="text-sm">
                    Prix total des services:{' '}
                    <span className="font-medium">
                      {totalServicePrice.toFixed(2)}€
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedServices.map((serviceId) => {
                      const service = services.find((s) => s.id === serviceId)
                      return service ? (
                        <Badge
                          key={serviceId}
                          variant="secondary"
                          className="text-xs"
                        >
                          {service.name}
                        </Badge>
                      ) : null
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
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
