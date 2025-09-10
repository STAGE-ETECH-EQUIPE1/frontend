'use client'

import { useEffect, useState } from 'react'
import { Menu, X, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import AuthModal from '@/features/auth/components/AuthModal'
import LanguageSwitcher from '../../translation/LanguageSwitcher'
import Image from 'next/image'
import { getRole, getToken } from '@/shared/utils/localStorage'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [role, setRole] = useState<'user' | 'admin' | 'client' | null>(null)

  const t = useTranslations('navbar')

  useEffect(() => {
    const token = getToken()
    const role = getRole()
    setIsAuthenticated(!!token)
    setRole(
      role === 'ROLE_ADMIN' ? 'admin' : role === 'ROLE_USER' ? 'user' : 'client'
    )
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      setIsScrolled(offset > 10)

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

  const profileLink =
    role === 'admin'
      ? '/admin'
      : role === 'user' || role === 'client'
        ? '/dashboard'
        : '#' // fallback si rôle inconnu

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
            <Image src="/_logo.png" alt="Logo" width={98} height={98} />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  const element = document.getElementById(item.id)
                  if (element) element.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Auth Buttons + Language Switcher */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            {!isAuthenticated ? (
              <>
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
              </>
            ) : (
              <Button
                className="btn-accent"
                onClick={() => window.location.assign(profileLink)}
              >
                {t('profile')}
              </Button>
            )}
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
          <div className="md:hidden absolute top-full left-0 w-full bg-primary/50 backdrop-blur-md border-b border-white/20">
            <nav className="flex flex-col py-6 px-6 gap-4">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className="text-white hover:text-white transition-colors font-medium py-2"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsMenuOpen(false)
                    const element = document.getElementById(item.id)
                    if (element) element.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  {item.label}
                </a>
              ))}
              <div className="space-y-3 mt-4">
                <div className="flex justify-center mb-3">
                  <LanguageSwitcher />
                </div>
                {!isAuthenticated ? (
                  <>
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
                  </>
                ) : (
                  <Button
                    className="btn-accent w-full"
                    onClick={() => {
                      setIsMenuOpen(false)
                      window.location.assign(profileLink)
                    }}
                  >
                    {t('profile')}
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </header>
  )
}

export default Navbar
