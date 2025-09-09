import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/store/slice/authSlice'
import projectReducer from '@/store/slice/projectSlice'
import { usersApi } from '@/features/admin/services/usersApi'
import { authApi } from '@/features/auth/services/authApi'
import { userApi } from '@/features/dashboard/services/userApi'
import { brandingApi } from '@/features/dashboard/services/brandingApi'
import { generationHistoryApi } from '@/features/dashboard/services/generationHistoryApi'
import { packApi } from '@/features/admin/services/packApi'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [brandingApi.reducerPath]: brandingApi.reducer,
    [generationHistoryApi.reducerPath]: generationHistoryApi.reducer,
    [packApi.reducerPath]: packApi.reducer,
    project: projectReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(userApi.middleware)
      .concat(brandingApi.middleware)
      .concat(generationHistoryApi.middleware)
      .concat(packApi.middleware)
      .concat(usersApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
