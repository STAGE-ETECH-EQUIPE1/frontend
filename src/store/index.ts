import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/store/slice/authSlice'
import { authApi } from '@/features/auth/services/authApi'
import { userApi } from '@/features/dashboard/services/userApi'
import { brandingApi } from '@/features/dashboard/services/brandingApi'
//import { brandingApi } from '@/features/dashboard/services/brandingApi'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [brandingApi.reducerPath]: brandingApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(userApi.middleware)
      .concat(brandingApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
