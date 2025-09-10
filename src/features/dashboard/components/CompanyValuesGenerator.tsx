import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion } from 'framer-motion'
import { Trash2, Zap, Heart } from 'lucide-react'
import { useTranslations } from 'next-intl'

function CompanyValuesGenerator() {
  const t = useTranslations('CompanyValuesGenerator')

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
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-2">
            {t('title')}
          </h2>
          <p className="text-slate-600">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-gradient-to-r from-purple-100 to-slate-100 text-purple-700 border-purple-200">
            <Zap className="w-3 h-3 mr-1" />
            89
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
          <Card className="bg-white border-purple-200/50 shadow-lg p-4 sm:p-6 h-full">
            <CardHeader>
              <CardTitle className="text-purple-600 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                {t('form.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Problèmes clients */}
              <div>
                <Label htmlFor="painPoints" className="text-slate-700">
                  {t('form.customerPainPoints')}
                </Label>
                <Input
                  id="painPoints"
                  placeholder={t('form.customerPainPointsPlaceholder')}
                  className="bg-slate-50 border-slate-200"
                />
              </div>

              {/* Promesse client */}
              <div>
                <Label htmlFor="promise" className="text-slate-700">
                  {t('form.customerPromise')}
                </Label>
                <Input
                  id="promise"
                  placeholder={t('form.customerPromisePlaceholder')}
                  className="bg-slate-50 border-slate-200"
                />
              </div>

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

              {/* Culture */}
              <div>
                <Label htmlFor="culture" className="text-slate-700">
                  {t('form.culture')}
                </Label>
                <Input
                  id="culture"
                  placeholder={t('form.culturePlaceholder')}
                  className="bg-slate-50 border-slate-200"
                />
              </div>

              {/* Points forts */}
              <div>
                <Label htmlFor="strengths" className="text-slate-700">
                  {t('form.strengths')}
                </Label>
                <Input
                  id="strengths"
                  placeholder={t('form.strengthsPlaceholder')}
                  className="bg-slate-50 border-slate-200"
                />
              </div>

              {/* Concurrents */}
              <div>
                <Label htmlFor="competitors" className="text-slate-700">
                  {t('form.competitors')}
                </Label>
                <Input
                  id="competitors"
                  placeholder={t('form.competitorsPlaceholder')}
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

              {/* Valeurs préférées */}
              <div>
                <Label htmlFor="preferredValues" className="text-slate-700">
                  {t('form.preferredValues')}
                </Label>
                <Input
                  id="preferredValues"
                  placeholder={t('form.preferredValuesPlaceholder')}
                  className="bg-slate-50 border-slate-200"
                />
              </div>

              {/* Valeurs à éviter */}
              <div>
                <Label htmlFor="avoidValues" className="text-slate-700">
                  {t('form.avoidValues')}
                </Label>
                <Input
                  id="avoidValues"
                  placeholder={t('form.avoidValuesPlaceholder')}
                  className="bg-slate-50 border-slate-200"
                />
              </div>

              {/* Entreprises inspirantes */}
              <div>
                <Label htmlFor="inspiringCompanies" className="text-slate-700">
                  {t('form.inspiringCompanies')}
                </Label>
                <Input
                  id="inspiringCompanies"
                  placeholder={t('form.inspiringCompaniesPlaceholder')}
                  className="bg-slate-50 border-slate-200"
                />
              </div>

              {/* Bouton */}
              <Button className="bg-purple-600 hover:bg-purple-700 text-white w-full">
                {t('actions.generateValues')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Prévisualisation */}
        <div className="lg:col-span-1">
          <Card className="bg-white border-purple-200/50 shadow-lg p-4 sm:p-6 h-full">
            <CardHeader>
              <CardTitle className="text-purple-600 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                {t('preview.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h1 className="text-lg font-semibold text-slate-800">{t('preview.generatedValues')}</h1>
              <div className="space-y-2">
                <p className="text-purple-600 font-medium">Transparence</p>
                <p className="text-purple-600 font-medium">Durabilité</p>
                <p className="text-purple-600 font-medium">Qualité</p>
                {/* … autres valeurs */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

export default CompanyValuesGenerator
