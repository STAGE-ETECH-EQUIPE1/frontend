'use client'

import { useState, useEffect } from 'react'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { AuthToggle } from './AuthToggle'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(true)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div>Loading...</div>
  }

  const isDarkMode = resolvedTheme === 'dark'

  return (
    <div className="w-full max-w-md mx-auto relative z-10">
      <div
        className={cn(
          'rounded-3xl p-8 transform transition-all duration-500 hover:scale-[1.02]',
          isDarkMode
            ? 'glass-effect shadow-glow'
            : 'glass-effect-light-blue shadow-md'
        )}
      >
        <AuthToggle
          isSignUp={isSignUp}
          onToggle={setIsSignUp}
          isDarkMode={isDarkMode}
        />

        <div className="mt-8">
          <h2
            className={cn(
              'text-3xl font-bold mb-2 text-center transition-colors duration-300',
              isDarkMode ? 'text-white' : 'text-primary-900'
            )}
          >
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </h2>
          <p
            className={cn(
              'text-center mb-8 transition-colors duration-300',
              isDarkMode ? 'text-blue-200' : 'text-primary-700'
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
  )
}
