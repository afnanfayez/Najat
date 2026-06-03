'use client'

import React from 'react'
import { Home, User, Phone } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import {
  formatFamilyCount,
  labelHealthStatus,
  labelHousingStatus,
} from '@/lib/profile/profileLabels'

export default function ProfileSidebar() {
  const { user, isLoading } = useAuth()

  const locationLine = [labelHousingStatus(user?.housingStatus), user?.region]
    .filter(Boolean)
    .join(' — ')

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-5 text-right">
          المواقع المحفوظة
        </h3>
        <div className="flex flex-col gap-5">
          <div className="flex justify-between items-center text-right">
            <div className="flex flex-col">
              <span className="text-blue-500 font-semibold text-sm">
                المنزل الرئيسي
              </span>
              <span className="text-slate-500 text-xs">
                {isLoading ? '...' : locationLine || '—'}
              </span>
            </div>
            <div className="w-8 h-8 rounded bg-blue-50 text-blue-500 flex items-center justify-center">
              <Home size={16} />
            </div>
          </div>

          <div className="flex justify-between items-center text-right">
            <div className="flex flex-col">
              <span className="text-blue-500 font-semibold text-sm">
                عدد الأفراد
              </span>
              <span className="text-slate-800 font-bold text-sm">
                {isLoading
                  ? '...'
                  : formatFamilyCount(
                      user?.familyMembersCount,
                      user?.malesCount,
                      user?.femalesCount,
                    )}
              </span>
            </div>
            <div className="w-8 h-8 rounded bg-blue-50 text-blue-500 flex items-center justify-center">
              <User size={16} />
            </div>
          </div>

          <div className="flex justify-between items-center text-right">
            <div className="flex flex-col">
              <span className="text-blue-500 font-semibold text-sm">
                رقم الهاتف
              </span>
              <span
                className="text-slate-800 font-bold text-sm"
                dir="ltr"
              >
                {isLoading ? '...' : (user?.phoneNumber ?? '—')}
              </span>
            </div>
            <div className="w-8 h-8 rounded bg-blue-50 text-blue-500 flex items-center justify-center">
              <Phone size={16} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-5 text-right">
          التفاصيل الطبية
        </h3>
        <div className="flex flex-col gap-4 text-right">
          <div className="flex flex-col gap-1">
            <span className="text-blue-500 text-xs font-semibold">
              الحالة الصحية
            </span>
            <span className="text-slate-800 text-sm font-semibold">
              {isLoading ? '...' : labelHealthStatus(user?.healthStatus)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
