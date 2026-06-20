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
  // Find a new image file being uploaded (has an actual File object)
  const newImageAttachment = form.attachments?.find((a) => a.file)
  // Find an existing server image (no File object, but has a valid URL from the server)
  const existingImageAttachment = form.attachments?.find(
    (a) => !a.file && a.url && !a.url.startsWith('blob:')
  )

  // Only send thumbnailUrl if it is a real server URL (not a blob)
  let thumbnailUrl: string | undefined = form.thumbnailUrl
  if (thumbnailUrl?.startsWith('blob:')) {
    // Will be replaced by the uploaded file on the server side
    thumbnailUrl = undefined
  }

  // If user didn't upload a new file but there is an existing server image, keep it
  if (!newImageAttachment && existingImageAttachment) {
    thumbnailUrl = existingImageAttachment.url
  }

  return {
    title: form.title.trim(),
    category: form.category,
    body: form.body.trim(),
    references: form.references.trim(),
    description: form.description.trim() || form.body.trim().slice(0, 120),
    status: form.status,
    thumbnailUrl,
    imageFile: newImageAttachment?.file,
  }
}
