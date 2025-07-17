'use client'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <div data-testid="theme-provider">
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </div>
  )
}
