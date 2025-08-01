'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
  Search,
  Filter,
  MoreHorizontal,
  UserCheck,
  UserX,
  Ban,
  Mail,
  Download,
  Palette,
  Crown,
  Zap,
  Target,
  Eye,
  Trash2,
  Users,
} from 'lucide-react'
import type { User, UsersManagementProps } from '@/types/admin'

export function UsersManagement({
  users,
  onUpdateUser,
  onDeleteUser,
  onSendEmail,
}: UsersManagementProps) {
  const t = useTranslations('admin.users')
  const tCommon = useTranslations('admin.common')

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [planFilter, setPlanFilter] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [emailDialog, setEmailDialog] = useState<{
    open: boolean
    user: User | null
  }>({ open: false, user: null })
  const [emailData, setEmailData] = useState({ subject: '', message: '' })
  const [showFilters, setShowFilters] = useState(false)

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    const matchesPlan = planFilter === 'all' || user.plan.type === planFilter
    return matchesSearch && matchesStatus && matchesPlan
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'suspended':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'banned':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return tCommon('active')
      case 'suspended':
        return t('suspended')
      case 'banned':
        return t('banned')
      default:
        return status
    }
  }

  const getPlanIcon = (type: string) => {
    switch (type) {
      case 'entreprise':
        return Crown
      case 'premium':
        return Zap
      default:
        return Target
    }
  }

  const getPlanColor = (type: string) => {
    switch (type) {
      case 'entreprise':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500'
      case 'premium':
        return 'bg-gradient-to-r from-blue-500 to-purple-500'
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600'
    }
  }

  const handleStatusChange = (userId: string, newStatus: User['status']) => {
    onUpdateUser(userId, { status: newStatus })
  }

  const handleSendEmail = () => {
    if (emailDialog.user && emailData.subject && emailData.message) {
      onSendEmail(emailDialog.user.id, emailData.subject, emailData.message)
      setEmailDialog({ open: false, user: null })
      setEmailData({ subject: '', message: '' })
    }
  }

  const handleDeleteUser = () => {
    if (userToDelete) {
      onDeleteUser(userToDelete.id)
      setUserToDelete(null)
    }
  }

  return (
    <div className="space-y-4 px-2 sm:px-4 lg:px-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-blue-600 truncate">
              {t('title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 hidden sm:block">
              {t('subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs flex-shrink-0">
              <Users className="w-3 h-3 mr-1" />
              {filteredUsers.length}
            </Badge>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder={t('search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 pr-10 h-9 text-sm bg-white border-slate-200"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 text-slate-500"
        >
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Collapsible Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <Card className="bg-white border-slate-200">
              <CardContent className="p-3">
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs w-full"
                  >
                    <option value="all">{t('allStatuses')}</option>
                    <option value="active">{tCommon('active')}</option>
                    <option value="suspended">{t('suspended')}</option>
                    <option value="banned">{t('banned')}</option>
                  </select>
                  <select
                    value={planFilter}
                    onChange={(e) => setPlanFilter(e.target.value)}
                    className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs w-full"
                  >
                    <option value="all">{t('allPlans')}</option>
                    <option value="gratuit">Gratuit</option>
                    <option value="premium">Premium</option>
                    <option value="entreprise">Entreprise</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Users List - Responsive: List sur desktop, Cards sur mobile */}
      <div className="max-w-7xl mx-auto">
        {/* Desktop List View - Hidden on mobile */}
        <div className="hidden lg:block">
          <div className="space-y-2">
            <AnimatePresence>
              {filteredUsers.map((user, index) => {
                const PlanIcon = getPlanIcon(user.plan.type)
                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                  >
                    <Card className="bg-white border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-6">
                          {/* Avatar & User Info */}
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <Avatar className="w-12 h-12 flex-shrink-0 ring-2 ring-slate-100">
                              <AvatarImage
                                src={user.avatar || '/placeholder.svg'}
                                alt={user.username}
                              />
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium">
                                {user.username.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-slate-800 text-base truncate">
                                {user.username}
                              </div>
                              <div className="text-sm text-slate-600 truncate">
                                {user.email}
                              </div>
                              <div className="text-xs text-slate-500 mt-1">
                                {t('joinedOn')}{' '}
                                {new Date(user.joinedAt).toLocaleDateString(
                                  'fr-FR'
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Status */}
                          <div className="flex-shrink-0">
                            <Badge
                              className={`${getStatusColor(user.status)} text-sm px-3 py-1.5 font-medium`}
                            >
                              {getStatusText(user.status)}
                            </Badge>
                          </div>

                          {/* Plan */}
                          <div className="flex items-center gap-3 flex-shrink-0 min-w-[140px]">
                            <div
                              className={`w-8 h-8 rounded-lg ${getPlanColor(user.plan.type)} flex items-center justify-center shadow-sm`}
                            >
                              <PlanIcon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-slate-800">
                                {user.plan.name}
                              </div>
                              <div className="text-xs text-slate-600">
                                {user.plan.price === 0
                                  ? 'Gratuit'
                                  : `${user.plan.price}€/mois`}
                              </div>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center gap-6 flex-shrink-0 min-w-[200px]">
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                                <Palette className="w-4 h-4" />
                                <span className="text-lg font-bold">
                                  {user.totalLogos}
                                </span>
                              </div>
                              <div className="text-xs text-slate-600 font-medium">
                                Logos
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                                <Download className="w-4 h-4" />
                                <span className="text-lg font-bold">
                                  {user.totalDownloads}
                                </span>
                              </div>
                              <div className="text-xs text-slate-600 font-medium">
                                {t('downloads')}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-purple-600 text-lg font-bold mb-1">
                                {user.tokensUsed}/
                                {user.plan.maxTokens === 'unlimited'
                                  ? '∞'
                                  : user.plan.maxTokens}
                              </div>
                              <div className="text-xs text-slate-600 font-medium">
                                {t('tokens')}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex-shrink-0">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-slate-500 hover:bg-slate-100"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuItem
                                  onClick={() => setSelectedUser(user)}
                                  className="text-sm"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  {t('viewDetails')}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    setEmailDialog({ open: true, user })
                                  }
                                  className="text-sm"
                                >
                                  <Mail className="w-4 h-4 mr-2" />
                                  {t('sendEmail')}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {user.status === 'active' && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleStatusChange(user.id, 'suspended')
                                    }
                                    className="text-sm"
                                  >
                                    <UserX className="w-4 h-4 mr-2" />
                                    {t('suspend')}
                                  </DropdownMenuItem>
                                )}
                                {user.status === 'suspended' && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleStatusChange(user.id, 'active')
                                    }
                                    className="text-sm"
                                  >
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    {t('reactivate')}
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(user.id, 'banned')
                                  }
                                  className="text-sm text-red-600"
                                >
                                  <Ban className="w-4 h-4 mr-2" />
                                  {t('banPermanently')}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => setUserToDelete(user)}
                                  className="text-sm text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  {t('deleteAccount')}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence>
              {filteredUsers.map((user, index) => {
                const PlanIcon = getPlanIcon(user.plan.type)
                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                  >
                    <Card className="bg-white border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 h-full">
                      <CardContent className="p-4 h-full flex flex-col">
                        {/* Header - Avatar + Info + Menu */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <Avatar className="w-12 h-12 flex-shrink-0 ring-2 ring-slate-100">
                              <AvatarImage
                                src={user.avatar || '/placeholder.svg'}
                                alt={user.username}
                              />
                              <AvatarFallback className="bg-slate-200 text-slate-600 text-sm font-medium">
                                {user.username.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-slate-800 text-base truncate mb-1">
                                {user.username}
                              </div>
                              <div className="text-sm text-slate-500 truncate">
                                {user.email}
                              </div>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex-shrink-0"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem
                                onClick={() => setSelectedUser(user)}
                                className="text-sm"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                {t('viewDetails')}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  setEmailDialog({ open: true, user })
                                }
                                className="text-sm"
                              >
                                <Mail className="w-4 h-4 mr-2" />
                                {t('sendEmail')}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.status === 'active' && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(user.id, 'suspended')
                                  }
                                  className="text-sm"
                                >
                                  <UserX className="w-4 h-4 mr-2" />
                                  {t('suspend')}
                                </DropdownMenuItem>
                              )}
                              {user.status === 'suspended' && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(user.id, 'active')
                                  }
                                  className="text-sm"
                                >
                                  <UserCheck className="w-4 h-4 mr-2" />
                                  {t('reactivate')}
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(user.id, 'banned')
                                }
                                className="text-sm text-red-600"
                              >
                                <Ban className="w-4 h-4 mr-2" />
                                {t('banPermanently')}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setUserToDelete(user)}
                                className="text-sm text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                {t('deleteAccount')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Status & Plan Row */}
                        <div className="flex items-center justify-between mb-4">
                          <Badge
                            className={`${getStatusColor(user.status)} text-sm px-3 py-1.5 font-medium rounded-full`}
                          >
                            {getStatusText(user.status)}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-8 h-8 rounded-lg ${getPlanColor(user.plan.type)} flex items-center justify-center shadow-sm`}
                            >
                              <PlanIcon className="w-4 h-4 text-white" />
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-slate-800">
                                {user.plan.name}
                              </div>
                              <div className="text-xs text-slate-500">
                                (
                                {user.plan.price === 0
                                  ? 'Gratuit'
                                  : `${user.plan.price}€`}
                                )
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-2 mb-4 flex-1">
                          {/* Logos */}
                          <div className="bg-blue-50 rounded-xl p-2 text-center flex flex-col justify-center min-h-[75px]">
                            <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                              <Palette className="w-3 h-3 flex-shrink-0" />
                              <span className="text-lg font-bold leading-none">
                                {user.totalLogos}
                              </span>
                            </div>
                            <div className="text-xs text-slate-600 font-medium leading-tight">
                              Logos
                            </div>
                          </div>

                          {/* Downloads */}
                          <div className="bg-green-50 rounded-xl p-2 text-center flex flex-col justify-center min-h-[75px]">
                            <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                              <Download className="w-3 h-3 flex-shrink-0" />
                              <span className="text-lg font-bold leading-none">
                                {user.totalDownloads}
                              </span>
                            </div>
                            <div className="text-xs text-slate-600 font-medium leading-tight truncate">
                              {t('downloads')}
                            </div>
                          </div>

                          {/* Tokens */}
                          <div className="bg-purple-50 rounded-xl p-2 text-center flex flex-col justify-center min-h-[75px]">
                            <div className="text-purple-600 text-lg font-bold mb-1 leading-none truncate">
                              {user.tokensUsed}/
                              {user.plan.maxTokens === 'unlimited'
                                ? '∞'
                                : user.plan.maxTokens}
                            </div>
                            <div className="text-xs text-slate-600 font-medium leading-tight">
                              {t('tokens')}
                            </div>
                          </div>
                        </div>

                        {/* Footer - Dates */}
                        <div className="text-xs text-slate-500 text-center pt-3 border-t border-slate-100">
                          {t('joinedOn')}{' '}
                          {new Date(user.joinedAt).toLocaleDateString('fr-FR')}{' '}
                          • {t('activeOn')}{' '}
                          {new Date(user.lastActive).toLocaleDateString(
                            'fr-FR'
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <div className="text-slate-600 text-lg">{t('noUsersFound')}</div>
          <p className="text-sm text-slate-500 mt-2">
            {t('modifySearchCriteria')}
          </p>
        </motion.div>
      )}

      {/* User Details Dialog - Mobile Optimized */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-blue-600 text-base">
              {t('userDetails')}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {t('fullInfo')}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              {/* User Header */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Avatar className="w-12 h-12 flex-shrink-0">
                  <AvatarImage
                    src={selectedUser.avatar || '/placeholder.svg'}
                    alt={selectedUser.username}
                  />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm">
                    {selectedUser.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 text-sm truncate">
                    {selectedUser.username}
                  </h3>
                  <p className="text-slate-600 text-xs break-all">
                    {selectedUser.email}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Badge
                      className={`${getStatusColor(selectedUser.status)} text-xs`}
                    >
                      {getStatusText(selectedUser.status)}
                    </Badge>
                    <Badge
                      className={`${getPlanColor(selectedUser.plan.type)} text-white border-0 text-xs`}
                    >
                      {selectedUser.plan.name}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-2">
                  <div>
                    <span className="text-slate-600 block">
                      {t('registration')}
                    </span>
                    <span className="text-slate-800 font-medium">
                      {new Date(selectedUser.joinedAt).toLocaleDateString(
                        'fr-FR'
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600 block">{t('plan')}</span>
                    <span className="text-slate-800 font-medium">
                      {selectedUser.plan.name}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-slate-600 block">
                      {t('lastActivity')}
                    </span>
                    <span className="text-slate-800 font-medium">
                      {new Date(selectedUser.lastActive).toLocaleDateString(
                        'fr-FR'
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600 block">{t('tokens')}</span>
                    <span className="text-purple-600 font-medium">
                      {selectedUser.tokensUsed}/
                      {selectedUser.plan.maxTokens === 'unlimited'
                        ? '∞'
                        : selectedUser.plan.maxTokens}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="text-blue-600 font-medium text-sm">
                    {selectedUser.totalLogos}
                  </div>
                  <div className="text-xs text-slate-600">
                    {t('logosCreated')}
                  </div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="text-green-600 font-medium text-sm">
                    {selectedUser.totalDownloads}
                  </div>
                  <div className="text-xs text-slate-600">{t('downloads')}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Email Dialog - Mobile Optimized */}
      <Dialog
        open={emailDialog.open}
        onOpenChange={(open) =>
          setEmailDialog({ open, user: emailDialog.user })
        }
      >
        <DialogContent className="w-[95vw] max-w-md mx-auto">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-blue-600 text-base">
              {t('sendEmail')}
            </DialogTitle>
            <DialogDescription className="text-sm">
              À {emailDialog.user?.username}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">
                {t('emailSubject')}
              </label>
              <Input
                value={emailData.subject}
                onChange={(e) =>
                  setEmailData({ ...emailData, subject: e.target.value })
                }
                placeholder={t('emailSubject') + '...'}
                className="text-sm h-9"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">
                {t('emailMessage')}
              </label>
              <textarea
                value={emailData.message}
                onChange={(e) =>
                  setEmailData({ ...emailData, message: e.target.value })
                }
                placeholder={t('yourMessage')}
                className="w-full p-2 border border-slate-200 rounded-md text-sm resize-none"
                rows={3}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setEmailDialog({ open: false, user: null })}
                className="flex-1 text-sm h-9"
              >
                {tCommon('cancel')}
              </Button>
              <Button
                onClick={handleSendEmail}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm h-9"
              >
                <Mail className="w-3 h-3 mr-1" />
                {tCommon('send')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog - Mobile Optimized */}
      <AlertDialog
        open={!!userToDelete}
        onOpenChange={() => setUserToDelete(null)}
      >
        <AlertDialogContent className="w-[95vw] max-w-md mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">
              {t('deleteUser')}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              {tCommon('delete')} <strong>{userToDelete?.username}</strong> ?{' '}
              {t('deleteConfirmation')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2 pt-4">
            <AlertDialogCancel className="flex-1 text-sm h-9">
              {tCommon('cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="flex-1 bg-red-600 hover:bg-red-700 text-sm h-9"
            >
              {tCommon('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
