export type OperatingStatus = 'efficient' | 'limited' | 'closed'

export type DrugStatus = 'available' | 'low' | 'unavailable'

export type FacilityImage = {
  id: string
  url: string
  name: string
  file?: File
}

export type FacilitySetupForm = {
  name: string
  region: string
  address: string
  phone: string
  operatingStatus: OperatingStatus
  images: FacilityImage[]
  selectedServices: string[]
  drugs: { id: string; name: string; subtitle: string; status: DrugStatus }[]
  staff: { id: string; name: string; role: string; shift: string }[]
  selectedDates: number[]
  selectedTimes: string[]
  latitude: number | null
  longitude: number | null
}

export const INITIAL_FACILITY_SETUP: FacilitySetupForm = {
  name: '',
  region: 'gaza',
  address: '',
  phone: '',
  operatingStatus: 'efficient',
  images: [],
  selectedServices: [
    'emergency',
    'surgery',
    'maternity',
    'icu',
    'outpatient',
    'urology',
    'dental',
    'dermatology',
  ],
  drugs: [
    {
      id: '1',
      name: 'أنسولين (Insulin)',
      subtitle: 'الأدوية الحيوية',
      status: 'available',
    },
    {
      id: '2',
      name: 'مضادات حيوية',
      subtitle: 'عام',
      status: 'low',
    },
    {
      id: '3',
      name: 'مسكنات آلام',
      subtitle: 'عام',
      status: 'unavailable',
    },
  ],
  staff: [
    {
      id: '1',
      name: 'د. أحمد خالد',
      role: 'طبيب طوارئ',
      shift: 'الفترة الصباحية',
    },
    {
      id: '2',
      name: 'د. سارة المنصور',
      role: 'إسعاف',
      shift: 'الفترة الصباحية',
    },
  ],
  selectedDates: [
    1, 2, 5, 6, 7, 8, 9, 12, 13, 14, 15, 16, 19, 20, 21, 22, 23, 26, 27, 28,
    29, 30,
  ],
  selectedTimes: ['09:30', '10:00', '10:30', '11:00', '11:30'],
  latitude: null,
  longitude: null,
}
