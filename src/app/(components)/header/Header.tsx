'use client'
import { ArrowRight, Sparkles, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Header = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 hero-gradient"></div>
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url('/hero-image.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="w-20 h-20 rounded-full bg-gradient-accent opacity-20 blur-xl"></div>
      </div>
      <div
        className="absolute bottom-32 right-16 animate-float"
        style={{ animationDelay: '1s' }}
      >
        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary-glow to-accent opacity-15 blur-2xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles className="w-6 h-6 text-accent" />
          <span className="text-accent font-medium tracking-wide uppercase text-sm">
            Plateforme Premium
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 md:mb-8 leading-tight">
          <span className="block">Services Digitaux</span>
          <span className="block text-gradient">d`&apos;`Excellence</span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed text-white/90 px-4">
          Orbixup transforme votre vision en réalité digitale. Logos premium,
          identité visuelle et services sur-mesure pour entreprises ambitieuses.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12 md:mb-16 px-4">
          <Button className="btn-premium group w-full sm:w-auto text-sm sm:text-base">
            Découvrir nos Packs
            <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold backdrop-blur-sm w-full sm:w-auto text-sm sm:text-base"
          >
            <Zap className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
            Portfolio
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 md:mb-2">
              500+
            </div>
            <div className="text-white/80 text-sm sm:text-base">
              Logos Créés
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 md:mb-2">
              98%
            </div>
            <div className="text-white/80 text-sm sm:text-base">
              Satisfaction Client
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 md:mb-2">
              24h
            </div>
            <div className="text-white/80 text-sm sm:text-base">
              Livraison Express
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Header
