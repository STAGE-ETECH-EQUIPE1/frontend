import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { motion } from 'framer-motion'
import { Palette, Settings, Trash2, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'

function TypographieGenerator() {
  const t = useTranslations('logoGenerator')

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
                  placeholder={t('form.companyNamePlaceholder')}
                  className="bg-slate-50 border-slate-200"
                />
              </div>

              <div>
                <Label htmlFor="industry" className="text-slate-700">
                  {t('form.industry')}
                </Label>
                <Input
                  id="companyName"
                  placeholder={t('form.companyNamePlaceholder')}
                  className="bg-slate-50 border-slate-200"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-slate-700">
                  {t('form.description')}
                </Label>
                <Textarea
                  id="description"
                  placeholder={t('form.descriptionPlaceholder')}
                  className="bg-slate-50 border-slate-200"
                />
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                {t('actions.generateLogos')}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="bg-white border-blue-200/50 shadow-lg p-4 sm:p-6 h-full">
            <CardHeader>
              <CardTitle className="text-blue-600 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                {t('preview.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h1>Card Content</h1>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

export default TypographieGenerator
