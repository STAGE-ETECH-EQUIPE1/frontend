'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Palette, Zap, Settings, Eye, Trash2 } from 'lucide-react'
import {
  useCreateBrandingProjectMutation,
  useGetProjectLogosQuery,
} from '../services/brandingApi'
import React from 'react'
import type { Logo } from '../types/branding'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useMercure } from '@/shared/hooks/useMercure'

export interface GeneratedLogo {
  id: number
  url: string
  name: string
  style: string
  colors: string[]
}

interface LogoGeneratorProps {
  user: {
    id: string
    plan: {
      tokensUsed: number
      maxTokens: number | 'unlimited'
    }
  }
}

export function LogoGenerator({ user }: LogoGeneratorProps) {
  const t = useTranslations('logoGenerator')
  const tIndustries = useTranslations('industries')
  const tStyles = useTranslations('styles')
  const tColors = useTranslations('colors')
  const tCommon = useTranslations('commonBranding')

  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    style: '',
    colors: '',
    description: '',
  })
  const [createProject, { isLoading: isGenerating }] =
    useCreateBrandingProjectMutation()
  const [projectId, setProjectId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [customColors, setCustomColors] = useState<string[]>([])
  const [isCacheLoaded, setIsCacheLoaded] = useState(false)

  const {
    data: logosData,
    isLoading: isLoadingLogos,
    error: logosError,
    refetch: refetchLogos,
  } = useGetProjectLogosQuery(projectId || '', {
    skip: !projectId,
    pollingInterval: projectId ? 3000 : 0,
  })

  const CACHE_EXPIRY_HOURS = 24
  const CACHE_KEY = user.id ? `logo-generator-form-data_${user.id}` : null
  const prevUserIdRef = useRef<string | null>(null)

  const [localGeneratedLogos, setLocalGeneratedLogos] = useState<
    GeneratedLogo[]
  >([])

  useMercure(projectId || '', (data: unknown) => {
    const newLogo = data as Logo
    setLocalGeneratedLogos((prev) => [
      ...prev,
      {
        id: newLogo.id,
        url: newLogo.assertUrl,
        name: `${formData.companyName} - Version ${newLogo.id}`,
        style: formData.style || 'modern',
        colors: customColors.length > 0 ? customColors : [],
      },
    ])
  })

  useEffect(() => {
    if (!user.id) return

    const cacheKey = `logo-generator-form-data_${user.id}`

    // Si on a un utilisateur précédent différent, on supprime son cache
    if (prevUserIdRef.current && prevUserIdRef.current !== user.id) {
      sessionStorage.removeItem(
        `logo-generator-form-data_${prevUserIdRef.current}`
      )
      setFormData({
        companyName: '',
        industry: '',
        style: '',
        colors: '',
        description: '',
      })
      setCustomColors([])
      setProjectId(null)
    }
    prevUserIdRef.current = user.id

    // Charger le cache du nouvel utilisateur
    const cachedData = sessionStorage.getItem(cacheKey)
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData)
        const now = Date.now()
        const cacheAge = (now - parsed.timestamp) / (1000 * 60 * 60)
        if (cacheAge < CACHE_EXPIRY_HOURS) {
          setFormData(parsed.formData)
          setCustomColors(parsed.customColors || [])
          setProjectId(parsed.projectId || null)
        } else {
          sessionStorage.removeItem(cacheKey)
        }
      } catch {
        sessionStorage.removeItem(cacheKey)
      }
    }

    setIsCacheLoaded(true)
  }, [user.id])

  useEffect(() => {
    if (!CACHE_KEY) return
    const loadCachedData = () => {
      try {
        const cachedData = sessionStorage.getItem(CACHE_KEY)
        if (!cachedData) return

        if (cachedData) {
          const parsed = JSON.parse(cachedData)

          const now = new Date().getTime()
          const cacheAge = (now - parsed.timestamp) / (1000 * 60 * 60) // en heures

          if (cacheAge < CACHE_EXPIRY_HOURS) {
            const restoredFormData = {
              companyName: parsed.formData?.companyName || '',
              industry: parsed.formData?.industry || '',
              style: parsed.formData?.style || '',
              colors: parsed.formData?.colors || '',
              description: parsed.formData?.description || '',
            }

            setFormData(restoredFormData)
            setCustomColors(parsed.customColors || [])

            if (parsed.projectId) {
              setProjectId(parsed.projectId)
            }
          } else {
            sessionStorage.removeItem(CACHE_KEY)
          }
        }
      } catch (error) {
        console.error(error)
        sessionStorage.removeItem(CACHE_KEY)
      } finally {
        setIsCacheLoaded(true)
      }
    }

    loadCachedData()
  }, [CACHE_KEY])

  useEffect(() => {
    if (!isCacheLoaded || !CACHE_KEY) {
      return
    }
    const hasData =
      formData.companyName ||
      formData.industry ||
      formData.style ||
      formData.colors ||
      formData.description ||
      customColors.length > 0

    if (!hasData) return

    const saveToCache = () => {
      try {
        const dataToCache = {
          formData,
          customColors,
          projectId,
          timestamp: new Date().getTime(),
        }
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(dataToCache))
      } catch (error) {
        console.error(error)
      }
    }

    const timeoutId = setTimeout(saveToCache, 500)
    return () => clearTimeout(timeoutId)
  }, [formData, customColors, projectId, isCacheLoaded, CACHE_KEY])

  const clearCache = () => {
    if (!CACHE_KEY) return
    try {
      sessionStorage.removeItem(CACHE_KEY)
      setFormData({
        companyName: '',
        industry: '',
        style: '',
        colors: '',
        description: '',
      })
      setCustomColors([])
      setProjectId(null)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (projectId) {
      const initialTimer = setTimeout(() => {
        refetchLogos()
      }, 2000)

      return () => clearTimeout(initialTimer)
    }
  }, [projectId, refetchLogos, logosData, isLoadingLogos, logosError])

  const industries = [
    { key: 'technology', value: tIndustries('technology') },
    { key: 'health', value: tIndustries('health') },
    { key: 'finance', value: tIndustries('finance') },
    { key: 'education', value: tIndustries('education') },
    { key: 'commerce', value: tIndustries('commerce') },
    { key: 'restaurant', value: tIndustries('restaurant') },
    { key: 'fashion', value: tIndustries('fashion') },
    { key: 'sport', value: tIndustries('sport') },
    { key: 'realEstate', value: tIndustries('realEstate') },
    { key: 'other', value: tIndustries('other') },
  ]

  const styles = [
    { key: 'modern', value: tStyles('modern') },
    { key: 'minimalist', value: tStyles('minimalist') },
    { key: 'vintage', value: tStyles('vintage') },
    { key: 'professional', value: tStyles('professional') },
    { key: 'creative', value: tStyles('creative') },
    { key: 'elegant', value: tStyles('elegant') },
    { key: 'dynamic', value: tStyles('dynamic') },
    { key: 'classic', value: tStyles('classic') },
  ]

  const colorSchemes = [
    {
      key: 'blueWhite',
      name: tColors('blueWhite'),
      colors: ['#3B82F6', '#FFFFFF', '#1E40AF'],
    },
    {
      key: 'redBlack',
      name: tColors('redBlack'),
      colors: ['#EF4444', '#000000', '#DC2626'],
    },
    {
      key: 'greenWhite',
      name: tColors('greenWhite'),
      colors: ['#10B981', '#FFFFFF', '#059669'],
    },
    {
      key: 'purplePink',
      name: tColors('purplePink'),
      colors: ['#8B5CF6', '#EC4899', '#7C3AED'],
    },
    {
      key: 'blackWhite',
      name: tColors('blackWhite'),
      colors: ['#000000', '#FFFFFF', '#6B7280'],
    },
    {
      key: 'orangeBlue',
      name: tColors('orangeBlue'),
      colors: ['#F97316', '#3B82F6', '#EA580C'],
    },
  ]

  const handleGenerate = async () => {
    if (!formData.companyName) return

    setErrorMessage(null)
    setProjectId(null)

    try {
      const selectedColorScheme =
        formData.colors === tColors('custom')
          ? customColors
          : colorSchemes.find((scheme) => scheme.name === formData.colors)
              ?.colors || []

      const payload = {
        description:
          formData.description ||
          t('defaultDescription', {
            companyName: formData.companyName,
            industry: formData.industry,
          }),
        slogan: formData.companyName,
        logoStyle: formData.style || 'modern',
        colorPreferences: selectedColorScheme,
        brandKeywords: [
          formData.industry,
          formData.style,
          formData.companyName,
        ].filter(Boolean),
      }

      const result = await createProject(payload).unwrap()
      console.log('Project creation result:', result)

      let projectIdFromResponse = ''

      if (result?.projectId) {
        projectIdFromResponse = result.projectId.toString()
      } else if (result?.id) {
        projectIdFromResponse = result.id.toString()
      } else {
        throw new Error('Project ID not found in response')
      }

      setProjectId(projectIdFromResponse)

      localStorage.setItem(
        `project_${projectIdFromResponse}`,
        JSON.stringify({
          ...payload,
          createdAt: new Date().toISOString(),
          backendResponse: result,
        })
      )
    } catch (error: unknown) {
      console.error('Error generating logos:', error)
      if (
        typeof error === 'object' &&
        error !== null &&
        ('status' in error || 'data' in error)
      ) {
        const err = error as { status?: number; data?: { message?: string } }
        if (
          err.status === 429 ||
          err.data?.message?.includes('quota') ||
          err.data?.message?.includes('RESOURCE_EXHAUSTED')
        ) {
          setErrorMessage(t('errors.quotaExceeded'))
        } else if (err.status === 500) {
          setErrorMessage(t('errors.serverError'))
        } else {
          setErrorMessage(t('errors.generalError'))
        }
      } else {
        setErrorMessage(t('errors.generalError'))
      }
    }
  }

  const generatedLogos = React.useMemo(() => {
    if (!logosData?.data || !Array.isArray(logosData.data)) {
      return localGeneratedLogos
    }

    return logosData.data.map((logo: Logo) => {
      let logoUrl = logo.assertUrl

      if (logoUrl) {
        if (logoUrl.startsWith('public/')) {
          logoUrl = logoUrl.replace('public/', '')
        }

        if (!logoUrl.startsWith('http')) {
          const baseUrl =
            process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ||
            'http://localhost:8000'
          logoUrl = logoUrl.startsWith('/')
            ? `${baseUrl}${logoUrl}`
            : `${baseUrl}/${logoUrl}`
        }
      }

      return {
        id: logo.id,
        url: logoUrl,
        name: `${formData.companyName} - Version ${logo.id}`,
        style: formData.style || 'modern',
        colors: customColors.length > 0 ? customColors : [],
      }
    })
  }, [
    logosData,
    formData.companyName,
    formData.style,
    customColors,
    localGeneratedLogos,
  ])

  const tokensUsed = user.plan.tokensUsed
  const maxTokens = user.plan.maxTokens
  const canGenerate =
    maxTokens === 'unlimited' || tokensUsed < (maxTokens as number)

  const getSelectedColors = () => {
    if (formData.colors === tColors('custom')) {
      return customColors
    }
    const selectedScheme = colorSchemes.find(
      (scheme) => scheme.name === formData.colors
    )
    return selectedScheme?.colors || []
  }

  const renderPreviewContent = () => {
    if (
      !formData.companyName &&
      !formData.industry &&
      !formData.style &&
      !formData.colors
    ) {
      return (
        <div className="text-center py-12">
          <Eye className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-slate-500 mb-2">{t('preview.emptyState.title')}</p>
          <p className="text-sm text-slate-400">
            {t('preview.emptyState.subtitle')}
          </p>
        </div>
      )
    }

    const selectedColors = getSelectedColors()

    return (
      <div className="space-y-6">
        {/* Aperçu du nom de l'entreprise */}
        {formData.companyName && (
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
              <div className="text-center">
                <div className="text-lg font-bold text-slate-700 mb-1">
                  {formData.companyName}
                </div>
                <div className="text-xs text-slate-500">
                  {t('preview.preview')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Informations de configuration */}
        <div className="space-y-3">
          {formData.companyName && (
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-700">
                {t('form.companyName')}:
              </span>
              <span className="text-sm text-blue-600">
                {formData.companyName}
              </span>
            </div>
          )}

          {formData.industry && (
            <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-700">
                {t('form.industry')}:
              </span>
              <span className="text-sm text-green-600">
                {formData.industry}
              </span>
            </div>
          )}

          {formData.style && (
            <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium text-purple-700">
                {t('form.style')}:
              </span>
              <span className="text-sm text-purple-600">{formData.style}</span>
            </div>
          )}

          {selectedColors.length > 0 && (
            <div className="p-2 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-orange-700">
                  {t('form.colors')}:
                </span>
              </div>
              <div className="flex items-center gap-2">
                {selectedColors.map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {formData.description && (
            <div className="p-2 bg-slate-50 rounded-lg">
              <span className="text-sm font-medium text-slate-700 block mb-1">
                {t('form.description')}:
              </span>
              <p className="text-sm text-slate-600 leading-relaxed">
                {formData.description}
              </p>
            </div>
          )}
        </div>
      </div>
    )
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
            {t('title')}
          </h2>
          <p className="text-slate-600">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-gradient-to-r from-blue-100 to-slate-100 text-blue-700 border-blue-200">
            <Zap className="w-3 h-3 mr-1" />
            {tokensUsed}/{maxTokens === 'unlimited' ? '∞' : maxTokens}{' '}
            {tCommon('tokens')}
          </Badge>
          <Button
            onClick={clearCache}
            variant="outline"
            size="sm"
            className="text-slate-600 border-slate-300 hover:bg-slate-50 bg-transparent"
            title={t('actions.clearCache')}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Generation Form */}
        <div className="lg:col-span-1">
          <Card className="bg-white border-blue-200/50 shadow-lg p-4 sm:p-6 h-full">
            <CardHeader>
              <CardTitle className="text-blue-600 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                {t('form.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="companyName" className="text-slate-700">
                  {t('form.companyName')} *
                </Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  placeholder={t('form.companyNamePlaceholder')}
                  className="bg-slate-50 border-slate-200"
                />
              </div>

              <div>
                <Label htmlFor="industry" className="text-slate-700">
                  {t('form.industry')}
                </Label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) =>
                    setFormData({ ...formData, industry: value })
                  }
                >
                  <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue placeholder={t('form.industryPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    {industries.map((industry) => (
                      <SelectItem key={industry.key} value={industry.value}>
                        {industry.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="style" className="text-slate-700">
                  {t('form.style')}
                </Label>
                <Select
                  value={formData.style}
                  onValueChange={(value) =>
                    setFormData({ ...formData, style: value })
                  }
                >
                  <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue placeholder={t('form.stylePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    {styles.map((style) => (
                      <SelectItem key={style.key} value={style.value}>
                        {style.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="colors" className="text-slate-700 mb-3 block">
                  {t('form.colorPalette')}
                </Label>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {colorSchemes.map((scheme) => (
                      <div
                        key={scheme.key}
                        onClick={() =>
                          setFormData({ ...formData, colors: scheme.name })
                        }
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${
                          formData.colors === scheme.name
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {scheme.colors.map((color, index) => (
                              <div
                                key={index}
                                className="w-4 h-4 rounded-full border border-white -ml-1 first:ml-0"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium text-slate-700 truncate">
                            {scheme.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-slate-700">
                  {t('form.description')}
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder={t('form.descriptionPlaceholder')}
                  className="bg-slate-50 border-slate-200"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!canGenerate || isGenerating}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full"
              >
                {isGenerating
                  ? t('actions.generating')
                  : t('actions.generateLogos')}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="bg-white border-blue-200/50 shadow-lg p-4 sm:p-6 h-full">
            <CardHeader>
              <CardTitle className="text-blue-600 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                {generatedLogos.length > 0 || projectId
                  ? t('results.title')
                  : t('preview.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!projectId && generatedLogos.length === 0 ? (
                // Aperçu des paramètres avant génération
                renderPreviewContent()
              ) : (
                // ... existing code for generated logos ...
                <>
                  {projectId && (
                    <div className="text-xs text-slate-500 mb-2 space-y-1">
                      <div>Project ID: {projectId}</div>
                    </div>
                  )}

                  {isGenerating && (
                    <div className="text-center py-4">
                      <Progress value={33} className="mb-2" />
                      <p className="text-sm text-slate-600">
                        {t('status.creatingProject')}
                      </p>
                    </div>
                  )}

                  {projectId &&
                    isLoadingLogos &&
                    generatedLogos.length === 0 && (
                      <div className="text-center py-4">
                        <Progress value={66} className="mb-2" />
                        <p className="text-sm text-slate-600">
                          {t('status.generatingLogos')}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {t('status.generatingTime')}
                        </p>
                      </div>
                    )}

                  {logosError && (
                    <div className="text-center py-4">
                      <div className="text-red-600 mb-2">
                        {t('errors.loadingLogos')}
                      </div>
                      <div className="text-xs text-red-500 mb-2">
                        {JSON.stringify(logosError, null, 2)}
                      </div>
                      <Button
                        onClick={() => refetchLogos()}
                        variant="outline"
                        size="sm"
                        className="mt-2 text-blue-600 border-blue-600 hover:bg-blue-50"
                      >
                        {tCommon('retry')}
                      </Button>
                    </div>
                  )}

                  {errorMessage && (
                    <div className="text-red-600 p-3 bg-red-50 rounded-lg border border-red-200">
                      {errorMessage}
                    </div>
                  )}

                  {generatedLogos.length > 0 ? (
                    <div className="space-y-4">
                      <div className="text-sm text-green-600 font-medium">
                        ✓{' '}
                        {t('results.logosGenerated', {
                          count: generatedLogos.length,
                        })}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {generatedLogos.map((logo) => (
                          <div
                            key={logo.id}
                            className="flex flex-col items-center p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
                          >
                            <div className="w-32 h-32 flex items-center justify-center bg-slate-50 rounded-lg mb-2 relative">
                              <Image
                                src={logo.url || '/placeholder.svg'}
                                alt={logo.name}
                                width={128}
                                height={128}
                                className="max-w-full max-h-full object-contain rounded"
                                onError={(e) => {
                                  console.error(
                                    'Failed to load logo:',
                                    logo.url
                                  )
                                  const target = e.target as HTMLImageElement
                                  const svgFallback = `data:image/svg+xml;base64,${btoa(`
                                    <svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <rect width="128" height="128" fill="#f1f5f9"/>
                                      <rect x="20" y="20" width="88" height="88" rx="8" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2"/>
                                      <circle cx="45" cy="45" r="8" fill="#94a3b8"/>
                                      <path d="M25 85 L45 65 L65 85 L85 65 L103 85 L103 100 L25 100 Z" fill="#94a3b8"/>
                                      <text x="64" y="115" textAnchor="middle" fill="#64748b" fontFamily="Arial" fontSize="10">Logo #${logo.id}</text>
                                    </svg>
                                  `)}`
                                  target.src = svgFallback
                                  target.style.opacity = '0.7'
                                }}
                                onLoad={() =>
                                  console.log(
                                    'Logo loaded successfully:',
                                    logo.url
                                  )
                                }
                              />
                              <div
                                className="absolute inset-0 flex items-center justify-center bg-slate-100 rounded opacity-0 transition-opacity duration-200"
                                style={{ display: 'none' }}
                              >
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                              </div>
                            </div>
                            <span className="text-sm font-medium text-slate-700 text-center truncate w-full">
                              {logo.name}
                            </span>
                            {logo.colors.length > 0 && (
                              <div className="flex items-center gap-1 mt-2">
                                {logo.colors.map((color, index) => (
                                  <div
                                    key={index}
                                    className="w-4 h-4 rounded-full border border-slate-300"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                  />
                                ))}
                              </div>
                            )}
                            <div className="flex gap-2 mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs bg-transparent"
                                onClick={() => {
                                  try {
                                    const link = document.createElement('a')
                                    link.href = logo.url
                                    link.download = `${formData.companyName || 'logo'}-${logo.id}.png`
                                    link.target = '_blank'
                                    link.click()
                                  } catch (error) {
                                    console.error('Download failed:', error)
                                    window.open(logo.url, '_blank')
                                  }
                                }}
                              >
                                {tCommon('download')}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs bg-transparent"
                                onClick={() => {
                                  navigator.clipboard
                                    .writeText(logo.url)
                                    .then(() => {
                                      console.log('URL copied to clipboard')
                                    })
                                    .catch(() => {
                                      console.log('Failed to copy URL')
                                    })
                                }}
                              >
                                {tCommon('copyUrl')}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    projectId &&
                    !isGenerating && (
                      <div className="text-center py-8">
                        {logosData?.data?.length === 0 ? (
                          <div className="space-y-3">
                            <div className="animate-pulse">
                              <Palette className="w-12 h-12 mx-auto mb-3 text-blue-400" />
                            </div>
                            <div className="space-y-2">
                              <p className="text-blue-600 font-medium">
                                🎨 {t('status.generationInProgress')}
                              </p>
                              <p className="text-sm text-slate-500">
                                {t('status.generationInProgressDetails', {
                                  projectId,
                                })}
                              </p>
                              <p className="text-xs text-slate-400">
                                {t('status.generationTime')}
                              </p>
                            </div>

                            <div className="mt-4">
                              <Progress value={75} className="mb-2" />
                              <p className="text-xs text-slate-500">
                                {t('status.aiProcessing')}
                              </p>
                            </div>

                            <div className="flex gap-2 justify-center mt-3">
                              <Button
                                onClick={async () => {
                                  console.log(
                                    'Manual refetch triggered for project:',
                                    projectId
                                  )
                                  try {
                                    const result = await refetchLogos()
                                    console.log(
                                      'Manual refetch result:',
                                      result
                                    )
                                    if (
                                      Array.isArray(result.data?.data) &&
                                      result.data.data.length === 0
                                    ) {
                                      console.log(
                                        'Still no logos after manual refetch'
                                      )
                                      setTimeout(() => {
                                        console.log('Second refetch attempt')
                                        refetchLogos()
                                      }, 2000)
                                    }
                                  } catch (error) {
                                    console.error(
                                      'Manual refetch error:',
                                      error
                                    )
                                  }
                                }}
                                variant="outline"
                                size="sm"
                                className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                disabled={isLoadingLogos}
                              >
                                {isLoadingLogos
                                  ? t('actions.checking')
                                  : t('actions.checkNow')}
                              </Button>

                              <Button
                                onClick={() => {
                                  console.log(
                                    'Force refresh - clearing cache and refetching'
                                  )
                                  refetchLogos()
                                  setTimeout(() => refetchLogos(), 1000)
                                  setTimeout(() => refetchLogos(), 3000)
                                }}
                                variant="outline"
                                size="sm"
                                className="text-orange-600 border-orange-600 hover:bg-orange-50"
                              >
                                {t('actions.forceRefresh')}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <Palette className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p className="text-slate-500">
                              {t('results.noLogos')}
                            </p>
                            <Button
                              onClick={() => refetchLogos()}
                              variant="outline"
                              size="sm"
                              className="mt-2 text-blue-600 border-blue-600 hover:bg-blue-50"
                            >
                              {tCommon('refresh')}
                            </Button>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
