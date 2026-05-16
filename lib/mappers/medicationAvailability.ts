/**
 * Derives a 0–100% availability score from backend medication/supply rows (`status`).
 * Mirrors pharmacy list behavior: permissive for unknown labels, explicit penalties for
 * `unavailable` / `out*` substrings, partial credit for `low_stock`.
 */
export function medicationAvailabilityPercent(
  meds?: Array<{ status?: string }> | null,
): number | undefined {
  if (!meds?.length) return undefined
  let score = 0
  for (const m of meds) {
    const s = (m.status ?? '').toLowerCase()
    if (s === 'low_stock' || s === 'low stock' || s === 'lowstock') {
      score += 0.5
      continue
    }
    if (!s.includes('out') && s !== 'unavailable') {
      score += 1
    }
  }
  return Math.round((score / meds.length) * 100)
}

/** `HospitalDto.currentMedications` is loosely typed in the schema. */
export function medicationRowsFromUnknown(
  items: unknown[] | undefined,
): Array<{ status?: string }> {
  if (!items?.length) return []
  return items.map((item) => {
    if (item && typeof item === 'object' && 'status' in item) {
      const st = (item as { status: unknown }).status
      if (typeof st === 'string') return { status: st }
    }
    return {}
  })
}

/** شريط نسبة التوفر: أحمر → برتقالي → أصفر فقط */
export function availabilityBarColor(percent: number): string {
  const p = Math.max(0, Math.min(100, Math.round(percent)))
  if (p <= 33) return '#F44336'
  if (p <= 66) return '#FF9800'
  return '#FFEB3B'
}
