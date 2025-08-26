'use client'

import { useEffect, useRef } from 'react'

const MERCURE_HUB_URL = process.env.NEXT_PUBLIC_MERCURE_HUB as string

export const useMercure = (
  topic: string,
  onMessage: (data: unknown) => void,
  jwt?: string
) => {
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    const url = new URL(MERCURE_HUB_URL)
    url.searchParams.append('topic', topic)
    if (jwt) url.searchParams.append('jwt', jwt)

    const es = new EventSource(url.toString())
    eventSourceRef.current = es

    es.onmessage = (event) => {
      try {
        onMessage(JSON.parse(event.data))
      } catch {
        onMessage(event.data)
      }
    }

    return () => es.close()
  }, [topic, jwt, onMessage])

  return eventSourceRef
}
