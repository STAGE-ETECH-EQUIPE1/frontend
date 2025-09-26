'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { motion } from 'framer-motion'
import { Trash2, Zap, Type } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useForm, FieldValues, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'
import { companySloganResponseSchema } from '../schema/CompanySloganGeneratorSchema'
import { verbalIdentityService } from '../services/VerbalIdentityService'
import { wait } from '@/shared/services/BaseService'
import { CompanySloganResponse } from '../types/branding'
import toast from 'react-hot-toast'

function CompanySloganGenerator() {
  const t = useTranslations('CompanySloganGenerator')
  const [results, setResults] = useState<string[]>([])
  const [selectedSlogan, setSelectedSlogan] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoading, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(companySloganResponseSchema),
  })

  const onSubmit = async (data: FieldValues) => {
    setIsGenerating(true)
    startTransition(async () => {
      await wait(1000)

      const response = await verbalIdentityService.generateCompanySlogan(data)

      if (response.success && Array.isArray(response.data)) {
        setResults(
          response.data
            .map((item: CompanySloganResponse) => item.Slogans)
            .flat()
        )
      }

      setIsGenerating(false)
    })
  }

  const validateSelection = async () => {
    try {
      if (!selectedSlogan) return
      await verbalIdentityService.submitCompanySlogan({ value: selectedSlogan })
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
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">
            {t('title')}
          </h2>
          <p className="text-slate-600">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-gradient-to-r from-blue-100 to-slate-100 text-blue-700 border-blue-200">
            <Zap className="w-3 h-3 mr-1" />
            123
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
          <Card className="bg-white border-blue-200/50 shadow-lg p-4 sm:p-6 h-full">
            <CardHeader>
              <CardTitle className="text-blue-600 flex items-center gap-2">
                <Type className="w-5 h-5" />
                {t('form.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Keywords include */}
                <div>
                  <Label htmlFor="include_keywords">
                    {t('form.includeKeywords')}
                  </Label>
                  <Input
                    {...register('include_keywords')}
                    id="include_keywords"
                    placeholder={t('form.includeKeywordsPlaceholder')}
                  />
                  {errors['include_keywords'] && (
                    <p className="text-red-600">
                      {errors['include_keywords'].message?.toString()}
                    </p>
                  )}
                </div>

                {/* Keywords exclude */}
                <div>
                  <Label htmlFor="exclude_keywords">
                    {t('form.excludeKeywords')}
                  </Label>
                  <Input
                    {...register('exclude_keywords')}
                    id="exclude_keywords"
                    placeholder={t('form.excludeKeywordsPlaceholder')}
                  />
                </div>

                {/* Tone */}
                <div>
                  <Label htmlFor="tone">{t('form.tone')}</Label>
                  <Controller
                    name="tone"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t('form.tonePlaceholder')}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inspirant">
                            {t('form.toneOptions.inspirant')}
                          </SelectItem>
                          <SelectItem value="motivant">
                            {t('form.toneOptions.motivant')}
                          </SelectItem>
                          <SelectItem value="humoristique">
                            {t('form.toneOptions.humoristique')}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors['tone'] && (
                    <p className="text-red-600">
                      {errors['tone'].message?.toString()}
                    </p>
                  )}
                </div>

                {/* Length */}
                <div>
                  <Label htmlFor="length">{t('form.length')}</Label>
                  <Controller
                    name="length"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t('form.lengthPlaceholder')}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="court">
                            {t('form.lengthOptions.short')}
                          </SelectItem>
                          <SelectItem value="moyen">
                            {t('form.lengthOptions.medium')}
                          </SelectItem>
                          <SelectItem value="long">
                            {t('form.lengthOptions.long')}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors['length'] && (
                    <p className="text-red-600">
                      {errors['length'].message?.toString()}
                    </p>
                  )}
                </div>

                {/* Language */}
                <div>
                  <Label htmlFor="langue">{t('form.language')}</Label>
                  <Controller
                    name="langue"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t('form.languagePlaceholder')}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="français">
                            {t('form.languageOptions.fr')}
                          </SelectItem>
                          <SelectItem value="anglais">
                            {t('form.languageOptions.en')}
                          </SelectItem>
                          <SelectItem value="espagnol">
                            {t('form.languageOptions.es')}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors['langue'] && (
                    <p className="text-red-600">
                      {errors['langue'].message?.toString()}
                    </p>
                  )}
                </div>

                {/* Focus */}
                <div>
                  <Label htmlFor="focus">{t('form.focus')}</Label>
                  <Input
                    {...register('focus')}
                    id="focus"
                    placeholder={t('form.focusPlaceholder')}
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                >
                  {t('actions.generateSlogans')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Résultats */}
        <div className="lg:col-span-1">
          <Card className="bg-white border-blue-200/50 shadow-lg p-4 sm:p-6 h-full">
            <CardHeader>
              <CardTitle className="text-blue-600 flex items-center gap-2">
                <Type className="w-5 h-5" />
                {t('preview.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isGenerating && isLoading ? (
                <p>{t('preview.loading')}</p>
              ) : (
                <>
                  <h1 className="text-lg font-semibold text-slate-800">
                    {t('preview.generatedSlogans')}
                  </h1>
                  <div className="space-y-2">
                    {results.map((slogan, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedSlogan(slogan)}
                        className={`w-full text-left px-2 py-1 border rounded ${
                          selectedSlogan === slogan
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {slogan}
                      </button>
                    ))}
                  </div>

                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full mt-4"
                    disabled={!selectedSlogan}
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

export default CompanySloganGenerator
