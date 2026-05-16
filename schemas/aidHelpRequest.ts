import { z } from 'zod'

const familyCountField = z
  .union([z.string(), z.number()])
  .transform((v) => {
    const n = typeof v === 'number' ? v : parseInt(String(v).trim(), 10)
    if (!Number.isFinite(n)) return 0
    return Math.min(50, Math.max(0, Math.trunc(n)))
  })

export const aidHelpRequestFormSchema = z.object({
  aidOrganizationId: z.string().min(1),
  husbandName: z.string().min(1, 'الاسم مطلوب'),
  husbandNationalId: z.string().min(6, 'رقم الهوية مطلوب'),
  wifeName: z.string().min(1, 'الاسم مطلوب'),
  wifeNationalId: z.string().min(6, 'رقم الهوية مطلوب'),
  daughtersCount: familyCountField,
  sonsCount: familyCountField,
  phone: z.string().min(8, 'رقم هاتف صالح مطلوب'),
  currentLocation: z.string().min(2, 'الموقع مطلوب'),
  notes: z.string().optional(),
})

export type AidHelpRequestForm = z.infer<typeof aidHelpRequestFormSchema>
