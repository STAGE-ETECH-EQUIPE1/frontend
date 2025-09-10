import { BACKEND_URL } from "@/shared/config/env";
import { getToken, removeToken } from "@/shared/utils/localStorage";
import { jwtDecode } from 'jwt-decode'

export class BaseService {
  protected _backendUrl: string;

  constructor() {
    this._backendUrl = `${BACKEND_URL}/api`;
  }


  _getHeader() {
    const token = getToken()
    const headerContent = {
      "Accept": "application/json",
      "Content-Type": "application/json",
    }

    if (token) {
      try {
        interface JwtPayload {
          exp: number
          [key: string]: unknown
        }
        const decoded: JwtPayload = jwtDecode<JwtPayload>(token)
        if (decoded.exp * 1000 < Date.now()) {
          removeToken()
        } else {
          return {
            ...headerContent,
            "Authorization": `Bearer ${getToken()}`
          }
        }
      } catch {
        removeToken()
      }
    }
    return headerContent
  }

}

export class ApiError extends Error {
  public statusCode: number
  public data: Record<string, unknown>

  constructor(statusCode: number, data: Record<string, unknown>) {
    super()
    this.statusCode = statusCode
    this.data = data
  }
}

export const wait = (duration: number = 1000) => {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration)
  })
}