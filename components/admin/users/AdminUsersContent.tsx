'use client'

import { useEffect, useState } from 'react'
import AdminShell from '../AdminShell'
import AdminUsersPageHeader from './AdminUsersPageHeader'
import AdminUsersStats from './AdminUsersStats'
import AdminUsersFilters from './AdminUsersFilters'
import AdminUsersTable from './AdminUsersTable'
import AdminUsersPagination from './AdminUsersPagination'
import AdminUserEditModal from './AdminUserEditModal'
import AdminDisableUserModal from './AdminDisableUserModal'
import { useAdminUsers } from '@/hooks/useAdminUsers'
import type { AdminManagedUser, AdminUserRegionFilter, AdminUserRoleFilter } from '@/schemas/adminUser'

const PAGE_SIZE = 4

export default function AdminUsersContent() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [role, setRole] = useState<AdminUserRoleFilter>('all')
  const [region, setRegion] = useState<AdminUserRegionFilter>('all')
  const [page, setPage] = useState(1)
  const [enabledOverrides, setEnabledOverrides] = useState<Record<string, boolean>>({})

  const [editingUser, setEditingUser] = useState<AdminManagedUser | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

  // Disable confirmation modal
  const [disableTarget, setDisableTarget] = useState<{ userId: string; userName: string } | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300)
    return () => window.clearTimeout(timer)
  }, [search])

  useEffect(() => { setPage(1) }, [debouncedSearch, role, region])

  const { users, stats, total, page: currentPage, isLoading, isError } = useAdminUsers({
    search: debouncedSearch,
    role,
    region,
    page,
    pageSize: PAGE_SIZE,
  })

  function handleToggleUser(userId: string, enabled: boolean, userName: string) {
    if (!enabled) {
      // Disabling → show confirmation modal, do NOT update yet
      setDisableTarget({ userId, userName })
    } else {
      // Re-enabling → apply immediately without confirmation
      setEnabledOverrides((prev) => ({ ...prev, [userId]: true }))
    }
  }

  function handleDisableConfirmed(userId: string) {
    setEnabledOverrides((prev) => ({ ...prev, [userId]: false }))
    setDisableTarget(null)
  }

  function handleDisableClose() {
    setDisableTarget(null)
  }

  function handleEditUser(user: AdminManagedUser) {
    setEditingUser(user)
    setEditModalOpen(true)
  }

  function handleEditClose() {
    setEditModalOpen(false)
    setEditingUser(null)
  }

  return (
    <AdminShell activeNav="users">
      <AdminUsersPageHeader />
      <AdminUsersStats stats={stats} />

      <AdminUsersFilters
        search={search}
        role={role}
        region={region}
        onSearchChange={setSearch}
        onRoleChange={(v) => { setRole(v); setPage(1) }}
        onRegionChange={(v) => { setRegion(v); setPage(1) }}
      />

      {isLoading && (
        <p
          className="py-10 text-center text-sm text-[#64748B]"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          جاري تحميل المستخدمين...
        </p>
      )}

      {isError && (
        <p
          className="py-10 text-center text-sm text-[#F44336]"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          تعذّر تحميل المستخدمين. حاول مرة أخرى.
        </p>
      )}

      {!isLoading && !isError && (
        <AdminUsersTable
          users={users}
          enabledOverrides={enabledOverrides}
          onToggleUser={handleToggleUser}
          onEditUser={handleEditUser}
          pagination={
            <AdminUsersPagination
              page={currentPage}
              pageSize={PAGE_SIZE}
              total={total}
              onPageChange={setPage}
            />
          }
        />
      )}

      <AdminUserEditModal
        user={editingUser}
        open={editModalOpen}
        onClose={handleEditClose}
      />

      {disableTarget && (
        <AdminDisableUserModal
          userId={disableTarget.userId}
          userName={disableTarget.userName}
          open={!!disableTarget}
          onClose={handleDisableClose}
          onConfirmed={handleDisableConfirmed}
        />
      )}
    </AdminShell>
  )
}
