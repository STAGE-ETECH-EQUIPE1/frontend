'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Phone, User, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

export function RegisterForm() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null 

  const isDarkMode = resolvedTheme === 'dark'

  const sharedIconClass =
    'absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors duration-200'
  const sharedInputClass = 'pl-10 transition-all duration-200'

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
      {/* Full Name */}
      <div className="space-y-2">
        <Label
          htmlFor="fullName"
          className={cn(
            'font-medium text-sm transition-colors',
            isDarkMode ? 'text-white/90' : 'text-primary-700'
          )}
        >
          Full Name
        </Label>
        <div className="relative group">
          <User
            className={cn(
              sharedIconClass,
              isDarkMode
                ? 'text-blue-300 group-focus-within:text-white group-hover:text-white'
                : 'text-primary-700 group-focus-within:text-primary-900 group-hover:text-primary-900'
            )}
          />
          <Input
            id="fullName"
            name="fullName"
            placeholder="RANDRIANIMANANA Toavina"
            className={cn(
              sharedInputClass,
              isDarkMode
                ? 'glass-input text-white placeholder:text-blue-200'
                : 'glass-input-light-blue text-primary-900 placeholder:text-primary-400 focus:border-primary-500 focus:ring-primary-500/20'
            )}
            required
          />
        </div>
      </div>

      {/* Username */}
      <div className="space-y-2">
        <Label
          htmlFor="username"
          className={cn(
            'font-medium text-sm transition-colors',
            isDarkMode ? 'text-white/90' : 'text-primary-700'
          )}
        >
          Username
        </Label>
        <div className="relative group">
          <User
            className={cn(
              sharedIconClass,
              isDarkMode
                ? 'text-blue-300 group-focus-within:text-white group-hover:text-white'
                : 'text-primary-700 group-focus-within:text-primary-900 group-hover:text-primary-900'
            )}
          />
          <Input
            id="username"
            name="username"
            placeholder="toavina"
            className={cn(
              sharedInputClass,
              isDarkMode
                ? 'glass-input text-white placeholder:text-blue-200'
                : 'glass-input-light-blue text-primary-900 placeholder:text-primary-400 focus:border-primary-500 focus:ring-primary-500/20'
            )}
            required
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className={cn(
            'font-medium text-sm transition-colors',
            isDarkMode ? 'text-white/90' : 'text-primary-700'
          )}
        >
          Email
        </Label>
        <div className="relative group">
          <Mail
            className={cn(
              sharedIconClass,
              isDarkMode
                ? 'text-blue-300 group-focus-within:text-white group-hover:text-white'
                : 'text-primary-700 group-focus-within:text-primary-900 group-hover:text-primary-900'
            )}
          />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="toavina@gmail.com"
            className={cn(
              sharedInputClass,
              isDarkMode
                ? 'glass-input text-white placeholder:text-blue-200'
                : 'glass-input-light-blue text-primary-900 placeholder:text-primary-400 focus:border-primary-500 focus:ring-primary-500/20'
            )}
            required
          />
        </div>
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label
          htmlFor="phone"
          className={cn(
            'font-medium text-sm transition-colors',
            isDarkMode ? 'text-white/90' : 'text-primary-700'
          )}
        >
          Phone
        </Label>
        <div className="relative group">
          <Phone
            className={cn(
              sharedIconClass,
              isDarkMode
                ? 'text-blue-300 group-focus-within:text-white group-hover:text-white'
                : 'text-primary-700 group-focus-within:text-primary-900 group-hover:text-primary-900'
            )}
          />
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="0334014061"
            className={cn(
              sharedInputClass,
              isDarkMode
                ? 'glass-input text-white placeholder:text-blue-200'
                : 'glass-input-light-blue text-primary-900 placeholder:text-primary-400 focus:border-primary-500 focus:ring-primary-500/20'
            )}
            required
          />
        </div>
      </div>

      {/* Password & Confirm */}
      <div className="grid grid-cols-2 gap-4">
        {['password', 'confirmPassword'].map((field, index) => (
          <div className="space-y-2" key={field}>
            <Label
              htmlFor={field}
              className={cn(
                'font-medium text-sm transition-colors',
                isDarkMode ? 'text-white/90' : 'text-primary-700'
              )}
            >
              {index === 0 ? 'Password' : 'Confirm'}
            </Label>
            <div className="relative group">
              <Lock
                className={cn(
                  sharedIconClass,
                  isDarkMode
                    ? 'text-blue-300 group-focus-within:text-white group-hover:text-white'
                    : 'text-primary-700 group-focus-within:text-primary-900 group-hover:text-primary-900'
                )}
              />
              <Input
                id={field}
                name={field}
                type="password"
                placeholder="••••••••"
                className={cn(
                  sharedInputClass,
                  isDarkMode
                    ? 'glass-input text-white placeholder:text-blue-200'
                    : 'glass-input-light-blue text-primary-900 placeholder:text-primary-400 focus:border-primary-500 focus:ring-primary-500/20'
                )}
                required
              />
            </div>
          </div>
        ))}
      </div>

      <Button
        type="submit"
        className={cn(
          'w-full font-semibold py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-glow',
          isDarkMode
            ? 'bg-white text-primary-theme hover:bg-blue-50 hover:shadow-glow-white'
            : 'bg-primary-theme text-white hover:bg-primary-700 shadow-md'
        )}
      >
        Create an account
      </Button>
    </form>
  )
}
