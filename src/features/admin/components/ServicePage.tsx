'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Package, Search, Filter } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useServices } from '../hooks/useService'
import { ServiceForm } from './ServiceForm'
import type { Service } from '../types/service'
import type { CreateServiceFormData } from '../schema/serviceSchema'
import { useTranslations } from 'next-intl'

type PlanType = 'gratuit' | 'pro' | 'entreprise'

const getPlanType = (price: number): PlanType => {
  if (price === 0) return 'gratuit'
  if (price <= 20) return 'pro'
  return 'entreprise'
}

const planColors = {
  gratuit: {
    bg: 'bg-slate-50 border-slate-200',
    badge: 'bg-slate-100 text-slate-700 border-slate-300',
    accent: 'text-slate-600',
  },
  pro: {
    bg: 'bg-blue-50 border-blue-200',
    badge: 'bg-blue-100 text-blue-700 border-blue-300',
    accent: 'text-blue-600',
  },
  entreprise: {
    bg: 'bg-emerald-50 border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    accent: 'text-emerald-600',
  },
}

const planLabels = {
  gratuit: 'Gratuit',
  pro: 'Pro',
  entreprise: 'Entreprise',
}

export default function ServicesPage() {
  const { services, loading, createService, updateService, deleteService } =
    useServices()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const t = useTranslations('admin.services')

  const filteredServices = useMemo(() => {
    let filtered = services

    // Filtrage par recherche
    if (searchQuery.trim()) {
      filtered = filtered.filter((service) =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filtrage par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((service) => {
        const planType = getPlanType(Number(service.price))
        return planType === selectedCategory
      })
    }

    // Tri par catégorie puis par prix
    return filtered.sort((a, b) => {
      const planA = getPlanType(Number(a.price))
      const planB = getPlanType(Number(b.price))

      if (planA !== planB) {
        const order = { gratuit: 0, pro: 1, entreprise: 2 }
        return order[planA] - order[planB]
      }

      return Number(a.price) - Number(b.price)
    })
  }, [services, searchQuery, selectedCategory])

  const stats = useMemo(() => {
    const gratuit = services.filter(
      (s) => getPlanType(Number(s.price)) === 'gratuit'
    ).length
    const pro = services.filter(
      (s) => getPlanType(Number(s.price)) === 'pro'
    ).length
    const entreprise = services.filter(
      (s) => getPlanType(Number(s.price)) === 'entreprise'
    ).length

    return { gratuit, pro, entreprise, total: services.length }
  }, [services])

  const handleCreateService = async (data: CreateServiceFormData) => {
    await createService(data)
  }

  const handleUpdateService = async (data: CreateServiceFormData) => {
    if (editingService) {
      await updateService(editingService.id, data)
      setEditingService(null)
    }
  }

  const handleDeleteService = async () => {
    if (serviceToDelete) {
      await deleteService(serviceToDelete.id)
      setServiceToDelete(null)
    }
  }

  if (loading && services.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Chargement des services...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('title')}
          </h1>
          <p className="text-muted-foreground mt-2">{t('subtitle')}</p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          size="lg"
          className="shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('newService')}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 p-6 bg-white rounded-xl border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder={t('searchServices')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40 h-11">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent className="bg-white ">
              <SelectItem value="all">{t('allStatuses')}</SelectItem>
              <SelectItem value="gratuit">{t('free')}</SelectItem>
              <SelectItem value="pro">{t('pro')}</SelectItem>
              <SelectItem value="entreprise">{t('enterprise')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-slate-200 bg-slate-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              {t('free')}
            </CardTitle>
            <Package className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-700">
              {stats.gratuit}
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">
              {t('pro')}
            </CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{stats.pro}</div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-600">
              {t('enterprise')}
            </CardTitle>
            <Package className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">
              {stats.entreprise}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-gray-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total
            </CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-700">
              {stats.total}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const planType = getPlanType(Number(service.price))
          const colors = planColors[planType]

          return (
            <Card
              key={service.id}
              className={`hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${colors.bg} border-2`}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="text-lg font-semibold">
                      {service.name}
                    </CardTitle>
                    <Badge variant="outline" className={colors.badge}>
                      {planLabels[planType]}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingService(service)}
                      className="hover:bg-white/50"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setServiceToDelete(service)}
                      className="hover:bg-white/50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center align-items p-4 bg-white/70 rounded-xl border border-white/50 shadow-sm">
                    <div
                      className={`text-2xl font-bold ${colors.accent} break-words whitespace-normal`}
                    >
                      {Number(service.price) === 0
                        ? t('free')
                        : `${service.price}€`}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">
                      Prix
                    </div>
                  </div>
                  <div className="text-center align-items p-4 bg-white/70 rounded-xl border border-white/50 shadow-sm">
                    <div className={`text-2xl font-bold ${colors.accent}`}>
                      {`${service.token}`}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">
                      Tokens
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredServices.length === 0 && services.length > 0 && (
        <div className="text-center py-16">
          <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Aucun service trouvé</h3>
          <p className="text-muted-foreground mb-4">
            Essayez de modifier vos critères de recherche ou de filtrage
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
            }}
          >
            Réinitialiser les filtres
          </Button>
        </div>
      )}

      {/* Empty State original */}
      {services.length === 0 && (
        <div className="text-center py-16">
          <Package className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
          <h3 className="text-2xl font-semibold mb-3">Aucun service trouvé</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Commencez par créer votre premier service et organisez votre
            catalogue
          </p>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            size="lg"
            className="shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Créer un service
          </Button>
        </div>
      )}

      {/* Create Service Dialog */}
      <ServiceForm
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateService}
        title="Créer un nouveau service"
        description="Ajoutez un nouveau service à votre catalogue"
      />

      {/* Edit Service Dialog */}
      <ServiceForm
        open={!!editingService}
        onOpenChange={(open) => !open && setEditingService(null)}
        onSubmit={handleUpdateService}
        service={editingService}
        title="Modifier le service"
        description="Modifiez les informations de ce service"
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!serviceToDelete}
        onOpenChange={(open) => !open && setServiceToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le service</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le service{' '}
              <strong>{serviceToDelete?.name}</strong> ? Cette action est
              irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteService}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
