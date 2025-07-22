import { configureStore } from "@reduxjs/toolkit"
import { baseApi } from "./api/baseApi"
import authReducer from "./slices/authSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware), // ✅ Utilisez baseApi
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
