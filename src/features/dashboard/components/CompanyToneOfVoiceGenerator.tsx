import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion } from 'framer-motion'
import { Trash2, Zap, MessageSquare } from 'lucide-react'
import { useTranslations } from 'next-intl'

function CompanyToneOfVoiceGenerator() {
  const t = useTranslations('CompanyToneOfVoiceGenerator')

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
                <MessageSquare className="w-5 h-5" />
                {t('form.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mission */}
              <div>
                <Label htmlFor="mission" className="text-slate-700">
                  {t('form.mission')}
                </Label>
                <Input
                  id="mission"
                  placeholder={t('form.missionPlaceholder')}
                  className="bg-slate-50 border-slate-200"
                />
              </div>

              {/* Vision */}
              <div>
                <Label htmlFor="vision" className="text-slate-700">
                  {t('form.vision')}
                </Label>
                <Input
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
                  id="positioning"
                  placeholder={t('form.positioningPlaceholder')}
                  className="bg-slate-50 border-slate-200"
                />
              </div>

              {/* Exemples à éviter */}
              <div>
                <Label htmlFor="avoidExamples" className="text-slate-700">
                  {t('form.avoidExamples')}
                </Label>
                <Input
                  id="avoidExamples"
                  placeholder={t('form.avoidExamplesPlaceholder')}
                  className="bg-slate-50 border-slate-200"
                />
              </div>

              {/* Périmètre du marché */}
              <div>
                <Label htmlFor="marketScope" className="text-slate-700">
                  {t('form.marketScope')}
                </Label>
                <Select>
                  <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue placeholder={t('form.marketScopePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">{t('form.marketScopeOptions.local')}</SelectItem>
                    <SelectItem value="national">{t('form.marketScopeOptions.national')}</SelectItem>
                    <SelectItem value="international">{t('form.marketScopeOptions.international')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bouton */}
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white w-full">
                {t('actions.generateTone')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Prévisualisation */}
        <div className="lg:col-span-1">
          <Card className="bg-white border-indigo-200/50 shadow-lg p-4 sm:p-6 h-full">
            <CardHeader>
              <CardTitle className="text-indigo-600 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                {t('preview.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h1 className="text-lg font-semibold text-slate-800">{t('preview.generatedTone')}</h1>
              <p className="text-indigo-600 font-medium">Accessible, chaleureux et inspirant</p>
              <p className="text-slate-500">{t('preview.exampleDescription')}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

export default CompanyToneOfVoiceGenerator
