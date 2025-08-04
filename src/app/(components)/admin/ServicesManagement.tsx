'use client'

import type React from 'react'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Search,
  Zap,
  DollarSign,
  Package,
  Eye,
  Settings,
} from 'lucide-react'
import type { Service, ServicesManagementProps } from '@/types/service'

export function ServicesManagement({
  services,
  onCreateService,
  onUpdateService,
  onDeleteService,
}: ServicesManagementProps) {
  const t = useTranslations('admin.services')
  const tCommon = useTranslations('admin.common')

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    tokens: 0,
    description: '',
    isActive: true,
  })

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && service.isActive) ||
      (statusFilter === 'inactive' && !service.isActive)
    return matchesSearch && matchesStatus
  })

  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      tokens: 0,
      description: '',
      isActive: true,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingService) {
      onUpdateService(editingService.id, formData)
      setEditingService(null)
    } else {
      onCreateService(formData)
      setIsCreateDialogOpen(false)
    }
    resetForm()
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      price: service.price,
      tokens: service.tokens,
      description: service.description,
      isActive: service.isActive,
    })
  }

  const handleDelete = () => {
    if (serviceToDelete) {
      onDeleteService(serviceToDelete.id)
      setServiceToDelete(null)
    }
  }

  const totalServices = services.length
  const activeServices = services.filter((s) => s.isActive).length
  const totalRevenue = services.reduce(
    (sum, service) => sum + service.price * service.usageCount,
    0
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
            {t('title')}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">{t('subtitle')}</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{t('newService')}</span>
              <span className="sm:hidden">{tCommon('create')}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-blue-200/30 text-slate-900 max-w-lg sm:max-w-2xl mx-4">
            <DialogHeader>
              <DialogTitle className="text-blue-600 text-lg sm:text-xl">
                {t('createService')}
              </DialogTitle>
              <DialogDescription className="text-slate-600 text-sm sm:text-base">
                {t('createDescription')}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-blue-600 text-sm">
                    {t('serviceName')}
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-slate-50 border-slate-200 text-slate-900 text-sm"
                    placeholder={t('serviceNamePlaceholder')}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price" className="text-blue-600 text-sm">
                    {t('price')} (€)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                    className="bg-slate-50 border-slate-200 text-slate-900 text-sm"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="tokens" className="text-blue-600 text-sm">
                  {t('tokens')} / {t('credits')}
                </Label>
                <Input
                  id="tokens"
                  type="number"
                  min="1"
                  value={formData.tokens}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tokens: Number(e.target.value),
                    })
                  }
                  className="bg-slate-50 border-slate-200 text-slate-900 text-sm"
                  placeholder={t('tokensPlaceholder')}
                  required
                />
                <p className="text-xs text-slate-500 mt-1">{t('tokensHelp')}</p>
              </div>

              <div>
                <Label htmlFor="description" className="text-blue-600 text-sm">
                  {t('description')}
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="bg-slate-50 border-slate-200 text-slate-900 text-sm"
                  rows={3}
                  placeholder={t('descriptionPlaceholder')}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label htmlFor="isActive" className="text-blue-600 text-sm">
                  {t('activeService')}
                </Label>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false)
                    resetForm()
                  }}
                  className="border-slate-200 text-slate-700 hover:bg-slate-50 text-sm"
                >
                  {tCommon('cancel')}
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-sm"
                >
                  {tCommon('create')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            title: t('totalServices'),
            value: totalServices,
            icon: Package,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
          },
          {
            title: t('activeServices'),
            value: activeServices,
            icon: Zap,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
          },
          {
            title: t('totalRevenue'),
            value: `${totalRevenue.toFixed(2)}€`,
            icon: DollarSign,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-200',
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card
              className={`bg-white ${stat.borderColor} border hover:shadow-lg transition-all duration-300`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-slate-800">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <Card className="bg-white border-blue-200/50 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder={t('searchServices')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-50 border-slate-200 text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-700 text-sm"
              >
                <option value="all">{t('allStatuses')}</option>
                <option value="active">{tCommon('active')}</option>
                <option value="inactive">{tCommon('inactive')}</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <AnimatePresence>
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="bg-white border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-blue-600 text-base sm:text-lg truncate">
                        {service.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          className={
                            service.isActive
                              ? 'bg-green-100 text-green-700 border-green-200 text-xs'
                              : 'bg-red-100 text-red-700 border-red-200 text-xs'
                          }
                        >
                          {service.isActive
                            ? tCommon('active')
                            : tCommon('inactive')}
                        </Badge>
                        <span className="text-xs text-slate-500">
                          {service.usageCount} {t('usages')}
                        </span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:bg-slate-100 p-1"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setSelectedService(service)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          {t('viewDetails')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(service)}>
                          <Edit className="w-4 h-4 mr-2" />
                          {tCommon('edit')}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setServiceToDelete(service)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {tCommon('delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 flex-1">
                  {/* Price and Tokens */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-xl font-bold text-blue-600">
                        {service.price === 0 ? t('free') : `${service.price}€`}
                      </div>
                      <div className="text-xs text-slate-600">{t('price')}</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-xl font-bold text-purple-600">
                        {service.tokens}
                      </div>
                      <div className="text-xs text-slate-600">
                        {t('tokens')}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-sm text-slate-700 line-clamp-3">
                      {service.description}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                    {t('createdOn')}{' '}
                    {new Date(service.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredServices.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <div className="text-slate-600 text-lg">{t('noServicesFound')}</div>
          <p className="text-sm text-slate-500 mt-2">
            {t('modifySearchCriteria')}
          </p>
        </motion.div>
      )}

      {/* Service Details Dialog */}
      <Dialog
        open={!!selectedService}
        onOpenChange={() => setSelectedService(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-blue-600">
              {t('serviceDetails')}
            </DialogTitle>
            <DialogDescription>{t('fullServiceInfo')}</DialogDescription>
          </DialogHeader>
          {selectedService && (
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800">
                    {selectedService.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      className={
                        selectedService.isActive
                          ? 'bg-green-100 text-green-700 border-green-200 text-xs'
                          : 'bg-red-100 text-red-700 border-red-200 text-xs'
                      }
                    >
                      {selectedService.isActive
                        ? tCommon('active')
                        : tCommon('inactive')}
                    </Badge>
                    <span className="text-sm text-slate-600">
                      {selectedService.usageCount} {t('usages')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedService.price === 0
                      ? t('free')
                      : `${selectedService.price}€`}
                  </div>
                  <div className="text-sm text-slate-600">{t('price')}</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {selectedService.tokens}
                  </div>
                  <div className="text-sm text-slate-600">{t('tokens')}</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 mb-2">
                  {t('description')}
                </h4>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-700">
                    {selectedService.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">{t('createdOn')}:</span>
                  <span className="ml-2 text-slate-800">
                    {new Date(selectedService.createdAt).toLocaleDateString(
                      'fr-FR'
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-slate-600">{t('lastUpdate')}:</span>
                  <span className="ml-2 text-slate-800">
                    {new Date(selectedService.updatedAt).toLocaleDateString(
                      'fr-FR'
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingService}
        onOpenChange={() => setEditingService(null)}
      >
        <DialogContent className="bg-white border-blue-200/30 text-slate-900 max-w-lg sm:max-w-2xl mx-4">
          <DialogHeader>
            <DialogTitle className="text-blue-600 text-lg sm:text-xl">
              {t('editService')}
            </DialogTitle>
            <DialogDescription className="text-slate-600 text-sm sm:text-base">
              {t('editDescription')}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name" className="text-blue-600 text-sm">
                  {t('serviceName')}
                </Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-slate-50 border-slate-200 text-slate-900 text-sm"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-price" className="text-blue-600 text-sm">
                  {t('price')} (€)
                </Label>
                <Input
                  id="edit-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  className="bg-slate-50 border-slate-200 text-slate-900 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-tokens" className="text-blue-600 text-sm">
                {t('tokens')} / {t('credits')}
              </Label>
              <Input
                id="edit-tokens"
                type="number"
                min="1"
                value={formData.tokens}
                onChange={(e) =>
                  setFormData({ ...formData, tokens: Number(e.target.value) })
                }
                className="bg-slate-50 border-slate-200 text-slate-900 text-sm"
                required
              />
            </div>

            <div>
              <Label
                htmlFor="edit-description"
                className="text-blue-600 text-sm"
              >
                {t('description')}
              </Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="bg-slate-50 border-slate-200 text-slate-900 text-sm"
                rows={3}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
              <Label htmlFor="edit-isActive" className="text-blue-600 text-sm">
                {t('activeService')}
              </Label>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingService(null)
                  resetForm()
                }}
                className="border-slate-200 text-slate-700 hover:bg-slate-50 text-sm"
              >
                {tCommon('cancel')}
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-sm"
              >
                {tCommon('save')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!serviceToDelete}
        onOpenChange={() => setServiceToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteService')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteConfirmation')} <strong>{serviceToDelete?.name}</strong>{' '}
              ? {t('deleteWarning')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {tCommon('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}
