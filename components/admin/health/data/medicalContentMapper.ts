import type {
  AdminHealthMedicalContent,
  CreateAdminHealthContentBody,
} from '@/schemas/adminHealth'
import type { MedicalContentForm } from '../content/types'
import { resolveImageUrl } from '@/lib/utils'

export function mapContentToForm(item: AdminHealthMedicalContent): MedicalContentForm {
  const resolvedThumb = resolveImageUrl(item.thumbnailUrl)
  return {
    title: item.title,
    category: item.category,
    body: item.body ?? item.description ?? '',
    references: item.references ?? '',
    description: item.description,
    status: item.status,
    thumbnailUrl: item.thumbnailUrl,
    attachments: resolvedThumb
      ? [
          {
            id: 'existing-thumb',
            name: item.title || 'صورة المقال',
            url: resolvedThumb,
          },
        ]
      : [],
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
    imageFile: form.attachments?.find((a) => a.file)?.file,
  }
}
