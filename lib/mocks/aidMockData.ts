import type { HumanitarianAid } from '@/schemas/humanitarianAid'
import { USE_MOCK_AID } from '@/lib/mocks/mockConfig'

export { USE_MOCK_AID }

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
    regions: ['الشمال', 'الجنوب'],
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
    regions: ['الجنوب'],
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
    regions: ['الشمال', 'الجنوب'],
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
    regions: ['الشمال'],
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
    regions: ['الجنوب'],
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
    regions: ['الشمال', 'الجنوب'],
  },
]
