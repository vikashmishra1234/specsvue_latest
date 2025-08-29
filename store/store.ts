"use client"
import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'
import navigateUrlReducer from './navigateUrlSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    navigateUrl: navigateUrlReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
