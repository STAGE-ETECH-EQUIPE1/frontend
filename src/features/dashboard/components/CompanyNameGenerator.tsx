import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select' // Importation pour les sélecteurs
import { Checkbox } from '@/components/ui/checkbox'
import { motion } from 'framer-motion'
import { Trash2, Zap, Building2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

function CompanyNameGenerator() {
  const t = useTranslations('companyNameGenerator')

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
            456
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
          <Card className="bg-white border-blue-200/50 shadow-lg p-4 sm:p-6 h-full">
            <CardHeader>
              <CardTitle className="text-blue-600 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                {t('form.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Champ pour les mots-clés à inclure */}
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

              {/* Champ pour les mots-clés à exclure */}
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

              {/* Sélecteur pour la longueur du nom */}
              <div>
                <Label htmlFor="length" className="text-slate-700">
                  {t('form.length')}
                </Label>
                <Select>
                  <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue placeholder={t('form.lengthPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">{t('form.lengthOptions.short')}</SelectItem>
                    <SelectItem value="medium">{t('form.lengthOptions.medium')}</SelectItem>
                    <SelectItem value="long">{t('form.lengthOptions.long')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sélecteur pour le style */}
              <div>
                <Label htmlFor="style" className="text-slate-700">
                  {t('form.style')}
                </Label>
                <Select>
                  <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue placeholder={t('form.stylePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">{t('form.styleOptions.modern')}</SelectItem>
                    <SelectItem value="classic">{t('form.styleOptions.classic')}</SelectItem>
                    <SelectItem value="minimalist">{t('form.styleOptions.minimalist')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sélecteur pour la langue */}
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

              {/* Case à cocher pour la vérification des réseaux sociaux */}
              <div className="flex items-center space-x-2">
                <Checkbox id="checkSocialMedia" />
                <Label htmlFor="checkSocialMedia" className="text-slate-700">
                  {t('form.checkSocialMedia')}
                </Label>
              </div>

              {/* Bouton de génération */}
              <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                {t('actions.generateNames')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Zone de prévisualisation des résultats */}
        <div className="lg:col-span-1">
          <Card className="bg-white border-blue-200/50 shadow-lg p-4 sm:p-6 h-full">
            <CardHeader>
              <CardTitle className="text-blue-600 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                {t('preview.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Ici, tu afficheras les noms d'entreprise générés */}
              <h1 className="text-lg font-semibold text-slate-800">{t('preview.generatedNames')}</h1>
              <div className="space-y-2">
                {/* Exemple de nom généré */}
                <p className="text-blue-600 font-medium">Nom d'entreprise 1</p>
                <p className="text-blue-600 font-medium">Nom d'entreprise 2</p>
                {/* ... plus de noms */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

export default CompanyNameGenerator