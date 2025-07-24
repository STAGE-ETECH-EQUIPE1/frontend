'use client'

import { GoogleLogin, CredentialResponse } from '@react-oauth/google'
import { useGoogleAuthMutation } from '@/store/api/authApi'
import { useDispatch } from 'react-redux'
import { setToken } from '@/features/authSlice'
import toast from 'react-hot-toast'

export default function GoogleLoginButton() {
  const dispatch = useDispatch()
  const [googleAuth] = useGoogleAuthMutation()

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error('Identifiant Google manquant')
      return
    }
    console.log(credentialResponse.credential)
    try {
      const res = await googleAuth({
        id_token: credentialResponse.credential,
      }).unwrap()
      dispatch(setToken(res.token))
      toast.success('Connexion réussie avec Google')
    } catch (err) {
      toast.error("Erreur lors de l'authentification Google")
      console.error(err)
    }
  }

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => toast.error('Erreur Google Login')}
    />
  )
}
