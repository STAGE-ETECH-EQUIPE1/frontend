'use client'

import { useState } from 'react'
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
import {
  Palette,
  Wand2,
  Download,
  Heart,
  RefreshCw,
  Sparkles,
  Zap,
  Settings,
} from 'lucide-react'
import { ColorPicker } from './ColorPicker'

interface LogoGeneratorProps {
  user: {
    plan: {
      tokensUsed: number
      maxTokens: number | 'unlimited'
    }
  }
}

export function LogoGenerator({ user }: LogoGeneratorProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    style: '',
    colors: '',
    description: '',
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedLogos, setGeneratedLogos] = useState<any[]>([])
  const [generationProgress, setGenerationProgress] = useState(0)
  const [customColors, setCustomColors] = useState<string[]>([])

  const industries = [
    'Technologie',
    'Santé',
    'Finance',
    'Éducation',
    'Commerce',
    'Restaurant',
    'Mode',
    'Sport',
    'Immobilier',
    'Autre',
  ]

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

  const colorSchemes = [
    {
      name: 'Bleu et Blanc',
      colors: ['#3B82F6', '#FFFFFF', '#1E40AF'],
    },
    {
      name: 'Rouge et Noir',
      colors: ['#EF4444', '#000000', '#DC2626'],
    },
    {
      name: 'Vert et Blanc',
      colors: ['#10B981', '#FFFFFF', '#059669'],
    },
    {
      name: 'Violet et Rose',
      colors: ['#8B5CF6', '#EC4899', '#7C3AED'],
    },
    {
      name: 'Noir et Blanc',
      colors: ['#000000', '#FFFFFF', '#6B7280'],
    },
    {
      name: 'Orange et Bleu',
      colors: ['#F97316', '#3B82F6', '#EA580C'],
    },
  ]

  const handleGenerate = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)

    // Simulation de génération avec les couleurs
    const selectedColorScheme =
      formData.colors === 'Personnalisé'
        ? { name: 'Personnalisé', colors: customColors }
        : colorSchemes.find((scheme) => scheme.name === formData.colors)

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsGenerating(false)
          // Simuler des logos générés avec les couleurs
          setGeneratedLogos([
            {
              id: 1,
              url: '/placeholder.svg?height=200&width=200&text=Logo1',
              name: `${formData.companyName} - Version 1`,
              style: formData.style,
              colors: selectedColorScheme?.colors || [],
            },
            {
              id: 2,
              url: '/placeholder.svg?height=200&width=200&text=Logo2',
              name: `${formData.companyName} - Version 2`,
              style: formData.style,
              colors: selectedColorScheme?.colors || [],
            },
            {
              id: 3,
              url: '/placeholder.svg?height=200&width=200&text=Logo3',
              name: `${formData.companyName} - Version 3`,
              style: formData.style,
              colors: selectedColorScheme?.colors || [],
            },
            {
              id: 4,
              url: '/placeholder.svg?height=200&width=200&text=Logo4',
              name: `${formData.companyName} - Version 4`,
              style: formData.style,
              colors: selectedColorScheme?.colors || [],
            },
          ])
          return 100
        }
        return prev + 2
      })
    }, 50)
  }

  const tokensUsed = user.plan.tokensUsed
  const maxTokens = user.plan.maxTokens
  const canGenerate =
    maxTokens === 'unlimited' || tokensUsed < (maxTokens as number)

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
            Générateur de Logos IA
          </h2>
          <p className="text-slate-600">
            Créez des logos uniques en quelques clics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-gradient-to-r from-blue-100 to-slate-100 text-blue-700 border-blue-200">
            <Zap className="w-3 h-3 mr-1" />
            {tokensUsed}/{maxTokens === 'unlimited' ? '∞' : maxTokens} tokens
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Generation Form */}
        <div className="lg:col-span-1">
          <Card className="bg-white border-blue-200/50 shadow-lg p-4 sm:p-6 h-full">
            <CardHeader>
              <CardTitle className="text-blue-600 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Paramètres de Génération
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="companyName" className="text-slate-700">
                  Nom de l'entreprise *
                </Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  placeholder="Ex: TechCorp"
                  className="bg-slate-50 border-slate-200"
                />
              </div>

              <div>
                <Label htmlFor="industry" className="text-slate-700">
                  Secteur d'activité
                </Label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) =>
                    setFormData({ ...formData, industry: value })
                  }
                >
                  <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Choisir un secteur" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="style" className="text-slate-700">
                  Style de logo
                </Label>
                <Select
                  value={formData.style}
                  onValueChange={(value) =>
                    setFormData({ ...formData, style: value })
                  }
                >
                  <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Choisir un style" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    {styles.map((style) => (
                      <SelectItem key={style} value={style}>
                        {style}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="colors" className="text-slate-700 mb-3 block">
                  Palette de couleurs
                </Label>
                <div className="space-y-4">
                  {/* Palettes prédéfinies - 2 par ligne */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {colorSchemes.map((scheme) => (
                      <div
                        key={scheme.name}
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

                  {/* Sélecteur de couleurs personnalisées */}
                  <div className="border-t pt-4">
                    <ColorPicker
                      selectedColors={customColors}
                      onColorsChange={(colors) => {
                        setCustomColors(colors)
                        if (colors.length > 0) {
                          setFormData({ ...formData, colors: 'Personnalisé' })
                        }
                      }}
                      maxColors={4}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-slate-700">
                  Description (optionnel)
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Décrivez votre vision du logo..."
                  className="bg-slate-50 border-slate-200"
                  rows={3}
                />
              </div>

              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">
                      Génération en cours...
                    </span>
                    <span className="text-blue-600">{generationProgress}%</span>
                  </div>
                  <Progress value={generationProgress} className="h-2" />
                </div>
              )}

              <Button
                onClick={handleGenerate}
                disabled={!formData.companyName || !canGenerate || isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Générer des Logos
                  </>
                )}
              </Button>

              {!canGenerate && (
                <p className="text-sm text-amber-600 text-center">
                  Vous avez atteint votre limite de tokens. Upgradez votre plan
                  pour continuer.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Generated Logos */}
        <div className="lg:col-span-1">
          {generatedLogos.length > 0 ? (
            <Card className="bg-white border-blue-200/50 shadow-lg p-4 sm:p-6 h-full">
              <CardHeader>
                <CardTitle className="text-blue-600 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Logos Générés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {generatedLogos.map((logo, index) => (
                    <motion.div
                      key={logo.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="group relative bg-slate-50 rounded-lg p-6 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="aspect-square bg-white rounded-lg shadow-inner p-4 mb-4">
                        <img
                          src={logo.url || '/placeholder.svg'}
                          alt={logo.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-slate-800">
                          {logo.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {logo.style}
                          </Badge>
                          {logo.colors && logo.colors.length > 0 && (
                            <div className="flex">
                              {logo.colors.slice(0, 3).map((color, index) => (
                                <div
                                  key={index}
                                  className="w-3 h-3 rounded-full border border-white -ml-1 first:ml-0"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:bg-red-50"
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-500 hover:bg-blue-50"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white border-blue-200/50 shadow-lg p-4 sm:p-6 h-full">
              <CardContent className="flex flex-col items-center justify-center h-full py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-slate-100 rounded-full flex items-center justify-center mb-6">
                  <Palette className="w-12 h-12 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  Prêt à créer votre logo ?
                </h3>
                <p className="text-slate-600 text-center max-w-md mb-6">
                  Remplissez les informations à gauche et cliquez sur "Générer
                  des Logos" pour commencer.
                </p>

                {/* Aperçu des paramètres saisis */}
                {(formData.companyName ||
                  formData.industry ||
                  formData.style ||
                  formData.colors) && (
                  <div className="w-full max-w-md bg-slate-50 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-slate-800 mb-3">
                      Vos paramètres :
                    </h4>
                    <div className="space-y-2 text-sm">
                      {formData.companyName && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Entreprise :</span>
                          <span className="font-medium text-slate-800">
                            {formData.companyName}
                          </span>
                        </div>
                      )}
                      {formData.industry && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Secteur :</span>
                          <span className="font-medium text-slate-800">
                            {formData.industry}
                          </span>
                        </div>
                      )}
                      {formData.style && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Style :</span>
                          <span className="font-medium text-slate-800">
                            {formData.style}
                          </span>
                        </div>
                      )}
                      {formData.colors && (
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Couleurs :</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-800">
                              {formData.colors}
                            </span>
                            {colorSchemes.find(
                              (scheme) => scheme.name === formData.colors
                            ) && (
                              <div className="flex">
                                {colorSchemes
                                  .find(
                                    (scheme) => scheme.name === formData.colors
                                  )
                                  ?.colors.slice(0, 3)
                                  .map((color, index) => (
                                    <div
                                      key={index}
                                      className="w-3 h-3 rounded-full border border-white -ml-1 first:ml-0"
                                      style={{ backgroundColor: color }}
                                    />
                                  ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  )
}
