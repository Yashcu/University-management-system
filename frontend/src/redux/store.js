import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import { setupInterceptors } from '@lib/AxiosWrapper'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: import.meta.env.NODE_ENV !== 'production',
})

setupInterceptors(store)

export default store
