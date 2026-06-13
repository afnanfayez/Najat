export type UserTypeOption = 'volunteer' | 'resident'

export type VolunteerFormData = {
  userType: UserTypeOption
  photo: string | null
  fullName: string
  idNumber: string
  birthDate: string
  currentAddress: string
  detailedAddress: string
  volunteerTypes: string[]
  primaryPhone: string
  backupPhone: string
  email: string
  socialMedia: string
  academicQualification: string
  specialization: string
  university: string
  graduationYear: string
  previousVolunteering: string
  workExperience: string
  specialSkills: string[]
  trainingCourses: string
  agreedToTerms: boolean
  // Resident-specific fields
  gender?: 'male' | 'female'
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed'
  familyMembersCount?: string
  femalesCount?: string
  malesCount?: string
  housingStatus?: string
}

export type UpdateField = <K extends keyof VolunteerFormData>(
  key: K,
  value: VolunteerFormData[K],
) => void

export const INITIAL_FORM_DATA: VolunteerFormData = {
  userType: 'volunteer',
  photo: null,
  fullName: '',
  idNumber: '',
  birthDate: '',
  currentAddress: '',
  detailedAddress: '',
  volunteerTypes: [],
  primaryPhone: '',
  backupPhone: '',
  email: '',
  socialMedia: '',
  academicQualification: '',
  specialization: '',
  university: '',
  graduationYear: '',
  previousVolunteering: '',
  workExperience: '',
  specialSkills: [],
  trainingCourses: '',
  agreedToTerms: false,
  gender: undefined,
  maritalStatus: undefined,
  familyMembersCount: '',
  femalesCount: '',
  malesCount: '',
  housingStatus: '',
}

export const STEP_NAMES = [
  'المعلومات الشخصية',
  'التصنيف ومعلومات التواصل',
  'المؤهلات الأكاديمية والمهنية',
  'مراجعة وتقديم الطلب',
] as const

export const TOTAL_STEPS = 4

export const ADDRESS_OPTIONS = [
  { value: 'شمال غزة',       label: 'شمال غزة' },
  { value: 'مدينة غزة',      label: 'مدينة غزة' },
  { value: 'المنطقة الوسطى', label: 'المنطقة الوسطى' },
  { value: 'خانيونس',        label: 'خانيونس' },
  { value: 'رفح',            label: 'رفح' },
]

export const VOLUNTEER_TYPE_OPTIONS: { value: string; label: string; description: string }[] = [
  { value: 'ميداني',       label: 'متطوع ميداني',  description: 'العمل المباشر في المواقع الميدانية' },
  { value: 'إغاثي',        label: 'متطوع إغاثي',   description: 'توزيع المساعدات والدعم اللوجستي' },
  { value: 'تقني',         label: 'متطوع تقني',    description: 'الدعم الفني، البرمجة، والتحليل' },
  { value: 'طبي',          label: 'متطوع طبي',     description: 'الأطباء، الممرضون، والمسعفون' },
  { value: 'تعليمي',       label: 'متطوع تعليمي',  description: 'التدريس والتوعية والإرشاد' },
  { value: 'نفسي اجتماعي', label: 'متطوع نفسي اجتماعي', description: 'الدعم النفسي والاجتماعي للمتضررين' },
]

export const QUALIFICATION_OPTIONS = [
  'ثانوية عامة',
  'دبلوم',
  'بكالوريوس',
  'ماجستير',
  'دكتوراه',
]

// Shared style constants
export const FORM_FONT = "'Cairo', sans-serif"
export const FORM_BLUE = '#2196F3'
export const FORM_AMBER = '#F59E0B'
export const FORM_INPUT_BG = '#2196F31A'

export const FORM_LABEL_STYLE = {
  fontFamily: FORM_FONT,
  fontWeight: 700,
  fontSize: '15px',
  color: '#1e293b',
} as const

export const FORM_INPUT_STYLE = {
  fontFamily: FORM_FONT,
  background: FORM_INPUT_BG,
  color: '#334155',
} as const

export const SECTION_TITLE_STYLE = {
  fontFamily: FORM_FONT,
  fontWeight: 700,
  fontSize: '16px',
  color: '#1e293b',
} as const
