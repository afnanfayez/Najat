'use client'

import React from 'react'
import EditHeader from './edit/EditHeader'
import GeneralSettings from './edit/GeneralSettings'
import AssistancePreferences from './edit/AssistancePreferences'
import HelpAndSupport from './edit/HelpAndSupport'
import DataAndStorage from './edit/DataAndStorage'
import EmergencySettings from './edit/EmergencySettings'
import MobileSimpleHeader from '../dashboard/header/MobileSimpleHeader'

export default function ProfileEditContent() {
  return (
    <div className="w-full flex flex-col gap-6 pb-10" dir="rtl">
      <MobileSimpleHeader />
      
      {/* Top Header Card */}
      <EditHeader />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Right Column (Main Settings) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <GeneralSettings />
          <AssistancePreferences />
          <HelpAndSupport />
        </div>

        {/* Left Column (Secondary Settings) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <DataAndStorage />
          <EmergencySettings />
        </div>
      </div>
    </div>
  )
}
