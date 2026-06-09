'use client'

import { useEffect } from 'react'
import { getToken } from '@/lib/api/auth'
import { getCurrentAuthRole, routeForRole } from '@/lib/auth/currentAuthRole'

/**
 * Root page — smart redirect based on auth state.
 * - Logged in  → redirect to role-based dashboard
 * - Logged out → redirect to /login
 *
 * All logic runs client-side so localStorage is always available.
 */
export default function RootPage() {
  useEffect(() => {
    const token = getToken()
    if (token) {
      const role = getCurrentAuthRole()
      const destination = routeForRole(role)
      window.location.replace(destination)
    } else {
      window.location.replace('/login')
    }
  }, [])

  // Minimal loading state while redirect is happening
  return (
    <div
      dir="rtl"
      style={{
        display: 'flex',
        height: '100vh',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f4f7fb',
        fontFamily: "'Cairo', sans-serif",
        fontSize: '18px',
        color: '#666',
      }}
    >
      جاري التحميل...
    </div>
  )
}
