import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  BellRing,
  Compass,
  Heart,
  LayoutGrid,
  MessageCircle,
  PieChart,
  Search,
  Shield,
  Stethoscope,
  Users,
} from 'lucide-react'

export type AdminNavItem = {
  id: string
  label: string
  icon: LucideIcon
}

export const adminNavItems: AdminNavItem[] = [
  { id: 'dashboard', label: 'لوحة التحكم العامة', icon: LayoutGrid },
  { id: 'users', label: 'إدارة المستخدمين والصلاحيات', icon: Users },
  { id: 'health', label: 'إدارة الخدمات الصحية', icon: Stethoscope },
  { id: 'aid', label: 'إدارة المساعدات الإنسانية', icon: Heart },
  { id: 'maps', label: 'إدارة الخرائط والملاحة', icon: Compass },
  { id: 'data', label: 'البيانات', icon: BarChart3 },
  { id: 'alerts', label: 'التنبيهات والتحذيرات', icon: BellRing },
  { id: 'audit', label: 'المراجعة والتدقيق', icon: Search },
  { id: 'communication', label: 'التواصل والتنسيق', icon: MessageCircle },
  { id: 'reports', label: 'التقرير والتحليلات', icon: PieChart },
  { id: 'security', label: 'أمان النظام والنسخ الاحتياطي', icon: Shield },
]
