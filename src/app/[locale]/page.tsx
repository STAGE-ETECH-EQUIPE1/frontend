'use client'
import Header from './(landing)/components/header/Header'
import Navbar from '@/shared/components/layout/navbar/Navbar'
import Services from './(landing)/components/service/Services'
import Footer from '@/shared/components/layout/footer/Footer'
import { DynamicPricing } from './(landing)/components/packs/DynamicPricing'
import Portfolio from './(landing)/components/portfolio/Portfolio'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Header />
      <Services />
      <Portfolio />
      <DynamicPricing />
      <Footer />
    </div>
  )
}
