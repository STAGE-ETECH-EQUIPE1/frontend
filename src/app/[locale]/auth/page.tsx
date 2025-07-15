'use client'

import { AuthForm } from '@/app/(components)/auth/AuthForm'
import { DayNightToggle } from '@/app/(components)/auth/DayNightToggle'
import { StarryBackground } from '@/app/(components)/background/StaryBackground'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

export default function AuthPage() {
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark' || theme === 'system'
  return (
    <div
      className={cn(
        'min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500',
        isDarkMode
          ? 'bg-primary-gradient'
          : 'bg-gradient-to-br from-blue-100 to-blue-300'
      )}
    >
      {/* Stars Animation Background */}
      <StarryBackground isDarkMode={isDarkMode} />

      {/* Glassmorphism Effect */}

      {/* Background decorative elements */}
      {isDarkMode && (
        <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 2 }}>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-white/3 to-transparent rounded-full blur-3xl"></div>
        </div>
      )}

      <div className="absolute top-4 right-4 z-50">
        <DayNightToggle />
      </div>

      {/* Main Content */}
      <div style={{ zIndex: 10 }} className="relative">
        <AuthForm isDarkMode={isDarkMode} />
      </div>
    </div>
  )
}
