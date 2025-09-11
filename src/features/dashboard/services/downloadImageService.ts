// utils/downloadImage.ts
export const downloadImage = async (
  imageUrl: string,
  filename: string = 'image'
): Promise<void> => {
  try {
    const response = await fetch(imageUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`)
    }

    const blob = await response.blob()

    const blobUrl = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = blobUrl

    const contentType = response.headers.get('content-type')
    let extension = 'png'

    if (contentType) {
      extension = contentType.split('/')[1] || 'png'
    } else {
      const urlExtension = imageUrl.split('.').pop()?.split('?')[0]
      if (
        urlExtension &&
        ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(urlExtension)
      ) {
        extension = urlExtension
      }
    }

    link.download = `${filename}.${extension}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(blobUrl)
  } catch (error) {
    console.error('Download failed:', error)
    throw error
  }
}
