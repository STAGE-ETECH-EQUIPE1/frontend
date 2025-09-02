'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
  Mail,
  Eye,
  Trash2,
  Users,
  Shield,
  UserIcon,
} from 'lucide-react'
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useSendEmailToUserMutation,
} from '../services/usersApi'
import type { User } from '../types/user'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'

export function UsersManagementContainer() {
  const { data: users = [], isLoading } = useGetUsersQuery()
  const [deleteUser] = useDeleteUserMutation()
  const [sendEmail] = useSendEmailToUserMutation()
  const t = useTranslations('admin.users')
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
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
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = roleFilter === 'all' || user.roles.includes(roleFilter)

    return matchesSearch && matchesRole
  })

  const getRoleColor = (roles: string[]) => {
    if (roles.includes('ROLE_ADMIN')) {
      return 'bg-red-100 text-red-700 border-red-200'
    }
    if (roles.includes('ROLE_CLIENT')) {
      return 'bg-blue-100 text-blue-700 border-blue-200'
    }
    return 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const getRoleText = (roles: string[]) => {
    if (roles.includes('ROLE_ADMIN')) return 'Admin'
    if (roles.includes('ROLE_CLIENT')) return 'Client'
    return 'Utilisateur'
  }

  const getRoleIcon = (roles: string[]) => {
    if (roles.includes('ROLE_ADMIN')) return Shield
    if (roles.includes('ROLE_CLIENT')) return UserCheck
    return UserIcon
  }

  const handleDeleteUser = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.id.toString()).unwrap()
        toast.success('Utilisateur supprimé avec succès')
        setUserToDelete(null)
      } catch (error) {
        toast.error('Erreur lors de la suppression')
        console.log('Delete user error:', error)
      }
    }
  }

  const handleSendEmail = async () => {
    if (emailDialog.user && emailData.subject && emailData.message) {
      try {
        await sendEmail({
          userId: emailDialog.user.id.toString(),
          subject: emailData.subject,
          message: emailData.message,
        }).unwrap()
        toast.success('Email envoyé avec succès')
        setEmailDialog({ open: false, user: null })
        setEmailData({ subject: '', message: '' })
      } catch (error) {
        toast.error("Erreur lors de l'envoi de l'email")
        console.log('Send email error:', error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 px-2 sm:px-4 lg:px-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-4xl font-bold font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('title')}
            </h2>
            <p className="text-muted-foreground mt-2">{t('subtitle')}</p>
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
                <div className="grid grid-cols-1 gap-2">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs w-full"
                  >
                    <option value="all">{t('allRoles')}</option>
                    <option value="ROLE_ADMIN">{t('roleAdmins')}</option>
                    <option value="ROLE_CLIENT">{t('roleClients')}</option>
                    <option value="ROLE_USER">{t('roleUsers')}</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Users List - Responsive */}
      <div className="max-w-7xl mx-auto">
        {/* Desktop List View */}
        <div className="hidden lg:block">
          <div className="space-y-2">
            <AnimatePresence>
              {filteredUsers.map((user, index) => {
                const RoleIcon = getRoleIcon(user.roles)
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
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium">
                                {user.fullName.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-slate-800 text-base truncate">
                                {user.fullName}
                              </div>
                              <div className="text-sm text-slate-600 truncate">
                                @{user.username} • {user.email}
                              </div>
                              <div className="text-xs text-slate-500 mt-1">
                                {user.phone}
                              </div>
                            </div>
                          </div>

                          {/* Role */}
                          <div className="flex items-center gap-3 flex-shrink-0 min-w-[140px]">
                            <div
                              className={`w-8 h-8 rounded-lg ${getRoleColor(user.roles).replace('text-', 'bg-').replace('border-', '').replace('100', '500')} flex items-center justify-center shadow-sm`}
                            >
                              <RoleIcon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-slate-800">
                                {getRoleText(user.roles)}
                              </div>
                              <div className="text-xs text-slate-600">
                                {user.roles.length} rôle
                                {user.roles.length > 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center gap-6 flex-shrink-0 min-w-[200px]">
                            <div className="text-center">
                              <div className="text-blue-600 text-lg font-bold mb-1">
                                {user.subscriptions.length}
                              </div>
                              <div className="text-xs text-slate-600 font-medium">
                                {t('subscription')}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-green-600 text-lg font-bold mb-1">
                                {user.packName.length}
                              </div>
                              <div className="text-xs text-slate-600 font-medium">
                                {t('plan')}
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
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <Avatar className="w-12 h-12 flex-shrink-0 ring-2 ring-slate-100">
                              <AvatarFallback className="bg-slate-200 text-slate-600 text-sm font-medium">
                                {user.fullName.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-slate-800 text-base truncate mb-1">
                                {user.fullName}
                              </div>
                              <div className="text-sm text-slate-500 truncate">
                                @{user.username}
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
                            <DropdownMenuContent
                              align="end"
                              className="w-44 bg-white"
                            >
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

                        {/* Role & Email */}
                        <div className="flex items-center justify-between mb-4">
                          <Badge
                            className={`${getRoleColor(user.roles)} text-sm px-3 py-1.5 font-medium rounded-full`}
                          >
                            {getRoleText(user.roles)}
                          </Badge>
                        </div>

                        <div className="text-sm text-slate-600 mb-4 truncate">
                          {user.email}
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-2 mb-4 flex-1">
                          <div className="bg-blue-50 rounded-xl p-2 text-center flex flex-col justify-center min-h-[75px]">
                            <div className="text-blue-600 text-lg font-bold mb-1 leading-none">
                              {user.subscriptions.length}
                            </div>
                            <div className="text-xs text-slate-600 font-medium leading-tight">
                              {t('subscription')}
                            </div>
                          </div>
                          <div className="bg-green-50 rounded-xl p-2 text-center flex flex-col justify-center min-h-[75px]">
                            <div className="text-green-600 text-lg font-bold mb-1 leading-none">
                              {user.packName.length}
                            </div>
                            <div className="text-xs text-slate-600 font-medium leading-tight">
                              Packs
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="text-xs text-slate-500 text-center pt-3 border-t border-slate-100">
                          {user.phone}
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
          <div className="text-slate-600 text-lg">Aucun utilisateur trouvé</div>
          <p className="text-sm text-slate-500 mt-2">
            Modifiez vos critères de recherche
          </p>
        </motion.div>
      )}

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-blue-600 text-base">
              Détails de l&apos;utilisateur
            </DialogTitle>
            <DialogDescription className="text-sm">
              Informations complètes
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Avatar className="w-12 h-12 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm">
                    {selectedUser.fullName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 text-sm truncate">
                    {selectedUser.fullName}
                  </h3>
                  <p className="text-slate-600 text-xs break-all">
                    {selectedUser.email}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Badge
                      className={`${getRoleColor(selectedUser.roles)} text-xs`}
                    >
                      {getRoleText(selectedUser.roles)}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-2">
                  <div>
                    <span className="text-slate-600 block">
                      Nom d&apos;utilisateur
                    </span>
                    <span className="text-slate-800 font-medium">
                      {selectedUser.username}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600 block">Téléphone</span>
                    <span className="text-slate-800 font-medium">
                      {selectedUser.phone}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-slate-600 block">Rôles</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedUser.roles.map((role, index) => (
                        <Badge key={index} className="text-xs">
                          {role.replace('ROLE_', '')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="text-blue-600 font-medium text-sm">
                    {selectedUser.subscriptions.length}
                  </div>
                  <div className="text-xs text-slate-600">
                    {' '}
                    {t('subscription')}
                  </div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="text-green-600 font-medium text-sm">
                    {selectedUser.packName.length}
                  </div>
                  <div className="text-xs text-slate-600">Packs</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Email Dialog */}
      <Dialog
        open={emailDialog.open}
        onOpenChange={(open) =>
          setEmailDialog({ open, user: emailDialog.user })
        }
      >
        <DialogContent className="w-[95vw] max-w-md mx-auto">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-blue-600 text-base">
              Envoyer un email
            </DialogTitle>
            <DialogDescription className="text-sm">
              À {emailDialog.user?.fullName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">
                Sujet
              </label>
              <Input
                value={emailData.subject}
                onChange={(e) =>
                  setEmailData({ ...emailData, subject: e.target.value })
                }
                placeholder="Sujet de l'email..."
                className="text-sm h-9"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">
                Message
              </label>
              <textarea
                value={emailData.message}
                onChange={(e) =>
                  setEmailData({ ...emailData, message: e.target.value })
                }
                placeholder="Votre message..."
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
                Annuler
              </Button>
              <Button
                onClick={handleSendEmail}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm h-9"
              >
                <Mail className="w-3 h-3 mr-1" />
                Envoyer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!userToDelete}
        onOpenChange={() => setUserToDelete(null)}
      >
        <AlertDialogContent className="w-[95vw] max-w-md mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">
              Supprimer l&apos;utilisateur
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Supprimer <strong>{userToDelete?.fullName}</strong> ? Cette action
              est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2 pt-4">
            <AlertDialogCancel className="flex-1 text-sm h-9">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="flex-1 bg-red-600 hover:bg-red-700 text-sm h-9"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
