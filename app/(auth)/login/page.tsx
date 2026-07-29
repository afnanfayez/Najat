'use client'

import { useEffect } from 'react'
import LoginForm from '@/components/auth/Login/LoginForm'
import { getCurrentUserId } from '@/lib/auth/tokenIdentity'
import { getCurrentAuthRole, routeForRole } from '@/lib/auth/currentAuthRole'
import { useLoginStore } from '@/store/useLoginStore'

export default function LoginPage() {
  const isSuccess = useLoginStore((s) => s.isSuccess)

  useEffect(() => {
    if (isSuccess) return

    // If user already has a valid session, redirect to their dashboard
    const userId = getCurrentUserId()
    if (userId) {
      const role = getCurrentAuthRole()
      const destination = routeForRole(role)
      window.location.replace(destination)
    }
  }, [isSuccess])

  return <LoginForm />
}
