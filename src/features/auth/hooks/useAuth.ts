import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { getToken, removeToken } from '../../../shared/utils/localStorage'
import { DecodedToken } from '../types/auth'

export const useAuth = () => {
  const [user, setUser] = useState<DecodedToken | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()

    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token)
      if (decoded.exp * 1000 > Date.now()) {
        setUser(decoded)
      } else {
        removeToken()
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  return { user, loading }
}
