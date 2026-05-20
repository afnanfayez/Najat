import {
  LayoutGrid,
  Shield,
  Heart,
  Compass,
  FilePlus,
  User,
  Siren,
  Send,
  Settings2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  id: string
  label: string
  icon: LucideIcon | string
  active: boolean
  sos?: boolean
}

export interface ServiceCardData {
  id: string
  title: string
  description: string
  icon: LucideIcon
  color: string
  iconColor: string
  sos?: boolean
}

export interface SearchSuggestion {
  id: string
  label: string
}

export const navItems: NavItem[] = [
  { id: 'home',      label: 'الرئيسية',           icon: LayoutGrid, active: true  },
  { id: 'health',    label: 'الخدمات الصحية',      icon: Shield,     active: false },
  { id: 'humanaid',  label: 'المساعدات الإنسانية', icon: Heart,      active: false },
  { id: 'maps',      label: 'الخرائط والملاحة',    icon: Compass,    active: false },
  { id: 'guide',     label: 'الدليل الصحي',       icon: 'https://api.iconify.design/solar:document-add-bold.svg?color=white',   active: false },
  { id: 'emergency', label: 'الطوارئ',             icon: Siren,      active: false, sos: true },
  { id: 'profile',   label: 'الملف الشخصي',        icon: User,       active: false },
]

export const adminNavItem: NavItem = {
  id: 'admin',
  label: 'إدارة النظام',
  icon: Settings2,
  active: false,
}

export const serviceCards: ServiceCardData[] = [
  {
    id: 'health-services',
    title: 'الخدمات الصحية',
    description:
      'الوصول الفوري إلى الأطباء المتطوعين، طلب استشارة طبية، والبحث عن أقرب الصيدليات المتاحة.',
    icon: Shield,
    color: '#e3f4ff',
    iconColor: '#2196f3',
  },
  {
    id: 'humanitarian-aid',
    title: 'المساعدات الإنسانية',
    description:
      'طلب طرود غذائية مستلزمات المعيشة الأساسية، أو العثور على مراكز توزيع المعونات القريبة منك.',
    icon: Heart,
    color: '#fff3e0',
    iconColor: '#f2a122',
  },
  {
    id: 'interactive-maps',
    title: 'الخرائط التفاعلية',
    description:
      'تحديد المناطق الآمنة، ممرات الإجلاء ومراكز الإيواء المحدثة لحظياً حسب الوضع الراهن.',
    icon: Compass,
    color: '#f3e8ff',
    iconColor: '#9c27b0',
  },
  {
    id: 'health-guide',
    title: 'الدليل الصحي',
    description:
      'إرشادات الإسعافات الأولية، كيفية التعامل مع الإصابات الشائعة في الأزمات، ونصائح الصحة النفسية.',
    icon: FilePlus,
    color: '#e8f5e9',
    iconColor: '#4caf50',
  },
  {
    id: 'emergency-cases',
    title: 'حالات الطوارئ',
    description:
      'اتصال الفوري بفرق الإنقاذ والدفاع المدني، اطلب النجدة الفورية في حالات الخطر الشديد.',
    icon: Siren,
    color: '#fff0f0',
    iconColor: '#f44336',
    sos: true,
  },
  {
    id: 'conversations',
    title: 'المحادثات',
    description:
      'التواصل المباشر مع غرفة العمليات، المتطوعين، المتطوعين، مجموعات الدعم المجتمعي في منطقتك.',
    icon: Send,
    color: '#e3f4ff',
    iconColor: '#2196f3',
  },
]

export const searchSuggestions: SearchSuggestion[] = [
  { id: 'emergency-nums', label: 'ارقام الطوارئ' },
  { id: 'hospitals',      label: 'المستشفيات' },
  { id: 'aid',            label: 'المساعدات' },
]
