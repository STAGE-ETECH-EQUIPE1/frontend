import { tokensResponse } from '@/types/service'
import { useCallback, useEffect, useState, useTransition } from 'react'
import { tokenService } from '../services/TokenService'

export const useToken = () => {
  const [tokens, setTokens] = useState<tokensResponse>({
    colorPaletteTokens: 0,
    companyNameTokens: 0,
    logoGenerationTokens: 0,
    sloganTokens: 0,
    tonVoiceTokens: 0,
    typographyTokens: 0,
    valuesTokens: 0,
  })
  const [isLoading, startTransition] = useTransition()

  const updateToken = useCallback((serviceType: string, newCount: number) => {
    setTokens((prev) => ({
      ...prev,
      [serviceType]: newCount,
    }))
  }, [])

  useEffect(() => {
    startTransition(async () => {
      const { success, data } = await tokenService.getAllTokens()
      if (success) {
        console.log(data)
        setTokens(data)
      }
    })
  }, [])

  return {
    tokens,
    updateToken,
    isTokenLoading: isLoading,
  }
}
