'use client'

import { useEffect, useState } from 'react'
import { Menu, X, Zap, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import AuthModal from '../auth/AuthModal'
import LanguageSwitcher from '../translation/LanguageSwitcher'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  const t = useTranslations('navbar')

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      setIsScrolled(offset > 10)

      // Détection de la section active pour l'effet de soulignement
      const sections = ['services', 'portfolio', 'pricing', 'contact']
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      setActiveSection(currentSection || '')
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: t('services'), href: '#services', id: 'services' },
    { label: t('portfolio'), href: '#portfolio', id: 'portfolio' },
    { label: t('pricing'), href: '#pricing', id: 'pricing' },
    { label: t('contact'), href: '#contact', id: 'contact' },
  ]

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-colors duration-300 backdrop-blur-md ${
        isScrolled
          ? 'bg-primary/50 text-primary-foreground'
          : 'bg-transparent text-white'
      }`}
    >
      <div id="scroll-sentinel" className="h-1" />
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-accent rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Orbixup</span>
          </div>

          {/* Desktop Navigation avec effet stylé */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  const element = document.getElementById(item.id)
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Auth Buttons + Language Switcher */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              className="text-white hover:text-white hover:bg-white/10 transition-colors"
              onClick={() => {
                setAuthMode('signin')
                setIsAuthModalOpen(true)
              }}
            >
              <User className="w-4 h-4 mr-2" />
              {t('signin')}
            </Button>
            <Button
              className="btn-accent"
              onClick={() => {
                setAuthMode('signup')
                setIsAuthModalOpen(true)
              }}
            >
              {t('start')}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-primary/95 backdrop-blur-md border-b border-white/20">
            <nav className="flex flex-col py-6 px-6 gap-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-white/90 hover:text-white transition-colors font-medium py-2"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsMenuOpen(false)
                    const element = document.getElementById(item.id)
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                >
                  {item.label}
                </a>
              ))}
              <div className="space-y-3 mt-4">
                <div className="flex justify-center mb-3">
                  <LanguageSwitcher />
                </div>
                <Button
                  variant="ghost"
                  className="w-full text-white/90 hover:text-white hover:bg-white/10 justify-start"
                  onClick={() => {
                    setAuthMode('signin')
                    setIsAuthModalOpen(true)
                    setIsMenuOpen(false)
                  }}
                >
                  <User className="w-4 h-4 mr-2" />
                  {t('signin')}
                </Button>
                <Button
                  className="btn-accent w-full"
                  onClick={() => {
                    setAuthMode('signup')
                    setIsAuthModalOpen(true)
                    setIsMenuOpen(false)
                  }}
                >
                  {t('start')}
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </header>
  )
}

export default Navbar
