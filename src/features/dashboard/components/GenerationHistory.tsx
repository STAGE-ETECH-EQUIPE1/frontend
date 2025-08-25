'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useMediaQuery } from 'usehooks-ts'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  History,
  Search,
  Filter,
  Calendar,
  Eye,
  Loader2,
  ImageIcon,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import {
  useGetBrandingProjectsQuery,
  useGetProjectLogosQuery,
} from '../services/brandingApi'
import type {
  BrandingProject,
  Logo as BrandingLogo,
  ProjectLogosResponse,
} from '../types/branding'
import Image from 'next/image'

function ProjectLogos({ projectId }: { projectId: number }) {
  const [start, setStart] = useState(0)

  const {
    data: logosResp,
    isLoading,
    error,
  } = useGetProjectLogosQuery(String(projectId))

  const logos: BrandingLogo[] = Array.isArray(
    (logosResp as ProjectLogosResponse)?.data
  )
    ? (logosResp as ProjectLogosResponse).data
    : []

  const isSm = useMediaQuery('(max-width: 640px)')
  const isMd = useMediaQuery('(max-width: 1024px)')

  const VISIBLE = isSm ? 1 : isMd ? 2 : 4

  const total = logos.length
  const visible = Array.from(
    { length: Math.min(VISIBLE, total) },
    (_, i) => logos[(start + i) % total]
  )

  const prev = () => setStart((s) => (s - 1 + total) % total)
  const next = () => setStart((s) => (s + 1) % total)

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-xs text-slate-400">Chargement...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-xs text-slate-400 italic">Erreur de chargement</div>
    )
  }

  if (logos.length === 0) {
    return (
      <div className="text-xs text-slate-400 italic">Aucun logo généré</div>
    )
  }

  const getImageUrl = (
    logo: BrandingLogo &
      Partial<
        Record<
          | 'imageUrl'
          | 'image_url'
          | 'logoUrl'
          | 'image'
          | 'file_path'
          | 'path'
          | 'assertUrl',
          string
        >
      >
  ) => {
    const rawUrl =
      logo.imageUrl ||
      logo.image_url ||
      logo.assertUrl ||
      logo.logoUrl ||
      logo.image ||
      logo.file_path ||
      logo.path

    if (!rawUrl) {
      return null
    }

    if (rawUrl.startsWith('http')) {
      return rawUrl
    }

    const apiBase = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '')
    if (apiBase) {
      try {
        const api = new URL(apiBase)
        const origin = `${api.protocol}//${api.host}`
        const withLeadingSlash = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`
        const publicIdx = withLeadingSlash.indexOf('/public/')
        if (publicIdx !== -1) {
          const withoutPublic = withLeadingSlash.replace(/^\/public\//, '/')
          return `${origin}${withoutPublic}`
        }
        if (withLeadingSlash.startsWith('/api/')) {
          return `${origin}${withLeadingSlash}`
        }
        return `${apiBase}${withLeadingSlash}`
      } catch {
        return null
      }
    }
    return rawUrl
  }

  return (
    <div className="relative w-full">
      {total > VISIBLE && (
        <>
          <Button
            size="icon"
            variant="secondary"
            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full shadow z-10"
            onClick={prev}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full shadow z-10"
            onClick={next}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </>
      )}

      {/* Logos */}
      <div className="flex gap-3 overflow-hidden justify-center px-10">
        {visible.map((logo: BrandingLogo) => {
          const imageUrl = getImageUrl(logo)

          return (
            <div
              key={logo.id}
              className="relative group cursor-pointer flex-shrink-0"
              title={`Logo ${logo.id}`}
            >
              <a
                href={imageUrl || undefined}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={imageUrl || '/placeholder.svg'}
                  alt={`Logo ${logo.id}`}
                  width={128}
                  height={128}
                  unoptimized
                  className="w-32 h-32 rounded-2xl border border-slate-200 object-cover hover:border-blue-300 transition-colors"
                  loading="lazy"
                />
              </a>
              <a
                href={imageUrl || undefined}
                download
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Télécharger"
              >
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full shadow"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </a>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function GenerationHistory() {
  const { data: projectsRaw, isLoading } = useGetBrandingProjectsQuery()
  const projects: BrandingProject[] = Array.isArray(projectsRaw)
    ? projectsRaw
    : ((projectsRaw as unknown as { data?: BrandingProject[] })?.data ?? [])

  const [selectedProject, setSelectedProject] =
    useState<BrandingProject | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase()
    return (
      (p.description || '').toLowerCase().includes(q) ||
      (p.slogan || '').toLowerCase().includes(q) ||
      (p.id ? String(p.id) : '').toLowerCase().includes(q)
    )
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

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
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">
            Projets de Branding
          </h2>
          <p className="text-slate-600">
            Gérez tous vos projets et leurs logos
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            <History className="w-3 h-3 mr-1" />
            {filteredProjects.length} projets
          </Badge>
        </div>
      </div>

      {/* Filtres */}
      <Card className="bg-white border-blue-200/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-blue-600 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Rechercher par description, slogan ou ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-50 border-slate-200"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-slate-600">Chargement...</span>
        </div>
      )}

      {!isLoading && (
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence>
            {filteredProjects.map((project, index) => {
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                >
                  <Card className="bg-white border-slate-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_1fr] md:items-start md:gap-8">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-slate-700">
                              Projet #{project.id}
                            </span>
                          </div>

                          <div className="text-sm text-slate-600">
                            <p className="line-clamp-3">
                              {project.description}
                            </p>
                          </div>

                          <div className="text-xs text-slate-500 space-y-2">
                            {project.createdAt && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Créé: {formatDate(project.createdAt)}
                              </div>
                            )}
                          </div>

                          <div className="pt-4 border-t">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedProject(project)
                                setIsDialogOpen(true)
                              }}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Voir détails
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2 md:justify-self-end w-full">
                          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                            <ImageIcon className="w-4 h-4" />
                            Logos
                          </div>
                          <ProjectLogos projectId={Number(project.id)} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {!isLoading && filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <History className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <div className="text-slate-600 text-lg">Aucun projet trouvé</div>
          <p className="text-sm text-slate-500 mt-2">
            Créez votre premier projet de branding pour commencer
          </p>
        </motion.div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-blue-600">
              Projet #{selectedProject?.id}
            </DialogTitle>
            <DialogDescription>
              {selectedProject?.createdAt &&
                formatDate(selectedProject.createdAt)}
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-slate-600">{selectedProject.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
