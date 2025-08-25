'use client'

import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { logout } from '@/store/slice/authSlice' 

export const useLogout = (userId?: string) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const handleLogout = () => {
    if (userId) {
      localStorage.removeItem(`logo-generator-form-data_${userId}`)
      sessionStorage.removeItem(`logo-generator-form-data_${userId}`)
    }

    dispatch(logout())         
    router.push('/')
  }

  return handleLogout
}

