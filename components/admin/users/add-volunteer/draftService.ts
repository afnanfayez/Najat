import type { VolunteerFormData } from './types'

const DRAFT_KEY = 'volunteer-draft'

export type VolunteerDraft = {
  data: VolunteerFormData
  step: number
  savedAt: string
}

/**
 * Saves the current form state as a draft.
 * TODO: Replace localStorage with POST /v1/admin/volunteers/draft when backend is ready.
 */
export async function saveDraft(data: VolunteerFormData, step: number): Promise<void> {
  // Backend integration point — swap this block for an API call:
  // await request('/v1/admin/volunteers/draft', { method: 'POST', body: JSON.stringify({ ...data, step }) })
  const draft: VolunteerDraft = { data, step, savedAt: new Date().toISOString() }
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
}

/**
 * Loads a previously saved draft.
 * TODO: Replace with GET /v1/admin/volunteers/draft when backend is ready.
 */
export function loadDraft(): VolunteerDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    return JSON.parse(raw) as VolunteerDraft
  } catch {
    return null
  }
}

/**
 * Clears the saved draft after successful submission.
 * TODO: Call DELETE /v1/admin/volunteers/draft when backend is ready.
 */
export function clearDraft(): void {
  localStorage.removeItem(DRAFT_KEY)
}
