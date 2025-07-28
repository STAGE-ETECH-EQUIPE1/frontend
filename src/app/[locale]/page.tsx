import Header from '../(components)/header/Header'
import Navbar from '../(components)/navbar/Navbar'
import Pricing from '../(components)/packs/Pricing'
import Services from '../(components)/service/Services'
import Footer from '../(components)/footer/Footer'
export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Header />
      <Services />
      <Pricing />
      <Footer />
    </div>
  )
}
