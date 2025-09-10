import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TypographiesResponse } from '../../types/branding'
import { useTranslations } from 'next-intl'
import { visuelIdentityService } from '../../services/VisualIdentityService'
import toast from 'react-hot-toast'

function TypographieCard({ data }: { data: TypographiesResponse }) {
  const t = useTranslations('typographieGenerator')

  const submitTypographie = async (fontName: string) => {
    const { success } =
      await visuelIdentityService.submitTypographieForClient(fontName)

    if (success) {
      toast.success(t('result.successToast'))
    } else {
      toast.error(t('result.errorToast'))
    }
  }

  return (
    <Card className="font-sample p-4 border border-gray-200 rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-700 mb-2">
          {data['font-type']}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.fonts.map((font, index) => (
          <Card key={index} style={{ fontFamily: '"Inter", sans-serif' }}>
            <CardHeader>
              <h3>{font.name}</h3>
            </CardHeader>
            <CardContent className="flex justify-between gap-6">
              <p>
                <span className="font-semibold">Relevance : </span>
                {font.Relevance}
              </p>
              <p>
                <span className="font-semibold">Impact : </span>
                {font.Impact}
              </p>
            </CardContent>
            <CardFooter>
              <button
                onClick={() => submitTypographie(font.name)}
                className="w-full mt-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors select-palette"
              >
                {t('result.selectTypo')}
              </button>
            </CardFooter>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}

export default TypographieCard
