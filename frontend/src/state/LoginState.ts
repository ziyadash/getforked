import { create } from 'zustand'

// Cookie utility functions
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null
  
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null
  }
  return null
}

const setCookie = (name: string, value: string, days: number = 7): void => {
  if (typeof document === 'undefined') return
  
  const expires = new Date()
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000))
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict;Secure`
}

const deleteCookie = (name: string): void => {
  if (typeof document === 'undefined') return
  
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

interface UserState {
  zid: string
  userToken: string
}

interface UserStore {
  user: UserState | null
  setUser: (userData: UserState) => void
  logout: () => void
  initializeUser: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  
  setUser: (userData: UserState) => {
    // Store token in cookie
    setCookie('userToken', userData.userToken, 7) // Expires in 7 days
    
    // Update store state
    set({ user: userData })
  },
  
  logout: () => {
    // Delete the cookie
    deleteCookie('userToken')
    
    // Reset store state
    set({ user: null })
  },
  
  initializeUser: () => {
    const savedToken = getCookie('userToken')
    
    if (savedToken) {
      set({ 
        user: { 
          zid: '', 
          userToken: savedToken 
        } 
      })
    }
  }
}))

