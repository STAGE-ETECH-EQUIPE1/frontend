import Navbar from '@/shared/components/layout/navbar/Navbar'
import Footer from '@/shared/components/layout/footer/Footer'

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
