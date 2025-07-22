//import { useTranslations } from 'next-intl'
//import { Link } from '@/i18n/navigation'
import Auth from './auth/page'
import { ThemeProvider } from '../(components)/ThemeProvider'
import './globals.css'
export default function HomePage() {
  //const t = useTranslations('HomePage')
  return (
    <div>
      <ThemeProvider>
        <Auth />
      </ThemeProvider>
    </div>
  )
}
