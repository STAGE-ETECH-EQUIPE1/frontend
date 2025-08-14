'use client'

import { Palette, Zap, Crown, Rocket } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useTranslations } from 'next-intl'

const Services = () => {
  const t = useTranslations('services')

  const services = [
    {
      icon: <Palette className="w-12 h-12 text-accent" />,
      title: t('logoService.title'),
      description: t('logoService.description'),
      features: [
        t('logoService.features.0'),
        t('logoService.features.1'),
        t('logoService.features.2'),
        t('logoService.features.3'),
      ],
    },
    {
      icon: <Crown className="w-12 h-12 text-accent" />,
      title: t('identityService.title'),
      description: t('identityService.description'),
      features: [
        t('identityService.features.0'),
        t('identityService.features.1'),
        t('identityService.features.2'),
        t('identityService.features.3'),
      ],
    },
    {
      icon: <Zap className="w-12 h-12 text-accent" />,
      title: t('expressService.title'),
      description: t('expressService.description'),
      features: [
        t('expressService.features.0'),
        t('expressService.features.1'),
        t('expressService.features.2'),
        t('expressService.features.3'),
      ],
    },
    {
      icon: <Rocket className="w-12 h-12 text-accent" />,
      title: t('startupService.title'),
      description: t('startupService.description'),
      features: [
        t('startupService.features.0'),
        t('startupService.features.1'),
        t('startupService.features.2'),
        t('startupService.features.3'),
      ],
    },
  ]

  return (
    <section
      id="services"
      className="py-24 px-6 bg-gradient-to-b from-background to-muted/30"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 text-foreground">
            {t('title')}{' '}
            <span className="text-gradient">{t('titleHighlight')}</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="card-premium p-6 md:p-8 hover:scale-105 transition-all duration-300 hover:shadow-glow group cursor-pointer"
            >
              <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>

              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-foreground">
                {service.title}
              </h3>

              <p className="text-muted-foreground mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                {service.description}
              </p>

              <ul className="space-y-3">
                {service.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-center text-sm text-muted-foreground"
                  >
                    <div className="w-2 h-2 bg-accent rounded-full mr-3 flex-shrink-0"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
