import Header from '../(components)/header/Header'
import Navbar from '../(components)/navbar/Navbar'
import Pricing from '../(components)/packs/Pricing'
import Services from '../(components)/service/Services'
export default function HomePage() {
  //const t = useTranslations('HomePage')
  return (
    <div className="min-h-screen">
      <Navbar />
      <Header />
      <Services />
      <Pricing />
    </div>
  )
}
