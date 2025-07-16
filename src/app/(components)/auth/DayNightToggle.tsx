'use client'

import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export function DayNightToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const isDarkMode = theme === 'dark' || theme === 'system'

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="transition-all duration-200 backdrop-blur-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100"
        aria-label="Toggle theme"
      >
        <Sun className="w-5 h-5" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={cn(
        'transition-all duration-200 backdrop-blur-sm',
        isDarkMode
          ? 'text-white/70 hover:text-white hover:bg-white/10'
          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
      )}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
    </Button>
  )
}
