import FreeCard from './FreeCard'
import PremiumCard from './PremiumCard'
import EnterpriseCard from './EnterpriseCard'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

const Pricing = () => {
  const t = useTranslations()

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-muted to-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            {t('pricing.title')} <span className="text-gradient">Premium</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto px-4">
            {t('pricing.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <FreeCard />
          <PremiumCard />
          <EnterpriseCard />
        </div>

        <div className="text-center mt-12 px-4">
          <p className="text-muted-foreground mb-6 text-sm">
            {t('pricing.customMessage')}
          </p>
          <Button
            variant="outline"
            className="border-accent text-accent hover:bg-accent hover:text-white w-full sm:w-auto"
          >
            {t('pricing.requestQuote')}
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Pricing
