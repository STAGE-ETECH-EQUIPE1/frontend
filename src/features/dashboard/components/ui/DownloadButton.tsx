import React from 'react'
import { downloadImage } from '../../services/downloadImageService'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { Spinner } from '@/components/ui/shadcn-io/spinner'

interface DownloadButtonProps {
  imageUrl: string
  filename?: string
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  imageUrl,
  filename = 'image',
}) => {
  const [isDownloading, setIsDownloading] = React.useState(false)

  const handleDownload = async () => {
    if (!imageUrl) return

    setIsDownloading(true)
    try {
      await downloadImage(imageUrl, filename)
    } catch (error) {
      console.error('Download failed:', error)
      alert('Download failed. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading || !imageUrl}
      size="icon"
      variant="secondary"
      className="rounded-full shadow"
    >
      {isDownloading ? (
        <Spinner variant="ring" />
      ) : (
        <Download className="w-4 h-4" />
      )}
    </Button>
  )
}

export default DownloadButton
