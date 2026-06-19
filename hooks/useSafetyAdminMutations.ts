'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  safetyAPI,
  type CreateDangerZoneBody,
  type UpdateDangerZoneBody,
  type CreateSafeRoadBody,
  type CreateResourcePointBody,
} from '@/lib/api/safety'
import { enqueueOfflineOp, putSafetyMapLayers, getSafetyMapLayers } from '@/lib/offline/db'
import type { SafetyMapLayers } from '@/lib/maps/safetyMapTransforms'

const QUERY_KEY = ['safety', 'map-data'] as const

function isOffline() {
  return typeof navigator !== 'undefined' && !navigator.onLine
}

/** Optimistically remove a safety entity from the cached map layers. */
async function optimisticRemove(
  queryClient: ReturnType<typeof useQueryClient>,
  entityId: string,
  entityKind: 'zone' | 'road' | 'point',
) {
  queryClient.setQueryData<SafetyMapLayers>(QUERY_KEY, (old) => {
    if (!old) return old
    switch (entityKind) {
      case 'zone':
        return { ...old, dangerZones: old.dangerZones.filter((z) => z.id !== entityId) }
      case 'road':
        return { ...old, safeRoads: old.safeRoads.filter((r) => r.id !== entityId) }
      case 'point':
        return { ...old, resourcePoints: old.resourcePoints.filter((p) => p.id !== entityId) }
    }
  })

  // Keep Dexie in sync so offline reads reflect the removal.
  const updated = queryClient.getQueryData<SafetyMapLayers>(QUERY_KEY)
  if (updated) {
    putSafetyMapLayers(updated).catch(() => {})
  }
}

/** Re-sync the cached map layers from IndexedDB after a successful mutation. */
async function persistCacheFromQuery(
  queryClient: ReturnType<typeof useQueryClient>,
) {
  await queryClient.invalidateQueries({ queryKey: QUERY_KEY })
  await queryClient.invalidateQueries({ queryKey: ['safety', 'zones'] })
  const fresh = queryClient.getQueryData<SafetyMapLayers>(QUERY_KEY)
  if (fresh) {
    putSafetyMapLayers(fresh).catch(() => {})
  }
}

export function useSafetyAdminMutations() {
  const queryClient = useQueryClient()

  // ── Create Danger Zone (requires geometry — used from map editor only) ───
  const createZone = useMutation({
    mutationFn: async (body: CreateDangerZoneBody) => {
      if (isOffline()) {
        await enqueueOfflineOp({ type: 'CREATE_DANGER_ZONE', payload: { body } })
        toast.info('ستُضاف منطقة الخطر عند عودة الاتصال', { duration: 4000 })
        return null
      }
      return safetyAPI.createZone(body)
    },
    onSuccess: async (result) => {
      if (result !== null) await persistCacheFromQuery(queryClient)
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'فشل إنشاء منطقة الخطر', { duration: 4000 })
    },
  })

  // ── Update Danger Zone (text fields only — geometry unchanged) ───────────
  const updateZone = useMutation({
    mutationFn: async ({ id, body }: { id: string; body: UpdateDangerZoneBody }) => {
      if (isOffline()) {
        await enqueueOfflineOp({ type: 'UPDATE_DANGER_ZONE', payload: { id, body } })
        toast.info('سيُحدَّث التغيير عند عودة الاتصال', { duration: 4000 })
        return null
      }
      return safetyAPI.updateZone(id, body)
    },
    onSuccess: async (result) => {
      if (result !== null) await persistCacheFromQuery(queryClient)
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'فشل تحديث منطقة الخطر', { duration: 4000 })
    },
  })

  // ── Delete Danger Zone — works offline via queue ──────────────────────────
  const deleteZone = useMutation({
    mutationFn: async (id: string) => {
      if (isOffline()) {
        await enqueueOfflineOp({ type: 'DELETE_DANGER_ZONE', payload: { id } })
        await optimisticRemove(queryClient, id, 'zone')
        toast.info('سيُحذف السجل عند عودة الاتصال', { duration: 4000 })
        return null
      }
      await safetyAPI.deleteZone(id)
      return id
    },
    onSuccess: async (id) => {
      if (id !== null) await persistCacheFromQuery(queryClient)
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'فشل حذف منطقة الخطر', { duration: 4000 })
    },
  })

  // ── Create Safe Road (requires geometry — used from map editor only) ──────
  const createSafeRoad = useMutation({
    mutationFn: async (body: CreateSafeRoadBody) => {
      if (isOffline()) {
        await enqueueOfflineOp({ type: 'CREATE_SAFE_ROAD', payload: { body } })
        toast.info('سيُضاف المسار الآمن عند عودة الاتصال', { duration: 4000 })
        return null
      }
      return safetyAPI.createSafeRoad(body)
    },
    onSuccess: async (result) => {
      if (result !== null) await persistCacheFromQuery(queryClient)
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'فشل إنشاء المسار الآمن', { duration: 4000 })
    },
  })

  // ── Delete Safe Road — works offline via queue ────────────────────────────
  const deleteSafeRoad = useMutation({
    mutationFn: async (id: string) => {
      if (isOffline()) {
        await enqueueOfflineOp({ type: 'DELETE_SAFE_ROAD', payload: { id } })
        await optimisticRemove(queryClient, id, 'road')
        toast.info('سيُحذف المسار عند عودة الاتصال', { duration: 4000 })
        return null
      }
      await safetyAPI.deleteSafeRoad(id)
      return id
    },
    onSuccess: async (id) => {
      if (id !== null) await persistCacheFromQuery(queryClient)
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'فشل حذف المسار الآمن', { duration: 4000 })
    },
  })

  // ── Create Resource Point (requires geometry — used from map editor) ──────
  const createResourcePoint = useMutation({
    mutationFn: async (body: CreateResourcePointBody) => {
      if (isOffline()) {
        await enqueueOfflineOp({ type: 'CREATE_RESOURCE_POINT', payload: { body } })
        toast.info('ستُضاف نقطة الموارد عند عودة الاتصال', { duration: 4000 })
        return null
      }
      return safetyAPI.createResourcePoint(body)
    },
    onSuccess: async (result) => {
      if (result !== null) await persistCacheFromQuery(queryClient)
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'فشل إنشاء نقطة الموارد', { duration: 4000 })
    },
  })

  // ── Delete Resource Point — works offline via queue ───────────────────────
  const deleteResourcePoint = useMutation({
    mutationFn: async (id: string) => {
      if (isOffline()) {
        await enqueueOfflineOp({ type: 'DELETE_RESOURCE_POINT', payload: { id } })
        await optimisticRemove(queryClient, id, 'point')
        toast.info('ستُحذف نقطة الموارد عند عودة الاتصال', { duration: 4000 })
        return null
      }
      await safetyAPI.deleteResourcePoint(id)
      return id
    },
    onSuccess: async (id) => {
      if (id !== null) await persistCacheFromQuery(queryClient)
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'فشل حذف نقطة الموارد', { duration: 4000 })
    },
  })

  return {
    createZone,
    updateZone,
    deleteZone,
    createSafeRoad,
    deleteSafeRoad,
    createResourcePoint,
    deleteResourcePoint,
  }
}
