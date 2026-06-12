import type {
  AdminHealthFacility,
  AdminHealthMedicalContent,
  AdminHealthStatsDto,
} from '@/schemas/adminHealth'

export const ADMIN_HEALTH_REGION_OPTIONS = [
  { value: 'all', label: 'جميع المناطق' },
  { value: 'north', label: 'شمال قطاع غزة' },
  { value: 'central', label: 'وسط قطاع غزة' },
  { value: 'south', label: 'جنوب قطاع غزة' },
] as const

export const ADMIN_HEALTH_STATUS_OPTIONS = [
  { value: 'all', label: 'الحالة' },
  { value: 'open', label: 'مفتوح الآن' },
  { value: 'closed', label: 'مغلق' },
  { value: 'maintenance', label: 'تحت الصيانة' },
] as const

export const ADMIN_HEALTH_TYPE_OPTIONS = [
  { value: 'all', label: 'جميع الأنواع' },
  { value: 'hospital', label: 'مستشفيات' },
  { value: 'pharmacy', label: 'صيدليات' },
  { value: 'lab', label: 'مختبرات' },
  { value: 'clinic', label: 'عيادات' },
  { value: 'dental_clinic', label: 'مراكز أسنان' },
] as const

export const ADMIN_HEALTH_CONTENT_STATUS_LABELS: Record<
  AdminHealthMedicalContent['status'],
  string
> = {
  published: 'منشور',
  review: 'تحت المراجعة',
  draft: 'مسودة',
}

export const ADMIN_HEALTH_STATS: AdminHealthStatsDto = {
  totalFacilities: 1284,
  activeNow: 942,
  underMaintenance: 42,
}

/** صورة موحّدة لمقالات المحتوى الطبي — مطابقة لدليل الصحة */
export const ADMIN_HEALTH_CONTENT_THUMBNAIL = '/assets/artical.png'

export const ADMIN_HEALTH_FACILITIES: AdminHealthFacility[] = [
  {
    id: '1',
    name: 'مستشفى شهداء الأقصى',
    address: 'دير البلح',
    imageUrl: '/assets/health1.jpg',
    isOpen: true,
    workloadPercent: 60,
    phone: '+970599000001',
    region: 'central',
    status: 'open',
  },
  {
    id: '2',
    name: 'مستشفى المعمداني',
    address: 'غزة - الرمال',
    imageUrl: '/assets/health2.jpg',
    isOpen: true,
    workloadPercent: 35,
    phone: '+970599000002',
    region: 'north',
    status: 'open',
  },
  {
    id: '3',
    name: 'مستشفى ناصر الطبي',
    address: 'خان يونس',
    imageUrl: '/assets/health3.jpg',
    isOpen: true,
    workloadPercent: 5,
    phone: '+970599000003',
    region: 'south',
    status: 'open',
  },
  {
    id: '4',
    name: 'مستشفى الأقصى الجامعي',
    address: 'غزة - التفاح',
    imageUrl: '/assets/health4.png',
    isOpen: false,
    workloadPercent: 0,
    phone: '+970599000004',
    region: 'north',
    status: 'maintenance',
  },
  {
    id: '5',
    name: 'مستشفى الأمل',
    address: 'رفح',
    imageUrl: '/assets/health5.jpg',
    isOpen: true,
    workloadPercent: 78,
    phone: '+970599000005',
    region: 'south',
    status: 'open',
  },
  {
    id: '6',
    name: 'مستشفى الصديق',
    address: 'بيت لاهيا',
    imageUrl: '/assets/health6.jpg',
    isOpen: true,
    workloadPercent: 22,
    phone: '+970599000006',
    region: 'north',
    status: 'open',
  },
]

export const ADMIN_HEALTH_CONTENT_CATEGORIES = [
  { id: 'first-aid' as const, label: 'الإسعافات الأولية' },
  { id: 'awareness' as const, label: 'مقالات التوعية' },
  { id: 'mental-health' as const, label: 'دعم الصحة النفسية' },
]

export const ADMIN_HEALTH_MEDICAL_CONTENT: AdminHealthMedicalContent[] = [
  {
    id: '1',
    title: 'معالجة الحروق البسيطة',
    author: 'أ. محمد خالد',
    date: '08 أكتوبر 2023',
    thumbnailUrl: '/assets/health1.jpg',
    status: 'published',
    category: 'first-aid',
    description: 'خطوات سريعة وآمنة للتعامل مع الحروق السطحية في المنزل.',
    body: 'ابدأ بإبعاد المصدر الحراري ثم ضع المنطقة تحت ماء فاتر جارٍ لمدة 10–15 دقيقة. لا تستخدم الثلج مباشرة على الحرق.',
    references: 'https://www.who.int/health-topics/burns',
  },
  {
    id: '2',
    title: 'الإنعاش القلبي الرئوي (CPR)',
    author: 'د. سارة محمود',
    date: '05 أكتوبر 2023',
    thumbnailUrl: '/assets/health2.jpg',
    status: 'published',
    category: 'first-aid',
    description: 'دليل عملي لإجراءات الإنعاش القلبي الرئوي للبالغين.',
    body: 'تأكد من سلامة المكان، تحقق من استجابة المصاب، ثم ابدأ بالضغطات الصدرية بمعدل 100–120 ضغطة في الدقيقة.',
    references: 'American Heart Association — CPR Guidelines',
  },
  {
    id: '3',
    title: 'التعامل مع النزيف الحاد',
    author: 'د. أحمد السيد',
    date: '01 أكتوبر 2023',
    thumbnailUrl: '/assets/health3.jpg',
    status: 'published',
    category: 'first-aid',
    description: 'كيفية إيقاف النزيف وطلب المساعدة الطبية بسرعة.',
    body: 'اضغط مباشرة على الجرح بقطعة قماش نظيفة، ارفع العضو المصاب إن أمكن، واطلب المساعدة الطبية فوراً.',
    references: 'Ministry of Health — Emergency Bleeding Control',
  },
  {
    id: '4',
    title: 'دليل الإسعافات الأولية الشامل 2024',
    author: 'د. أحمد السيد',
    date: '12 مايو 2024',
    thumbnailUrl: ADMIN_HEALTH_CONTENT_THUMBNAIL,
    status: 'published',
    category: 'first-aid',
    description: 'مرجع شامل لأهم إجراءات الإسعافات الأولية في حالات الطوارئ.',
    body: 'يشمل هذا الدليل خطوات التقييم الأولي، إيقاف النزيف، التعامل مع الكسور، والحروق، والاختناق.',
    references: 'https://www.redcross.org/first-aid',
  },
  {
    id: '5',
    title: 'كيفية التعامل مع حالات الاختناق',
    author: 'د. سارة محمود',
    date: '10 مايو 2024',
    thumbnailUrl: '/assets/health4.png',
    status: 'review',
    category: 'first-aid',
    description: 'إرشادات فورية لإنقاذ شخص يعاني من انسداد مجرى الهواء.',
    body: 'للبالغين استخدم مناورة هايمليك، وللأطفال الرضع طبّق ضربات الظهر والضغطات الصدرية المناسبة للعمر.',
    references: 'WHO — Choking First Aid',
  },
  {
    id: '6',
    title: 'الوقاية من الأمراض المعدية في الأزمات',
    author: 'د. خالد عمر',
    date: '8 مايو 2024',
    thumbnailUrl: '/assets/health5.jpg',
    status: 'draft',
    category: 'awareness',
    description: 'نصائح عملية للحد من انتشار العدوى في البيئات المزدحمة.',
    body: 'اغسل يديك بانتظام، تجنب التجمعات غير الضرورية، واستخدم الكمامات في الأماكن المغلقة.',
    references: '',
  },
  {
    id: '7',
    title: 'دليل التغذية السليمة للأطفال',
    author: 'د. ليلى حسن',
    date: '5 مايو 2024',
    thumbnailUrl: '/assets/health6.jpg',
    status: 'published',
    category: 'awareness',
    description: 'مبادئ التغذية المتوازنة لدعم نمو الأطفال بشكل صحي.',
    body: 'قدّم وجبات متنوعة غنية بالخضروات والبروتينات والحبوب الكاملة مع مراقبة كمية السكر.',
    references: 'UNICEF — Child Nutrition',
  },
  {
    id: '8',
    title: 'إدارة القلق في أوقات الأزمات',
    author: 'د. نور الهادي',
    date: '15 أبريل 2024',
    thumbnailUrl: '/assets/health1.jpg',
    status: 'published',
    category: 'mental-health',
    description: 'تقنيات نفسية بسيطة للتخفيف من التوتر والقلق اليومي.',
    body: 'مارس التنفس العميق، حدّد مصادر القلق، وتواصل مع شخص تثق به عند الحاجة.',
    references: '',
  },
  {
    id: '9',
    title: 'دعم الأطفال نفسياً بعد الصدمات',
    author: 'د. ريم يوسف',
    date: '10 أبريل 2024',
    thumbnailUrl: '/assets/health2.jpg',
    status: 'published',
    category: 'mental-health',
    description: 'كيف تساعد الأطفال على تجاوز التجارب الصادمة بأمان.',
    body: 'وفّر بيئة آمنة، استمع لهم دون الحكم، واطلب دعماً متخصصاً عند استمرار الأعراض.',
    references: 'UNICEF — Psychosocial Support',
  },
]
