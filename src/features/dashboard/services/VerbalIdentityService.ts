import { API_ENDPOINTS } from '@/shared/constants/apiEndpoint'
import { ApiError, BaseService } from '@/shared/services/BaseService'
import {
  ClientResponse,
  CompanyNameResponse,
  CompanySloganResponse,
  CompanyToneOfVoiceResponse,
  CompanyValuesResponse,
} from '../types/branding'
import { ApiResponse } from '@/types/service'
import { FieldValues } from 'react-hook-form'

class VerbalIdentityService extends BaseService {
  async generateCompanyNames(
    data: FieldValues
  ): Promise<ApiResponse<Array<CompanyNameResponse>>> {
    const r = await fetch(
      this._backendUrl + API_ENDPOINTS.BRANDING.COMPANY_NAME_GENERATION,
      {
        method: 'POST',
        headers: this._getHeader(),
        body: JSON.stringify(data),
      }
    )
    if (r.ok)
      return r.json() as Promise<ApiResponse<Array<CompanyNameResponse>>>
    throw new ApiError(r.status, await r.json())
  }

  async generateCompanySlogan(
    data: FieldValues
  ): Promise<ApiResponse<Array<CompanySloganResponse>>> {
    const r = await fetch(
      this._backendUrl + API_ENDPOINTS.BRANDING.COMPANY_SLOGAN_GENERATION,
      {
        method: 'POST',
        headers: this._getHeader(),
        body: JSON.stringify(data),
      }
    )
    if (r.ok)
      return r.json() as Promise<ApiResponse<Array<CompanySloganResponse>>>
    throw new ApiError(r.status, await r.json())
  }

  async generateCompanyValues(
    data: FieldValues
  ): Promise<ApiResponse<Array<CompanyValuesResponse>>> {
    const r = await fetch(
      this._backendUrl + API_ENDPOINTS.BRANDING.COMPANY_VALUES_GENERATION,
      {
        method: 'POST',
        headers: this._getHeader(),
        body: JSON.stringify(data),
      }
    )
    if (r.ok)
      return r.json() as Promise<ApiResponse<Array<CompanyValuesResponse>>>
    throw new ApiError(r.status, await r.json())
  }

  async generateCompanyToneOfVoice(
    data: FieldValues
  ): Promise<ApiResponse<Array<CompanyToneOfVoiceResponse>>> {
    const r = await fetch(
      this._backendUrl + API_ENDPOINTS.BRANDING.COMPANY_TONE_GENERATION,
      {
        method: 'POST',
        headers: this._getHeader(),
        body: JSON.stringify(data),
      }
    )
    console.log(JSON.stringify(data))
    if (r.ok)
      return r.json() as Promise<ApiResponse<Array<CompanyToneOfVoiceResponse>>>
    throw new ApiError(r.status, await r.json())
  }

  async submitCompanyToneOfVoice(data: {
    value: string
  }): Promise<ApiResponse<Array<ClientResponse>>> {
    const r = await fetch(
      this._backendUrl + API_ENDPOINTS.BRANDING.COMPANY_TONE_SUBMIT,
      {
        method: 'POST',
        headers: this._getHeader(),
        body: JSON.stringify(data),
      }
    )
    console.log(JSON.stringify(data))
    if (r.ok) return r.json() as Promise<ApiResponse<Array<ClientResponse>>>
    throw new ApiError(r.status, await r.json())
  }

  async submitCompanyName(data: {
    value: string
  }): Promise<ApiResponse<Array<ClientResponse>>> {
    const r = await fetch(
      this._backendUrl + API_ENDPOINTS.BRANDING.COMPANY_NAME_SUBMIT,
      {
        method: 'POST',
        headers: this._getHeader(),
        body: JSON.stringify(data),
      }
    )
    console.log(JSON.stringify(data))
    if (r.ok) return r.json() as Promise<ApiResponse<Array<ClientResponse>>>
    throw new ApiError(r.status, await r.json())
  }

  async submitCompanySlogan(data: {
    value: string
  }): Promise<ApiResponse<Array<ClientResponse>>> {
    const r = await fetch(
      this._backendUrl + API_ENDPOINTS.BRANDING.COMPANY_SLOGAN_SUBMIT,
      {
        method: 'POST',
        headers: this._getHeader(),
        body: JSON.stringify(data),
      }
    )
    if (r.ok) return r.json() as Promise<ApiResponse<Array<ClientResponse>>>
    throw new ApiError(r.status, await r.json())
  }

  async submitCompanyValue(data: {
    value: string
  }): Promise<ApiResponse<Array<ClientResponse>>> {
    const r = await fetch(
      this._backendUrl + API_ENDPOINTS.BRANDING.COMPANY_VALUE_SUBMIT,
      {
        method: 'POST',
        headers: this._getHeader(),
        body: JSON.stringify(data),
      }
    )
    if (r.ok) return r.json() as Promise<ApiResponse<Array<ClientResponse>>>
    throw new ApiError(r.status, await r.json())
  }
}

export const verbalIdentityService = new VerbalIdentityService()
