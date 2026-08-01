import type { VolunteerTask, VolunteerTaskDto } from '@/schemas/volunteerApi'

/**
 * Admins pick priority from a free-text select (see AdminCommunicationAddTaskModal),
 * so normalise the Arabic labels and the English enum onto one UI scale.
 */
function mapPriority(raw?: string | null): VolunteerTask['priority'] {
  if (!raw) return 'medium'
  const value = raw.trim().toLowerCase()
  if (value === 'urgent' || value === 'high' || value.includes('عاجل') || value.includes('مرتفع')) {
    return 'high'
  }
  if (value === 'low' || value.includes('منخفض')) return 'low'
  return 'medium'
}

const DATE_FORMATTER = new Intl.DateTimeFormat('ar', {
  day: 'numeric',
  month: 'long',
})

function formatDueLabel(dueDate?: string | null, dueTime?: string | null): string {
  if (!dueDate) return dueTime?.trim() || 'بدون موعد محدّد'

  const parsed = new Date(dueDate)
  if (Number.isNaN(parsed.getTime())) return dueTime?.trim() || 'بدون موعد محدّد'

  const day = DATE_FORMATTER.format(parsed)
  const time = dueTime?.trim()
  return time ? `${day}، ${time}` : day
}

export function mapVolunteerTaskDto(dto: VolunteerTaskDto): VolunteerTask {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description?.trim() || '',
    status: dto.status,
    priority: mapPriority(dto.priority),
    dueLabel: formatDueLabel(dto.dueDate, dto.dueTime),
    createdAt: dto.createdAt,
  }
}
