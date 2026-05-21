import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  Compass,
  Heart,
  LayoutGrid,
  MessageCircle,
  PieChart,
  Search,
  Shield,
  Stethoscope,
  UserCog,
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
  { id: 'audit', label: 'المراجعة والتحقيق', icon: Search },
  { id: 'communication', label: 'التواصل والتنسيق', icon: MessageCircle },
  { id: 'reports', label: 'التقرير والتحليلات', icon: PieChart },
  { id: 'security', label: 'أمان النظام والنسخ الاحتياطي', icon: Shield },
  { id: 'support', label: 'نظام إدارة الدعم والتدريب', icon: UserCog },
]
