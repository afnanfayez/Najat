'use client'

import { useEffect } from 'react'
import LoginForm from '@/components/auth/Login/LoginForm'
import { getToken } from '@/lib/api/auth'
import { getCurrentAuthRole, routeForRole } from '@/lib/auth/currentAuthRole'

export default function LoginPage() {
  useEffect(() => {
    // If user already has a valid token, redirect to their dashboard
    const token = getToken()
    if (token) {
      const role = getCurrentAuthRole()
      const destination = routeForRole(role)
      window.location.replace(destination)
    }
  }, [])

  return <LoginForm />
}
