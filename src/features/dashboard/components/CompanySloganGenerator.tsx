import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { motion } from 'framer-motion'
import { Trash2, Zap, Type } from 'lucide-react'
import { useTranslations } from 'next-intl'

function CompanySloganGenerator() {
  const t = useTranslations('CompanySloganGenerator')

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
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2">
            {t('title')}
          </h2>
          <p className="text-slate-600">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-gradient-to-r from-green-100 to-slate-100 text-green-700 border-green-200">
            <Zap className="w-3 h-3 mr-1" />
            123
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
        {/* Formulaire de Génération */}
        <div className="lg:col-span-1">
          <Card className="bg-white border-green-200/50 shadow-lg p-4 sm:p-6 h-full">
            <CardHeader>
              <CardTitle className="text-green-600 flex items-center gap-2">
                <Type className="w-5 h-5" />
                {t('form.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Inclure mots-clés */}
              <div>
                <Label htmlFor="includeKeywords" className="text-slate-700">
                  {t('form.includeKeywords')}
                </Label>
                <Input
                  id="includeKeywords"
                  placeholder={t('form.includeKeywordsPlaceholder')}
                  className="bg-slate-50 border-slate-200"
                />
              </div>

              {/* Exclure mots-clés */}
              <div>
                <Label htmlFor="excludeKeywords" className="text-slate-700">
                  {t('form.excludeKeywords')}
                </Label>
                <Input
                  id="excludeKeywords"
                  placeholder={t('form.excludeKeywordsPlaceholder')}
                  className="bg-slate-50 border-slate-200"
                />
              </div>

              {/* Tonalité */}
              <div>
                <Label htmlFor="tone" className="text-slate-700">
                  {t('form.tone')}
                </Label>
                <Select>
                  <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue placeholder={t('form.tonePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inspirant">{t('form.toneOptions.inspirant')}</SelectItem>
                    <SelectItem value="motivant">{t('form.toneOptions.motivant')}</SelectItem>
                    <SelectItem value="humoristique">{t('form.toneOptions.humoristique')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Longueur */}
              <div>
                <Label htmlFor="length" className="text-slate-700">
                  {t('form.length')}
                </Label>
                <Select>
                  <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue placeholder={t('form.lengthPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="court">{t('form.lengthOptions.short')}</SelectItem>
                    <SelectItem value="moyen">{t('form.lengthOptions.medium')}</SelectItem>
                    <SelectItem value="long">{t('form.lengthOptions.long')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Langue */}
              <div>
                <Label htmlFor="language" className="text-slate-700">
                  {t('form.language')}
                </Label>
                <Select>
                  <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue placeholder={t('form.languagePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">{t('form.languageOptions.fr')}</SelectItem>
                    <SelectItem value="en">{t('form.languageOptions.en')}</SelectItem>
                    <SelectItem value="es">{t('form.languageOptions.es')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Focus */}
              <div>
                <Label htmlFor="focus" className="text-slate-700">
                  {t('form.focus')}
                </Label>
                <Select>
                  <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue placeholder={t('form.focusPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="produits">{t('form.focusOptions.products')}</SelectItem>
                    <SelectItem value="valeurs">{t('form.focusOptions.values')}</SelectItem>
                    <SelectItem value="client">{t('form.focusOptions.client')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bouton */}
              <Button className="bg-green-600 hover:bg-green-700 text-white w-full">
                {t('actions.generateSlogans')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Prévisualisation */}
        <div className="lg:col-span-1">
          <Card className="bg-white border-green-200/50 shadow-lg p-4 sm:p-6 h-full">
            <CardHeader>
              <CardTitle className="text-green-600 flex items-center gap-2">
                <Type className="w-5 h-5" />
                {t('preview.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h1 className="text-lg font-semibold text-slate-800">{t('preview.generatedSlogans')}</h1>
              <div className="space-y-2">
                <p className="text-green-600 font-medium">Innovation vers l’avenir</p>
                <p className="text-green-600 font-medium">Réussite, notre valeur</p>
                {/* … autres slogans */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

export default CompanySloganGenerator
