'use client'
import type React from 'react'
import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { setToken } from '@/features/authSlice'
import { useGoogleAuthMutation } from '@/store/api/authApi'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export default function GoogleLoginButton({
  authContext,
  setAuthMethod,
}: {
  authContext: 'signup' | 'login'
  setAuthMethod: (method: 'google') => void
}) {
  const dispatch = useDispatch()
  const t = useTranslations('toast')
  const [googleAuth] = useGoogleAuthMutation()
  const tokenClientRef = useRef<TokenClient | null>(null)

  useEffect(() => {
    if (!window.google || !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) return

    tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      scope: process.env.NEXT_PUBLIC_GOOGLE_API_SCOPE!,
      callback: async (response) => {
        if (response.access_token) {
          setAuthMethod('google')

          try {
            const res = await googleAuth({
              access_token: response.access_token,
            }).unwrap()

            if (res?.token) {
              dispatch(setToken(res.token))
              toast.success(
                authContext === 'login'
                  ? t('successLoginGoogle')
                  : t('successSignupGoogle')
              )
            } else {
              toast.error('Réponse invalide du serveur')
            }
          } catch (err) {
            toast.error("Erreur lors de l'authentification Google")
            console.error(err)
          }
        } else {
          toast.error('Access token Google manquant')
        }
      },
    })
  }, [authContext, dispatch, googleAuth, setAuthMethod, t])

  const handleClick = () => {
    if (!tokenClientRef.current) {
      toast.error('Client Google non initialisé')
      return
    }

    tokenClientRef.current.requestAccessToken()
  }

  return (
    <button
      onClick={handleClick}
      className="w-full h-12 flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-md shadow-sm hover:shadow-md transition justify-center"
    >
      <Image
        src="/google-icon.png"
        alt="Google"
        width={28}
        height={28}
        className="w-7 h-7"
      />
      <span className="text-sm text-gray-700">Connexion avec Google</span>
    </button>
  )
}
