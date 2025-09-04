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
    LIST: '/user/showAll',
  },
  BRANDING: {
    PROJECTS: '/branding-project',
    PROJECTS_GET: '/branding-projects',
    PROJECT_LOGOS: (id: string | number) => `/branding-project/${id}/logos`,
  },
  PAYMENT: {
    PAYMENT_SECURE_ACCEPTANCE: (id: string | number) =>
      `/secure-acceptance/init/${id}`,
    GET_PAYMENT_RESUME: '/payment/resume',
  },
  SERVICES: {
    LIST: '/service/show',
    CREATE: '/service/create',
    UPDATE: (id: number) => `/service/edit/${id}`,
    DELETE: (id: number) => `/service/delete/${id}`,
  },
  PACKS: {
    LIST: '/pack/show',
    CREATE: '/pack/create',
    UPDATE: (id: number) => `/pack/edit/${id}`,
    DELETE: (id: number) => `/pack/delete/${id}`,
  },
  MERCURE: {
    TOKEN: '/mercure/token',
  },
} as const
