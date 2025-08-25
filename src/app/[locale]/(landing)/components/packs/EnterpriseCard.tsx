import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useTranslations } from 'next-intl'

const EnterpriseCard = () => {
  const t = useTranslations()

  const features = [
    t('pricing.enterprise.features.tokens'),
    t('pricing.enterprise.features.identity'),
    t('pricing.enterprise.features.logo'),
    t('pricing.enterprise.features.charter'),
    t('pricing.enterprise.features.cards'),
    t('pricing.enterprise.features.stationery'),
    t('pricing.enterprise.features.templates'),
    t('pricing.enterprise.features.designer'),
    t('pricing.enterprise.features.delivery'),
    t('pricing.enterprise.features.support'),
  ]

  return (
    <Card className="p-6 hover:scale-105 transition-all duration-300 card-premium">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-foreground">
          {t('pricing.enterprise.title')}
        </h3>
        <p className="text-muted-foreground mb-4">
          {t('pricing.enterprise.description')}
        </p>
        <div className="mb-4">
          <span className="text-3xl font-bold text-foreground">1299€</span>
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
      <Button className="w-full py-3 btn-accent">
        {t('pricing.enterprise.button')}
      </Button>
    </Card>
  )
}

export default EnterpriseCard
