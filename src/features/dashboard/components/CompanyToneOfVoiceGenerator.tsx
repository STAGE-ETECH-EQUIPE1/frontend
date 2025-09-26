'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'
import { Trash2, Zap, MessageSquare } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useForm, FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'
import { companyToneOfVoiceGeneratorSchema } from '../schema/CompanyToneOfVoiceGeneratorSchema'
import { verbalIdentityService } from '../services/VerbalIdentityService'
import { wait } from '@/shared/services/BaseService'
import toast from 'react-hot-toast'

export interface ToneOfVoiceResponse {
  success: boolean
  tones: string[]
}

function CompanyToneOfVoiceGenerator() {
  const t = useTranslations('CompanyToneOfVoiceGenerator')
  const [results, setResults] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedTone, setSelectedTone] = useState<string | null>(null)
  const [isLoading, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(companyToneOfVoiceGeneratorSchema),
  })

  const onSubmit = async (data: FieldValues) => {
    setIsGenerating(true)
    startTransition(async () => {
      await wait(1000)
      const response =
        await verbalIdentityService.generateCompanyToneOfVoice(data)
      if (response.success && response.data.length > 0) {
        setResults(response.data[0].Tones)
      }

      setIsGenerating(false)
    })
  }

  const validateSelection = async () => {
    if (!selectedTone) return
    try {
      if (!selectedTone) return
      await verbalIdentityService.submitCompanyToneOfVoice({
        value: selectedTone,
      })
      toast.success(t('actions.successChoice'))
    } catch {
      toast.success(t('actions.errorChoice'))
    }
  }

  const resetGeneration = () => {
    setIsGenerating(false)
    setResults([])
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
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent mb-2">
            {t('title')}
          </h2>
          <p className="text-slate-600">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-gradient-to-r from-indigo-100 to-slate-100 text-indigo-700 border-indigo-200">
            <Zap className="w-3 h-3 mr-1" />
            56
          </Badge>
          <Button
            onClick={resetGeneration}
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
        {/* Formulaire */}
        <div className="lg:col-span-1">
          <Card className="bg-white border-indigo-200/50 shadow-lg p-4 sm:p-6 h-full">
            <CardHeader>
              <CardTitle className="text-indigo-600 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" /> {t('form.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Mission */}
                <div>
                  <Label htmlFor="mission" className="text-slate-700">
                    {t('form.mission')}
                  </Label>
                  <Input
                    {...register('mission')}
                    id="mission"
                    placeholder={t('form.missionPlaceholder')}
                    className="bg-slate-50 border-slate-200"
                  />
                  {errors['mission'] && (
                    <p className="text-red-600">
                      {errors['mission'].message?.toString()}
                    </p>
                  )}
                </div>

                {/* Vision */}
                <div>
                  <Label htmlFor="vision" className="text-slate-700">
                    {t('form.vision')}
                  </Label>
                  <Input
                    {...register('vision')}
                    id="vision"
                    placeholder={t('form.visionPlaceholder')}
                    className="bg-slate-50 border-slate-200"
                  />
                </div>

                {/* Valeurs */}
                <div>
                  <Label htmlFor="values" className="text-slate-700">
                    {t('form.values')}
                  </Label>
                  <Input
                    {...register('values')}
                    id="values"
                    placeholder={t('form.valuesPlaceholder')}
                    className="bg-slate-50 border-slate-200"
                  />
                </div>

                {/* Positionnement */}
                <div>
                  <Label htmlFor="positioning" className="text-slate-700">
                    {t('form.positioning')}
                  </Label>
                  <Input
                    {...register('positioning')}
                    id="positioning"
                    placeholder={t('form.positioningPlaceholder')}
                    className="bg-slate-50 border-slate-200"
                  />
                </div>

                {/* Périmètre du marché
                <div>
                  <Label htmlFor="marketScope" className="text-slate-700">{t('form.marketScope')}</Label>
                  <Controller
                    name="marketScope"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="bg-slate-50 border-slate-200">
                          <SelectValue placeholder={t('form.marketScopePlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="local">{t('form.marketScopeOptions.local')}</SelectItem>
                          <SelectItem value="national">{t('form.marketScopeOptions.national')}</SelectItem>
                          <SelectItem value="international">{t('form.marketScopeOptions.international')}</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div> */}

                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white w-full"
                >
                  {t('actions.generateTone')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Résultats */}
        <div className="lg:col-span-1">
          <Card className="bg-white border-indigo-200/50 shadow-lg p-4 sm:p-6 h-full">
            <CardHeader>
              <CardTitle className="text-indigo-600 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" /> {t('preview.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isGenerating && isLoading ? (
                <p>{t('preview.loading')}</p>
              ) : (
                <>
                  <h1 className="text-lg font-semibold text-slate-800">
                    {t('preview.generatedTone')}
                  </h1>
                  <div className="space-y-2">
                    {results.map((tone, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedTone(tone)}
                        className={`w-full text-left px-2 py-1 border rounded ${
                          selectedTone === tone
                            ? 'bg-indigo-600 text-white'
                            : 'bg-indigo-100 text-indigo-700'
                        }`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>

                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white w-full mt-4"
                    disabled={!selectedTone}
                    onClick={validateSelection}
                  >
                    {t('actions.validateSelection')}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

export default CompanyToneOfVoiceGenerator
