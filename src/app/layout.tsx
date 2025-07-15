import { ThemeProvider } from './(components)/ThemeProvider'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Orbixup',
  description:
    'Orbixup is a platform for managing and sharing your projects with ease.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
