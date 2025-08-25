'use client'
import Header from './(landing)/components/header/Header'
import Navbar from '@/shared/components/layout/navbar/Navbar'
import Pricing from './(landing)/components/packs/Pricing'
import Services from './(landing)/components/service/Services'
import Footer from '@/shared/components/layout/footer/Footer'

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
