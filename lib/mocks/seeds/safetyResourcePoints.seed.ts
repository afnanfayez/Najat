import type { ResourcePointDto } from '@/schemas/safetyApi'

export function seedResourcePoints(): ResourcePointDto[] {
  return [
    {
      id: 'point-001',
      name: 'ملجأ مدرسة الفالوجا',
      type: 'shelter',
      isActive: true,
      location: { type: 'Point', coordinates: [34.4489, 31.5164] },
    },
    {
      id: 'point-002',
      name: 'نقطة إسعاف أولي - خان يونس',
      type: 'medical',
      isActive: true,
      location: { type: 'Point', coordinates: [34.3061, 31.3417] },
    },
    {
      id: 'point-003',
      name: 'نقطة مياه شرب - دير البلح',
      type: 'water',
      isActive: true,
      location: { type: 'Point', coordinates: [34.3512, 31.4187] },
    },
  ]
}
