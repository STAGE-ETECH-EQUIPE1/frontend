'use client'

import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { logout } from '@/store/slice/authSlice' 

export const useLogout = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const handleLogout = () => {
    dispatch(logout())         
    router.push('/')
  }

  return handleLogout
}
