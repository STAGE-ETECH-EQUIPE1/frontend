'use client'

import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  twinkleSpeed: number
  speedX: number
  speedY: number
}

interface CelestialBody {
  x: number
  y: number
  radius: number
  color: string
  glowBlur: number
  speedX: number
  speedY: number
}

interface ShootingStar {
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  life: number // Durée de vie restante pour le fondu
}

interface Cloud {
  x: number
  y: number
  width: number
  height: number
  speed: number
  opacity: number
}
interface StarryBackgroundProps {
  isDarkMode: boolean
}

export function StarryBackground({ isDarkMode }: StarryBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const celestialBodyRef = useRef<CelestialBody | null>(null) // Pour lune ou soleil
  const shootingStarsRef = useRef<ShootingStar[]>([])
  const cloudsRef = useRef<Cloud[]>([]) // Pour les nuages
  const animationRef = useRef<number | null>(null)
  const lastShootingStarTimeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createStars = () => {
      const stars: Star[] = []
      const numStars = 150

      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          speedX: (Math.random() - 0.5) * 0.1,
          speedY: (Math.random() - 0.5) * 0.1,
        })
      }
      starsRef.current = stars
    }

    const createCelestialBody = () => {
      if (isDarkMode) {
        // Moon
        celestialBodyRef.current = {
          x: canvas.width * 0.8,
          y: canvas.height * 0.2,
          radius: 50,
          color: 'rgba(200, 200, 255, 0.8)',
          glowBlur: 30,
          speedX: -0.005, // Vitesse de déplacement de la lune (plus lente)
          speedY: 0.002, // Vitesse de déplacement de la lune (plus lente)
        }
      } else {
        // Sun
        celestialBodyRef.current = {
          x: canvas.width * 0.2, // Position initiale à gauche
          y: canvas.height * 0.2, // Position initiale en haut
          radius: 60,
          color: 'rgba(255, 220, 100, 0.9)', // Couleur du soleil (jaune orangé)
          glowBlur: 40, // Intensité de la lueur du soleil
          speedX: 0.005, // Vitesse de déplacement du soleil (vers la droite)
          speedY: 0.002, // Vitesse de déplacement du soleil (vers le bas)
        }
      }
    }

    const createShootingStar = () => {
      const startX = canvas.width + Math.random() * 500
      const startY = -Math.random() * 500
      shootingStarsRef.current.push({
        x: startX,
        y: startY,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 8 + 5,
        opacity: 1,
        life: 100,
      })
    }

    const createClouds = () => {
      const clouds: Cloud[] = []
      const numClouds = 3 // Nombre de nuages

      for (let i = 0; i < numClouds; i++) {
        clouds.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.4, // Dans la partie supérieure de l'écran
          width: Math.random() * 150 + 100, // Largeur aléatoire
          height: Math.random() * 50 + 30, // Hauteur aléatoire
          speed: Math.random() * 0.2 + 0.1, // Vitesse de déplacement
          opacity: Math.random() * 0.4 + 0.3, // Opacité légère
        })
      }
      cloudsRef.current = clouds
    }

    const drawCloud = (cloud: Cloud) => {
      ctx.beginPath()
      ctx.fillStyle = `rgba(255, 255, 255, ${cloud.opacity})`
      ctx.arc(cloud.x, cloud.y, cloud.height * 0.6, 0, Math.PI * 2)
      ctx.arc(
        cloud.x + cloud.width * 0.3,
        cloud.y - cloud.height * 0.3,
        cloud.height * 0.7,
        0,
        Math.PI * 2
      )
      ctx.arc(
        cloud.x + cloud.width * 0.6,
        cloud.y,
        cloud.height * 0.5,
        0,
        Math.PI * 2
      )
      ctx.arc(
        cloud.x + cloud.width * 0.2,
        cloud.y + cloud.height * 0.2,
        cloud.height * 0.5,
        0,
        Math.PI * 2
      )
      ctx.fill()
    }

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (isDarkMode) {
        // Animer et dessiner les étoiles
        starsRef.current.forEach((star) => {
          star.opacity += Math.sin(time * star.twinkleSpeed) * 0.01
          star.opacity = Math.max(0.1, Math.min(1, star.opacity))

          star.x += star.speedX
          star.y += star.speedY

          if (star.x < 0) star.x = canvas.width
          if (star.x > canvas.width) star.x = 0
          if (star.y < 0) star.y = canvas.height
          if (star.y > canvas.height) star.y = 0

          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
          ctx.fill()

          ctx.shadowBlur = star.size * 2
          ctx.shadowColor = `rgba(255, 255, 255, ${star.opacity * 0.5})`
          ctx.fill()
          ctx.shadowBlur = 0
        })

        // Animer et dessiner les étoiles filantes
        shootingStarsRef.current = shootingStarsRef.current.filter((star) => {
          star.x -= star.speed
          star.y += star.speed
          star.life -= 1
          star.opacity = star.life / 100

          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
          ctx.shadowBlur = star.size * 5
          ctx.shadowColor = `rgba(255, 255, 255, ${star.opacity * 0.8})`
          ctx.fill()
          ctx.shadowBlur = 0

          return star.life > 0 && star.x > -50 && star.y < canvas.height + 50
        })

        // Créer une nouvelle étoile filante plus fréquemment
        const shootingStarInterval = 3000 // Toutes les 3 secondes en moyenne
        if (
          time - lastShootingStarTimeRef.current > shootingStarInterval &&
          Math.random() < 0.05
        ) {
          createShootingStar()
          lastShootingStarTimeRef.current = time
        }
      } else {
        // Clear shooting stars and stars if switching to day mode
        shootingStarsRef.current = []
        starsRef.current = []

        // Animer et dessiner les nuages
        cloudsRef.current.forEach((cloud) => {
          cloud.x += cloud.speed
          if (cloud.x > canvas.width + cloud.width) {
            cloud.x = -cloud.width // Réapparaître à gauche
            cloud.y = Math.random() * canvas.height * 0.4 // Nouvelle position Y
          }
          drawCloud(cloud)
        })
      }

      // Animer et dessiner le corps céleste (lune ou soleil)
      if (celestialBodyRef.current) {
        celestialBodyRef.current.x += celestialBodyRef.current.speedX
        celestialBodyRef.current.y += celestialBodyRef.current.speedY

        // Envelopper le corps céleste autour de l'écran
        if (celestialBodyRef.current.x + celestialBodyRef.current.radius < 0)
          celestialBodyRef.current.x =
            canvas.width + celestialBodyRef.current.radius
        if (celestialBodyRef.current.y + celestialBodyRef.current.radius < 0)
          celestialBodyRef.current.y =
            canvas.height + celestialBodyRef.current.radius
        if (
          celestialBodyRef.current.x - celestialBodyRef.current.radius >
          canvas.width
        )
          celestialBodyRef.current.x = -celestialBodyRef.current.radius
        if (
          celestialBodyRef.current.y - celestialBodyRef.current.radius >
          canvas.height
        )
          celestialBodyRef.current.y = -celestialBodyRef.current.radius

        ctx.beginPath()
        ctx.arc(
          celestialBodyRef.current.x,
          celestialBodyRef.current.y,
          celestialBodyRef.current.radius,
          0,
          Math.PI * 2
        )
        ctx.fillStyle = celestialBodyRef.current.color
        ctx.shadowBlur = celestialBodyRef.current.glowBlur
        ctx.shadowColor = celestialBodyRef.current.color
        ctx.fill()
        ctx.shadowBlur = 0
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    createStars()
    createCelestialBody() // Créer la lune ou le soleil selon le mode
    createClouds() // Créer les nuages
    animate(0)

    const handleResize = () => {
      resizeCanvas()
      createStars()
      createCelestialBody()
      createClouds()
      shootingStarsRef.current = []
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isDarkMode]) // Re-run effect when isDarkMode changes

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}
