'use client'

import { useCallback } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { volunteerAPI } from '@/lib/api/volunteer'
import { mapVolunteerTaskDto } from '@/lib/mappers/volunteerTask'
import { isConnectivityError } from '@/lib/api/api'
import {
  getAllVolunteerTasks,
  putVolunteerTasks,
  updateCachedVolunteerTaskStatus,
  enqueueOfflineOp,
} from '@/lib/offline/db'
import type { VolunteerTask, VolunteerTaskStatus } from '@/schemas/volunteerApi'

const QUERY_KEY = ['volunteer', 'tasks'] as const

/**
 * Cache-first so a volunteer in the field always sees their assignments, then
 * refreshed from the network. Mirrors the useAid/facilities pattern.
 */
async function fetchVolunteerTasks(): Promise<VolunteerTask[]> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return getAllVolunteerTasks()
  }

  try {
    const tasks = (await volunteerAPI.listTasks()).map(mapVolunteerTaskDto)
    await putVolunteerTasks(tasks, { reconcile: true })
    return tasks
  } catch (err) {
    // Only fall back to cache for connectivity failures — a 403 means this
    // account is not a volunteer, and should surface rather than show stale rows.
    if (isConnectivityError(err)) return getAllVolunteerTasks()
    throw err
  }
}

export function useVolunteerTasks() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchVolunteerTasks,
    staleTime: 1000 * 60 * 2,
  })

  const mutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: VolunteerTaskStatus }) => {
      // Update the cached copy first so the card reflects the new state whether
      // the PATCH lands now or replays from the offline queue later.
      await updateCachedVolunteerTaskStatus(id, status)

      const offline = typeof navigator !== 'undefined' && !navigator.onLine
      if (offline) {
        await enqueueOfflineOp({
          type: 'UPDATE_VOLUNTEER_TASK_STATUS',
          payload: { taskId: id, status },
        })
        return { queued: true as const }
      }

      try {
        await volunteerAPI.updateTaskStatus(id, status)
        return { queued: false as const }
      } catch (err) {
        if (isConnectivityError(err)) {
          await enqueueOfflineOp({
            type: 'UPDATE_VOLUNTEER_TASK_STATUS',
            payload: { taskId: id, status },
          })
          return { queued: true as const }
        }
        throw err
      }
    },

    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY })
      const previous = queryClient.getQueryData<VolunteerTask[]>(QUERY_KEY)
      queryClient.setQueryData<VolunteerTask[]>(QUERY_KEY, (old) =>
        (old ?? []).map((task) => (task.id === id ? { ...task, status } : task)),
      )
      return { previous }
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(QUERY_KEY, context.previous)
      toast.error('تعذّر تحديث حالة المهمة')
    },

    onSuccess: (result) => {
      if (result.queued) {
        toast.success('تم الحفظ محلياً — ستتم المزامنة عند عودة الاتصال', { duration: 4000 })
      } else {
        toast.success('تم تحديث حالة المهمة')
      }
    },

    onSettled: () => {
      if (typeof navigator !== 'undefined' && navigator.onLine) {
        void queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      }
    },
  })

  const updateStatus = useCallback(
    (id: string, status: VolunteerTaskStatus) => mutation.mutate({ id, status }),
    [mutation],
  )

  const tasks = query.data ?? []

  return {
    tasks,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    updateStatus,
    isUpdating: mutation.isPending,
    stats: {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === 'pending').length,
      inProgress: tasks.filter((t) => t.status === 'in_progress').length,
      completed: tasks.filter((t) => t.status === 'completed').length,
    },
  }
}
