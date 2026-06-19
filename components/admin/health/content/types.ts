import type {
  AdminHealthContentCategory,
  AdminHealthContentStatus,
} from '@/schemas/adminHealth'

export type MedicalContentAttachment = {
  id: string
  name: string
  url: string
  file?: File
}

export type MedicalContentForm = {
  title: string
  category: AdminHealthContentCategory
  body: string
  references: string
  description: string
  status: AdminHealthContentStatus
  thumbnailUrl: string
  attachments: MedicalContentAttachment[]
}

export const INITIAL_MEDICAL_CONTENT: MedicalContentForm = {
  title: '',
  category: 'first-aid',
  body: '',
  references: '',
  description: '',
  status: 'published',
  thumbnailUrl: '/assets/artical.png',
  attachments: [],
}
