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
    PROJECTS_GET: '/branding-projects',
    PROJECT_LOGOS: (id: string | number) => `/branding-project/${id}/logos`,
  },
  PAYMENT: {
    PAYMENT_SECURE_ACCEPTANCE: (id: string | number) => `/secure-acceptance/init/${id}`,
    GET_PAYMENT_RESUME: '/payment/resume',
  }
} as const
