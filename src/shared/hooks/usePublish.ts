import { usePublishMutation } from '../services/mercureApi'

export const usePublish = () => {
  const [publish, { data, error, isLoading }] = usePublishMutation()

  const sendMessage = (message: string) => {
    return publish({
      topic: '/foo',
      data: { message },
    })
  }

  return { sendMessage, data, error, isLoading }
}
