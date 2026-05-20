export type UserRole = 'admin' | 'volunteer' | 'resident'

export const ROLE_LABELS: Record<string, string> = {
  admin: 'مدير',
  volunteer: 'متطوع',
  resident: 'مستفيد',
}

export const ROLE_BADGE_STYLES: Record<string, { bg: string; text: string }> = {
  admin:     { bg: 'bg-purple-100', text: 'text-purple-700' },
  volunteer: { bg: 'bg-green-100',  text: 'text-green-700'  },
  resident:  { bg: 'bg-orange-100', text: 'text-orange-600' },
}

export const isAdmin = (role?: string | null): boolean => role === 'admin'
export const isVolunteerOrAdmin = (role?: string | null): boolean =>
  role === 'admin' || role === 'volunteer'

export function roleLabel(role?: string | null): string {
  return role ? (ROLE_LABELS[role] ?? role) : 'مستفيد'
}

export function roleBadgeStyle(role?: string | null): { bg: string; text: string } {
  return (role ? ROLE_BADGE_STYLES[role] : undefined) ?? ROLE_BADGE_STYLES.resident
}
