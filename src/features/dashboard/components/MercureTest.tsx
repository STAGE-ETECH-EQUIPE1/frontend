'use client'
import { Button } from '@/components/ui/button'
import { usePublishMutation } from '@/shared/services/mercureApi'

export default function TestPublish() {
  const [publish, { data, error, isLoading }] = usePublishMutation()

  const sendMessage = () =>
    publish({ topic: '/foo', data: { message: 'Hello world' } })

  return (
    <div>
      <Button onClick={sendMessage} disabled={isLoading}>
        Envoyer
      </Button>
      {data && <p>✅ Publié: {data}</p>}
      {error && <p>❌ Erreur: {JSON.stringify(error)}</p>}
    </div>
  )
}
