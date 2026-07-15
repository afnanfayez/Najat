import type { DentalDto } from '@/schemas/dentalApi'

export function seedDentalClinics(): DentalDto[] {
  const now = new Date().toISOString()
  const items: Array<Omit<DentalDto, 'createdAt' | 'updatedAt'>> = [
    {
      id: 'dental-001',
      name: 'عيادة أسنان الابتسامة',
      address: 'شارع النصر، مدينة غزة',
      contactNumber: '082864000',
      image: null,
      latitude: 31.5142,
      longitude: 34.4512,
      status: 'available',
      dentalChairs: 3,
      implantsAvailable: true,
      orthodonticsAvailable: true,
      workingDoctors: [
        { name: 'د. فادي أبو عيطة', specialty: 'تقويم أسنان', workingDays: ['السبت', 'الاثنين'], workingHours: '10:00 - 18:00' },
      ],
      availableTests: [],
      currentMedications: [],
      workingHours: '10:00 - 18:00',
      workingDays: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء'],
      medicalSupplies: [],
      healthcareCategories: ['طب أسنان'],
    },
    {
      id: 'dental-002',
      name: 'مركز خان يونس لطب الأسنان',
      address: 'خان يونس - حي القرارة',
      contactNumber: '082054000',
      image: null,
      latitude: 31.3487,
      longitude: 34.3102,
      status: 'available',
      dentalChairs: 2,
      implantsAvailable: false,
      orthodonticsAvailable: true,
      workingDoctors: [
        { name: 'د. نادين أبو دقة', specialty: 'أسنان أطفال', workingDays: ['الأحد', 'الثلاثاء'], workingHours: '09:00 - 16:00' },
      ],
      availableTests: [],
      currentMedications: [],
      workingHours: '09:00 - 16:00',
      workingDays: ['الأحد', 'الثلاثاء', 'الخميس'],
      medicalSupplies: [],
      healthcareCategories: ['طب أسنان'],
    },
    {
      id: 'dental-003',
      name: 'عيادة رفح لطب وجراحة الفم',
      address: 'رفح - حي يبنا',
      contactNumber: '082134000',
      image: null,
      latitude: 31.2951,
      longitude: 34.2402,
      status: 'limited',
      dentalChairs: 1,
      implantsAvailable: false,
      orthodonticsAvailable: false,
      workingDoctors: [
        { name: 'د. باسل شبات', specialty: 'جراحة فم', workingDays: ['السبت'], workingHours: '10:00 - 14:00' },
      ],
      availableTests: [],
      currentMedications: [],
      workingHours: '10:00 - 14:00',
      workingDays: ['السبت'],
      medicalSupplies: [],
      healthcareCategories: ['طب أسنان'],
    },
  ]
  return items.map((item) => ({ ...item, createdAt: now, updatedAt: now }))
}
