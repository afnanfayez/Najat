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
import {
  transformDangerZone,
  transformSafeRoad,
  transformResourcePoint,
  type SafetyMapLayers,
} from '@/lib/maps/safetyMapTransforms'
import { isConnectivityError } from '@/lib/api/api'
import { isBrowserOffline } from '@/lib/offline/connectionState'

const QUERY_KEY = ['safety', 'map-data'] as const

function isOffline() {
  return isBrowserOffline()
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
}

export function useSafetyAdminMutations() {
  const queryClient = useQueryClient()

  // ── Create Danger Zone (requires geometry — used from map editor only) ───
  const createZone = useMutation({
    mutationFn: async (body: CreateDangerZoneBody) => {
      const handleOffline = async () => {
        const tempId = `temp-zone-${Date.now()}`
        await enqueueOfflineOp({ type: 'CREATE_DANGER_ZONE', payload: { body } })
        
        const cached = await getSafetyMapLayers()
        if (cached) {
          const transformed = transformDangerZone({
            id: tempId,
            description: body.description,
            dangerLevel: body.dangerLevel,
            area: body.area as any,
            isActive: body.isActive,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deletedAt: null,
            version: 1,
          })
          if (transformed) {
            const updatedLayers = { ...cached, dangerZones: [...cached.dangerZones, transformed] }
            await putSafetyMapLayers(updatedLayers)
            queryClient.setQueryData(QUERY_KEY, updatedLayers)
          }
        }
        
        toast.info('ستُضاف منطقة الخطر عند عودة الاتصال', { duration: 4000 })
        return null
      }

      if (isOffline()) {
        return handleOffline()
      }
      try {
        return await safetyAPI.createZone(body)
      } catch (err) {
        if (isConnectivityError(err)) {
          return handleOffline()
        }
        throw err
      }
    },
    onSuccess: async (result) => {
      if (result !== null) {
        const transformed = transformDangerZone(result)
        if (transformed) {
          queryClient.setQueryData<SafetyMapLayers>(QUERY_KEY, (old) => {
            if (!old) return { safeRoads: [], dangerZones: [transformed], resourcePoints: [] }
            if (old.dangerZones.some((z) => z.id === transformed.id)) return old
            return { ...old, dangerZones: [...old.dangerZones, transformed] }
          })
          const updated = queryClient.getQueryData<SafetyMapLayers>(QUERY_KEY)
          if (updated) {
            await putSafetyMapLayers(updated)
          }
        }
      }
      await persistCacheFromQuery(queryClient)
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'فشل إنشاء منطقة الخطر', { duration: 4000 })
    },
  })

  // ── Update Danger Zone (text fields only — geometry unchanged) ───────────
  const updateZone = useMutation({
    mutationFn: async ({ id, body }: { id: string; body: UpdateDangerZoneBody }) => {
      const handleOffline = async () => {
        const cached = await getSafetyMapLayers()
        if (cached) {
          const updatedZones = cached.dangerZones.map((z) => {
            if (z.id === id) {
              return {
                ...z,
                description: body.description ?? z.description,
                dangerLevel: body.dangerLevel ?? z.dangerLevel,
                isActive: body.isActive !== undefined ? body.isActive : z.isActive,
              }
            }
            return z
          })
          const updatedLayers = { ...cached, dangerZones: updatedZones }
          await putSafetyMapLayers(updatedLayers)
          queryClient.setQueryData(QUERY_KEY, updatedLayers)
        }
        await enqueueOfflineOp({ type: 'UPDATE_DANGER_ZONE', payload: { id, body } })
        toast.info('سيُحدَّث التغيير عند عودة الاتصال', { duration: 4000 })
        return null
      }

      if (isOffline()) {
        return handleOffline()
      }
      try {
        return await safetyAPI.updateZone(id, body)
      } catch (err) {
        if (isConnectivityError(err)) {
          return handleOffline()
        }
        throw err
      }
    },
    onSuccess: async (result) => {
      if (result !== null) {
        const transformed = transformDangerZone(result)
        if (transformed) {
          queryClient.setQueryData<SafetyMapLayers>(QUERY_KEY, (old) => {
            if (!old) return old
            return {
              ...old,
              dangerZones: old.dangerZones.map((z) => z.id === transformed.id ? transformed : z)
            }
          })
          const updated = queryClient.getQueryData<SafetyMapLayers>(QUERY_KEY)
          if (updated) {
            await putSafetyMapLayers(updated)
          }
        }
      }
      await persistCacheFromQuery(queryClient)
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'فشل تحديث منطقة الخطر', { duration: 4000 })
    },
  })

  // ── Delete Danger Zone — works offline via queue ──────────────────────────
  const deleteZone = useMutation({
    mutationFn: async (id: string) => {
      const handleOffline = async () => {
        await enqueueOfflineOp({ type: 'DELETE_DANGER_ZONE', payload: { id } })
        await optimisticRemove(queryClient, id, 'zone')
        toast.info('سيُحذف السجل عند عودة الاتصال', { duration: 4000 })
        return null
      }

      if (isOffline()) {
        return handleOffline()
      }
      try {
        await safetyAPI.deleteZone(id)
        return id
      } catch (err) {
        if (isConnectivityError(err)) {
          return handleOffline()
        }
        throw err
      }
    },
    onSuccess: async (id) => {
      if (id !== null) {
        queryClient.setQueryData<SafetyMapLayers>(QUERY_KEY, (old) => {
          if (!old) return old
          return { ...old, dangerZones: old.dangerZones.filter((z) => z.id !== id) }
        })
        const updated = queryClient.getQueryData<SafetyMapLayers>(QUERY_KEY)
        if (updated) {
          await putSafetyMapLayers(updated)
        }
      }
      await persistCacheFromQuery(queryClient)
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'فشل حذف منطقة الخطر', { duration: 4000 })
    },
  })

  // ── Create Safe Road (requires geometry — used from map editor only) ──────
  const createSafeRoad = useMutation({
    mutationFn: async (body: CreateSafeRoadBody) => {
      const handleOffline = async () => {
        const tempId = `temp-road-${Date.now()}`
        await enqueueOfflineOp({ type: 'CREATE_SAFE_ROAD', payload: { body } })
        
        const cached = await getSafetyMapLayers()
        if (cached) {
          const transformed = transformSafeRoad({
            id: tempId,
            name: body.name,
            description: body.description ?? '',
            path: body.path as any,
            isActive: body.isActive ?? true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deletedAt: null,
            version: 1,
          })
          if (transformed) {
            const updatedLayers = { ...cached, safeRoads: [...cached.safeRoads, transformed] }
            await putSafetyMapLayers(updatedLayers)
            queryClient.setQueryData(QUERY_KEY, updatedLayers)
          }
        }
        
        toast.info('سيُضاف المسار الآمن عند عودة الاتصال', { duration: 4000 })
        return null
      }

      if (isOffline()) {
        return handleOffline()
      }
      try {
        return await safetyAPI.createSafeRoad(body)
      } catch (err) {
        if (isConnectivityError(err)) {
          return handleOffline()
        }
        throw err
      }
    },
    onSuccess: async (result) => {
      if (result !== null) {
        const transformed = transformSafeRoad(result)
        if (transformed) {
          queryClient.setQueryData<SafetyMapLayers>(QUERY_KEY, (old) => {
            if (!old) return { safeRoads: [transformed], dangerZones: [], resourcePoints: [] }
            if (old.safeRoads.some((r) => r.id === transformed.id)) return old
            return { ...old, safeRoads: [...old.safeRoads, transformed] }
          })
          const updated = queryClient.getQueryData<SafetyMapLayers>(QUERY_KEY)
          if (updated) {
            await putSafetyMapLayers(updated)
          }
        }
      }
      await persistCacheFromQuery(queryClient)
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'فشل إنشاء المسار الآمن', { duration: 4000 })
    },
  })

  // ── Delete Safe Road — works offline via queue ────────────────────────────
  const deleteSafeRoad = useMutation({
    mutationFn: async (id: string) => {
      const handleOffline = async () => {
        await enqueueOfflineOp({ type: 'DELETE_SAFE_ROAD', payload: { id } })
        await optimisticRemove(queryClient, id, 'road')
        toast.info('سيُحذف المسار عند عودة الاتصال', { duration: 4000 })
        return null
      }

      if (isOffline()) {
        return handleOffline()
      }
      try {
        await safetyAPI.deleteSafeRoad(id)
        return id
      } catch (err) {
        if (isConnectivityError(err)) {
          return handleOffline()
        }
        throw err
      }
    },
    onSuccess: async (id) => {
      if (id !== null) {
        queryClient.setQueryData<SafetyMapLayers>(QUERY_KEY, (old) => {
          if (!old) return old
          return { ...old, safeRoads: old.safeRoads.filter((r) => r.id !== id) }
        })
        const updated = queryClient.getQueryData<SafetyMapLayers>(QUERY_KEY)
        if (updated) {
          await putSafetyMapLayers(updated)
        }
      }
      await persistCacheFromQuery(queryClient)
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'فشل حذف المسار الآمن', { duration: 4000 })
    },
  })

  // ── Create Resource Point (requires geometry — used from map editor) ──────
  const createResourcePoint = useMutation({
    mutationFn: async (body: CreateResourcePointBody) => {
      const handleOffline = async () => {
        const tempId = `temp-point-${Date.now()}`
        await enqueueOfflineOp({ type: 'CREATE_RESOURCE_POINT', payload: { body } })
        
        const cached = await getSafetyMapLayers()
        if (cached) {
          const transformed = transformResourcePoint({
            id: tempId,
            name: body.name,
            description: body.description ?? '',
            type: body.type,
            location: body.location as any,
            isActive: body.isActive ?? true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deletedAt: null,
            version: 1,
          })
          if (transformed) {
            const updatedLayers = { ...cached, resourcePoints: [...cached.resourcePoints, transformed] }
            await putSafetyMapLayers(updatedLayers)
            queryClient.setQueryData(QUERY_KEY, updatedLayers)
          }
        }
        
        toast.info('ستُضاف نقطة الموارد عند عودة الاتصال', { duration: 4000 })
        return null
      }

      if (isOffline()) {
        return handleOffline()
      }
      try {
        return await safetyAPI.createResourcePoint(body)
      } catch (err) {
        if (isConnectivityError(err)) {
          return handleOffline()
        }
        throw err
      }
    },
    onSuccess: async (result) => {
      if (result !== null) {
        const transformed = transformResourcePoint(result)
        if (transformed) {
          queryClient.setQueryData<SafetyMapLayers>(QUERY_KEY, (old) => {
            if (!old) return { safeRoads: [], dangerZones: [], resourcePoints: [transformed] }
            if (old.resourcePoints.some((p) => p.id === transformed.id)) return old
            return { ...old, resourcePoints: [...old.resourcePoints, transformed] }
          })
          const updated = queryClient.getQueryData<SafetyMapLayers>(QUERY_KEY)
          if (updated) {
            await putSafetyMapLayers(updated)
          }
        }
      }
      await persistCacheFromQuery(queryClient)
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'فشل إنشاء نقطة الموارد', { duration: 4000 })
    },
  })

  // ── Delete Resource Point — works offline via queue ───────────────────────
  const deleteResourcePoint = useMutation({
    mutationFn: async (id: string) => {
      const handleOffline = async () => {
        await enqueueOfflineOp({ type: 'DELETE_RESOURCE_POINT', payload: { id } })
        await optimisticRemove(queryClient, id, 'point')
        toast.info('ستُحذف نقطة الموارد عند عودة الاتصال', { duration: 4000 })
        return null
      }

      if (isOffline()) {
        return handleOffline()
      }
      try {
        await safetyAPI.deleteResourcePoint(id)
        return id
      } catch (err) {
        if (isConnectivityError(err)) {
          return handleOffline()
        }
        throw err
      }
    },
    onSuccess: async (id) => {
      if (id !== null) {
        queryClient.setQueryData<SafetyMapLayers>(QUERY_KEY, (old) => {
          if (!old) return old
          return { ...old, resourcePoints: old.resourcePoints.filter((p) => p.id !== id) }
        })
        const updated = queryClient.getQueryData<SafetyMapLayers>(QUERY_KEY)
        if (updated) {
          await putSafetyMapLayers(updated)
        }
      }
      await persistCacheFromQuery(queryClient)
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
