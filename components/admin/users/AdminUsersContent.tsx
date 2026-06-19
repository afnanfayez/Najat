'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import AdminShell from '../AdminShell'
import AdminUsersPageHeader from './AdminUsersPageHeader'
import AdminUsersStats from './AdminUsersStats'
import AdminUsersFilters from './AdminUsersFilters'
import AdminUsersTable from './AdminUsersTable'
import AdminUsersPagination from './AdminUsersPagination'
import AdminUserEditModal from './AdminUserEditModal'
import AdminDisableUserModal from './AdminDisableUserModal'
import { useAdminUsers, useSetAdminUserActive, useRestoreAdminUser, useDeleteAdminUser } from '@/hooks/useAdminUsers'
import type { AdminManagedUser, AdminUserRegionFilter, AdminUserRoleFilter } from '@/schemas/adminUser'

const PAGE_SIZE = 4

export default function AdminUsersContent() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [role, setRole] = useState<AdminUserRoleFilter>('all')
  const [region, setRegion] = useState<AdminUserRegionFilter>('all')
  const [showDeleted, setShowDeleted] = useState(false)
  const [page, setPage] = useState(1)

  const [editingUser, setEditingUser] = useState<AdminManagedUser | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

  // Disable confirmation modal
  const [disableTarget, setDisableTarget] = useState<{ userId: string; userName: string } | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300)
    return () => window.clearTimeout(timer)
  }, [search])

  const { users, stats, total, page: currentPage, isLoading, isError } = useAdminUsers({
    search: debouncedSearch,
    role,
    region,
    withDeleted: showDeleted || undefined,
    page,
    pageSize: PAGE_SIZE,
  })
  const setActiveMutation = useSetAdminUserActive()
  const restoreMutation = useRestoreAdminUser()
  const deleteMutation = useDeleteAdminUser()

  function handleToggleUser(userId: string, enabled: boolean, userName: string) {
    if (!enabled) {
      // Disabling → show confirmation modal, do NOT update yet
      setDisableTarget({ userId, userName })
    } else {
      // Re-enabling → apply immediately without confirmation
      setActiveMutation.mutate({ id: userId, isActive: true })
    }
  }

  function handleDisableConfirmed() {
    setDisableTarget(null)
  }

  function handleDisableClose() {
    setDisableTarget(null)
  }

  function handleRestoreUser(userId: string, userName: string) {
    restoreMutation.mutate(userId, {
      onSuccess: () => toast.success(`تم استعادة المستخدم "${userName}" بنجاح`),
      onError: () => toast.error(`تعذّر استعادة المستخدم "${userName}"`),
    })
  }

  function handleDeleteUser(userId: string, userName: string) {
    deleteMutation.mutate(userId, {
      onSuccess: () => toast.success(`تم حذف المستخدم "${userName}" بنجاح`),
      onError: () => toast.error(`تعذّر حذف المستخدم "${userName}"`),
    })
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
        onSearchChange={(value) => { setSearch(value); setPage(1) }}
        onRoleChange={(v) => { setRole(v); setPage(1) }}
        onRegionChange={(v) => { setRegion(v); setPage(1) }}
      />

      <div dir="rtl" className="mb-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => { setShowDeleted((v) => !v); setPage(1) }}
          className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors"
          style={{
            fontFamily: "'Cairo', sans-serif",
            borderColor: showDeleted ? '#F44336' : '#E8EEF5',
            background: showDeleted ? '#F4433610' : '#fff',
            color: showDeleted ? '#F44336' : '#64748B',
          }}
        >
          <span className={`h-2 w-2 rounded-full ${showDeleted ? 'bg-[#F44336]' : 'bg-[#94A3B8]'}`} />
          {showDeleted ? 'إخفاء المحذوفين فقط' : 'عرض المحذوفين فقط'}
        </button>
        {showDeleted && (
          <span className="text-xs text-[#F44336]" style={{ fontFamily: "'Cairo', sans-serif" }}>
            يعرض المستخدمين المحذوفين فقط — اضغط زر الإرجاع الأخضر لاسترجاعهم
          </span>
        )}
      </div>

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
          enabledOverrides={{}}
          onToggleUser={handleToggleUser}
          onEditUser={handleEditUser}
          onRestoreUser={handleRestoreUser}
          onDeleteUser={handleDeleteUser}
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
        key={editingUser?.id ?? 'no-user'}
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
