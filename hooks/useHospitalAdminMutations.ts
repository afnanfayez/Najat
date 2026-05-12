'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { hospitalsAPI } from '@/lib/api/hospitals'
import type { HospitalCapacityStatus } from '@/schemas/hospitalApi'

/** Ready-to-use mutations for ADMIN/VOLUNTEER flows (wire to forms when needed). */
export function useHospitalAdminMutations() {
  const queryClient = useQueryClient()

  const invalidateLists = () => {
    queryClient.invalidateQueries({ queryKey: ['health-facilities'] })
  }

  const createHospital = useMutation({
    mutationFn: (formData: FormData) => hospitalsAPI.create(formData),
    onSuccess: invalidateLists,
  })

  const updateHospital = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string
      body: Record<string, unknown> | FormData
    }) => hospitalsAPI.update(id, body),
    onSuccess: invalidateLists,
  })

  const deleteHospital = useMutation({
    mutationFn: (id: string) => hospitalsAPI.softDelete(id),
    onSuccess: invalidateLists,
  })

  const updateHospitalStatus = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string
      status: HospitalCapacityStatus
    }) => hospitalsAPI.updateStatus(id, { status }),
    onSuccess: invalidateLists,
  })

  return {
    createHospital,
    updateHospital,
    deleteHospital,
    updateHospitalStatus,
  }
}
