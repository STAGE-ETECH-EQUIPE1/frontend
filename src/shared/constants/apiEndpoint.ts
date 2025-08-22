//list api
export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/register',
    LOGIN: '/login',
    GOOGLE_AUTH: '/auth/google',
    FORGOT_PASSWORD: '/reset-password',
    RESET_PASSWORD: (token: string) => `/reset-password/reset/${token}`,
  },
  USER: {
    ME: 'client/me',
  },
  BRANDING: {
    PROJECTS: '/branding-project',
    PROJECT_LOGOS: (id: string) => `/branding-project/${id}/logos`,
  },
} as const
