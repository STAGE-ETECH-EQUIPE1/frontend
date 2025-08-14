'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  History,
  Search,
  Filter,
  MoreHorizontal,
  RefreshCw,
  Calendar,
  Clock,
  Palette,
  Download,
  Heart,
  Eye,
  Trash2,
  Copy,
  Wand2,
  TrendingUp,
  BarChart3,
} from 'lucide-react'

interface GenerationRecord {
  id: string
  timestamp: string
  companyName: string
  industry: string
  style: string
  colors: string[]
  colorSchemeName: string
  description?: string
  generatedLogos: {
    id: string
    url: string
    downloaded: boolean
    favorited: boolean
  }[]
  tokensUsed: number
  status: 'completed' | 'failed' | 'in-progress'
  duration: number // en secondes
}

const mockGenerationHistory: GenerationRecord[] = [
  {
    id: 'gen-1',
    timestamp: '2024-01-30T14:30:00Z',
    companyName: 'TechCorp',
    industry: 'Technologie',
    style: 'Moderne',
    colors: ['#3B82F6', '#FFFFFF', '#1E40AF'],
    colorSchemeName: 'Bleu et Blanc',
    description: 'Logo pour une startup tech innovante',
    generatedLogos: [
      {
        id: 'logo-1',
        url: '/placeholder.svg?height=200&width=200&text=TechCorp1',
        downloaded: true,
        favorited: true,
      },
      {
        id: 'logo-2',
        url: '/placeholder.svg?height=200&width=200&text=TechCorp2',
        downloaded: false,
        favorited: false,
      },
      {
        id: 'logo-3',
        url: '/placeholder.svg?height=200&width=200&text=TechCorp3',
        downloaded: true,
        favorited: false,
      },
      {
        id: 'logo-4',
        url: '/placeholder.svg?height=200&width=200&text=TechCorp4',
        downloaded: false,
        favorited: true,
      },
    ],
    tokensUsed: 3,
    status: 'completed',
    duration: 45,
  },
  {
    id: 'gen-2',
    timestamp: '2024-01-29T16:15:00Z',
    companyName: 'Restaurant Saveurs',
    industry: 'Restaurant',
    style: 'Élégant',
    colors: ['#10B981', '#FFFFFF', '#059669'],
    colorSchemeName: 'Vert et Blanc',
    generatedLogos: [
      {
        id: 'logo-5',
        url: '/placeholder.svg?height=200&width=200&text=Saveurs1',
        downloaded: true,
        favorited: false,
      },
      {
        id: 'logo-6',
        url: '/placeholder.svg?height=200&width=200&text=Saveurs2',
        downloaded: false,
        favorited: true,
      },
      {
        id: 'logo-7',
        url: '/placeholder.svg?height=200&width=200&text=Saveurs3',
        downloaded: false,
        favorited: false,
      },
      {
        id: 'logo-8',
        url: '/placeholder.svg?height=200&width=200&text=Saveurs4',
        downloaded: true,
        favorited: false,
      },
    ],
    tokensUsed: 3,
    status: 'completed',
    duration: 38,
  },
  {
    id: 'gen-3',
    timestamp: '2024-01-28T10:45:00Z',
    companyName: 'Fitness Pro',
    industry: 'Sport',
    style: 'Dynamique',
    colors: ['#EF4444', '#000000', '#DC2626'],
    colorSchemeName: 'Rouge et Noir',
    description: 'Logo énergique pour salle de sport',
    generatedLogos: [
      {
        id: 'logo-9',
        url: '/placeholder.svg?height=200&width=200&text=FitnessPro1',
        downloaded: true,
        favorited: true,
      },
      {
        id: 'logo-10',
        url: '/placeholder.svg?height=200&width=200&text=FitnessPro2',
        downloaded: false,
        favorited: false,
      },
      {
        id: 'logo-11',
        url: '/placeholder.svg?height=200&width=200&text=FitnessPro3',
        downloaded: true,
        favorited: true,
      },
      {
        id: 'logo-12',
        url: '/placeholder.svg?height=200&width=200&text=FitnessPro4',
        downloaded: false,
        favorited: false,
      },
    ],
    tokensUsed: 3,
    status: 'completed',
    duration: 52,
  },
  {
    id: 'gen-4',
    timestamp: '2024-01-27T09:20:00Z',
    companyName: 'EcoVert',
    industry: 'Environnement',
    style: 'Minimaliste',
    colors: ['#10B981', '#FFFFFF'],
    colorSchemeName: 'Personnalisé',
    generatedLogos: [
      {
        id: 'logo-13',
        url: '/placeholder.svg?height=200&width=200&text=EcoVert1',
        downloaded: false,
        favorited: false,
      },
      {
        id: 'logo-14',
        url: '/placeholder.svg?height=200&width=200&text=EcoVert2',
        downloaded: true,
        favorited: false,
      },
    ],
    tokensUsed: 2,
    status: 'failed',
    duration: 15,
  },
]

export function GenerationHistory() {
  const t = useTranslations('generationHistory')
  const tCommon = useTranslations('common')
  const [history, setHistory] = useState<GenerationRecord[]>(
    mockGenerationHistory
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPeriod, setFilterPeriod] = useState<string>('all')
  const [selectedGeneration, setSelectedGeneration] =
    useState<GenerationRecord | null>(null)

  const filteredHistory = history.filter((record) => {
    const matchesSearch =
      record.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.style.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      filterStatus === 'all' || record.status === filterStatus

    let matchesPeriod = true
    if (filterPeriod !== 'all') {
      const recordDate = new Date(record.timestamp)
      const now = new Date()
      const daysDiff = Math.floor(
        (now.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      switch (filterPeriod) {
        case 'today':
          matchesPeriod = daysDiff === 0
          break
        case 'week':
          matchesPeriod = daysDiff <= 7
          break
        case 'month':
          matchesPeriod = daysDiff <= 30
          break
      }
    }

    return matchesSearch && matchesStatus && matchesPeriod
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'failed':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    return t(`status.${status}`)
  }

  const regenerateWithSameParams = (record: GenerationRecord) => {
    console.log('Régénération avec les paramètres:', record)
    // Ici, vous pourriez appeler votre fonction de génération avec les mêmes paramètres
  }

  const copyParameters = (record: GenerationRecord) => {
    const params = {
      companyName: record.companyName,
      industry: record.industry,
      style: record.style,
      colors: record.colorSchemeName,
      description: record.description || '',
    }
    navigator.clipboard.writeText(JSON.stringify(params, null, 2))
  }

  // Statistiques
  const totalGenerations = history.length
  const successfulGenerations = history.filter(
    (r) => r.status === 'completed'
  ).length
  const totalTokensUsed = history.reduce(
    (sum, record) => sum + record.tokensUsed,
    0
  )
  const averageDuration = Math.round(
    history
      .filter((r) => r.status === 'completed')
      .reduce((sum, record) => sum + record.duration, 0) / successfulGenerations
  )

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
            {t('title')}
          </h2>
          <p className="text-slate-600">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            <History className="w-3 h-3 mr-1" />
            {filteredHistory.length}{' '}
            {filteredHistory.length > 1 ? t('generations') : t('generation')}
          </Badge>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: t('totalGenerations'),
            value: totalGenerations,
            icon: BarChart3,
            color: 'text-blue-500',
            bg: 'bg-blue-50',
          },
          {
            label: t('successful'),
            value: successfulGenerations,
            icon: TrendingUp,
            color: 'text-green-500',
            bg: 'bg-green-50',
          },
          {
            label: t('tokensUsed'),
            value: totalTokensUsed,
            icon: Palette,
            color: 'text-purple-500',
            bg: 'bg-purple-50',
          },
          {
            label: t('averageDuration'),
            value: `${averageDuration}s`,
            icon: Clock,
            color: 'text-orange-500',
            bg: 'bg-orange-50',
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}
                  >
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                    <p className={`text-xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filtres */}
      <Card className="bg-white border-blue-200/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-blue-600 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            {t('filters')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-50 border-slate-200"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48 bg-slate-50 border-slate-200">
                <SelectValue placeholder={t('allStatuses')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allStatuses')}</SelectItem>
                <SelectItem value="completed">{t('completed')}</SelectItem>
                <SelectItem value="failed">{t('failed')}</SelectItem>
                <SelectItem value="in-progress">{t('inProgress')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPeriod} onValueChange={setFilterPeriod}>
              <SelectTrigger className="w-48 bg-slate-50 border-slate-200">
                <SelectValue placeholder={t('allPeriods')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allPeriods')}</SelectItem>
                <SelectItem value="today">{t('today')}</SelectItem>
                <SelectItem value="week">{t('thisWeek')}</SelectItem>
                <SelectItem value="month">{t('thisMonth')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des générations */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredHistory.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
            >
              <Card className="bg-white border-slate-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-800">
                          {record.companyName}
                        </h3>
                        <Badge className={getStatusColor(record.status)}>
                          {getStatusText(record.status)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {record.tokensUsed}{' '}
                          {record.tokensUsed > 1 ? 'tokens' : 'token'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(record.timestamp).toLocaleDateString(
                            'fr-FR',
                            {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            }
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(record.timestamp).toLocaleTimeString(
                            'fr-FR',
                            {
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </span>
                        {record.status === 'completed' && (
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            {record.duration}s
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline">{record.industry}</Badge>
                        <Badge variant="outline">{record.style}</Badge>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-slate-600">
                            {record.colorSchemeName}:
                          </span>
                          <div className="flex">
                            {record.colors.slice(0, 3).map((color, index) => (
                              <div
                                key={index}
                                className="w-4 h-4 rounded-full border border-white -ml-1 first:ml-0"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      {record.description && (
                        <p className="text-sm text-slate-600 italic">
                          {record.description}
                        </p>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => regenerateWithSameParams(record)}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          {tCommon('regenerate')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => copyParameters(record)}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          {t('copyParameters')}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          {tCommon('delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Logos générés */}
                  {record.status === 'completed' &&
                    record.generatedLogos.length > 0 && (
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-slate-800">
                            {t('logosGenerated')} (
                            {record.generatedLogos.length})
                          </h4>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedGeneration(record)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                {t('viewAll')}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle className="text-blue-600">
                                  {t('logosGenerated')} - {record.companyName}
                                </DialogTitle>
                                <DialogDescription>
                                  {t('generatedOn')}{' '}
                                  {new Date(
                                    record.timestamp
                                  ).toLocaleDateString('fr-FR')}
                                </DialogDescription>
                              </DialogHeader>
                              {selectedGeneration && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  {selectedGeneration.generatedLogos.map(
                                    (logo) => (
                                      <div
                                        key={logo.id}
                                        className="group relative"
                                      >
                                        <div className="aspect-square bg-slate-50 rounded-lg p-4 mb-2">
                                          <img
                                            src={logo.url || '/placeholder.svg'}
                                            alt={`Logo ${logo.id}`}
                                            className="w-full h-full object-contain"
                                          />
                                        </div>
                                        <div className="flex items-center justify-center gap-2">
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className={
                                              logo.favorited
                                                ? 'text-red-500'
                                                : ''
                                            }
                                          >
                                            <Heart
                                              className={`w-4 h-4 ${logo.favorited ? 'fill-red-500' : ''}`}
                                            />
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className={
                                              logo.downloaded
                                                ? 'text-green-500'
                                                : ''
                                            }
                                          >
                                            <Download className="w-4 h-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {record.generatedLogos.slice(0, 4).map((logo) => (
                            <div key={logo.id} className="group relative">
                              <div className="aspect-square bg-slate-50 rounded-lg p-2">
                                <img
                                  src={logo.url || '/placeholder.svg'}
                                  alt={`Logo ${logo.id}`}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="absolute top-1 right-1 flex gap-1">
                                {logo.favorited && (
                                  <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                    <Heart className="w-2 h-2 text-white fill-white" />
                                  </div>
                                )}
                                {logo.downloaded && (
                                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                    <Download className="w-2 h-2 text-white" />
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Actions rapides */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      {record.status === 'completed' && (
                        <>
                          <span className="text-sm text-slate-600">
                            {
                              record.generatedLogos.filter((l) => l.downloaded)
                                .length
                            }{' '}
                            {t('downloaded')}
                            {record.generatedLogos.filter((l) => l.downloaded)
                              .length > 1
                              ? 's'
                              : ''}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-sm text-slate-600">
                            {
                              record.generatedLogos.filter((l) => l.favorited)
                                .length
                            }{' '}
                            {t('favorited')}
                            {record.generatedLogos.filter((l) => l.favorited)
                              .length > 1
                              ? 's'
                              : ''}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => regenerateWithSameParams(record)}
                        disabled={record.status !== 'completed'}
                      >
                        <Wand2 className="w-4 h-4 mr-2" />
                        {tCommon('regenerate')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredHistory.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <History className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <div className="text-slate-600 text-lg">{t('noGenerationFound')}</div>
          <p className="text-sm text-slate-500 mt-2">
            {t('noGenerationFoundDesc')}
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
