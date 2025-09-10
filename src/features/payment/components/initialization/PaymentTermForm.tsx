import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

export default function PaymentTermForm() {
  const t = useTranslations('payment.term')
  return (
    <div className="space-y-6">
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            {t('title')}
            <span className="text-primary">{t('number')}</span>
          </CardTitle>
          <CardDescription className="text-lg">
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Nouveau bouton pour CyberSource Secure Acceptance */}
          <div className="space-y-6">
            <Alert variant="default" className="bg-[#f9f6e9] border-primary">
              <AlertCircle className="w-4 h-4 text-primary" />
              <AlertDescription>{t('alert')}</AlertDescription>
            </Alert>

            <div className="flex items-center justify-between pt-4">
              <div className="text-sm">
                {t('amount')}
                <span className="font-semibold">1000 €</span>
              </div>
              <Button
                variant="ghost"
                className={`text-white hover:bg-primary/90 h-10 rounded-[10px]`}
              >
                {t('pay')}
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              </Button>
            </div>
          </div>

          {/* Formulaire legacy extrait dans un composant séparé */}
        </CardContent>
      </Card>
    </div>
  )
}
