'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

interface PortfolioClient {
  id: number
  name: string
  logo: string
  description: string
  category: string
}

const portfolioClients: PortfolioClient[] = [
  {
    id: 1,
    name: 'Microsoft',
    logo: '/microsoft-logo.png',
    description: 'Cloud computing solutions',
    category: 'Technology',
  },
  {
    id: 2,
    name: 'Google',
    logo: '/google-logo.png',
    description: 'Search and advertising platform',
    category: 'Technology',
  },
  {
    id: 3,
    name: 'Amazon',
    logo: '/amazon-logo.png',
    description: 'E-commerce and cloud services',
    category: 'E-commerce',
  },
  {
    id: 4,
    name: 'Apple',
    logo: '/apple-logo.png',
    description: 'Consumer electronics',
    category: 'Technology',
  },
  {
    id: 5,
    name: 'Netflix',
    logo: '/netflix-inspired-logo.png',
    description: 'Streaming entertainment',
    category: 'Media',
  },
  {
    id: 6,
    name: 'Spotify',
    logo: '/spotify-logo.png',
    description: 'Music streaming platform',
    category: 'Media',
  },
]

export default function Portfolio() {
  const t = useTranslations('portfolio')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex(
        (prev) => (prev + 1) % Math.ceil(portfolioClients.length / 3)
      )
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentIndex(
      (prev) => (prev + 1) % Math.ceil(portfolioClients.length / 3)
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.ceil(portfolioClients.length / 3) - 1 : prev - 1
    )
  }

  return (
    <section id="portfolio" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Carousel Container */}
        <div
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            className="carousel-arrow absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-transparent"
            onClick={prevSlide}
            aria-label={t('prevClients')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="carousel-arrow absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-transparent"
            onClick={nextSlide}
            aria-label={t('nextClients')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Carousel Content */}
          <div className="mx-12 overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {Array.from({
                length: Math.ceil(portfolioClients.length / 3),
              }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {portfolioClients
                      .slice(slideIndex * 3, slideIndex * 3 + 3)
                      .map((client) => (
                        <div
                          key={client.id}
                          className="portfolio-card group cursor-pointer"
                        >
                          <div className="logo-hover flex flex-col items-center text-center">
                            <div className="mb-4 h-20 w-40 flex items-center justify-center">
                              <Image
                                width={100}
                                height={100}
                                src={client.logo || '/placeholder.svg'}
                                alt={`Logo ${client.name}`}
                                className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                              />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                              {client.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {client.description}
                            </p>
                            <span className="inline-block px-3 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full">
                              {client.category}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(portfolioClients.length / 3) }).map(
              (_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentIndex
                      ? 'bg-accent'
                      : 'bg-border hover:bg-muted-foreground'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={t('slideLabel', { index: index + 1 })}
                />
              )
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">{t('ctaText')}</p>
          <Button className="btn-accent px-8 py-3">{t('ctaButton')}</Button>
        </div>
      </div>
    </section>
  )
}
