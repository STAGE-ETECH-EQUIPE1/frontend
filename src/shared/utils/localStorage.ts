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
