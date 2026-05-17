'use client'

import React from 'react'
import ToggleSwitch from '../shared/ToggleSwitch'

export default function NotificationPreferences() {
  return (
    <div>
      <h3 className="text-sm font-bold text-slate-800 mb-3 text-right">تفضيلات الاشعارات</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ToggleSwitch label="اشعارات الطوارئ" defaultChecked={true} />
        <ToggleSwitch label="تنبيهات المنطقة" defaultChecked={true} />
        <ToggleSwitch label="اشعارات الخدمات الجديدة" defaultChecked={true} />
      </div>
    </div>
  )
}
