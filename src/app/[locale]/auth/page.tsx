'use client'
import AuthModal from '@/features/auth/components/AuthModal'
import React, { useState } from 'react'

export default function Auth() {
  const [isOpen, setIsOpen] = useState(true)

  return <AuthModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
}
