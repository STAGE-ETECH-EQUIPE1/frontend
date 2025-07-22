'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'
import { useState } from 'react'

const LanguageSwitcher = () => {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const switchLanguage = (newLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')

    router.push(newPath)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="text-white hover:text-white hover:bg-white/10 transition-colors gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Globe className="w-4 h-4" />
        <span className="uppercase font-medium">{locale}</span>
      </Button>

      {isOpen && (
        <>
          {/* Overlay pour fermer le menu */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu déroulant */}
          <div className="absolute top-full right-0 mt-2 bg-background/95 backdrop-blur-md border border-border/50 rounded-lg shadow-lg z-20 min-w-[120px]">
            <div className="py-2">
              <button
                onClick={() => switchLanguage('fr')}
                className={`w-full px-4 py-2 text-left hover:bg-muted/50 transition-colors flex items-center gap-3 ${
                  locale === 'fr'
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground'
                }`}
              >
                <span className="text-lg">🇫🇷</span>
                <span>Français</span>
              </button>
              <button
                onClick={() => switchLanguage('en')}
                className={`w-full px-4 py-2 text-left hover:bg-muted/50 transition-colors flex items-center gap-3 ${
                  locale === 'en'
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground'
                }`}
              >
                <span className="text-lg">🇺🇸</span>
                <span>English</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default LanguageSwitcher
