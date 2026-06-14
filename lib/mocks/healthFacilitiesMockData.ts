import type { FacilityCategory, HealthFacility } from '@/schemas/healthFacility'
import type { HealthFacilityDetail } from '@/schemas/healthFacilityDetail'
import { MOCK_HOSPITAL_FACILITIES } from './hospitalFacilitiesMockData'

import { USE_MOCK_HEALTH_FACILITIES } from '@/lib/mocks/mockConfig'

export { USE_MOCK_HEALTH_FACILITIES }

function normalizeSearchQuery(raw: string): string {
  return raw.trim().toLowerCase()
}

function collectSearchHaystack(f: HealthFacility): string {
  const d = f.detail
  const parts: string[] = [
    f.name,
    f.address,
    f.phone ?? '',
    f.category,
    f.id,
  ]
  if (!d) return parts.join(' ')
  if (d.facilityKindLabel) parts.push(d.facilityKindLabel)
  d.doctors?.forEach((x) => {
    parts.push(x.name, x.specialty)
  })
  d.medicines?.forEach((x) => {
    parts.push(x.name, x.category, x.status)
  })
  d.medicinesAll?.forEach((x) => {
    parts.push(x.name, x.category, x.status)
  })
  d.hospitalServices?.forEach((x) => parts.push(x.label))
  d.pharmacyMedicineTypes?.forEach((x) => parts.push(x))
  d.pharmacySupplies?.forEach((x) => parts.push(x.label))
  d.labTests?.forEach((x) => {
    parts.push(x.name, x.group ?? '')
  })
  d.labSupplies?.forEach((x) => parts.push(x.label))
  d.dentalServices?.forEach((x) => {
    parts.push(x.name, x.desc, x.group ?? '')
  })
  d.clinicServices?.forEach((x) => {
    parts.push(x.name, x.desc)
  })
  d.clinicMedicines?.forEach((x) => {
    parts.push(x.name, x.category, x.status)
  })
  d.clinicMedicinesAll?.forEach((x) => {
    parts.push(x.name, x.category, x.status)
  })
  if (d.workingHours?.bannerText) parts.push(d.workingHours.bannerText)
  d.clinicSupplies?.forEach((x) => parts.push(x.label))
  d.dentalSupplies?.forEach((x) => parts.push(x.label))
  d.dentalHours?.rows.forEach((r) => {
    parts.push(r.label, r.time)
  })
  d.workingHours?.rows.forEach((r) => {
    parts.push(r.label, r.time)
  })
  d.pharmacyHours?.rows.forEach((r) => {
    parts.push(r.label, r.time)
  })
  d.labHours?.rows.forEach((r) => {
    parts.push(r.label, r.time)
  })
  d.clinicHours?.rows.forEach((r) => {
    parts.push(r.label, r.time)
  })
  return parts.join(' ')
}

export function facilityMatchesHealthSearch(
  f: HealthFacility,
  rawSearch: string,
): boolean {
  const q = normalizeSearchQuery(rawSearch)
  if (!q) return true
  const hay = collectSearchHaystack(f).toLowerCase()
  const tokens = q.split(/\s+/).filter(Boolean)
  return tokens.every((t) => hay.includes(t))
}

const DEF_ICON = {
  drop: 'https://api.iconify.design/solar:drop-bold.svg?color=%23F2A122',
  blood: 'https://api.iconify.design/solar:health-bold.svg?color=%23F2A122',
  tooth: 'https://api.iconify.design/healthicons:tooth.svg?color=%23F2A122',
  odon: 'https://api.iconify.design/healthicons:odontology.svg?color=%23F2A122',
}

function hDetail(partial: HealthFacilityDetail): HealthFacilityDetail {
  return partial
}

const CLINIC_FULL_MEDICINES: NonNullable<
  HealthFacilityDetail['clinicMedicinesAll']
> = [
  {
    name: 'إنسولين (Insulin)',
    category: 'السكري',
    status: 'كمية محدودة',
    statusColor: '#F59E0B',
  },
  {
    name: 'باراسيتامول (Paracetamol)',
    category: 'مسكن آلام',
    status: 'متوفر',
    statusColor: '#22c55e',
  },
  {
    name: 'أموكسيسيلين (Amoxicillin)',
    category: 'مضاد حيوي',
    status: 'متوفر',
    statusColor: '#22c55e',
  },
  {
    name: 'أيبوبروفين (Ibuprofen)',
    category: 'مسكن آلام',
    status: 'غير متوفر',
    statusColor: '#EF4444',
  },
  {
    name: 'أزيثرومايسين (Azithromycin)',
    category: 'مضاد حيوي',
    status: 'متوفر',
    statusColor: '#22c55e',
  },
  {
    name: 'سالبوتامول (Salbutamol)',
    category: 'تنفسي وربو',
    status: 'متوفر',
    statusColor: '#22c55e',
  },
  {
    name: 'بيسوبرولول (Bisoprolol)',
    category: 'أمراض القلب',
    status: 'كمية محدودة',
    statusColor: '#F59E0B',
  },
  {
    name: 'ديكساميثازون (Dexamethasone)',
    category: 'كورتيزون',
    status: 'متوفر',
    statusColor: '#22c55e',
  },
  {
    name: 'فيتامين سي (Vitamin C)',
    category: 'مكملات',
    status: 'متوفر',
    statusColor: '#22c55e',
  },
  {
    name: 'أوميبرازول (Omeprazole)',
    category: 'الجهاز الهضمي',
    status: 'كمية محدودة',
    statusColor: '#F59E0B',
  },
]

const PHARMACY_SUPPLIES_BASE: NonNullable<HealthFacilityDetail['pharmacySupplies']> =
  [
    {
      label: 'كمامات جراحية',
      icon: 'https://api.iconify.design/healthicons:mask.svg?color=%23f59e0b',
    },
    {
      label: 'اسطوانات اكسجين',
      icon: 'https://api.iconify.design/healthicons:oxygen-tank.svg?color=%23f59e0b',
    },
    {
      label: 'موازين حرارة',
      icon: 'https://api.iconify.design/healthicons:thermometer.svg?color=%23f59e0b',
    },
    {
      label: 'قفازات طبية',
      icon: 'https://api.iconify.design/healthicons:ppe-gloves.svg?color=%23f59e0b',
    },
    {
      label: 'أجهزة قياس الضغط',
      icon: 'https://api.iconify.design/healthicons:blood-pressure.svg?color=%23f59e0b',
    },
    {
      label: 'ميزان',
      icon: 'https://api.iconify.design/solar:scale-bold.svg?color=%23f59e0b',
    },
  ]

export const MOCK_PHARMACY_FACILITIES: HealthFacility[] = [
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
    region: 'north',
    latitude: 31.5,
    longitude: 34.47,
    detail: hDetail({
      mapPreviewImageUrl: '/assets/health7.jpg',
      lastUpdatedAt: '29/3/2026',
      facilityKindLabel: 'صيدلية مركزية',
      pharmacyMedicineTypes: [
        'أدوية الضغط المزمن',
        'أدوية مرضى السكر',
        'مسكنات',
        'المضادات الحيوية',
        'فيتامينات',
        'منتجات الأطفال',
        'مراهم الحروق',
      ],
      pharmacySupplies: PHARMACY_SUPPLIES_BASE,
      pharmacyHours: {
        rows: [
          { label: 'السبت-الخميس', time: '8:00ص-10:00م' },
          { label: 'الجمعة', time: '4:00م-11:00م' },
        ],
      },
    }),
  },
  {
    id: '12',
    name: 'صيدلية الشفاء',
    address: 'حي الرمال - غزة',
    category: 'pharmacies',
    isOpen: true,
    medicineAvailability: 12,
    distance: '1.1 كم',
    imageUrl: '/assets/health3.jpg',
    phone: '+970599000712',
    region: 'north',
    latitude: 31.52,
    longitude: 34.45,
    detail: hDetail({
      mapPreviewImageUrl: '/assets/health3.jpg',
      lastUpdatedAt: '1/5/2026',
      facilityKindLabel: 'صيدلية حي',
      pharmacyMedicineTypes: [
        'أدوية السكري',
        'باراسيتامول ومشتقات',
        'مضادات حيوية',
        'أدوية الحساسية',
      ],
      pharmacySupplies: PHARMACY_SUPPLIES_BASE.slice(0, 4),
      pharmacyHours: {
        rows: [
          { label: 'السبت-الخميس', time: '9:00ص-11:00م' },
          { label: 'الجمعة', time: '5:00م-10:00م' },
        ],
      },
    }),
  },
  {
    id: '13',
    name: 'صيدليات الرحمة',
    address: 'خان يونس - شارع الجلاء',
    category: 'pharmacies',
    isOpen: true,
    medicineAvailability: 20,
    distance: '2.0 كم',
    imageUrl: '/assets/health8.jpg',
    phone: '+970599000713',
    region: 'south',
    latitude: 31.35,
    longitude: 34.3,
    detail: hDetail({
      mapPreviewImageUrl: '/assets/health8.jpg',
      lastUpdatedAt: '3/5/2026',
      facilityKindLabel: 'صيدلية مجمع',
      pharmacyMedicineTypes: [
        'إنسولين وحقن',
        'مسكنات',
        'مكملات غذائية',
        'أدوية الجهاز الهضمي',
      ],
      pharmacySupplies: PHARMACY_SUPPLIES_BASE,
      pharmacyHours: {
        rows: [
          { label: 'السبت-الخميس', time: '8:30ص-10:30م' },
          { label: 'الجمعة', time: '4:30م-11:00م' },
        ],
      },
    }),
  },
  {
    id: '14',
    name: 'صيدلية المجمع الشاملة',
    address: 'جباليا البلد - السوق',
    category: 'pharmacies',
    isOpen: false,
    medicineAvailability: 8,
    distance: '3.3 كم',
    imageUrl: '/assets/health9.jpg',
    phone: '+970599000714',
    region: 'north',
    latitude: 31.528,
    longitude: 34.484,
    detail: hDetail({
      mapPreviewImageUrl: '/assets/health9.jpg',
      lastUpdatedAt: '2/5/2026',
      facilityKindLabel: 'صيدلية حي',
      pharmacyMedicineTypes: [
        'أدوية نفسية',
        'مضادات حيوية',
        'علاج البرد والإنفلونزا',
      ],
      pharmacySupplies: PHARMACY_SUPPLIES_BASE.slice(2, 6),
      pharmacyHours: {
        rows: [
          { label: 'السبت-الخميس', time: '9:00ص-9:00م' },
          { label: 'الجمعة', time: 'مغلق' },
        ],
      },
    }),
  },
]

export const MOCK_CLINIC_FACILITIES: HealthFacility[] = [
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
    region: 'north',
    latitude: 31.503,
    longitude: 34.468,
    detail: hDetail({
      mapPreviewImageUrl: '/assets/health8.jpg',
      lastUpdatedAt: '7/5/2026',
      facilityKindLabel: 'مستوصف أهلي',
      clinicServices: [
        {
          name: 'فحص عام',
          desc: 'كشف باطني عام',
          icon: 'https://api.iconify.design/solar:stethoscope-bold.svg?color=%23F2A122',
        },
        {
          name: 'التطعيمات',
          desc: 'لقاحات الأطفال الروتينية',
          icon: 'https://api.iconify.design/solar:syringe-bold.svg?color=%23F2A122',
        },
        {
          name: 'متابعة الحمل',
          desc: 'رعاية الأم والجنين',
          icon: 'https://api.iconify.design/healthicons:pregnant.svg?color=%23F2A122',
        },
        {
          name: 'متابعة أمراض مزمنة',
          desc: 'السكري والضغط',
          icon: 'https://api.iconify.design/solar:heart-pulse-bold.svg?color=%23F2A122',
        },
      ],
      clinicMedicines: [
        {
          name: 'إنسولين (Insulin)',
          category: 'السكري',
          status: 'كمية محدودة',
          statusColor: '#F59E0B',
        },
        {
          name: 'باراسيتامول (Paracetamol)',
          category: 'مسكن',
          status: 'متوفر',
          statusColor: '#22C55E',
        },
        {
          name: 'أموكسيسيلين (Amoxicillin)',
          category: 'مضاد حيوي',
          status: 'متوفر',
          statusColor: '#22C55E',
        },
      ],
      clinicMedicinesAll: CLINIC_FULL_MEDICINES,
      clinicHours: {
        rows: [
          { label: 'السبت-الخميس', time: '8:00ص-4:00م' },
          { label: 'الجمعة', time: '9:00ص-1:00م' },
        ],
      },
      clinicSupplies: [
        { label: 'مخدر موضعي', icon: 'https://api.iconify.design/solar:syringe-bold.svg?color=%23F2A122' },
        { label: 'مضاد حيوي', icon: 'https://api.iconify.design/solar:pill-bold.svg?color=%23F2A122' },
        { label: 'تعقيم', icon: 'https://api.iconify.design/healthicons:clean-hands.svg?color=%23F2A122' },
        { label: 'مسكن ألم', icon: 'https://api.iconify.design/solar:medical-kit-bold.svg?color=%23F2A122' },
      ],
    }),
  },
  {
    id: '17',
    name: 'مستوصف الهدى',
    address: 'دير البلح - الشارع الرئيسي',
    category: 'clinics',
    isOpen: true,
    medicineAvailability: 45,
    distance: '2.7 كم',
    imageUrl: '/assets/health6.jpg',
    phone: '+970599000817',
    region: 'south',
    latitude: 31.42,
    longitude: 34.35,
    detail: hDetail({
      mapPreviewImageUrl: '/assets/health6.jpg',
      lastUpdatedAt: '6/5/2026',
      facilityKindLabel: 'مستوصف',
      clinicServices: [
        {
          name: 'تغيير الجروح',
          desc: 'تنظيف وتعقيم',
          icon: 'https://api.iconify.design/solar:bandage-bold.svg?color=%23F2A122',
        },
        {
          name: 'فحص تنفسي',
          desc: 'متابعة الربو والكحة',
          icon: 'https://api.iconify.design/solar:lungs-bold.svg?color=%23F2A122',
        },
      ],
      clinicMedicines: [
        {
          name: 'سالبوتامول (Salbutamol)',
          category: 'تنفسي',
          status: 'متوفر',
          statusColor: '#22C55E',
        },
        {
          name: 'أوميبرازول (Omeprazole)',
          category: 'هضمي',
          status: 'كمية محدودة',
          statusColor: '#F59E0B',
        },
      ],
      clinicMedicinesAll: CLINIC_FULL_MEDICINES,
      clinicHours: {
        rows: [
          { label: 'السبت-الخميس', time: '8:00ص-3:00م' },
          { label: 'الجمعة', time: 'مغلق', danger: true },
        ],
      },
      clinicSupplies: [
        { label: 'مخدر موضعي', icon: 'https://api.iconify.design/solar:syringe-bold.svg?color=%23F2A122' },
        { label: 'ضمادات', icon: 'https://api.iconify.design/solar:bandage-bold.svg?color=%23F2A122' },
        { label: 'محاليل', icon: 'https://api.iconify.design/solar:drop-bold.svg?color=%23F2A122' },
        { label: 'ميزان حرارة', icon: 'https://api.iconify.design/healthicons:thermometer.svg?color=%23F2A122' },
      ],
    }),
  },
]

const LAB_TABS = ['الكل', 'فحوصات الدم', 'الهرمونات', 'وظائف الكبد', 'الفيروسات']

export const MOCK_LAB_FACILITIES: HealthFacility[] = [
  {
    id: '9',
    name: 'مختبر ابن الهيثم للتحاليل الطبية',
    address: 'مقابل مستشفى الشفاء - غزة',
    category: 'labs',
    isOpen: true,
    medicineAvailability: 90,
    distance: '2.2 كم',
    imageUrl: '/assets/health9.jpg',
    phone: '0592201453',
    region: 'north',
    latitude: 31.51,
    longitude: 34.47,
    detail: hDetail({
      mapPreviewImageUrl: '/assets/health9.jpg',
      lastUpdatedAt: '29/3/2026',
      facilityKindLabel: 'مختبر مركزي',
      labTestTabLabels: LAB_TABS,
      labTests: [
        {
          name: 'تعداد الدم الكامل (CBC)',
          time: 'النتيجة خلال 24 ساعة',
          icon: DEF_ICON.drop,
          group: 'فحوصات الدم',
        },
        {
          name: 'السكر التراكمي (HbA1c)',
          time: 'النتيجة خلال 24 ساعة',
          icon: 'https://api.iconify.design/healthicons:hiv-self-test.svg?color=%23F2A122',
          group: 'فحوصات الدم',
        },
        {
          name: 'فحص هرمون الغدة الدرقية',
          time: 'النتيجة خلال 48 ساعة',
          icon: DEF_ICON.blood,
          group: 'الهرمونات',
        },
        {
          name: 'وظائف الكبد',
          time: 'النتيجة خلال 24 ساعة',
          icon: DEF_ICON.blood,
          group: 'وظائف الكبد',
        },
        {
          name: 'فحص فيروس سي',
          time: 'النتيجة خلال 3 أيام',
          icon: DEF_ICON.blood,
          group: 'الفيروسات',
        },
      ],
      labSupplies: [
        {
          label: 'إبر سحب العينات',
          icon: 'https://api.iconify.design/solar:syringe-bold.svg?color=%23F2A122',
        },
        {
          label: 'مجاهر فحص',
          icon: 'https://api.iconify.design/healthicons:microscope.svg?color=%23F2A122',
        },
        {
          label: 'أنابيب سحب الدم',
          icon: 'https://api.iconify.design/solar:test-tube-bold.svg?color=%23F2A122',
        },
        {
          label: 'شرائح قياس',
          icon: 'https://api.iconify.design/solar:box-bold.svg?color=%23F2A122',
        },
      ],
      labHours: {
        rows: [
          { label: 'السبت-الخميس', time: '8:00ص-4:00م' },
          { label: 'الجمعة', time: '4:00م-11:00م' },
        ],
      },
    }),
  },
  {
    id: '15',
    name: 'مركز غزة للتحاليل',
    address: 'غزة - الرمال الجنوبي',
    category: 'labs',
    isOpen: true,
    medicineAvailability: 75,
    distance: '1.4 كم',
    imageUrl: '/assets/health7.jpg',
    phone: '+970599000915',
    region: 'north',
    latitude: 31.515,
    longitude: 34.455,
    detail: hDetail({
      mapPreviewImageUrl: '/assets/health7.jpg',
      lastUpdatedAt: '4/5/2026',
      facilityKindLabel: 'مختبر',
      labTestTabLabels: LAB_TABS,
      labTests: [
        {
          name: 'زمرة الدم',
          time: 'خلال 24 ساعة',
          icon: DEF_ICON.drop,
          group: 'فحوصات الدم',
        },
        {
          name: 'فحص فيتامين د',
          time: 'خلال 48 ساعة',
          icon: DEF_ICON.blood,
          group: 'الهرمونات',
        },
      ],
      labSupplies: [
        {
          label: 'إبر سحب',
          icon: 'https://api.iconify.design/solar:syringe-bold.svg?color=%23F2A122',
        },
      ],
      labHours: {
        rows: [
          { label: 'السبت-الخميس', time: '7:30ص-3:30م' },
          { label: 'الجمعة', time: 'مغلق' },
        ],
      },
    }),
  },
  {
    id: '16',
    name: 'مختبر البرج الطبي',
    address: 'بيت لاهيا - مقابل البلدية',
    category: 'labs',
    isOpen: true,
    medicineAvailability: 82,
    distance: '4.0 كم',
    imageUrl: '/assets/health2.jpg',
    phone: '+970599000916',
    region: 'north',
    latitude: 31.553,
    longitude: 34.512,
    detail: hDetail({
      mapPreviewImageUrl: '/assets/health2.jpg',
      lastUpdatedAt: '5/5/2026',
      facilityKindLabel: 'مختبر فرعي',
      labTestTabLabels: LAB_TABS,
      labTests: [
        {
          name: 'تحليل بول كامل',
          time: 'خلال 24 ساعة',
          icon: DEF_ICON.drop,
          group: 'فحوصات الدم',
        },
        {
          name: 'إنزيمات الكبد',
          time: 'خلال 24 ساعة',
          icon: DEF_ICON.blood,
          group: 'وظائف الكبد',
        },
        {
          name: 'فحص التلاسيميا',
          time: 'خلال أسبوع',
          icon: 'https://api.iconify.design/solar:ribbon-bold.svg?color=%23F2A122',
          group: 'فحوصات الدم',
        },
      ],
      labSupplies: [
        {
          label: 'أنابيب تحليل',
          icon: 'https://api.iconify.design/solar:test-tube-bold.svg?color=%23F2A122',
        },
      ],
      labHours: {
        rows: [
          { label: 'السبت-الخميس', time: '8:00ص-4:00م' },
          { label: 'الجمعة', time: '9:00ص-1:00م' },
        ],
      },
    }),
  },
]

const DENTAL_TABS = ['الكل', 'حشوات', 'جراحة', 'تجميل', 'تقويم']

export const MOCK_DENTAL_FACILITIES: HealthFacility[] = [
  {
    id: '10',
    name: 'مركز النور لطب الاسنان',
    address: 'غزة - حي الرمال - بالقرب من المجلس التشريعي',
    category: 'dental',
    isOpen: true,
    medicineAvailability: 85,
    distance: '0.8 كم',
    imageUrl: '/assets/Photo2.jpg',
    phone: '0592201453',
    region: 'north',
    latitude: 31.518,
    longitude: 34.46,
    detail: hDetail({
      mapPreviewImageUrl: '/assets/Photo2.jpg',
      lastUpdatedAt: '29/3/2026',
      facilityKindLabel: 'مركز أسنان',
      dentalTabLabels: DENTAL_TABS,
      dentalServices: [
        {
          name: 'حشوة كومبوزيت (تجميلية)',
          desc: 'حشوة بلون السن',
          icon: DEF_ICON.odon,
          group: 'حشوات',
        },
        {
          name: 'زراعة الأسنان',
          desc: 'تعويض ضائع',
          icon: 'https://api.iconify.design/healthicons:odontology-implant.svg?color=%23F2A122',
          group: 'جراحة',
        },
        {
          name: 'تبييض أسنان',
          desc: 'ليزر وكيميائي',
          icon: DEF_ICON.tooth,
          group: 'تجميل',
        },
        {
          name: 'تقويم أسنان',
          desc: 'تقويم شفاف وتقليدي',
          icon: DEF_ICON.tooth,
          group: 'تقويم',
        },
        {
          name: 'خلع ضرس',
          desc: 'خلع بسيط',
          icon: DEF_ICON.tooth,
          group: 'جراحة',
        },
        {
          name: 'تنظيف وتجريف لثة',
          desc: 'إزالة ترسبات',
          icon: 'https://api.iconify.design/healthicons:clean-hands.svg?color=%23F2A122',
          group: 'تجميل',
        },
      ],
      dentalHours: {
        rows: [
          { label: 'السبت-الخميس', time: '8:00ص-6:00م' },
          { label: 'الجمعة', time: '9:00ص-2:00م' },
        ],
      },
      dentalSupplies: [
        { label: 'مخدر موضعي', icon: 'https://api.iconify.design/solar:syringe-bold.svg?color=%23F2A122' },
        { label: 'مضاد حيوي', icon: 'https://api.iconify.design/solar:pill-bold.svg?color=%23F2A122' },
        { label: 'تعقيم', icon: 'https://api.iconify.design/healthicons:clean-hands.svg?color=%23F2A122' },
        { label: 'مسكن ألم', icon: 'https://api.iconify.design/solar:medical-kit-bold.svg?color=%23F2A122' },
      ],
    }),
  },
  {
    id: '11',
    name: 'عيادة سما للأسنان',
    address: 'خان يونس - شارع الجلاء',
    category: 'dental',
    isOpen: true,
    medicineAvailability: 70,
    distance: '1.5 كم',
    imageUrl: '/assets/health6.jpg',
    phone: '0590000011',
    region: 'south',
    latitude: 31.346,
    longitude: 34.305,
    detail: hDetail({
      mapPreviewImageUrl: '/assets/health6.jpg',
      lastUpdatedAt: '30/3/2026',
      facilityKindLabel: 'عيادة أسنان',
      dentalTabLabels: DENTAL_TABS,
      dentalServices: [
        {
          name: 'حشو أطفال',
          desc: 'عناية بالأسنان اللبنية',
          icon: DEF_ICON.odon,
          group: 'حشوات',
        },
        {
          name: 'سحب عصب',
          desc: 'علاج قنوات',
          icon: 'https://api.iconify.design/healthicons:spine.svg?color=%23F2A122',
          group: 'جراحة',
        },
      ],
      dentalHours: {
        rows: [
          { label: 'السبت-الخميس', time: '9:00ص-5:00م' },
          { label: 'الجمعة', time: '10:00ص-1:00م' },
        ],
      },
      dentalSupplies: [
        { label: 'مخدر موضعي', icon: 'https://api.iconify.design/solar:syringe-bold.svg?color=%23F2A122' },
        { label: 'حشوات', icon: 'https://api.iconify.design/healthicons:odontology.svg?color=%23F2A122' },
        { label: 'تعقيم', icon: 'https://api.iconify.design/healthicons:clean-hands.svg?color=%23F2A122' },
      ],
    }),
  },
]

export const ALL_MOCK_HEALTH_FACILITIES: HealthFacility[] = [
  ...MOCK_HOSPITAL_FACILITIES,
  ...MOCK_PHARMACY_FACILITIES,
  ...MOCK_CLINIC_FACILITIES,
  ...MOCK_LAB_FACILITIES,
  ...MOCK_DENTAL_FACILITIES,
]

export type MockHealthQuery = {
  category?: FacilityCategory
  search?: string
  region?: 'north' | 'south' | null
}

export function getMockHealthFacilitiesResult(
  params?: MockHealthQuery,
): { facilities: HealthFacility[]; total: number } {
  let list = params?.category
    ? ALL_MOCK_HEALTH_FACILITIES.filter((f) => f.category === params.category)
    : ALL_MOCK_HEALTH_FACILITIES

  if (params?.region) {
    list = list.filter((f) => f.region === params.region)
  }

  if (params?.search) {
    list = list.filter((f) => facilityMatchesHealthSearch(f, params.search!))
  }

  return { facilities: list, total: list.length }
}
