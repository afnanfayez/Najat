const HOUSING_LABELS: Record<string, string> = {
  owned: 'بيت ملك',
  rented: 'بيت إيجار',
  tent: 'خيمة',
  camp: 'مخيم',
  Owner: 'بيت ملك',
}

const HEALTH_LABELS: Record<string, string> = {
  Healthy: 'سليم',
  'Chronically Ill': 'مرض مزمن',
  Injured: 'مصاب',
  Amputee: 'بتر',
}

export function labelHousingStatus(value?: string | null): string {
  if (!value) return '—'
  return HOUSING_LABELS[value] ?? value
}

export function labelHealthStatus(value?: string | null): string {
  if (!value) return '—'
  return HEALTH_LABELS[value] ?? value
}

export function formatFamilyCount(
  total?: number | null,
  males?: number | null,
  females?: number | null,
): string {
  if (total == null) return '—'
  const parts = [`${total}`]
  if (males != null || females != null) {
    parts.push(`(ذكور: ${males ?? 0} · إناث: ${females ?? 0})`)
  }
  return parts.join(' ')
}
