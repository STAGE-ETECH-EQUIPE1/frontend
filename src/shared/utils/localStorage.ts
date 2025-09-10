export const saveToken = (token: string) => {
  if (typeof window !== 'undefined') localStorage.setItem('token', token)
}

export const removeToken = () => {
  if (typeof window !== 'undefined') localStorage.removeItem('token')
  window.location.reload()
}

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') return localStorage.getItem('token')
  return null
}

export const saveRole = (role: 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_CLIENT') => {
  if (typeof window !== 'undefined') localStorage.setItem('role', role)
}

export const getRole = ():
  | 'ROLE_USER'
  | 'ROLE_ADMIN'
  | 'ROLE_CLIENT'
  | null => {
  if (typeof window !== 'undefined')
    return localStorage.getItem('role') as
      | 'ROLE_USER'
      | 'ROLE_ADMIN'
      | 'ROLE_CLIENT'
      | null
  return null
}

export const removeRole = () => {
  if (typeof window !== 'undefined') localStorage.removeItem('role')
  window.location.reload()
}
