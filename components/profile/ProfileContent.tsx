'use client'

import React from 'react'
import UserSummaryCard from './view/UserSummaryCard'
import ProfileStatsRow from './view/ProfileStatsRow'
import RequestsTable from './view/RequestsTable'
import NotificationPreferences from './view/NotificationPreferences'
import SettingsSupportRow from './view/SettingsSupportRow'
import ProfileSidebar from './view/ProfileSidebar'
export default function ProfileContent() {
  return (
    <>
      <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6" dir="rtl">
      
      {/* Right Column (Main Content) */}
      <div className="flex flex-col gap-6">
        <UserSummaryCard />
        <ProfileStatsRow />
        <RequestsTable />
        <NotificationPreferences />
      </div>

      {/* Left Column (Sidebar Stats) */}
      <ProfileSidebar />
      
      {/* Footer / SettingsSupportRow */}
      <div className="col-span-full">
        <SettingsSupportRow />
      </div>
    </div>
    </>
  )
}
