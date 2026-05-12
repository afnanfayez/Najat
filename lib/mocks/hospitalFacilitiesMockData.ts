import type { HealthFacility } from '@/schemas/healthFacility'
import type { HealthFacilityDetail } from '@/schemas/healthFacilityDetail'

function hDetail(partial: HealthFacilityDetail): HealthFacilityDetail {
  return partial
}

function sharedHospitalMedicines(): NonNullable<HealthFacilityDetail['medicines']> {
  return [
    {
      name: 'إنسولين (Insulin)',
      category: 'السكري',
      status: 'كمية محدودة',
      color: '#F2A122',
    },
    {
      name: 'باراسيتامول (Paracetamol)',
      category: 'مسكن آلام',
      status: 'متوفر',
      color: '#22c55e',
    },
    {
      name: 'أموكسيسيلين (Amoxicillin)',
      category: 'مضاد حيوي',
      status: 'متوفر',
      color: '#22c55e',
    },
  ]
}

function expandedMedicines(): NonNullable<HealthFacilityDetail['medicines']> {
  return [
    ...sharedHospitalMedicines(),
    {
      name: 'أزيثرومايسين (Azithromycin)',
      category: 'مضاد حيوي',
      status: 'متوفر',
      color: '#22c55e',
    },
    {
      name: 'سالبوتامول (Salbutamol)',
      category: 'تنفسي وربو',
      status: 'متوفر',
      color: '#22c55e',
    },
    {
      name: 'أوميبرازول (Omeprazole)',
      category: 'الجهاز الهضمي',
      status: 'كمية محدودة',
      color: '#F2A122',
    },
  ]
}

const FULL_MEDICINE_LIST: NonNullable<HealthFacilityDetail['medicinesAll']> = [
  ...expandedMedicines(),
  {
    name: 'أيبوبروفين (Ibuprofen)',
    category: 'مسكن آلام',
    status: 'غير متوفر',
    color: '#EF4444',
  },
  {
    name: 'فيتامين سي (Vitamin C)',
    category: 'مكملات',
    status: 'متوفر',
    color: '#22c55e',
  },
  {
    name: 'بيسوبرولول (Bisoprolol)',
    category: 'أمراض القلب',
    status: 'كمية محدودة',
    color: '#F2A122',
  },
  {
    name: 'ديكساميثازون (Dexamethasone)',
    category: 'كورتيزون',
    status: 'متوفر',
    color: '#22c55e',
  },
]

export const MOCK_HOSPITAL_FACILITIES: HealthFacility[] = [
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
    region: 'south',
    latitude: 31.42,
    longitude: 34.35,
    detail: hDetail({
      mapPreviewImageUrl: '/assets/health1.jpg',
      lastUpdatedAt: '12/5/2026',
      doctors: [
        {
          name: 'د. ناصر رأفت أبو شعبان',
          specialty: 'استشاري الجراحة العامة وجراحة المناظير',
          photo: '/assets/doctor.png',
          time: 'من 10:00 ص - 2:00 م',
          days: ['الأحد', 'الخميس'],
        },
        {
          name: 'د. محمد صلاح اللولو',
          specialty: 'أخصائي عيون',
          photo: '/assets/health6.jpg',
          time: 'من 1:30 م - 5:00 م',
          days: ['السبت', 'الخميس'],
        },
      ],
      medicines: sharedHospitalMedicines(),
      medicinesAll: FULL_MEDICINE_LIST,
      hospitalServices: [
        { label: 'النساء والولادة' },
        { label: 'الأسنان' },
        { label: 'العيون' },
        { label: 'العظام' },
        { label: 'التصوير التلفزيوني' },
        { label: 'الجراحة العامة' },
        { label: 'المسالك البولية' },
        { label: 'السكر والغدد' },
      ],
      workingHours: {
        bannerText: 'قسم الطوارئ يعمل على مدار 24 ساعة',
        rows: [
          { label: 'السبت - الخميس (العيادات)', time: 'من 8:00 ص - 2:00 م' },
          { label: 'الجمعة', time: 'مغلق (للطوارئ فقط)', danger: true },
          {
            label: 'الصيدلية الخارجية',
            time: 'من 8:00 ص - 8:00 م',
          },
        ],
      },
    }),
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
    region: 'north',
    latitude: 31.555,
    longitude: 34.505,
    detail: hDetail({
      mapPreviewImageUrl: '/assets/health2.jpg',
      lastUpdatedAt: '10/5/2026',
      doctors: [
        {
          name: 'د. سلامة سعيد التتر',
          specialty: 'استشاري أمراض السكري والغدد',
          photo: '/assets/health2.jpg',
          time: 'من 9:00 ص - 1:00 م',
          days: ['الأحد', 'الأربعاء'],
        },
        {
          name: 'د. هيثم الكردي',
          specialty: 'أخصائي باطنية',
          photo: '/assets/health8.jpg',
          time: 'من 10:00 ص - 3:00 م',
          days: ['السبت', 'الثلاثاء'],
        },
      ],
      medicines: sharedHospitalMedicines(),
      medicinesAll: FULL_MEDICINE_LIST,
      hospitalServices: [
        { label: 'الباطنية' },
        { label: 'السكر والغدد' },
        { label: 'القلب' },
        { label: 'جراحة التجميل' },
      ],
      workingHours: {
        bannerText: 'الطوارئ متاحة على مدار الساعة',
        rows: [
          { label: 'السبت - الخميس', time: '8:00 ص - 3:00 م' },
          { label: 'الجمعة', time: 'طوارئ فقط', danger: true },
        ],
      },
    }),
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
    region: 'north',
    latitude: 31.52,
    longitude: 34.45,
    detail: hDetail({
      mapPreviewImageUrl: '/assets/health3.jpg',
      lastUpdatedAt: '11/5/2026',
      doctors: [
        {
          name: 'د. ناصر رأفت أبو شعبان',
          specialty: 'استشاري الجراحة العامة وجراحة المناظير',
          photo: '/assets/doctor.png',
          time: 'من 10:00 ص - 2:00 م',
          days: ['الأحد', 'الخميس'],
        },
        {
          name: 'د. شادي عبد الحكيم الحداد',
          specialty: 'أخصائي طب وجراحة الفم والأسنان',
          photo: '/assets/Photo2.jpg',
          time: 'من 10:00 ص - 2:00 م',
          days: ['الأحد', 'الأربعاء'],
        },
        {
          name: 'د. ليلى موسى',
          specialty: 'استشارية نساء وتوليد',
          photo: '/assets/health6.jpg',
          time: 'من 11:00 ص - 4:00 م',
          days: ['السبت', 'الاثنين'],
        },
      ],
      medicines: expandedMedicines(),
      medicinesAll: FULL_MEDICINE_LIST,
      hospitalServices: [
        { label: 'النساء والولادة' },
        { label: 'الأسنان' },
        { label: 'العيون' },
        { label: 'العظام' },
        { label: 'التصوير التلفزيوني' },
        { label: 'الجراحة العامة' },
        { label: 'المسالك البولية' },
        { label: 'السكر والغدد' },
        { label: 'جراحة التجميل' },
        { label: 'الجلدية والعناية بالبشرة' },
      ],
      workingHours: {
        bannerText: 'قسم الطوارئ يعمل على مدار 24 ساعة',
        rows: [
          { label: 'السبت - الخميس (العيادات)', time: 'من 8:00 ص - 2:00 م' },
          { label: 'الجمعة', time: 'مغلق (للطوارئ فقط)', danger: true },
          { label: 'الصيدلية الخارجية', time: 'من 8:00 ص - 8:00 م' },
        ],
      },
    }),
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
    region: 'south',
    latitude: 31.296,
    longitude: 34.24,
    detail: hDetail({
      mapPreviewImageUrl: '/assets/health4.png',
      lastUpdatedAt: '8/5/2026',
      doctors: [
        {
          name: 'د. كمال عوض',
          specialty: 'أخصائي جراحة عامة',
          photo: '/assets/health4.png',
          time: 'من 9:00 ص - 1:00 م',
          days: ['الأحد', 'الثلاثاء'],
        },
      ],
      medicines: sharedHospitalMedicines(),
      medicinesAll: FULL_MEDICINE_LIST,
      hospitalServices: [
        { label: 'الجراحة العامة' },
        { label: 'الطوارئ' },
        { label: 'الأطفال' },
      ],
      workingHours: {
        bannerText: 'الطوارئ 24 ساعة',
        rows: [
          { label: 'السبت - الخميس', time: '8:00 ص - 2:00 م' },
          { label: 'الجمعة', time: 'طوارئ', danger: true },
        ],
      },
    }),
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
    region: 'north',
    latitude: 31.56,
    longitude: 34.498,
    detail: hDetail({
      mapPreviewImageUrl: '/assets/health5.jpg',
      lastUpdatedAt: '5/5/2026',
      doctors: [
        {
          name: 'د. عمر الشافعي',
          specialty: 'استشاري عظام',
          photo: '/assets/health5.jpg',
          time: 'من 10:00 ص - 2:00 م',
          days: ['السبت', 'الأربعاء'],
        },
      ],
      medicines: sharedHospitalMedicines(),
      medicinesAll: FULL_MEDICINE_LIST,
      hospitalServices: [
        { label: 'العظام' },
        { label: 'الطوارئ' },
        { label: 'التخدير' },
      ],
      workingHours: {
        rows: [
          { label: 'السبت - الخميس', time: '8:00 ص - 2:00 م' },
          { label: 'الجمعة', time: 'مغلق', danger: true },
        ],
      },
    }),
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
    region: 'south',
    latitude: 31.346,
    longitude: 34.302,
    detail: hDetail({
      mapPreviewImageUrl: '/assets/health6.jpg',
      lastUpdatedAt: '9/5/2026',
      doctors: [
        {
          name: 'د. رنا المصري',
          specialty: 'استشارية أطفال',
          photo: '/assets/health6.jpg',
          time: 'من 9:30 ص - 1:30 م',
          days: ['الأحد', 'الخميس'],
        },
        {
          name: 'د. محمد صلاح اللولو',
          specialty: 'أخصائي عيون',
          photo: '/assets/health1.jpg',
          time: 'من 1:30 م - 5:00 م',
          days: ['السبت', 'الخميس'],
        },
      ],
      medicines: expandedMedicines(),
      medicinesAll: FULL_MEDICINE_LIST,
      hospitalServices: [
        { label: 'الأطفال' },
        { label: 'العيون' },
        { label: 'الجراحة' },
        { label: 'العناية المركزة' },
      ],
      workingHours: {
        bannerText: 'الطوارئ متاحة على مدار الساعة',
        rows: [
          { label: 'السبت - الخميس', time: '8:00 ص - 3:00 م' },
          { label: 'الجمعة', time: 'طوارئ فقط', danger: true },
        ],
      },
    }),
  },
]
