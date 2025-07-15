import './globals.css'
//import { Montserrat_Alternates, Open_Sans } from "next/font/google";
import Providers from './providers'

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <Providers locale={locale}>
      <main>{children}</main>
    </Providers>
  )
}
