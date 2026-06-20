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
import { updateAdminAidRequestStatusFromApi } from '@/lib/api/adminAid'
import {
  createAdminCommunicationTaskFromApi,
  launchAdminCommunicationBroadcastFromApi,
} from '@/lib/api/adminCommunication'
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
  putAidRequests,
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
    const { body } = item.payload as { body: Record<string, unknown> }
    await aidAPI.create(body)
    return true
  }

  if (item.type === 'UPDATE_AID_POINT') {
    const { id, body } = item.payload as { id: string; body: Record<string, unknown> }
    await aidAPI.update(id, body)
    return true
  }

  if (item.type === 'DELETE_AID_POINT') {
    const { id } = item.payload as { id: string }
    await aidAPI.softDelete(id)
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
      status: 'pending' | 'approved' | 'rejected' | 'fulfilled'
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
    const { body } = item.payload as { body: CreateAdminHealthContentBody }
    await createAdminHealthContentFromApi(body)
    return true
  }

  if (item.type === 'UPDATE_HEALTH_CONTENT') {
    const { id, body } = item.payload as { id: string; body: UpdateAdminHealthContentBody }
    await updateAdminHealthContentFromApi(id, body)
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
  if (typeof window === 'undefined' || !navigator.onLine) return
  // Multiple independent triggers (online event, SW background sync message,
  // manual calls) can all fire processSyncQueue() within the same moment —
  // without this guard, the same queued item could be sent to the backend
  // twice before the first call marks it done.
  if (isProcessing) return
  isProcessing = true

  try {
    const items = await getPendingOfflineOps()
    for (const item of items) {
      if (item.id == null) continue

      if (item.retries >= MAX_RETRIES) {
        await markOfflineOpFailed(item.id, 'max retries exceeded')
        continue
      }

      await markOfflineOpSyncing(item.id)

      try {
        const ok = await processDexieItem(item)
        if (ok) {
          await markOfflineOpDone(item.id)
        } else {
          await incrementOfflineOpRetry(item.id)
        }
      } catch (err) {
        const status = getErrStatus(err)
        const msg = getErrMessage(err)
        const nonRetryable = isNonRetryable(status)
        const exhausted = item.retries + 1 >= MAX_RETRIES

        // A backend rejection (e.g. failed validation) will never succeed on
        // retry. Fail it immediately and roll back the optimistic local state so
        // offline ends up consistent with what the server actually accepted.
        if (nonRetryable) {
          await markOfflineOpFailed(item.id, msg)
          if (item.type === 'PROFILE_SYNC') {
            clearFailedProfileOverrides(item.payload)
            toast.error(`تعذّر حفظ تعديلات الملف الشخصي: ${msg}`)
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
          }
        }
      }
    }
  } finally {
    isProcessing = false
  }
}
