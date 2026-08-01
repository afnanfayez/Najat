import { request } from '@/lib/api/api'
import {
  volunteerTasksResponseSchema,
  volunteerTaskResponseSchema,
  type VolunteerTaskDto,
  type VolunteerTaskStatus,
} from '@/schemas/volunteerApi'

const V1_ROOT = process.env.NEXT_PUBLIC_API_V1_ROOT?.replace(/\/$/, '') ?? '/v1'

export const volunteerAPI = {
  /** Tasks assigned to the signed-in volunteer. Scoped server-side by RLS. */
  listTasks(): Promise<VolunteerTaskDto[]> {
    return request(`${V1_ROOT}/volunteer/tasks`).then(
      (raw) => volunteerTasksResponseSchema.parse(raw).data,
    )
  },

  /** Advance a task's status. The only field a volunteer may change. */
  updateTaskStatus(id: string, status: VolunteerTaskStatus): Promise<VolunteerTaskDto> {
    return request(`${V1_ROOT}/volunteer/tasks/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }).then((raw) => volunteerTaskResponseSchema.parse(raw).data)
  },
}
