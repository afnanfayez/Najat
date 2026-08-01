import { z } from 'zod'
import { bilingualMessageSchema } from '@/schemas/shared'

/** Matches communication_tasks.status (supabase/migrations/0011_admin_communication.sql). */
export const volunteerTaskStatusSchema = z.enum(['pending', 'in_progress', 'completed'])

export type VolunteerTaskStatus = z.infer<typeof volunteerTaskStatusSchema>

/**
 * A task an admin assigned to the signed-in volunteer.
 *
 * Nullable-tolerant throughout: `priority`, `due_date` and `due_time` are all
 * nullable columns, and a JSON null against a bare `.optional()` would reject
 * the whole page of results — the exact failure that blanked the aid list (see
 * supabase/migrations/0024_fix_null_aid_arrays.sql).
 */
export const volunteerTaskDtoSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullish(),
    volunteerId: z.string().nullish(),
    priority: z.string().nullish(),
    dueDate: z.string().nullish(),
    dueTime: z.string().nullish(),
    status: volunteerTaskStatusSchema.catch('pending'),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })
  .passthrough()

export type VolunteerTaskDto = z.infer<typeof volunteerTaskDtoSchema>

export const volunteerTasksResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number().optional(),
  message: bilingualMessageSchema.optional(),
  data: z.array(volunteerTaskDtoSchema),
  meta: z.object({ totalItems: z.coerce.number() }).passthrough().optional(),
  timestamp: z.string().optional(),
})

export type VolunteerTasksResponse = z.infer<typeof volunteerTasksResponseSchema>

export const volunteerTaskResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number().optional(),
  message: bilingualMessageSchema.optional(),
  data: volunteerTaskDtoSchema,
  timestamp: z.string().optional(),
})

/** UI-facing shape after mapping — see lib/mappers/volunteerTask.ts. */
export interface VolunteerTask {
  id: string
  title: string
  description: string
  status: VolunteerTaskStatus
  priority: 'high' | 'medium' | 'low'
  dueLabel: string
  createdAt?: string
}
