import type { FacilityCategory } from '@/schemas/healthFacility'

const POOLS: Record<FacilityCategory | 'aid', string[]> = {
  hospitals: [
    '/assets/healthcare1.jpg',
    '/assets/healthcare2.jpg',
    '/assets/healthcare3.jpg',
    '/assets/health1.jpg',
  ],
  pharmacies: [
    '/assets/health7.jpg',
    '/assets/health3.jpg',
    '/assets/health8.jpg',
    '/assets/health9.jpg',
  ],
  labs: [
    '/assets/health9.jpg',
    '/assets/health7.jpg',
    '/assets/health2.jpg',
  ],
  clinics: [
    '/assets/health8.jpg',
    '/assets/health6.jpg',
    '/assets/health1.jpg',
  ],
  dental: [
    '/assets/Photo2.jpg',
    '/assets/health6.jpg',
    '/assets/Photo1.png',
  ],
  aid: [
    '/assets/healthcare1.jpg',
    '/assets/healthcare2.jpg',
    '/assets/healthcare3.jpg',
    '/assets/health4.png',
    '/assets/health5.jpg',
  ],
}

function hashStringToInt(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  }
  return h
}

export function pickLocalImage(
  category: FacilityCategory | 'aid',
  id: string,
): string {
  const pool = POOLS[category] ?? POOLS.hospitals
  const index = Math.abs(hashStringToInt(id)) % pool.length
  return pool[index]
}
