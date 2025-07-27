import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useTranslations } from 'next-intl'

const FreeCard = () => {
  const t = useTranslations()

  const features = [
    t('pricing.free.features.tokens'),
    t('pricing.free.features.tools'),
    t('pricing.free.features.community'),
    t('pricing.free.features.watermark'),
  ]

  return (
    <Card className="p-6 hover:scale-105 transition-all duration-300 card-premium">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-foreground">
          {t('pricing.free.title')}
        </h3>
        <p className="text-muted-foreground mb-4">
          {t('pricing.free.description')}
        </p>
        <div className="mb-4">
          <span className="text-3xl font-bold text-foreground">0€</span>
          <span className="text-muted-foreground ml-2 text-sm">TTC</span>
        </div>
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-3">
            <Check className="w-4 h-4 text-accent" />
            <span className="text-foreground text-sm">{f}</span>
          </li>
        ))}
      </ul>
      <Button
        className="w-full py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white"
        variant="outline"
      >
        {t('pricing.free.button')}
      </Button>
    </Card>
  )
}

export default FreeCard
