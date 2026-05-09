'use client'

import { useQuery } from '@tanstack/react-query'
import { healthAPI } from '@/lib/api/health'
import type { FacilityCategory, HealthFacility } from '@/schemas/healthFacility'

const MOCK_FACILITIES: HealthFacility[] = [
  {
    id: '1',
    name: 'مستشفى شهداء الأقصى',
    address: 'دير البلح - وسط قطاع غزة',
    category: 'hospitals',
    isOpen: true,
    medicineAvailability: 40,
    distance: '1.2 كم',
    imageUrl: '/assets/health1.jpg',
    phone: '+970599000001',
  },
  {
    id: '2',
    name: 'مستشفى أصدقاء المريض الخيري',
    address: 'بيت لاهيا - شمال غزة',
    category: 'hospitals',
    isOpen: true,
    medicineAvailability: 35,
    distance: '2.4 كم',
    imageUrl: '/assets/health2.jpg',
    phone: '+970599000002',
  },
  {
    id: '3',
    name: 'مستشفى الشفاء',
    address: 'حي الرمال - غزة',
    category: 'hospitals',
    isOpen: true,
    medicineAvailability: 95,
    distance: '3.1 كم',
    imageUrl: '/assets/health3.jpg',
    phone: '+970599000003',
  },
  {
    id: '4',
    name: 'مستشفى النجار',
    address: 'رفح المدينة - جنوب غزة',
    category: 'hospitals',
    isOpen: true,
    medicineAvailability: 55,
    distance: '4.5 كم',
    imageUrl: '/assets/health4.png',
    phone: '+970599000004',
  },
  {
    id: '5',
    name: 'مستشفى الإندونيسي',
    address: 'بيت لاهيا - شمال غزة',
    category: 'hospitals',
    isOpen: false,
    medicineAvailability: 40,
    distance: '6.2 كم',
    imageUrl: '/assets/health5.jpg',
    phone: '+970599000005',
  },
  {
    id: '6',
    name: 'مجمع ناصر الطبي',
    address: 'خان يونس - جنوب غزة',
    category: 'hospitals',
    isOpen: true,
    medicineAvailability: 60,
    distance: '5.1 كم',
    imageUrl: '/assets/health6.jpg',
    phone: '+970599000006',
  },
  {
    id: '7',
    name: 'صيدلية النجاة المركزية',
    address: 'شارع الوحدة - غزة',
    category: 'pharmacies',
    isOpen: true,
    medicineAvailability: 5,
    distance: '0.5 كم',
    imageUrl: '/assets/health7.jpg',
    phone: '+970599000007',
  },
  {
    id: '8',
    name: 'مستوصف الأمل الصحي',
    address: 'حي الزيتون - غزة',
    category: 'clinics',
    isOpen: true,
    medicineAvailability: 70,
    distance: '1.8 كم',
    imageUrl: '/assets/health8.jpg',
    phone: '+970599000008',
  },
  {
    id: '9',
    name: 'مختبر الرشيد الطبي',
    address: 'شارع عمر المختار - غزة',
    category: 'labs',
    isOpen: true,
    medicineAvailability: 5,
    distance: '2.2 كم',
    imageUrl: '/assets/health9.jpg',
    phone: '+970599000009',
  },
]

type Params = {
  category?: FacilityCategory
  search?: string
  nearMe?: boolean
}

export function useHealthFacilities(params?: Params) {
  return useQuery({
    queryKey: ['health-facilities', params],
    queryFn: async () => {
      try {
        const response = await healthAPI.getFacilities(params)
        // Inject mock progress for testing
        response.facilities = response.facilities.map(f => ({
          ...f,
          medicineAvailability: f.medicineAvailability ?? 5
        }))
        return response
      } catch {
        const filtered = MOCK_FACILITIES.filter((f) => {
          if (params?.category && f.category !== params.category) return false
          if (params?.search) {
            const q = params.search.toLowerCase()
            if (!f.name.includes(q) && !f.address.includes(q)) return false
          }
          return true
        })
        return { facilities: filtered, total: filtered.length }
      }
    },
    staleTime: 1000 * 60 * 2,
  })
}
