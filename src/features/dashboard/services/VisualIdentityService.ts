import { API_ENDPOINTS } from '@/shared/constants/apiEndpoint'
import { ApiError, BaseService } from '@/shared/services/BaseService'
import {
  ClientResponse,
  ColorPaletteResponse,
  TypographiesResponse,
} from '../types/branding'
import { ApiResponse } from '@/types/service'
import { FieldValues } from 'react-hook-form'

class VisualIdentityService extends BaseService {
  async submitFileToProvide(data: FieldValues): Promise<ApiResponse<unknown>> {
    const r = await fetch(
      this._backendUrl + API_ENDPOINTS.BRANDING.FILE_TO_PROVIDE,
      {
        method: 'POST',
        headers: this._getHeader(),
        body: JSON.stringify(data),
      }
    )
    if (r.ok) return r.json() as Promise<ApiResponse<unknown>>
    throw new ApiError(r.status, await r.json())
  }

  async generateColorPalettes(
    data: FieldValues
  ): Promise<ApiResponse<Array<ColorPaletteResponse>>> {
    const r = await fetch(
      this._backendUrl + API_ENDPOINTS.BRANDING.COLOR_PALETTES_GENERATION,
      {
        method: 'POST',
        headers: this._getHeader(),
        body: JSON.stringify(data),
      }
    )
    if (r.ok)
      return r.json() as Promise<ApiResponse<Array<ColorPaletteResponse>>>
    throw new ApiError(r.status, await r.json())
  }

  async generateTypographies(
    data: FieldValues
  ): Promise<ApiResponse<Array<TypographiesResponse>>> {
    const r = await fetch(
      this._backendUrl + API_ENDPOINTS.BRANDING.TYPOGRAPHIE_GENERATION,
      {
        method: 'POST',
        headers: this._getHeader(),
        body: JSON.stringify(data),
      }
    )
    if (r.ok)
      return r.json() as Promise<ApiResponse<Array<TypographiesResponse>>>
    throw new ApiError(r.status, await r.json())
  }

  async submitTypographieForClient(
    data: string
  ): Promise<ApiResponse<ClientResponse>> {
    const url = new URL(
      this._backendUrl + API_ENDPOINTS.BRANDING.TYPOGRAPHIE_GENERATION
    )
    url.searchParams.set('data', data)

    const r = await fetch(url.toString(), {
      method: 'GET',
      headers: this._getHeader(),
    })

    if (r.ok) return r.json() as Promise<ApiResponse<ClientResponse>>
    throw new ApiError(r.status, await r.json())
  }

  async submitColorPaletteForClient(
    data: Array<string>
  ): Promise<ApiResponse<ClientResponse>> {
    const r = await fetch(
      this._backendUrl + API_ENDPOINTS.BRANDING.COLOR_PALETTES_SUBMIT,
      {
        method: 'POST',
        headers: this._getHeader(),
        body: JSON.stringify({
          colors: data,
        }),
      }
    )

    if (r.ok) return r.json() as Promise<ApiResponse<ClientResponse>>
    throw new ApiError(r.status, await r.json())
  }
}

export const visuelIdentityService = new VisualIdentityService()
