import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Settings } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { FieldValues, useForm } from 'react-hook-form'
import { fileToProvideSchema } from '../schema/fileToProvideSchema'
import { wait } from '@/shared/services/BaseService'
import { visuelIdentityService } from '../services/VisualIdentityService'
import toast from 'react-hot-toast'
import { Spinner } from '@/components/ui/shadcn-io/spinner'

function FileToProvide() {
  const t = useTranslations('fileToProvide')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(fileToProvideSchema),
  })

  const onSubmit = async (data: FieldValues) => {
    await wait()
    const { success } = await visuelIdentityService.submitFileToProvide(data)
    if (success) {
      toast.success(t('results.success'))
    } else {
      toast.error(t('results.error'))
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">
          {t('title')}
        </h2>
      </div>

      <div className="w-full">
        <div className="flex justify-center items-center">
          <Card className="bg-white border-blue-200/50 shadow-lg p-4 sm:p-6 h-full sm:w-full lg:w-3xl">
            <CardHeader>
              <CardTitle className="text-blue-600 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                {t('form.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <Label htmlFor="companyArea" className="text-slate-700">
                    {t('form.companyArea')} *
                  </Label>
                  <Input
                    {...register('companyArea')}
                    id="companyArea"
                    placeholder={t('form.companyArea')}
                    className="bg-slate-50 border-slate-200"
                  />
                  {errors['companyArea'] && (
                    <p className="text-red-600">
                      {errors['companyArea'].message?.toString()}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="publicTarget" className="text-slate-700">
                    {t('form.publicTarget')}
                  </Label>
                  <Input
                    {...register('publicTarget')}
                    id="publicTarget"
                    placeholder={t('form.publicTarget')}
                    className="bg-slate-50 border-slate-200"
                  />
                  {errors['publicTarget'] && (
                    <p className="text-red-600">
                      {errors['publicTarget'].message?.toString()}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="mainLanguage" className="text-slate-700">
                    {t('form.mainLanguage')} *
                  </Label>
                  <Input
                    {...register('mainLanguage')}
                    id="mainLanguage"
                    placeholder={t('form.mainLanguage')}
                    className="bg-slate-50 border-slate-200"
                  />
                  {errors['mainLanguage'] && (
                    <p className="text-red-600">
                      {errors['mainLanguage'].message?.toString()}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="mainService" className="text-slate-700">
                    {t('form.mainService')}
                  </Label>
                  <Input
                    {...register('mainService')}
                    id="mainService"
                    placeholder={t('form.mainService')}
                    className="bg-slate-50 border-slate-200"
                  />
                  {errors['mainService'] && (
                    <p className="text-red-600">
                      {errors['mainService'].message?.toString()}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner variant="ellipsis" />
                      Soumission
                    </>
                  ) : (
                    t('form.submit')
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

export default FileToProvide
