import type {
  ClinicServiceItem,
  DentalServiceItem,
  HealthDoctor,
  HealthMedicineRow,
  HealthServiceChip,
  LabTestItem,
  LabeledIcon,
  WorkingHoursBlock,
} from '@/schemas/healthFacilityDetail'

export const MOCK_HOSPITAL_DOCTORS: HealthDoctor[] = [
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
  {
    name: 'د. سلامة سعيد التتر',
    specialty: 'استشاري أمراض السكري والغدد',
    photo: '/assets/health2.jpg',
    time: 'من 1:30 م - 5:00 م',
    days: ['السبت', 'الخميس'],
  },
  {
    name: 'د. شادي عبد الحكيم الحداد',
    specialty: 'أخصائي طب وجراحة الفم والأسنان',
    photo: '/assets/Photo2.jpg',
    time: 'من 10:00 ص - 2:00 م',
    days: ['الأحد', 'الأربعاء'],
  },
]

export const MOCK_HOSPITAL_MEDICINES: HealthMedicineRow[] = [
  { name: 'إنسولين (Insulin)', category: 'السكري', status: 'كمية محدودة', color: '#F2A122' },
  { name: 'باراسيتامول (Paracetamol)', category: 'مسكن آلام', status: 'متوفر', color: '#22c55e' },
  { name: 'أموكسيسيلين (Amoxicillin)', category: 'مضاد حيوي', status: 'متوفر', color: '#22c55e' },
]

export const MOCK_HOSPITAL_SERVICES: HealthServiceChip[] = [
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
]

export const MOCK_HOSPITAL_WORKING_HOURS: WorkingHoursBlock = {
  bannerText: 'قسم الطوارئ يعمل على مدار 24 ساعة',
  rows: [
    { label: 'السبت - الخميس (العيادات)', time: 'من 8:00 ص - 2:00 م' },
    { label: 'الجمعة', time: 'مغلق (للطوارئ فقط)', danger: true },
    { label: 'الصيدلية الخارجية', time: 'من 8:00 ص - 8:00 م' },
  ],
}

export const MOCK_PHARMACY_HOURS = {
  rows: [
    { label: 'السبت-الخميس', time: '8:00ص-10:00م' },
    { label: 'الجمعة', time: '4:00م-11:00م' },
  ],
}

export const MOCK_PHARMACY_MEDICINE_TYPES = [
  'أدوية الضغط المزمن',
  'أدوية مرضى السكر',
  'مسكنات',
  'المضادات الحيوية',
  'أدوية الأمراض النفسية',
  'مراهم الحروق',
  'فيتامينات',
  'منتجات تخص الأطفال',
  'منتجات العناية بالبشرة',
  'منتجات النظافة',
  'أدوية السموم',
]

export const MOCK_PHARMACY_MEDICAL_SUPPLIES: LabeledIcon[] = [
  { label: 'كمامات جراحية', icon: 'https://api.iconify.design/healthicons:mask.svg?color=%23f59e0b' },
  { label: 'اسطوانات اكسجين', icon: 'https://api.iconify.design/healthicons:oxygen-tank.svg?color=%23f59e0b' },
  { label: 'موازين حرارة', icon: 'https://api.iconify.design/healthicons:thermometer.svg?color=%23f59e0b' },
  { label: 'ميزان', icon: 'https://api.iconify.design/solar:scale-bold.svg?color=%23f59e0b' },
  { label: 'قفازات طبية', icon: 'https://api.iconify.design/healthicons:ppe-gloves.svg?color=%23f59e0b' },
  { label: 'اجهزة قياس الضغط', icon: 'https://api.iconify.design/healthicons:blood-pressure.svg?color=%23f59e0b' },
]

export const MOCK_LAB_TABS = ['الكل', 'فحوصات الدم', 'الهرمونات', 'وظائف الكبد', 'الفيروسات']

export const MOCK_LAB_TESTS: LabTestItem[] = [
  { name: 'تعداد الدم الكامل (CBC)', time: 'النتيجة خلال 24 ساعة', icon: 'https://api.iconify.design/solar:drop-bold.svg?color=%23F2A122', group: 'فحوصات الدم' },
  { name: 'السكر التراكمي (HbA1c)', time: 'النتيجة خلال 24 ساعة', icon: 'https://api.iconify.design/healthicons:hiv-self-test.svg?color=%23F2A122', group: 'فحوصات الدم' },
  { name: 'فحص زمرة الدم', time: 'النتيجة خلال 24 ساعة', icon: 'https://api.iconify.design/solar:box-bold.svg?color=%23F2A122', group: 'فحوصات الدم' },
  { name: 'وظائف الكبد', time: 'النتيجة خلال 24 ساعة', icon: 'https://api.iconify.design/solar:health-bold.svg?color=%23F2A122', group: 'وظائف الكبد' },
  { name: 'فحص التلاسيميا', time: 'النتيجة خلال أسبوع', icon: 'https://api.iconify.design/solar:graph-new-bold.svg?color=%23F2A122', group: 'فحوصات الدم' },
  { name: 'فحص السرطان', time: 'النتيجة خلال 3 أيام', icon: 'https://api.iconify.design/solar:ribbon-bold.svg?color=%23F2A122', group: 'الفيروسات' },
]

export const MOCK_LAB_SUPPLIES: LabeledIcon[] = [
  { label: 'ابر سحب العينات', icon: 'https://api.iconify.design/solar:syringe-bold.svg?color=%23F2A122' },
  { label: 'مجاهر الفحص', icon: 'https://api.iconify.design/healthicons:microscope.svg?color=%23F2A122' },
  { label: 'انابيب سحب الدم', icon: 'https://api.iconify.design/solar:test-tube-bold.svg?color=%23F2A122' },
  { label: 'شرائح قياس', icon: 'https://api.iconify.design/solar:box-bold.svg?color=%23F2A122' },
]

export const MOCK_LAB_HOURS = {
  rows: [
    { label: 'السبت-الخميس', time: '8:00ص-4:00م' },
    { label: 'الجمعة', time: '4:00م-11:00م' },
  ],
}

export const MOCK_DENTAL_TABS = ['الكل', 'حشوات', 'جراحة', 'تجميل', 'تقويم']

export const MOCK_DENTAL_SERVICES: DentalServiceItem[] = [
  { name: 'حشوة كومبوزيت (تجميلية)', desc: 'حشوة تجميلية بلون السن', icon: 'https://api.iconify.design/healthicons:odontology.svg?color=%23F2A122', group: 'حشوات' },
  { name: 'زراعة الاسنان', desc: 'تعويض الاسنان المفقودة', icon: 'https://api.iconify.design/healthicons:odontology-implant.svg?color=%23F2A122', group: 'جراحة' },
  { name: 'تبييض اسنان', desc: 'تبييض كيميائي وليزر', icon: 'https://api.iconify.design/healthicons:tooth.svg?color=%23F2A122', group: 'تجميل' },
  { name: 'خلع ضرس', desc: 'اجراء جراحي لخلع بسيط', icon: 'https://api.iconify.design/healthicons:tooth.svg?color=%23F2A122', group: 'جراحة' },
  { name: 'تنظيف وتجريف اللثة', desc: 'ازالة الرواسب الكلسية', icon: 'https://api.iconify.design/healthicons:clean-hands.svg?color=%23F2A122', group: 'تجميل' },
  { name: 'سحب عصب', desc: 'علاج القنوات الجزرية', icon: 'https://api.iconify.design/healthicons:spine.svg?color=%23F2A122', group: 'جراحة' },
]

export const MOCK_DENTAL_SUPPLIES: LabeledIcon[] = [
  { label: 'مخدر موضعي', icon: 'https://api.iconify.design/solar:syringe-bold.svg?color=%23F2A122' },
  { label: 'مضاد حيوي', icon: 'https://api.iconify.design/solar:pill-bold.svg?color=%23F2A122' },
  { label: 'تعقيم', icon: 'https://api.iconify.design/healthicons:clean-hands.svg?color=%23F2A122' },
  { label: 'مسكن الام', icon: 'https://api.iconify.design/solar:medical-kit-bold.svg?color=%23F2A122' },
]

export const MOCK_DENTAL_HOURS = {
  rows: [
    { label: 'السبت-الخميس', time: '8:00ص-4:00م' },
    { label: 'الجمعة', time: 'مغلق', danger: true },
  ],
}

export const MOCK_CLINIC_SUPPLIES: LabeledIcon[] = MOCK_DENTAL_SUPPLIES

export const MOCK_CLINIC_HOURS = MOCK_DENTAL_HOURS

export const MOCK_CLINIC_SERVICES: ClinicServiceItem[] = [
  { name: 'فحص عام', desc: 'كشف باطني عام', icon: 'https://api.iconify.design/solar:stethoscope-bold.svg?color=%23F2A122' },
  { name: 'التطعيمات', desc: 'اللقاحات الروتينية للاطفال', icon: 'https://api.iconify.design/solar:syringe-bold.svg?color=%23F2A122' },
  { name: 'متابعة الحمل', desc: 'متابعة الامومة والجنين', icon: 'https://api.iconify.design/healthicons:pregnant.svg?color=%23F2A122' },
  { name: 'تغيير الجروح', desc: 'تغيير وتنظيف وتعقيم الجروح', icon: 'https://api.iconify.design/solar:bandage-bold.svg?color=%23F2A122' },
  { name: 'متابعة امراض مزمنة', desc: 'السكري والضغط والقلب', icon: 'https://api.iconify.design/solar:heart-pulse-bold.svg?color=%23F2A122' },
  { name: 'متابعة الامراض التنفسية', desc: 'كشف ومتابعة لامراض الجهاز التنفسي', icon: 'https://api.iconify.design/solar:lungs-bold.svg?color=%23F2A122' },
]

export const MOCK_CLINIC_MEDICINES: HealthMedicineRow[] = [
  { name: 'انسولين (Insulin)', category: 'السكري', status: 'كمية محدودة', statusColor: '#F59E0B' },
  { name: 'باراسيتامول (Paracetamol)', category: 'مسكن الالم', status: 'متوفر', statusColor: '#22C55E' },
  { name: 'اموكسيسيلين (Amoxicillin)', category: 'مضاد حيوي', status: 'متوفر', statusColor: '#22C55E' },
]

export const MOCK_CLINIC_MEDICINES_ALL: HealthMedicineRow[] = [
  { name: 'إنسولين (Insulin)', category: 'السكري', status: 'كمية محدودة', color: '#F59E0B' },
  { name: 'باراسيتامول (Paracetamol)', category: 'مسكن آلام', status: 'متوفر', color: '#22c55e' },
  { name: 'أموكسيسيلين (Amoxicillin)', category: 'مضاد حيوي', status: 'متوفر', color: '#22c55e' },
]
