import { request } from '@/lib/api/api'

const V1_ROOT = process.env.NEXT_PUBLIC_API_V1_ROOT?.replace(/\/$/, '') ?? '/v1'

export interface PublicVolunteer {
  id: string
  name: string
  fullName: string
  email: string
  phoneNumber?: string
  region?: string
  gender?: string
  status?: string
}

export const FALLBACK_VOLUNTEERS: PublicVolunteer[] = [
  {
    id: 'vol-fallback-1',
    name: 'محمد إبراهيم عودة',
    fullName: 'محمد إبراهيم عودة',
    email: 'volunteer@najat.ps',
    phoneNumber: '0599222333',
    region: 'خانيونس',
    gender: 'male',
    status: 'active',
  },
  {
    id: 'vol-fallback-2',
    name: 'لينا حسن الشوا',
    fullName: 'لينا حسن الشوا',
    email: 'lina.hassan@najat.ps',
    phoneNumber: '0599333444',
    region: 'مدينة غزة',
    gender: 'female',
    status: 'active',
  },
  {
    id: 'vol-fallback-3',
    name: 'خليل النتور',
    fullName: 'خليل النتور',
    email: 'khalil.natour@najat.ps',
    phoneNumber: '0599444555',
    region: 'شمال القطاع',
    gender: 'male',
    status: 'active',
  },
  {
    id: 'vol-fallback-4',
    name: 'سمير الغول',
    fullName: 'سمير الغول',
    email: 'samir.ghoul@najat.ps',
    phoneNumber: '0599555666',
    region: 'دير البلح',
    gender: 'male',
    status: 'active',
  },
  {
    id: 'vol-fallback-5',
    name: 'سارة محمود',
    fullName: 'سارة محمود',
    email: 'sara.mahmoud@najaa.sa',
    phoneNumber: '0599666777',
    region: 'الوسطى',
    gender: 'female',
    status: 'active',
  },
]

export async function fetchPublicVolunteers(region?: string): Promise<PublicVolunteer[]> {
  try {
    const url = region && region !== 'all'
      ? `${V1_ROOT}/volunteers?region=${encodeURIComponent(region)}`
      : `${V1_ROOT}/volunteers`

    const res = await request(url, { method: 'GET' })
    const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []

    if (list.length > 0) return list
    return FALLBACK_VOLUNTEERS
  } catch {
    return FALLBACK_VOLUNTEERS
  }
}
