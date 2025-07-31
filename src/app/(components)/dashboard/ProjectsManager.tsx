'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
  Search,
  Filter,
  MoreHorizontal,
  Download,
  Heart,
  MessageSquare,
  Star,
  Send,
  Edit,
  Trash2,
  FolderOpen,
} from 'lucide-react'

interface Project {
  id: string
  name: string
  logoUrl: string
  createdAt: string
  style: string
  industry: string
  downloads: number
  isFavorite: boolean
  comments: Comment[]
}

interface Comment {
  id: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  rating: number
  createdAt: string
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'TechCorp Logo',
    logoUrl: '/placeholder.svg?height=200&width=200&text=TechCorp',
    createdAt: '2024-01-30T10:00:00Z',
    style: 'Moderne',
    industry: 'Technologie',
    downloads: 5,
    isFavorite: true,
    comments: [
      {
        id: '1',
        userId: 'user1',
        userName: 'Marie Dubois',
        userAvatar: '/placeholder.svg?height=40&width=40&text=MD',
        content:
          'Très beau logo ! Le style moderne correspond parfaitement à notre startup.',
        rating: 5,
        createdAt: '2024-01-30T14:00:00Z',
      },
    ],
  },
  {
    id: '2',
    name: 'Restaurant Saveurs',
    logoUrl: '/placeholder.svg?height=200&width=200&text=Saveurs',
    createdAt: '2024-01-29T15:30:00Z',
    style: 'Élégant',
    industry: 'Restaurant',
    downloads: 3,
    isFavorite: false,
    comments: [],
  },
  {
    id: '3',
    name: 'Fitness Pro',
    logoUrl: '/placeholder.svg?height=200&width=200&text=FitnessPro',
    createdAt: '2024-01-28T09:15:00Z',
    style: 'Dynamique',
    industry: 'Sport',
    downloads: 8,
    isFavorite: true,
    comments: [
      {
        id: '2',
        userId: 'user2',
        userName: 'Jean Martin',
        userAvatar: '/placeholder.svg?height=40&width=40&text=JM',
        content: 'Logo parfait pour une salle de sport. Très énergique !',
        rating: 4,
        createdAt: '2024-01-28T16:20:00Z',
      },
    ],
  },
]

export function ProjectsManager() {
  const t = useTranslations('projectsManager')
  const tCommon = useTranslations('common')
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStyle, setFilterStyle] = useState<string>('all')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [newComment, setNewComment] = useState('')
  const [newRating, setNewRating] = useState(5)

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesStyle = filterStyle === 'all' || project.style === filterStyle
    return matchesSearch && matchesStyle
  })

  const toggleFavorite = (projectId: string) => {
    setProjects(
      projects.map((project) =>
        project.id === projectId
          ? { ...project, isFavorite: !project.isFavorite }
          : project
      )
    )
  }

  const addComment = () => {
    if (!selectedProject || !newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      userId: 'currentUser',
      userName: 'Vous',
      userAvatar: '/placeholder.svg?height=40&width=40&text=V',
      content: newComment,
      rating: newRating,
      createdAt: new Date().toISOString(),
    }

    setProjects(
      projects.map((project) =>
        project.id === selectedProject.id
          ? { ...project, comments: [...project.comments, comment] }
          : project
      )
    )

    setNewComment('')
    setNewRating(5)
  }

  const renderStars = (
    rating: number,
    interactive = false,
    onRatingChange?: (rating: number) => void
  ) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
        onClick={() => interactive && onRatingChange && onRatingChange(i + 1)}
      />
    ))
  }

  const styles = [
    'Moderne',
    'Minimaliste',
    'Vintage',
    'Professionnel',
    'Créatif',
    'Élégant',
    'Dynamique',
    'Classique',
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2 text-xl sm:text-2xl lg:text-3xl">
            {t('title')}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-sm sm:text-base">
            {filteredProjects.length}{' '}
            {filteredProjects.length > 1 ? t('projects') : t('project')}
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white border-blue-200/50 shadow-sm p-3 sm:p-4">
        <CardHeader>
          <CardTitle className="text-blue-600 flex items-center gap-2 text-sm sm:text-base">
            <Filter className="w-5 h-5" />
            {tCommon('filter')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <div className="flex-1 min-w-48 sm:min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-50 border-slate-200 text-sm sm:text-base"
                />
              </div>
            </div>
            <select
              value={filterStyle}
              onChange={(e) => setFilterStyle(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-700 text-sm sm:text-base"
            >
              <option value="all">{t('allStyles')}</option>
              {styles.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-white border-slate-200 hover:border-blue-300 transition-all duration-300 group shadow-sm hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-slate-800 text-lg">
                        {project.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {project.style}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {project.industry}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          {tCommon('edit')}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          {tCommon('delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Logo Preview */}
                  <div className="aspect-square bg-slate-50 rounded-lg overflow-hidden p-4">
                    <img
                      src={project.logoUrl || '/placeholder.svg'}
                      alt={project.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {project.downloads}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {project.comments.length}
                      </span>
                    </div>
                    <span>
                      {new Date(project.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleFavorite(project.id)}
                      className={
                        project.isFavorite ? 'text-red-500 border-red-200' : ''
                      }
                    >
                      <Heart
                        className={`w-4 h-4 ${project.isFavorite ? 'fill-red-500' : ''}`}
                      />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedProject(project)}
                          className="flex-1 min-w-0 flex items-center justify-center gap-1 sm:gap-2"
                        >
                          <MessageSquare className="w-4 h-4 flex-shrink-0" />
                          <span className="hidden sm:inline truncate">
                            {t('commentsTitle')}
                          </span>
                          <span className="sm:hidden">
                            ({project.comments.length})
                          </span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-xl sm:max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-blue-600 text-sm sm:text-base">
                            {t('commentsTitle')} - {project.name}
                          </DialogTitle>
                          <DialogDescription className="text-sm sm:text-base">
                            {t('commentsSubtitle')}
                          </DialogDescription>
                        </DialogHeader>
                        {selectedProject && (
                          <div className="space-y-6">
                            {/* Logo Preview */}
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                              <img
                                src={
                                  selectedProject.logoUrl || '/placeholder.svg'
                                }
                                alt={selectedProject.name}
                                className="w-16 h-16 object-contain bg-white rounded"
                              />
                              <div>
                                <h3 className="font-semibold text-slate-800 text-sm sm:text-base">
                                  {selectedProject.name}
                                </h3>
                                <p className="text-sm text-slate-600">
                                  {selectedProject.style} •{' '}
                                  {selectedProject.industry}
                                </p>
                              </div>
                            </div>

                            {/* Add Comment */}
                            <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                              <div>
                                <label className="text-sm font-medium text-slate-700 text-sm sm:text-base">
                                  {t('yourRating')}
                                </label>
                                <div className="flex mt-1">
                                  {renderStars(newRating, true, setNewRating)}
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-slate-700 text-sm sm:text-base">
                                  {t('comment')}
                                </label>
                                <Textarea
                                  value={newComment}
                                  onChange={(e) =>
                                    setNewComment(e.target.value)
                                  }
                                  placeholder={t('commentPlaceholder')}
                                  className="mt-1 bg-white text-sm sm:text-base"
                                  rows={3}
                                />
                              </div>
                              <Button
                                onClick={addComment}
                                className="bg-blue-600 hover:bg-blue-700 text-sm sm:text-base"
                              >
                                <Send className="w-4 h-4 mr-2" />
                                {t('publish')}
                              </Button>
                            </div>

                            {/* Comments List */}
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                              {selectedProject.comments.length > 0 ? (
                                selectedProject.comments.map((comment) => (
                                  <div
                                    key={comment.id}
                                    className="flex gap-3 p-4 bg-slate-50 rounded-lg"
                                  >
                                    <Avatar className="w-10 h-10">
                                      <AvatarImage
                                        src={
                                          comment.userAvatar ||
                                          '/placeholder.svg'
                                        }
                                        alt={comment.userName}
                                      />
                                      <AvatarFallback>
                                        {comment.userName.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-slate-800 text-sm sm:text-base">
                                          {comment.userName}
                                        </span>
                                        <div className="flex">
                                          {renderStars(comment.rating)}
                                        </div>
                                        <span className="text-xs text-slate-500 text-sm sm:text-base">
                                          {new Date(
                                            comment.createdAt
                                          ).toLocaleDateString('fr-FR')}
                                        </span>
                                      </div>
                                      <p className="text-sm text-slate-700 text-sm sm:text-base">
                                        {comment.content}
                                      </p>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-8 text-slate-500">
                                  <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                  <p className="text-sm sm:text-base">
                                    {t('noComments')}
                                  </p>
                                  <p className="text-sm text-sm sm:text-base">
                                    {t('beFirst')}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FolderOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <div className="text-slate-600 text-lg text-sm sm:text-base">
            {t('noProjectFound')}
          </div>
          <p className="text-sm text-slate-500 mt-2 text-sm sm:text-base">
            {t('noProjectFoundDesc')}
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
