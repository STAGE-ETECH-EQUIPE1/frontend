'use client'

import { cn } from '@/lib/utils'

interface AuthToggleProps {
  isSignUp: boolean
  onToggle: (isSignUp: boolean) => void
  isDarkMode: boolean
}

export function AuthToggle({
  isSignUp,
  onToggle,
  isDarkMode,
}: AuthToggleProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl p-1 transition-colors duration-300',
        isDarkMode ? 'glass-input' : 'glass-input-light-blue' // Utilise glass-input-light-blue
      )}
    >
      <div
        className={cn(
          'absolute top-1 bottom-1 rounded-xl transition-all duration-300 ease-out',
          isSignUp
            ? isDarkMode
              ? 'bg-white shadow-glow-white'
              : 'bg-white shadow-md'
            : isDarkMode
              ? 'bg-white shadow-glow-white'
              : 'bg-white shadow-md'
        )}
        style={{
          left: isSignUp ? '4px' : '50%',
          right: isSignUp ? '50%' : '4px',
        }}
      />
      <div className="relative flex">
        <button
          onClick={() => onToggle(true)}
          className={cn(
            'flex-1 py-3 px-6 text-sm font-semibold rounded-xl transition-all duration-300 transform',
            isSignUp
              ? isDarkMode
                ? 'text-primary-theme scale-[0.98]'
                : 'text-primary-900 scale-[0.98]' // Texte sombre en mode clair
              : isDarkMode
                ? 'text-white/70 hover:text-white hover:scale-105'
                : 'text-primary-700 hover:text-primary-900 hover:scale-105' // Texte sombre en mode clair
          )}
        >
          Sign up
        </button>
        <button
          onClick={() => onToggle(false)}
          className={cn(
            'flex-1 py-3 px-6 text-sm font-semibold rounded-xl transition-all duration-300 transform',
            !isSignUp
              ? isDarkMode
                ? 'text-primary-theme scale-[0.98]'
                : 'text-primary-900 scale-[0.98]' // Texte sombre en mode clair
              : isDarkMode
                ? 'text-white/70 hover:text-white hover:scale-105'
                : 'text-primary-700 hover:text-primary-900 hover:scale-105' // Texte sombre en mode clair
          )}
        >
          Sign in
        </button>
      </div>
    </div>
  )
}
