'use client'

import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Twitter,
  Linkedin,
  Github,
} from 'lucide-react'
import { useTranslations, useMessages } from 'next-intl'
import Image from 'next/image'
const Footer = () => {
  const t = useTranslations('Footer')
  const messages = useMessages()

  const services = messages?.Footer?.services as string[]
  const footerLinks = messages?.Footer?.footerLinks as string[]

  return (
    <footer className="relative bg-gradient-to-br to-primary/80 absolute  text-white overflow-hidden">
      <div className="absolute inset-0 hero-gradient"></div>
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url('/hero-image.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-accent/30 rounded-full blur-lg"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/10 rounded-full blur-md"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <Image src="/_logo.png" alt="Google" width={98} height={98} />
              </div>
            </div>
            <p className="text-white/90 leading-relaxed max-w-md mb-6 text-lg">
              {t('description')}
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Linkedin, Github].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300 hover:shadow-glow"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">
              {t('servicesTitle')}
            </h3>
            <ul className="space-y-3">
              {services?.map((service, index) => (
                <li key={index}>
                  <a href="#" className="hover:underline">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">
              {t('contactTitle')}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span>contact@orbixup.com</span>
              </li>
              <li className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <span>+33 1 23 45 67 89</span>
              </li>
              <li className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>Paris, France</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-12 border border-white/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-xl font-bold mb-2">{t('newsletterTitle')}</h4>
              <p className="text-white/80">{t('newsletterSubtitle')}</p>
            </div>
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder={t('emailPlaceholder')}
                className="bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/60 focus:outline-none focus:border-accent flex-1 md:w-64"
              />
              <button className="btn-accent px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform">
                {t('subscribe')}
              </button>
            </div>
          </div>
        </div>

        {/* Footer links */}
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/70 text-center md:text-left">
            {t('rights')}
          </p>
          <div className="flex gap-6 text-white/70">
            {footerLinks?.map((link, index) => (
              <a
                key={index}
                href="#"
                className="hover:text-white transition-colors relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-accent after:left-0 after:-bottom-1 after:transition-all hover:after:w-full"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
