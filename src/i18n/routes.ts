import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/navigation'

type DecodedToken = {
  roles: string[]
}

export function redirectAccordingToRole(
  token: string,
  router: ReturnType<typeof useRouter>
) {
  if (!token || typeof token !== 'string') {
    console.error('Token invalide fourni à redirectAccordingToRole:', token)
    return
  }

  const decoded: DecodedToken = jwtDecode(token)

  if (decoded.roles.includes('ROLE_ADMIN')) {
    router.push('/admin')
  } else {
    router.push('/dashboard')
  }
}
