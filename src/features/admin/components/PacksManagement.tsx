'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Plus, Edit, Trash2, Package, Users, Search } from 'lucide-react'
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
import { PackForm } from './PackForm'
import {
  useGetPacksQuery,
  useCreatePackMutation,
  useUpdatePackMutation,
  useDeletePackMutation,
  useGetServicesQuery,
} from '../services/packApi'
import type { Pack, CreatePackFormData, Service } from '../types/pack'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'

export function PacksManagement() {
  const { data: packs = [], isLoading } = useGetPacksQuery()
  const { data: allServices = [] } = useGetServicesQuery()
  const [createPack] = useCreatePackMutation()
  const [updatePack] = useUpdatePackMutation()
  const [deletePack] = useDeletePackMutation()
  const t = useTranslations('admin.plans')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingPack, setEditingPack] = useState<Pack | null>(null)
  const [packToDelete, setPackToDelete] = useState<Pack | null>(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const handleCreatePack = async (data: CreatePackFormData) => {
    try {
      await createPack(data).unwrap()
      toast.success('Pack créé avec succès')
    } catch (error) {
      console.error('Erreur lors de la création du pack:', error)
      toast.error('Une erreur est survenue lors de la création du pack.')
    }
  }

  const handleUpdatePack = async (data: CreatePackFormData) => {
    if (editingPack) {
      try {
        await updatePack({ id: editingPack.id, data }).unwrap()
        setEditingPack(null)
        toast.success('Pack mis à jour avec succès')
      } catch (error) {
        console.error('Erreur lors de la mise à jour du pack:', error)
        toast.error('Une erreur est survenue lors de la mise à jour du pack.')
      }
    }
  }

  const handleDeletePack = async () => {
    if (packToDelete) {
      try {
        await deletePack(packToDelete.id).unwrap()
        toast.success('Pack supprimé avec succès')
        setPackToDelete(null)
      } catch (error) {
        console.error('Erreur lors de la suppression du pack:', error)
        toast.error('Une erreur est survenue lors de la suppression du pack.')
      }
    }
  }

  const isService = (service: unknown): service is Service =>
    typeof service === 'object' && service !== null && 'id' in service

  const getServicesFromPack = (pack: Pack): Service[] => {
    if (!pack.services) return []

    if (typeof pack.services === 'object' && !Array.isArray(pack.services)) {
      return Object.values(pack.services).filter(isService)
    }

    if (Array.isArray(pack.services)) {
      return (pack.services as (Service | number)[]).filter(isService)
    }

    return []
  }

  const getServiceWithPrice = (service: Service) => {
    const fullService = allServices.find((s) => s.id === service.id)
    return {
      ...service,
      price: fullService?.price || service.price || '0',
    }
  }

  const calculatePackTotalPrice = (pack: Pack): number => {
    const services = getServicesFromPack(pack)
    return services.reduce((total, service) => {
      const serviceWithPrice = getServiceWithPrice(service)
      return total + Number(serviceWithPrice.price || 0)
    }, 0)
  }

  const getPackCategory = (pack: Pack): string => {
    const totalPrice = calculatePackTotalPrice(pack)
    if (totalPrice === 0) return 'gratuit'
    if (totalPrice <= 1000) return 'pro'
    return 'entreprise'
  }

  const filteredPacks = packs.filter((pack) => {
    const matchesSearch = pack.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === 'all' || getPackCategory(pack) === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categoryStats = {
    gratuit: packs.filter((pack) => getPackCategory(pack) === 'gratuit').length,
    pro: packs.filter((pack) => getPackCategory(pack) === 'pro').length,
    entreprise: packs.filter((pack) => getPackCategory(pack) === 'entreprise')
      .length,
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Chargement des packs...</div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="container mx-auto p-6 space-y-8"
    >
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
          className="shadow-lg bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('newPlan')}
        </Button>
      </div>

      {/* Search bar and category filters */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder={t('search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
            className="text-sm"
          >
            {t('all')}({packs.length})
          </Button>
          <Button
            variant={selectedCategory === 'gratuit' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('gratuit')}
            className={`text-sm ${
              selectedCategory === 'gratuit'
                ? 'bg-gray-500 hover:bg-gray-600'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t('free')} ({categoryStats.gratuit})
          </Button>
          <Button
            variant={selectedCategory === 'pro' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('pro')}
            className={`text-sm ${
              selectedCategory === 'pro'
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'border-blue-300 text-blue-600 hover:bg-blue-50'
            }`}
          >
            {t('pro')} ({categoryStats.pro})
          </Button>
          <Button
            variant={selectedCategory === 'entreprise' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('entreprise')}
            className={`text-sm ${
              selectedCategory === 'entreprise'
                ? 'bg-green-500 hover:bg-green-600'
                : 'border-green-300 text-green-600 hover:bg-green-50'
            }`}
          >
            {t('enterprise')} ({categoryStats.entreprise})
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">
              {t('totalPacks')}
            </CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {packs.length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-600">
              {t('totalRevenue')}
            </CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">
              {packs
                .reduce(
                  (total, pack) => total + calculatePackTotalPrice(pack),
                  0
                )
                .toFixed(2)}
              €
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Packs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredPacks.map((pack, index) => {
            const services = getServicesFromPack(pack)
            const category = getPackCategory(pack)

            return (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  className={`hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <CardTitle className="text-lg font-semibold text-gray-900">
                          {pack.name}
                        </CardTitle>
                        <div className="flex gap-2">
                          <Badge
                            variant="default"
                            className="bg-blue-100 text-blue-700"
                          >
                            {services.length} service
                            {services.length > 1 ? 's' : ''}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={
                              category === 'gratuit'
                                ? 'border-gray-400 text-gray-600'
                                : category === 'pro'
                                  ? 'border-blue-400 text-blue-600'
                                  : 'border-green-400 text-green-600'
                            }
                          >
                            {category.charAt(0).toUpperCase() +
                              category.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingPack(pack)}
                          className="hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setPackToDelete(pack)}
                          className="hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                      <div className="text-3xl font-bold text-blue-600">
                        {calculatePackTotalPrice(pack).toFixed(2)}€
                      </div>
                    </div>

                    {/* Services */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-600 mb-3">
                        Services inclus:
                      </h4>
                      <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                        {services.length > 0 ? (
                          services.map((service) => {
                            const serviceWithPrice =
                              getServiceWithPrice(service)
                            return (
                              <div
                                key={service.id}
                                className="p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                              >
                                <div className="flex justify-between items-start mb-1">
                                  <span className="text-sm font-medium text-gray-800 leading-tight flex-1 pr-2">
                                    {service.name}
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className="text-xs flex-shrink-0 ml-2"
                                  >
                                    {serviceWithPrice.price &&
                                    Number(serviceWithPrice.price) > 0
                                      ? `${Number(serviceWithPrice.price).toFixed(2)}€`
                                      : t('free')}
                                  </Badge>
                                </div>
                                {(service.token || service.tokens) && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    Tokens: {service.token || service.tokens}
                                  </div>
                                )}
                              </div>
                            )
                          })
                        ) : (
                          <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg text-center">
                            Services non détaillés
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {filteredPacks.length === 0 && packs.length > 0 && (
        <div className="text-center py-16">
          <Package className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
          <h3 className="text-2xl font-semibold mb-3">Aucun pack trouvé</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Aucun pack ne correspond à vos critères de recherche
          </p>
          <Button
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory('all')
            }}
            variant="outline"
          >
            Réinitialiser les filtres
          </Button>
        </div>
      )}

      {/* Empty State */}
      {packs.length === 0 && (
        <div className="text-center py-16">
          <Package className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
          <h3 className="text-2xl font-semibold mb-3">Aucun pack trouvé</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Commencez par créer votre premier pack de services pour vos clients
          </p>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            size="lg"
            className="shadow-lg bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Créer un pack
          </Button>
        </div>
      )}

      {/* Create Pack Dialog */}
      <PackForm
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreatePack}
        title="Créer un nouveau pack"
        description="Créez un pack personnalisé en sélectionnant plusieurs services"
      />

      {/* Edit Pack Dialog */}
      <PackForm
        open={!!editingPack}
        onOpenChange={(open) => !open && setEditingPack(null)}
        onSubmit={handleUpdatePack}
        pack={editingPack}
        title="Modifier le pack"
        description="Modifiez les informations de ce pack"
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!packToDelete}
        onOpenChange={(open) => !open && setPackToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le pack</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le pack{' '}
              <strong>{packToDelete?.name}</strong> ? Cette action est
              irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePack}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}
