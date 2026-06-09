'use client'

import { useEffect } from 'react'
import LoginForm from '@/components/auth/Login/LoginForm'
import { getToken } from '@/lib/api/auth'
import { getCurrentAuthRole, routeForRole } from '@/lib/auth/currentAuthRole'
import { useLoginStore } from '@/store/useLoginStore'

export default function LoginPage() {
  const isSuccess = useLoginStore((s) => s.isSuccess)

  useEffect(() => {
    if (isSuccess) return

    // If user already has a valid token, redirect to their dashboard
    const token = getToken()
    if (token) {
      const role = getCurrentAuthRole()
      const destination = routeForRole(role)
      window.location.replace(destination)
    }
  }, [isSuccess])

  return <LoginForm />
}
