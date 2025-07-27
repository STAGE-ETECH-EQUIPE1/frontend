'use client'
import AuthModal from '@/app/(components)/auth/AuthModal'
import React, { useState } from 'react'

export default function Auth() {
  const [isOpen, setIsOpen] = useState(true) // ou false par défaut

  return <AuthModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
}
