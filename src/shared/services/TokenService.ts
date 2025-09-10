import { ApiResponse, tokensResponse } from "@/types/service";
import { ApiError, BaseService } from "./BaseService";
import { API_ENDPOINTS } from "../constants/apiEndpoint";

class TokenService extends BaseService {

  async getAllTokens(): Promise<ApiResponse<tokensResponse>> {

    const r = await fetch(this._backendUrl + API_ENDPOINTS.TOKEN.ALL, {
      method: 'GET',
      headers: this._getHeader()
    });

    if (r.ok) return r.json() as Promise<ApiResponse<tokensResponse>>;
    throw new ApiError(r.status, await r.json())
  }

}

export const tokenService = new TokenService();