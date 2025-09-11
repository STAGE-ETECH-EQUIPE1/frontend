'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { motion } from 'framer-motion'
import { Trash2, Zap, Building2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useForm, FieldValues, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'
import { companyNameGeneratorSchema } from '../schema/CompanyNameGeneratorSchema'
import { verbalIdentityService } from '../services/VerbalIdentityService'
import { wait } from '@/shared/services/BaseService'
import { CompanyNameResponse } from '../types/branding'
import toast from 'react-hot-toast'

function CompanyNameGenerator() {
  const t = useTranslations('companyNameGenerator')
  const [results, setResults] = useState<string[]>([])
  const [selectedValue, setSelectedValue] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoading, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(companyNameGeneratorSchema),
  })

  const onSubmit = async (data: FieldValues) => {
    setIsGenerating(true)
    startTransition(async () => {
      await wait(1000)
      const response: CompanyNameResponse = await verbalIdentityService.generateCompanyNames(data)
      if (response.success && response.Names) {
        setResults(response.Names)
      }
      setIsGenerating(false)
    })
  }

  const resetGeneration = () => {
    setIsGenerating(false)
    setResults([])
    setSelectedValue(null)
  }

  const validateSelection = async () => {
    try {
      if (!selectedValue) return
      await verbalIdentityService.submitCompanyName({ value: selectedValue })
      toast.success(t('actions.successChoice'))
    } catch (err) 
      toast.error(t('actions.errorChoice'))
    }
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
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent mb-2">
            {t('title')}
          </h2>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-gradient-to-r from-blue-50 to-gray-100 text-blue-700 border border-blue-200 shadow-sm">
            <Zap className="w-3 h-3 mr-1" />456
          </Badge>
          <Button 
            onClick={resetGeneration} 
            variant="outline" 
            size="sm" 
            className="text-gray-600 border-gray-300 hover:bg-gray-50" 
            title={t('actions.clearCache')}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Formulaire */}
        <div className="lg:col-span-1">
          <Card className="bg-white border border-gray-200 shadow-md rounded-2xl p-6 h-full">
            <CardHeader>
              <CardTitle className="text-blue-600 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                {t('form.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Keywords include */}
                <div>
                  <Label htmlFor="includeKeywords" className="text-gray-700 font-medium">
                    {t('form.includeKeywords')}
                  </Label>
                  <Input
                    {...register('includeKeywords')}
                    id="includeKeywords"
                    placeholder={t('form.includeKeywordsPlaceholder')}
                    className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors['includeKeywords'] && (
                    <p className="text-red-500 text-sm">{errors['includeKeywords'].message?.toString()}</p>
                  )}
                </div>

                {/* Keywords exclude */}
                <div>
                  <Label htmlFor="excludeKeywords" className="text-gray-700 font-medium">
                    {t('form.excludeKeywords')}
                  </Label>
                  <Input
                    {...register('excludeKeywords')}
                    id="excludeKeywords"
                    placeholder={t('form.excludeKeywordsPlaceholder')}
                    className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Length */}
                <div>
                  <Label htmlFor="length" className="text-gray-700 font-medium">
                    {t('form.length')}
                  </Label>
                  <Controller
                    name="length"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                          <SelectValue placeholder={t('form.lengthPlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">{t('form.lengthOptions.short')}</SelectItem>
                          <SelectItem value="medium">{t('form.lengthOptions.medium')}</SelectItem>
                          <SelectItem value="long">{t('form.lengthOptions.long')}</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors['length'] && (
                    <p className="text-red-500 text-sm">{errors['length'].message?.toString()}</p>
                  )}
                </div>

                {/* Style */}
                <div>
                  <Label htmlFor="style" className="text-gray-700 font-medium">
                    {t('form.style')}
                  </Label>
                  <Controller
                    name="style"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                          <SelectValue placeholder={t('form.stylePlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="modern">{t('form.styleOptions.modern')}</SelectItem>
                          <SelectItem value="classic">{t('form.styleOptions.classic')}</SelectItem>
                          <SelectItem value="minimalist">{t('form.styleOptions.minimalist')}</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors['style'] && (
                    <p className="text-red-500 text-sm">{errors['style'].message?.toString()}</p>
                  )}
                </div>

                {/* Language */}
                <div>
                  <Label htmlFor="language" className="text-gray-700 font-medium">
                    {t('form.language')}
                  </Label>
                  <Controller
                    name="language"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                          <SelectValue placeholder={t('form.languagePlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fr">{t('form.languageOptions.fr')}</SelectItem>
                          <SelectItem value="en">{t('form.languageOptions.en')}</SelectItem>
                          <SelectItem value="es">{t('form.languageOptions.es')}</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors['language'] && (
                    <p className="text-red-500 text-sm">{errors['language'].message?.toString()}</p>
                  )}
                </div>

                {/* Social Media */}
                <div className="flex items-center space-x-2">
                  <Controller
                    name="checkSocialMedia"
                    control={control}
                    render={({ field }) => (
                      <Checkbox id="checkSocialMedia" checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  />
                  <Label htmlFor="checkSocialMedia" className="text-gray-700">{t('form.checkSocialMedia')}</Label>
                </div>

                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium w-full rounded-lg shadow-sm"
                >
                  {t('actions.generateNames')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Résultats */}
        <div className="lg:col-span-1">
          <Card className="bg-white border border-gray-200 shadow-md rounded-2xl p-6 h-full">
            <CardHeader>
              <CardTitle className="text-blue-600 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                {t('preview.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isGenerating && isLoading ? (
                <p className="text-gray-500">{t('preview.loading')}</p>
              ) : (
                <>
                  <h1 className="text-lg font-semibold text-gray-800 mb-3">{t('preview.generatedNames')}</h1>
                  <div className="space-y-2">
                    {results.map((name, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedValue(name)}
                        className={`w-full text-left px-3 py-2 rounded-lg border transition ${
                          selectedValue === name 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200'
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>

                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full mt-4 rounded-lg shadow-sm"
                    disabled={!selectedValue}
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

export default CompanyNameGenerator
