'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'
import { Trash2, Zap, Heart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useForm, FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'
import { companyValuesGeneratorSchema } from '../schema/CompanyValuesGeneratorSchema'
import { verbalIdentityService } from '../services/VerbalIdentityService'
import { wait } from '@/shared/services/BaseService'
import toast from 'react-hot-toast'

function CompanyValuesGenerator() {
  const t = useTranslations('CompanyValuesGenerator')
  const [results, setResults] = useState<string[]>([])
  const [selectedValue, setSelectedValue] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoading, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(companyValuesGeneratorSchema),
  })

  const onSubmit = async (data: FieldValues) => {
    setIsGenerating(true)
    startTransition(async () => {
      await wait(1000)
      const response = await verbalIdentityService.generateCompanyValues(data)
      if (response.success && response.data.length > 0) {
        setResults(response.data[0].Values)
      }
      setIsGenerating(false)
    })
  }

  const validateSelection = async () => {
    try {
      if (!selectedValue) return
      await verbalIdentityService.submitCompanyValue({ value: selectedValue })
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
            89
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
                <Heart className="w-5 h-5" />
                {t('form.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Customer Pain Points */}
                <div>
                  <Label htmlFor="painPoints">{t('form.customerPainPoints')}</Label>
                  <Input
                    id="painPoints"
                    placeholder={t('form.customerPainPointsPlaceholder')}
                    {...register('customer_pain_points')}
                  />
                  {errors['customer_pain_points'] && (
                    <p className="text-red-600">
                      {errors['customer_pain_points'].message?.toString()}
                    </p>
                  )}
                </div>

                {/* Customer Promise */}
                <div>
                  <Label htmlFor="promise">{t('form.customerPromise')}</Label>
                  <Input
                    id="promise"
                    placeholder={t('form.customerPromisePlaceholder')}
                    {...register('customer_promise')}
                  />
                  {errors['customer_promise'] && (
                    <p className="text-red-600">
                      {errors['customer_promise'].message?.toString()}
                    </p>
                  )}
                </div>

                {/* Mission */}
                <div>
                  <Label htmlFor="mission">{t('form.mission')}</Label>
                  <Input
                    id="mission"
                    {...register('mission')}
                    placeholder={t('form.missionPlaceholder')}
                  />
                  {errors['mission'] && (
                    <p className="text-red-600">
                      {errors['mission'].message?.toString()}
                    </p>
                  )}
                </div>

                {/* Vision */}
                <div>
                  <Label htmlFor="vision">{t('form.vision')}</Label>
                  <Input
                    id="vision"
                    {...register('vision')}
                    placeholder={t('form.visionPlaceholder')}
                  />
                  {errors['vision'] && (
                    <p className="text-red-600">
                      {errors['vision'].message?.toString()}
                    </p>
                  )}
                </div>

                {/* Culture */}
                <div>
                  <Label htmlFor="culture">{t('form.culture')}</Label>
                  <Input
                    id="culture"
                    {...register('culture')}
                    placeholder={t('form.culturePlaceholder')}
                  />
                  {errors['culture'] && (
                    <p className="text-red-600">
                      {errors['culture'].message?.toString()}
                    </p>
                  )}
                </div>

                {/* Strengths */}
                <div>
                  <Label htmlFor="strengths">{t('form.strengths')}</Label>
                  <Input
                    id="strengths"
                    {...register('strengths')}
                    placeholder={t('form.strengthsPlaceholder')}
                  />
                </div>

                {/* Competitors */}
                <div>
                  <Label htmlFor="competitors">{t('form.competitors')}</Label>
                  <Input
                    id="competitors"
                    {...register('competitors')}
                    placeholder={t('form.competitorsPlaceholder')}
                  />
                </div>

                {/* Preferred Values */}
                <div>
                  <Label htmlFor="preferredValues">{t('form.preferredValues')}</Label>
                  <Input
                    id="preferredValues"
                    {...register('preferred_values')}
                    placeholder={t('form.preferredValuesPlaceholder')}
                  />
                </div>

                {/* Inspiring Companies */}
                <div>
                  <Label htmlFor="inspiringCompanies">{t('form.inspiringCompanies')}</Label>
                  <Input
                    id="inspiringCompanies"
                    {...register('inspiring_companies')}
                    placeholder={t('form.inspiringCompaniesPlaceholder')}
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                >
                  {t('actions.generateValues')}
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
                <Heart className="w-5 h-5" />
                {t('preview.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isGenerating && isLoading ? (
                <p>{t('preview.loading')}</p>
              ) : (
                <>
                  <h1 className="text-lg font-semibold text-slate-800">
                    {t('preview.generatedValues')}
                  </h1>
                  <div className="space-y-2">
                    {results.map((value, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedValue(value)}
                        className={`w-full text-left px-2 py-1 border rounded ${
                          selectedValue === value
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>

                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full mt-4"
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

export default CompanyValuesGenerator
