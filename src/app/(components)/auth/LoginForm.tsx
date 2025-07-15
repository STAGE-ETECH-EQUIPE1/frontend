'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoginFormProps {
  isDarkMode: boolean
}

export function LoginForm({ isDarkMode }: LoginFormProps) {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      {/* Email */}
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className={cn(
            'font-medium transition-colors duration-300',
            isDarkMode ? 'text-white/90' : 'text-primary-700'
          )} // Texte sombre en mode clair
        >
          Email
        </Label>
        <div className="relative group">
          <Mail
            className={cn(
              'absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200',
              isDarkMode
                ? 'text-blue-300 group-focus-within:text-white group-hover:text-white'
                : 'text-primary-700 group-focus-within:text-primary-900 group-hover:text-primary-900' // Icône sombre en mode clair
            )}
          />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="toavina@gmail.com"
            className={cn(
              'pl-12 transition-all duration-200',
              isDarkMode
                ? 'glass-input text-white placeholder:text-blue-200'
                : 'glass-input-light-blue text-primary-900 placeholder:text-primary-400 focus:border-primary-500 focus:ring-primary-500/20' // Utilise glass-input-light-blue
            )}
            required
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label
          htmlFor="password"
          className={cn(
            'font-medium transition-colors duration-300',
            isDarkMode ? 'text-white/90' : 'text-primary-700'
          )} // Texte sombre en mode clair
        >
          Password
        </Label>
        <div className="relative group">
          <Lock
            className={cn(
              'absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200',
              isDarkMode
                ? 'text-blue-300 group-focus-within:text-white group-hover:text-white'
                : 'text-primary-700 group-focus-within:text-primary-900 group-hover:text-primary-900' // Icône sombre en mode clair
            )}
          />
          <Input
            id="password"
            name="password"
            type="password" // Type fixed to password, visibility toggle removed for pure design
            placeholder="••••••••"
            className={cn(
              'pl-12 pr-12 transition-all duration-200',
              isDarkMode
                ? 'glass-input text-white placeholder:text-blue-200'
                : 'glass-input-light-blue text-primary-900 placeholder:text-primary-400 focus:border-primary-500 focus:ring-primary-500/20' // Utilise glass-input-light-blue
            )}
            required
          />
        </div>
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
        Sign in
      </Button>

      <div className="text-center">
        <a
          href="#"
          className={cn(
            'text-sm transition-colors duration-200 hover:underline',
            isDarkMode
              ? 'text-blue-200 hover:text-white'
              : 'text-primary-700 hover:text-primary-900' // Texte sombre en mode clair
          )}
        >
          Forgot your password?
        </a>
      </div>
    </form>
  )
}
