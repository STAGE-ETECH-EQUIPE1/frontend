// Types pour l'API Branding
export interface BrandingProject {
  id?: string
  description: string
  slogan: string
  logoStyle: string
  colorPreferences: string[]
  brandKeywords: string[]
  createdAt?: string
  updatedAt?: string
}

export interface CreateBrandingProjectRequest {
  description: string
  slogan: string
  logoStyle: string
  colorPreferences: string[]
  brandKeywords: string[]
}

export interface CreateBrandingProjectResponse extends BrandingProject {
  id: string
  createdAt: string
  updatedAt: string
}

export interface BrandingApiError {
  message: string
  code?: string
  details?: Record<string, unknown>
}

// Types pour les styles de logo
export type LogoStyle =
  | 'modern'
  | 'classic'
  | 'minimalist'
  | 'creative'
  | 'corporate'
  | 'playful'

// Types pour les mots-clés de marque
export interface BrandKeyword {
  id: string
  name: string
  category?: string
}

// Types pour logo data
export interface Logo {
  id: number
  assertUrl: string
  style: string
  createdAt: string
  projectId: string
}

export interface ProjectLogosResponse {
  data: Logo[]
  message: string
}

export interface CreateBrandingProjectResponse {
  message: string
  status: number
  data: {
    brandKeywords: string[]
    moodBoardUrl: string
    description: string
    colorPreferences: string[]
    logoStyle: string
    slogan: string
  }
  projectId: number
}

export interface ColorResponse {
  name: string;
  position: string;
  hex: string;
}

export interface ColorPaletteResponse {
  name: string;
  colors: Array<ColorResponse>
}

export interface TypographieResponse {
  name: string;
  Relevance: string;
  Impact: string;
}

export interface TypographiesResponse {
  'font-type': string;
  fonts: Array<TypographieResponse>
}

export interface ClientResponse {
  id: number;
  typogrpahie: string;
  companyName: string;
  companyValue: string;
  colorPalette: Array<string>;
  mainService: string;
  mainLanguage: string;
  publicTarget: string;
  qualities: string;
}

export interface CompanyNameResponse {
  success: boolean;
  Names: string[];
}

export interface CompanySloganResponse {
  success: boolean;
  Slogans: string[];
}

export interface CompanyValuesResponse {
  success: boolean;
  Values: string[];
}

export interface CompanyToneOfVoiceResponse {
  success: boolean;
  Tones: string[];
}