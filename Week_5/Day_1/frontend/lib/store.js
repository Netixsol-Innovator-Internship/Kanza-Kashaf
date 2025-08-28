'use client'
import { configureStore } from '@reduxjs/toolkit'
import { commentsApi } from './api'

export const store = configureStore({
  reducer: {
    [commentsApi.reducerPath]: commentsApi.reducer,
  },
  middleware: (gDM) => gDM().concat(commentsApi.middleware),
})
