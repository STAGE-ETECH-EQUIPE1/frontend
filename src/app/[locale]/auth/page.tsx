'use client'

import { useState, useEffect } from 'react'
import { LoginForm } from '@/app/(components)/auth/LoginForm'
import { RegisterForm } from '@/app/(components)/auth/RegisterForm'
import { AuthToggle } from '@/app/(components)/auth/AuthToggle'
import { cn } from '@/lib/utils'
import { StarryBackground } from '@/app/(components)/background/StaryBackground'
import { DayNightToggle } from '@/app/(components)/auth/DayNightToggle'
import { useTheme } from 'next-themes'

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(true)
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark' || theme === 'system'
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div
      className={cn(
        'min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500',
        mounted && isDarkMode
          ? 'bg-primary-gradient'
          : 'bg-gradient-to-br from-blue-100 to-blue-300'
      )}
    >
      {/* Stars/Sun/Clouds Animation Background */}
      <StarryBackground isDarkMode={mounted ? isDarkMode : false} />

      {/* Background decorative elements */}
      {mounted && isDarkMode && (
        <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 2 }}>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-white/3 to-transparent rounded-full blur-3xl"></div>
        </div>
      )}

      {/* Day/Night Toggle Button */}
      <div className="absolute top-4 right-4 z-50">
        <DayNightToggle />
      </div>

      {/* Main Content - Auth Form */}
      <div style={{ zIndex: 10 }} className="w-full max-w-md mx-auto relative">
        <div
          className={cn(
            'rounded-3xl p-8 transform transition-all duration-500 hover:scale-[1.02]',
            mounted && isDarkMode
              ? 'glass-effect shadow-glow'
              : 'glass-effect-light-blue shadow-md'
          )}
        >
          <AuthToggle
            isSignUp={isSignUp}
            onToggle={setIsSignUp}
            isDarkMode={mounted ? isDarkMode : false}
          />
          <div className="mt-8">
            <h2
              className={cn(
                'text-3xl font-bold mb-2 text-center transition-colors duration-300',
                mounted && isDarkMode ? 'text-white' : 'text-primary-900'
              )}
            >
              {isSignUp ? 'Create an account' : 'Welcome back'}
            </h2>
            <p
              className={cn(
                'text-center mb-8 transition-colors duration-300',
                mounted && isDarkMode ? 'text-blue-200' : 'text-primary-700'
              )}
            >
              {isSignUp
                ? 'Join us today and get started'
                : 'Sign in to your account'}
            </p>
            <div className="transition-all duration-500 ease-in-out">
              {isSignUp ? <RegisterForm /> : <LoginForm />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
