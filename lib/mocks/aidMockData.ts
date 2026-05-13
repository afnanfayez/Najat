import type { HumanitarianAid } from '@/schemas/humanitarianAid'

export const USE_MOCK_AID = process.env.NEXT_PUBLIC_USE_MOCK === '1'

export const MOCK_AID: HumanitarianAid[] = [
  {
    id: '1',
    name: 'الاونروا (UNRWA)',
    provider: 'وكالة الأمم المتحدة لإغاثة وتشغيل اللاجئين',
    description:
      'تقدم خدمات الطوارئ، الرعاية الصحية الأولية، وتوزيع المواد الغذائية الأساسية في كافة مناطق القطاع',
    status: 'active',
    tags: ['غذاء', 'تعليم', 'صحة'],
    category: 'all',
  },
  {
    id: '2',
    name: 'اطباء بلا حدود',
    provider: 'Medecins Sans Frontieres',
    description:
      'تعمل في المستشفيات الرئيسية وتقدم الرعاية الجراحية الطارئة، النشاط يتركز حاليا في مناطق الجنوب',
    status: 'limited',
    tags: ['جراحة', 'ادوية'],
    category: 'health',
  },
  {
    id: '3',
    name: 'برنامج الأغذية العالمية',
    provider: 'World Food Programme',
    description:
      'توزيع الطرود الغذائية الطارئة والقسائم الشرائية للأسر المتضررة والنازحين',
    status: 'active',
    tags: ['طعام', 'دعم مادي'],
    category: 'food',
  },
  {
    id: '4',
    name: 'مؤسسة واش (WASH)',
    provider: 'مبادرة المياه والصرف الصحي العالمي',
    description:
      'تعليق مؤقت للعمليات الميدانية بسبب نقص الوقود وتضرر البنية التحتية الرئيسية للمياه',
    status: 'stopped',
    tags: ['مياه', 'تعقيم'],
    category: 'water',
  },
  {
    id: '5',
    name: 'المجلس النرويجي للاجئين',
    provider: 'Norwegian Refugee Council',
    description:
      'توفير مواد الايواء الطارئة والبطانيات والمستلزمات المنزلية الاساسية للنازحين',
    status: 'active',
    tags: ['خيم', 'اغطية', 'ملابس'],
    category: 'shelter',
  },
  {
    id: '6',
    name: 'اليونيسيف (UNICEF)',
    provider: 'منظمة الأمم المتحدة للطفولة',
    description:
      'حماية الطفل والدعم النفسي وتوفير اللقاحات والمياه الصالحة للشرب للاطفال والاسر',
    status: 'limited',
    tags: ['تعليم', 'مياه', 'طرود'],
    category: 'health',
  },
]
