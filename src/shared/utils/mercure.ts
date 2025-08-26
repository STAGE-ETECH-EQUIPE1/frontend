const MERCURE_HUB_URL = process.env.NEXT_PUBLIC_MERCURE_HUB as string

export const createMercureEventSource = (topic: string, jwt?: string) => {
  const url = new URL(MERCURE_HUB_URL)
  url.searchParams.append('topic', topic)

  if (jwt) url.searchParams.append('jwt', jwt)

  const eventSource = new EventSource(url.toString())

  return eventSource
}
