'use client'

import { useRouter } from 'next/navigation'
import { removeToken } from '@/lib/api/auth'
import { useLoginStore } from '@/store/useLoginStore'
import { useRegisterStore } from '@/store/useRegisterStore'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { resetLogin } = useLoginStore()
  const { resetRegister } = useRegisterStore()

  const handleLogout = () => {
    removeToken()
    resetLogin()
    resetRegister()
    router.push('/login')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white gap-6">
      <h1 className="text-2xl font-bold">مرحباً بك في لوحة التحكم</h1>
      <Button 
        onClick={handleLogout}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-5 rounded-xl transition-all"
        dir="rtl"
      >
        تسجيل الخروج
        <LogOut className="w-5 h-5 mr-2" />
      </Button>
    </div>
  )
}
