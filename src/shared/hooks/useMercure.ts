'use client'

import { useEffect, useState } from 'react'
import { API_ENDPOINTS } from '../constants/apiEndpoint'

export default function useMercure(projectId: string) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState(null)

  useEffect(() => {
    if (!projectId) return

    const initMercure = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.MERCURE.TOKEN}`,
          {
            credentials: 'include',
          }
        )

        if (!res.ok) {
          throw new Error(`Failed to get Mercure token: ${res.status}`)
        }

        const { token } = await res.json()

        const url = new URL(
          `${process.env.NEXT_PUBLIC_MERCURE_HUB}/.well-known/mercure`
        )
        url.searchParams.append(
          'topic',
          `https://example.com/project/${projectId}`
        )
        url.searchParams.append('token', token)

        const eventSource = new EventSource(url.toString())

        eventSource.onopen = () => {
          console.log('[v0] Mercure connection opened')
          setIsConnected(true)
        }

        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data)
          console.log('[v0] Mercure message received:', data)
          setLastMessage(data)
        }

        eventSource.onerror = (err) => {
          console.log('[v0] Mercure connection error:', err)
          setIsConnected(false)
          eventSource.close()
        }

        return () => {
          eventSource.close()
          setIsConnected(false)
        }
      } catch (err) {
        console.log('[v0] Failed to connect to Mercure:', err)
        setIsConnected(false)
      }
    }

    const cleanup = initMercure()

    return () => {
      if (cleanup instanceof Promise) {
        cleanup.then((cleanupFn) => cleanupFn?.())
      }
    }
  }, [projectId])

  return { isConnected, lastMessage }
}
