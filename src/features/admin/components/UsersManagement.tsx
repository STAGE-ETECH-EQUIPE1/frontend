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
  Mail,
  Eye,
  Trash2,
  Users,
} from 'lucide-react'
import type { User, UsersManagementProps } from '../types/user'

export function UsersManagement({
  users,
  onDeleteUser,
  onSendEmail,
}: UsersManagementProps) {
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
    if (roles.includes('admin')) return 'bg-red-100 text-red-700 border-red-200'
    if (roles.includes('premium'))
      return 'bg-blue-100 text-blue-700 border-blue-200'
    return 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const getRoleText = (roles: string[]) => {
    if (roles.includes('admin')) return 'Admin'
    if (roles.includes('premium')) return 'Premium'
    return 'User'
  }

  const handleSendEmail = () => {
    if (
      emailDialog.user &&
      emailData.subject &&
      emailData.message &&
      onSendEmail
    ) {
      onSendEmail(
        emailDialog.user.id.toString(),
        emailData.subject,
        emailData.message
      )
      setEmailDialog({ open: false, user: null })
      setEmailData({ subject: '', message: '' })
    }
  }

  const handleDeleteUser = () => {
    if (userToDelete && onDeleteUser) {
      onDeleteUser(userToDelete.id.toString())
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
              Gestion des Utilisateurs
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 hidden sm:block">
              Gérez les comptes utilisateurs
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
          placeholder="Rechercher par nom, email..."
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
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs w-full"
                >
                  <option value="all">Tous les rôles</option>
                  <option value="admin">Admin</option>
                  <option value="premium">Premium</option>
                  <option value="user">Utilisateur</option>
                </select>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Users List */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredUsers.map((user, index) => (
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
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium">
                            {user.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-slate-800 text-base truncate mb-1">
                            {user.fullName || user.username}
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
                            Voir détails
                          </DropdownMenuItem>
                          {
                            <DropdownMenuItem
                              onClick={() =>
                                setEmailDialog({ open: true, user })
                              }
                              className="text-sm"
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              Envoyer email
                            </DropdownMenuItem>
                          }
                          <DropdownMenuSeparator />
                          {
                            <DropdownMenuItem
                              onClick={() => setUserToDelete(user)}
                              className="text-sm text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          }
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Role & Info */}
                    <div className="flex items-center justify-between mb-4">
                      <Badge
                        className={`${getRoleColor(user.roles)} text-sm px-3 py-1.5 font-medium rounded-full`}
                      >
                        {getRoleText(user.roles)}
                      </Badge>
                      <div className="text-xs text-slate-500">
                        ID: {user.id}
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="space-y-2 flex-1">
                      <div className="text-xs">
                        <span className="text-slate-600 block">Téléphone:</span>
                        <span className="text-slate-800 font-medium">
                          {user.phone || 'Non renseigné'}
                        </span>
                      </div>
                      <div className="text-xs">
                        <span className="text-slate-600 block">
                          Abonnements:
                        </span>
                        <span className="text-slate-800 font-medium">
                          {user.subscriptions.length} actif(s)
                        </span>
                      </div>
                      <div className="text-xs">
                        <span className="text-slate-600 block">Packs:</span>
                        <span className="text-slate-800 font-medium">
                          {user.packName.length} pack(s)
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
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
              Détails utilisateur
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
                    {selectedUser.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 text-sm truncate">
                    {selectedUser.fullName}
                  </h3>
                  <p className="text-slate-600 text-xs break-all">
                    {selectedUser.email}
                  </p>
                  <Badge
                    className={`${getRoleColor(selectedUser.roles)} text-xs mt-1`}
                  >
                    {getRoleText(selectedUser.roles)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 text-xs">
                <div>
                  <span className="text-slate-600 block">
                    Nom d&apos;utilisateur:
                  </span>
                  <span className="text-slate-800 font-medium">
                    {selectedUser.username}
                  </span>
                </div>
                <div>
                  <span className="text-slate-600 block">Téléphone:</span>
                  <span className="text-slate-800 font-medium">
                    {selectedUser.phone || 'Non renseigné'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-600 block">Rôles:</span>
                  <span className="text-slate-800 font-medium">
                    {selectedUser.roles.join(', ')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-600 block">Abonnements:</span>
                  <span className="text-slate-800 font-medium">
                    {selectedUser.subscriptions.length} actif(s)
                  </span>
                </div>
                <div>
                  <span className="text-slate-600 block">Packs:</span>
                  <span className="text-slate-800 font-medium">
                    {selectedUser.packName.length} pack(s)
                  </span>
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
              À {emailDialog.user?.username}
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
              Supprimer <strong>{userToDelete?.username}</strong> ? Cette action
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
