'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { useForgotPasswordMutation } from '../services/authApi'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await forgotPassword({ email }).unwrap()
      toast.success('Email de réinitialisation envoyé avec succès.')
    } catch (error) {
      toast.error('Une erreur est survenue.')
      console.error('Erreur forgotPassword:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <Input
        type="email"
        placeholder="Entrez votre adresse e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Envoi...' : 'Réinitialiser'}
      </Button>
    </form>
  )
}

export default ForgotPassword
