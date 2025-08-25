import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getToken, removeToken, saveToken } from '@/shared/utils/localStorage'

interface AuthState {
  token: string | null
}

const initialState: AuthState = {
  token: getToken(),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      saveToken(action.payload)
    },
    logout: (state) => {
      state.token = null
      removeToken()
      window.location.reload()
    },
  },
})

export const { setToken, logout } = authSlice.actions
export default authSlice.reducer
