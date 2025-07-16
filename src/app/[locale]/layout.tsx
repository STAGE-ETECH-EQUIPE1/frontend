import './globals.css'
import { ThemeProvider } from '../(components)/ThemeProvider'
import Providers from './providers' // Assurez-vous que ce fichier existe et est correctement configuré
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Orbixup',
  description:
    'Orbixup is a platform for managing and sharing your projects with ease.',
}

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
        >
          {/* Providers est enveloppé par ThemeProvider */}
          <Providers locale={locale}>
            <main>{children}</main>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
