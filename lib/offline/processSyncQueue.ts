import { hospitalsAPI } from '@/lib/api/hospitals'
import { aidAPI, type AidStatus } from '@/lib/api/aid'
import { profileAPI } from '@/lib/api/profile'
import { submitAidHelpRequest } from '@/lib/api/submitAidHelpRequest'
import {
  safetyAPI,
  type CreateDangerZoneBody,
  type UpdateDangerZoneBody,
  type CreateSafeRoadBody,
  type CreateResourcePointBody,
} from '@/lib/api/safety'
import {
  createAdminHealthFacilityFromApi,
  updateAdminHealthFacilityFromApi,
  deleteAdminHealthFacilityFromApi,
  createAdminHealthContentFromApi,
  updateAdminHealthContentFromApi,
  deleteAdminHealthContentFromApi,
} from '@/lib/api/adminHealth'
import {
  updateAdminAidRequestStatusFromApi,
  createAdminAidPointFromApi,
  updateAdminAidPointFromApi,
  deleteAdminAidPointFromApi,
} from '@/lib/api/adminAid'
import type { AdminAidDistributionPoint } from '@/schemas/adminAid'
import {
  createAdminCommunicationTaskFromApi,
  launchAdminCommunicationBroadcastFromApi,
} from '@/lib/api/adminCommunication'
import {
  approveAdminDataRequestFromApi,
  deleteAdminDataRequestFromApi,
} from '@/lib/api/adminData'
import type {
  CreateAdminCommunicationTaskBody,
  LaunchAdminCommunicationBroadcastBody,
} from '@/schemas/adminCommunication'
import {
  createAdminVolunteer,
  createAdminResident,
  updateAdminUser,
  setAdminUserActive,
  deleteAdminUser,
  restoreAdminUser,
  type CreateAdminVolunteerBody,
  type CreateAdminResidentBody,
  type UpdateAdminUserBody,
} from '@/lib/api/adminUsers'
import { toast } from 'sonner'
import { getToken } from '@/lib/api/auth'
import { getUserIdFromToken } from '@/lib/auth/tokenIdentity'
import { updateOfflineLoginProfile } from '@/lib/auth/offlineLogin'
import { clearLocalOverrides } from '@/lib/profile/localProfileStorage'
import { isConnectivityError } from '@/lib/api/api'
import {
  getPendingOfflineOps,
  markOfflineOpSyncing,
  markOfflineOpDone,
  markOfflineOpFailed,
  markOfflineOpConflict,
  incrementOfflineOpRetry,
  putAdminFacilities,
  getAdminFacilityById,
  putAdminUsers,
  putAdminHealthContent,
  putAidRequests,
  putAdminAidPoints,
  updateCachedAidRequestStatus,
  getOfflineDB,
  type OfflineSyncQueueItem,
} from '@/lib/offline/db'
import type { AidHelpRequestForm } from '@/schemas/aidHelpRequest'
import type { UpdateUserProfileBody } from '@/schemas/userProfile'
import type { HospitalCapacityStatus } from '@/schemas/hospitalApi'
import type { AdminHealthFacilityType, CreateAdminHealthFacilityBody, CreateAdminHealthContentBody, UpdateAdminHealthContentBody } from '@/schemas/adminHealth'

const MAX_RETRIES = 3

function getErrStatus(err: unknown): number | undefined {
  if (err && typeof err === 'object' && 'status' in err) {
    const s = (err as { status?: unknown }).status
    if (typeof s === 'number') return s
  }
  return undefined
}

function getErrMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) {
    const m = (err as { message?: unknown }).message
    if (typeof m === 'string') return m
  }
  if (err instanceof Error) return err.message
  return 'sync failed'
}

/** 4xx client errors (except 408/429) will never succeed on retry. */
function isNonRetryable(status?: number): boolean {
  return status !== undefined && status >= 400 && status < 500 && status !== 408 && status !== 429
}

/** Drop the optimistic local override for a profile edit the backend refused. */
function clearFailedProfileOverrides(payload: Record<string, unknown>): void {
  const userId = getUserIdFromToken(getToken())
  if (!userId) return
  clearLocalOverrides(userId, Object.keys(payload) as (keyof UpdateUserProfileBody)[])
}

/** Toast shown once a previously-queued offline mutation has synced successfully. */
const SYNC_SUCCESS_MESSAGES: Partial<Record<OfflineSyncQueueItem['type'], string>> = {
  CREATE_VOLUNTEER: 'تم إنشاء المتطوع ومزامنته بنجاح',
  CREATE_RESIDENT: 'تم إنشاء بيانات المستفيد ومزامنتها بنجاح',
  UPDATE_ADMIN_USER: 'تم تحديث بيانات المستخدم ومزامنته بنجاح',
  SET_ADMIN_USER_ACTIVE: 'تم تحديث حالة المستخدم ومزامنته بنجاح',
  DELETE_ADMIN_USER: 'تم حذف المستخدم ومزامنته بنجاح',
  RESTORE_ADMIN_USER: 'تمت استعادة المستخدم ومزامنته بنجاح',
  CREATE_FACILITY_TYPED: 'تم إنشاء المنشأة ومزامنتها بنجاح',
  UPDATE_FACILITY_TYPED: 'تم تحديث المنشأة ومزامنتها بنجاح',
  DELETE_FACILITY_TYPED: 'تم حذف المنشأة ومزامنتها بنجاح',
  CREATE_HEALTH_CONTENT: 'تم نشر المحتوى الطبي ومزامنته بنجاح',
  UPDATE_HEALTH_CONTENT: 'تم تحديث المحتوى الطبي ومزامنته بنجاح',
  DELETE_HEALTH_CONTENT: 'تم حذف المحتوى الطبي ومزامنته بنجاح',
  CREATE_AID_POINT: 'تم إنشاء نقطة التوزيع ومزامنتها بنجاح',
  UPDATE_AID_POINT: 'تم تحديث نقطة التوزيع ومزامنتها بنجاح',
  DELETE_AID_POINT: 'تم حذف نقطة التوزيع ومزامنتها بنجاح',
  APPROVE_DATA_REQUEST: 'تم اعتماد طلب تحديث البيانات بنجاح',
  DELETE_DATA_REQUEST: 'تم رفض/حذف طلب تحديث البيانات بنجاح',
}

/** Entity caches holding an optimistic temp record that must be dropped if the create is permanently rejected. */
const OPTIMISTIC_CREATE_TABLES: Partial<Record<OfflineSyncQueueItem['type'], 'adminUsers' | 'adminFacilities' | 'adminHealthContent' | 'adminAidPoints'>> = {
  CREATE_VOLUNTEER: 'adminUsers',
  CREATE_RESIDENT: 'adminUsers',
  CREATE_FACILITY_TYPED: 'adminFacilities',
  CREATE_HEALTH_CONTENT: 'adminHealthContent',
  CREATE_AID_POINT: 'adminAidPoints',
}

/** Remove the optimistic local record for a queued create the backend permanently rejected. */
async function rollbackOptimisticCreate(item: OfflineSyncQueueItem): Promise<void> {
  const table = OPTIMISTIC_CREATE_TABLES[item.type]
  if (!table) return
  const { tempId } = item.payload as { tempId?: string }
  if (!tempId) return
  const db = getOfflineDB()
  await db[table].delete(tempId).catch(() => {})
}

async function processDexieItem(item: OfflineSyncQueueItem): Promise<boolean> {
  if (item.type === 'AID_REQUEST') {
    const result = await submitAidHelpRequest(item.payload as AidHelpRequestForm)
    const { localRequestId } = item.payload as { localRequestId?: string }
    if (result.ok && result.data) {
      const db = getOfflineDB()
      if (localRequestId && localRequestId !== result.data.id) {
        await db.aidRequests.delete(localRequestId)
      }
      await putAidRequests([result.data])
    }
    return result.ok
  }

  if (item.type === 'PROFILE_SYNC') {
    const body = item.payload as UpdateUserProfileBody
    const result = await profileAPI.update(body)
    await updateOfflineLoginProfile(result.profile)
    clearLocalOverrides(
      result.profile.id,
      Object.keys(body) as (keyof UpdateUserProfileBody)[],
    )
    return true
  }

  if (item.type === 'UPDATE_FACILITY_STATUS') {
    const { id, status } = item.payload as { id: string; status: HospitalCapacityStatus }
    await hospitalsAPI.updateStatus(id, { status })
    return true
  }

  if (item.type === 'DELETE_FACILITY') {
    const { id } = item.payload as { id: string }
    await hospitalsAPI.softDelete(id)
    return true
  }

  if (item.type === 'CREATE_AID_POINT') {
    const { body, tempId } = item.payload as { body: AdminAidDistributionPoint; tempId?: string }
    const created = await createAdminAidPointFromApi(body)
    const db = getOfflineDB()
    if (tempId) {
      await db.adminAidPoints.delete(tempId)
    }
    await putAdminAidPoints([created])
    return true
  }

  if (item.type === 'UPDATE_AID_POINT') {
    const { body } = item.payload as { body: AdminAidDistributionPoint }
    const updated = await updateAdminAidPointFromApi(body)
    await putAdminAidPoints([updated])
    return true
  }

  if (item.type === 'DELETE_AID_POINT') {
    const { id } = item.payload as { id: string }
    await deleteAdminAidPointFromApi(id)
    return true
  }

  if (item.type === 'APPROVE_DATA_REQUEST') {
    const { id } = item.payload as { id: string }
    await approveAdminDataRequestFromApi(id)
    return true
  }

  if (item.type === 'DELETE_DATA_REQUEST') {
    const { id } = item.payload as { id: string }
    await deleteAdminDataRequestFromApi(id)
    return true
  }

  if (item.type === 'UPDATE_AID_STATUS') {
    const { id, status } = item.payload as { id: string; status: AidStatus }
    await aidAPI.updateStatus(id, { status })
    return true
  }

  if (item.type === 'UPDATE_AID_REQUEST_STATUS') {
    const { requestId, status } = item.payload as {
      requestId: string
      status: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'fulfilled'
    }
    const updated = await updateAdminAidRequestStatusFromApi(requestId, status)
    await putAidRequests([updated])
    await updateCachedAidRequestStatus(requestId, status)
    return true
  }

  if (item.type === 'CREATE_DANGER_ZONE') {
    const { body } = item.payload as { body: CreateDangerZoneBody }
    await safetyAPI.createZone(body)
    return true
  }

  if (item.type === 'UPDATE_DANGER_ZONE') {
    const { id, body } = item.payload as { id: string; body: UpdateDangerZoneBody }
    await safetyAPI.updateZone(id, body)
    return true
  }

  if (item.type === 'DELETE_DANGER_ZONE') {
    const { id } = item.payload as { id: string }
    await safetyAPI.deleteZone(id)
    return true
  }

  if (item.type === 'CREATE_SAFE_ROAD') {
    const { body } = item.payload as { body: CreateSafeRoadBody }
    await safetyAPI.createSafeRoad(body)
    return true
  }

  if (item.type === 'DELETE_SAFE_ROAD') {
    const { id } = item.payload as { id: string }
    await safetyAPI.deleteSafeRoad(id)
    return true
  }

  if (item.type === 'CREATE_RESOURCE_POINT') {
    const { body } = item.payload as { body: CreateResourcePointBody }
    await safetyAPI.createResourcePoint(body)
    return true
  }

  if (item.type === 'DELETE_RESOURCE_POINT') {
    const { id } = item.payload as { id: string }
    await safetyAPI.deleteResourcePoint(id)
    return true
  }

  if (item.type === 'CREATE_FACILITY_TYPED') {
    const { body, facilityType, tempId } = item.payload as {
      body: CreateAdminHealthFacilityBody
      facilityType?: AdminHealthFacilityType
      tempId: string
    }
    const created = await createAdminHealthFacilityFromApi(body, facilityType)
    // Replace optimistic temp record with the real server record
    const db = getOfflineDB()
    await db.adminFacilities.delete(tempId)
    await putAdminFacilities([created])
    return true
  }

  if (item.type === 'UPDATE_FACILITY_TYPED') {
    const { id, body, facilityType } = item.payload as {
      id: string
      body: CreateAdminHealthFacilityBody
      facilityType?: AdminHealthFacilityType
    }
    const updated = await updateAdminHealthFacilityFromApi(id, body, facilityType)
    await putAdminFacilities([updated])
    return true
  }

  if (item.type === 'DELETE_FACILITY_TYPED') {
    const { id, facilityType } = item.payload as { id: string; facilityType?: AdminHealthFacilityType }
    await deleteAdminHealthFacilityFromApi(id, facilityType)
    return true
  }

  if (item.type === 'CREATE_HEALTH_CONTENT') {
    const { body, tempId } = item.payload as { body: CreateAdminHealthContentBody; tempId?: string }
    const created = await createAdminHealthContentFromApi(body)
    // Replace optimistic temp record with the real server record
    if (tempId) {
      const db = getOfflineDB()
      await db.adminHealthContent.delete(tempId)
    }
    await putAdminHealthContent([created])
    return true
  }

  if (item.type === 'UPDATE_HEALTH_CONTENT') {
    const { id, body } = item.payload as { id: string; body: UpdateAdminHealthContentBody }
    const updated = await updateAdminHealthContentFromApi(id, body)
    await putAdminHealthContent([updated])
    return true
  }

  if (item.type === 'DELETE_HEALTH_CONTENT') {
    const { id } = item.payload as { id: string }
    await deleteAdminHealthContentFromApi(id)
    return true
  }

  if (item.type === 'CREATE_VOLUNTEER') {
    const { body, tempId } = item.payload as { body: CreateAdminVolunteerBody; tempId: string }
    const created = await createAdminVolunteer(body)
    const db = getOfflineDB()
    await db.adminUsers.delete(tempId)
    if (created) await putAdminUsers([created])
    return true
  }

  if (item.type === 'CREATE_RESIDENT') {
    const { body, tempId } = item.payload as { body: CreateAdminResidentBody; tempId: string }
    const created = await createAdminResident(body)
    const db = getOfflineDB()
    await db.adminUsers.delete(tempId)
    if (created) await putAdminUsers([created])
    return true
  }

  if (item.type === 'UPDATE_ADMIN_USER') {
    const { id, body } = item.payload as { id: string; body: UpdateAdminUserBody }
    const updated = await updateAdminUser(id, body)
    await putAdminUsers([updated])
    return true
  }

  if (item.type === 'SET_ADMIN_USER_ACTIVE') {
    const { id, isActive } = item.payload as { id: string; isActive: boolean }
    const updated = await setAdminUserActive(id, isActive)
    if (updated) await putAdminUsers([updated])
    return true
  }

  if (item.type === 'DELETE_ADMIN_USER') {
    const { id } = item.payload as { id: string }
    await deleteAdminUser(id)
    return true
  }

  if (item.type === 'RESTORE_ADMIN_USER') {
    const { id } = item.payload as { id: string }
    const restored = await restoreAdminUser(id)
    await putAdminUsers([restored])
    return true
  }

  if (item.type === 'CREATE_COMMUNICATION_TASK') {
    const { body } = item.payload as { body: CreateAdminCommunicationTaskBody }
    await createAdminCommunicationTaskFromApi(body)
    return true
  }

  if (item.type === 'LAUNCH_COMMUNICATION_BROADCAST') {
    const { body } = item.payload as { body: LaunchAdminCommunicationBroadcastBody }
    await launchAdminCommunicationBroadcastFromApi(body)
    return true
  }

  return false
}

let isProcessing = false

export async function processSyncQueue(): Promise<void> {
  console.log(`[CONN-DEBUG] processSyncQueue() called @ ${Date.now()} navigator.onLine=${typeof window !== 'undefined' ? navigator.onLine : 'n/a'} isProcessing=${isProcessing}`)
  if (typeof window === 'undefined' || !navigator.onLine) {
    console.log(`[CONN-DEBUG] processSyncQueue() EXIT early — window undefined or navigator.onLine=false`)
    return
  }
  // Multiple independent triggers (online event, SW background sync message,
  // manual calls) can all fire processSyncQueue() within the same moment —
  // without this guard, the same queued item could be sent to the backend
  // twice before the first call marks it done.
  if (isProcessing) {
    console.log(`[CONN-DEBUG] processSyncQueue() EXIT early — already processing`)
    return
  }
  isProcessing = true

  let processedAny = false

  try {
    const items = await getPendingOfflineOps()
    console.log(`[CONN-DEBUG] processSyncQueue() found ${items.length} pending item(s): ${items.map((i) => i.type).join(', ') || '(none)'}`)
    for (const item of items) {
      if (item.id == null) continue
      processedAny = true

      if (item.retries >= MAX_RETRIES) {
        await markOfflineOpFailed(item.id, 'max retries exceeded')
        await rollbackOptimisticCreate(item)
        continue
      }

      await markOfflineOpSyncing(item.id)

      try {
        const ok = await processDexieItem(item)
        if (ok) {
          await markOfflineOpDone(item.id)
          const successMsg = SYNC_SUCCESS_MESSAGES[item.type]
          if (successMsg) toast.success(successMsg, { duration: 3500 })
        } else {
          await incrementOfflineOpRetry(item.id)
        }
      } catch (err) {
        const isConnErr = isConnectivityError(err) ||
          (err && typeof err === 'object' && 'status' in err && (err as any).status === 0) ||
          (err instanceof Error && err.message.toLowerCase().includes('failed to fetch'))

        if (isConnErr) {
          console.warn(`[Sync Queue] Connectivity error during sync. Aborting queue processing to avoid losing changes.`, err)
          const db = getOfflineDB()
          await db.offlineSyncQueue.update(item.id, { status: 'pending' }).catch(() => {})
          break
        }

        const status = getErrStatus(err)
        const msg = getErrMessage(err)
        const nonRetryable = isNonRetryable(status)
        const exhausted = item.retries + 1 >= MAX_RETRIES

        console.error(`[Sync Queue] Error processing item ${item.id} (${item.type}):`, err)

        // A backend rejection (e.g. failed validation) will never succeed on
        // retry. Fail it immediately and roll back the optimistic local state so
        // offline ends up consistent with what the server actually accepted.
        if (nonRetryable) {
          await markOfflineOpFailed(item.id, msg)
          if (item.type === 'PROFILE_SYNC') {
            clearFailedProfileOverrides(item.payload)
            toast.error(`تعذّر حفظ تعديلات الملف الشخصي: ${msg}`)
          } else if (OPTIMISTIC_CREATE_TABLES[item.type]) {
            await rollbackOptimisticCreate(item)
            toast.error(`تعذّر حفظ العملية: ${msg}`, { duration: 5000 })
          } else {
            toast.error(`تعذّر مزامنة العملية (${item.type}): ${msg}`, { duration: 5000 })
          }
          continue
        }

        await incrementOfflineOpRetry(item.id)

        if (status === 409 || msg.toLowerCase().includes('conflict')) {
          await markOfflineOpConflict(item.id)
        } else if (exhausted) {
          await markOfflineOpFailed(item.id, msg)
          if (item.type === 'PROFILE_SYNC') {
            clearFailedProfileOverrides(item.payload)
            toast.error('تعذّر مزامنة تعديلات الملف الشخصي بعد عدة محاولات')
          } else if (OPTIMISTIC_CREATE_TABLES[item.type]) {
            await rollbackOptimisticCreate(item)
            toast.error('تعذّرت مزامنة العملية بعد عدة محاولات', { duration: 5000 })
          } else {
            toast.error(`فشلت مزامنة العملية (${item.type}) بعد عدة محاولات`, { duration: 5000 })
          }
        }
      }
    }
  } finally {
    isProcessing = false
    console.log(`[CONN-DEBUG] processSyncQueue() finished @ ${Date.now()} processedAny=${processedAny}`)
    if (processedAny && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('najat:sync-queue-processed'))
    }
  }
}
