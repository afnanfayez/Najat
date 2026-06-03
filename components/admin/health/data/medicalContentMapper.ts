import type {
  AdminHealthMedicalContent,
  CreateAdminHealthContentBody,
} from '@/schemas/adminHealth'
import type { MedicalContentForm } from '../content/types'

export function mapContentToForm(item: AdminHealthMedicalContent): MedicalContentForm {
  return {
    title: item.title,
    category: item.category,
    body: item.body ?? item.description ?? '',
    references: item.references ?? '',
    description: item.description,
    status: item.status,
    thumbnailUrl: item.thumbnailUrl,
    attachments: [],
  }
}

export function mapContentFormToBody(
  form: MedicalContentForm,
): CreateAdminHealthContentBody {
  return {
    title: form.title.trim(),
    category: form.category,
    body: form.body.trim(),
    references: form.references.trim(),
    description: form.description.trim() || form.body.trim().slice(0, 120),
    status: form.status,
    thumbnailUrl: form.thumbnailUrl,
  }
}
