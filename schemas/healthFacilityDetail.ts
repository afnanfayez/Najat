/**
 * بيانات تفصيلية تُرجَع لاحقاً من الباكند مع `/v1/health/facilities` أو مسارات التفصيل.
 * الحقول اختيارية؛ الواجهة تعود للقيم الافتراضية المحلية عند غيابها.
 */
export type HealthDoctor = {
  name: string
  specialty: string
  photo: string
  time: string
  days: string[]
}

export type HealthMedicineRow = {
  name: string
  category: string
  status: string
  color?: string
  statusColor?: string
}

export type HealthServiceChip = { label: string }

export type LabeledIcon = { label: string; icon: string }

export type LabTestItem = {
  name: string
  time: string
  icon: string
  /** يطابق تبويب الفلترة في واجهة المختبر */
  group?: string
}

export type DentalServiceItem = {
  name: string
  desc: string
  icon: string
  group?: string
}

export type ClinicServiceItem = {
  name: string
  desc: string
  icon: string
}

export type WorkingHoursRow = {
  label: string
  time: string
  danger?: boolean
}

export type WorkingHoursBlock = {
  bannerText?: string
  rows: WorkingHoursRow[]
}

export type HealthFacilityDetail = {
  mapPreviewImageUrl?: string
  lastUpdatedAt?: string
  /** عنوان فرعي في رأس الصيدلية / المختبر: "صيدلية مركزية"، "مختبر مركزي"، … */
  facilityKindLabel?: string
  doctors?: HealthDoctor[]
  medicines?: HealthMedicineRow[]
  /** قائمة أدوية موسّعة لشاشة «عرض الكل» (مستشفى) */
  medicinesAll?: HealthMedicineRow[]
  hospitalServices?: HealthServiceChip[]
  workingHours?: WorkingHoursBlock
  pharmacyMedicineTypes?: string[]
  pharmacySupplies?: LabeledIcon[]
  pharmacyHours?: WorkingHoursBlock
  labTests?: LabTestItem[]
  labTestTabLabels?: string[]
  labSupplies?: LabeledIcon[]
  labHours?: WorkingHoursBlock
  dentalServices?: DentalServiceItem[]
  dentalTabLabels?: string[]
  clinicServices?: ClinicServiceItem[]
  clinicMedicines?: HealthMedicineRow[]
  clinicMedicinesAll?: HealthMedicineRow[]
  clinicHours?: WorkingHoursBlock
  clinicSupplies?: LabeledIcon[]
  dentalHours?: WorkingHoursBlock
  dentalSupplies?: LabeledIcon[]
}
