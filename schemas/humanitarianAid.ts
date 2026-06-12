import { z } from 'zod'

export const humanitarianAidSchema = z.object({
  id: z.string(),
  name: z.string(),
  provider: z.string(),
  description: z.string(),
  status: z.enum(['active', 'limited', 'stopped']),
  tags: z.array(z.string()),
  category: z.string(),
  regions: z.array(z.string()).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
})

export type HumanitarianAid = z.infer<typeof humanitarianAidSchema>

export const AID_STATUS_LABELS: Record<HumanitarianAid['status'], string> = {
  active: 'نشط الآن',
  limited: 'نشط محدود',
  stopped: 'متوقف الآن',
}

export const AID_STATUS_COLORS: Record<HumanitarianAid['status'], string> = {
  active: '#4CAF50',
  limited: '#FF9800',
  stopped: '#F44336',
}
