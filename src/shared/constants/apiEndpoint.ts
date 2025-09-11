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
    CURRENT_USER_SUBSCRIPTION: 'client/subscription',
    LIST: '/user/showAll',
  },
  BRANDING: {
    PROJECTS: '/branding-project',
    PROJECTS_GET: '/branding-projects',
    PROJECT_LOGOS: (id: string | number) => `/branding-project/${id}/logos`,
    COLOR_PALETTES_GENERATION: '/brandings/color-palettes',
    TYPOGRAPHIE_GENERATION: '/brandings/typographies',
    COMPANY_NAME_GENERATION: '/brandings/companyNames',
    COMPANY_SLOGAN_GENERATION: '/brandings/companySlogan',
    COMPANY_VALUES_GENERATION: '/brandings/companyValues',
    COMPANY_TONE_GENERATION: '/brandings/companyToneOfVoice',
    COMPANY_TONE_SUBMIT: '/brandingVerbal/companyToneOfVoice',
    COMPANY_VALUE_SUBMIT: '/brandingVerbal/companyValue',
    COMPANY_SLOGAN_SUBMIT: '/brandingVerbal/companySlogan',
    COMPANY_NAME_SUBMIT: '/brandingVerbal/companyName',
    FILE_TO_PROVIDE: '/brandings/file-provide'
  },
  PAYMENT: {
    PAYMENT_SECURE_ACCEPTANCE: (id: string | number) => `/secure-acceptance/init/${id}`,
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
    GET_BY_ID: (id: number) => `/packs/${id}`,
  },
  MERCURE: {
    TOKEN: '/mercure/token',
  },
} as const
