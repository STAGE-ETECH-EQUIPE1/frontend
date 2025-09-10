import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'
import { RefreshCwIcon, Settings, Trash2, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState, useTransition } from 'react'
import ColorPaletteCard from './ui/ColorPaletteCard'
import { wait } from '@/shared/services/BaseService'
import ColorPaletteSkeleton from './ui/ColorPaletteSkeleton'
import { ColorPaletteResponse } from '../types/branding'
import { visuelIdentityService } from '../services/VisualIdentityService'
import { FieldValues, useForm } from 'react-hook-form'
import { ColorPicker } from './ui/ColorPicker'
import { zodResolver } from '@hookform/resolvers/zod'
import { colorGeneratorSchema } from '../schema/colorGeneratorSchema'
import { useToken } from '@/shared/hooks/useToken'

function ColorPaletteGenerator() {
  const t = useTranslations('colorPaletteGenerator')
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [isLoading, startTransition] = useTransition()
  const [items, setItems] = useState<Array<ColorPaletteResponse> | null>(null)
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [excludedColors, setExcludedColors] = useState<string[]>([])
  const { tokens, isTokenLoading, updateToken } = useToken()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(colorGeneratorSchema),
  })

  const onFavoritesColorsChange = (colors: string[]) => {
    setSelectedColors(colors)
    setValue('colorFavorites', colors)
  }

  const onExcludeColorsChange = (colors: string[]) => {
    setExcludedColors(colors)
    setValue('colorExcepts', colors)
  }

  const onSubmit = async (data: FieldValues) => {
    setIsGenerating(true)

    startTransition(async () => {
      await wait(1000)
      const { success, data: items } =
        await visuelIdentityService.generateColorPalettes(data)
      if (success) {
        updateToken('colorPaletteTokens', tokens.colorPaletteTokens)
        setItems(items)
      }
    })
  }

  const resetGeneration = () => {
    setIsGenerating(false)
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
        <div className="flex items-center gap-4">
          <Badge className="bg-gradient-to-r from-blue-100 to-slate-100 text-blue-700 border-blue-200">
            <Zap className="w-3 h-3 mr-1" />
            {isTokenLoading ? 0 : tokens.colorPaletteTokens}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            className="text-slate-600 border-slate-300 hover:bg-slate-50 bg-transparent"
            title={t('clearCache')}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="w-full">
        <div className="flex justify-center items-center">
          {isGenerating ? (
            <div>
              <Card>
                <CardHeader className="text-center">
                  {t('result.title')}
                </CardHeader>
                <CardContent className="justify-center grid grid-cols-3">
                  {isGenerating && isLoading ? (
                    <ColorPaletteSkeleton />
                  ) : (
                    <>
                      {items?.map((item, index) => (
                        <ColorPaletteCard data={item} key={index} />
                      ))}
                    </>
                  )}
                </CardContent>
                <Button className="sticky bottom-4" onClick={resetGeneration}>
                  <RefreshCwIcon />
                  {t('result.regenerate')}
                </Button>
              </Card>
            </div>
          ) : (
            <Card className="bg-white border-blue-200/50 shadow-lg p-4 sm:p-6 h-full sm:w-full lg:w-3xl">
              <CardHeader>
                <CardTitle className="text-blue-600 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  {t('form.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="emotion" className="text-slate-700">
                      {t('form.emotion')} *
                    </Label>
                    <Input
                      {...register('emotion')}
                      type="text"
                      id="emotion"
                      placeholder={t('form.emotion')}
                      className="bg-slate-50 border-slate-200"
                    />
                    {errors['emotion'] && (
                      <p className="text-red-600">
                        {errors['emotion'].message?.toString()}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="styleSearch" className="text-slate-700">
                      {t('form.styleSearch')}
                    </Label>
                    <Input
                      {...register('styleSearch')}
                      type="text"
                      id="styleSearch"
                      placeholder={t('form.styleSearch')}
                      className="bg-slate-50 border-slate-200"
                    />
                    {errors['styleSearch'] && (
                      <p className="text-red-600">
                        {errors['styleSearch'].message?.toString()}
                      </p>
                    )}
                  </div>

                  <div>
                    <ColorPicker
                      selectedColors={selectedColors}
                      onColorsChange={(colors) =>
                        onFavoritesColorsChange(colors)
                      }
                      maxColors={4}
                      inputLabel={t('form.colorFavorites')}
                    />

                    {errors['colorFavorites'] && (
                      <p className="text-red-600">
                        {errors['colorFavorites'].message?.toString()}
                      </p>
                    )}
                  </div>

                  <div>
                    <ColorPicker
                      selectedColors={excludedColors}
                      onColorsChange={(colors) => onExcludeColorsChange(colors)}
                      maxColors={4}
                      inputLabel={t('form.colorExcepts')}
                    />
                    {errors['colorExcepts'] && (
                      <p className="text-red-600">
                        {errors['colorExcepts'].message?.toString()}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="colorNumber" className="text-slate-700">
                      {t('form.colorNumber')}
                    </Label>
                    <Input
                      {...register('colorNumber')}
                      type="number"
                      id="colorNumber"
                      placeholder={t('form.colorNumber')}
                      className="bg-slate-50 border-slate-200"
                    />
                    {errors['colorNumber'] && (
                      <p className="text-red-600">
                        {errors['colorNumber'].message?.toString()}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                  >
                    {t('form.submit')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ColorPaletteGenerator
