export type VolunteerFormData = {
  photo: string | null
  fullName: string
  idNumber: string
  birthDate: string
  currentAddress: string
  detailedAddress: string
  volunteerType: string
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
  specialSkills: string
  trainingCourses: string
  agreedToTerms: boolean
}

export type UpdateField = <K extends keyof VolunteerFormData>(
  key: K,
  value: VolunteerFormData[K],
) => void

export const INITIAL_FORM_DATA: VolunteerFormData = {
  photo: null,
  fullName: '',
  idNumber: '',
  birthDate: '',
  currentAddress: '',
  detailedAddress: '',
  volunteerType: '',
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
  specialSkills: '',
  trainingCourses: '',
  agreedToTerms: false,
}

export const STEP_NAMES = [
  'المعلومات الشخصية',
  'التصنيف ومعلومات التواصل',
  'المؤهلات الأكاديمية والمهنية',
  'مراجعة وتقديم الطلب',
] as const

export const TOTAL_STEPS = 4

export const VOLUNTEER_TYPE_OPTIONS = [
  'طبي',
  'إغاثي',
  'تعليمي',
  'نفسي واجتماعي',
  'لوجستي',
  'إداري',
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
