import type { DangerZoneDto } from '@/schemas/safetyApi'

export function seedSafetyZones(): DangerZoneDto[] {
  return [
    {
      id: 'zone-001',
      description: 'منطقة قصف نشطة - شرق مدينة غزة',
      dangerLevel: 'critical',
      isActive: true,
      area: {
        type: 'Polygon',
        coordinates: [
          [
            [34.47, 31.51],
            [34.485, 31.51],
            [34.485, 31.5],
            [34.47, 31.5],
            [34.47, 31.51],
          ],
        ],
      },
    },
    {
      id: 'zone-002',
      description: 'منطقة حدودية مقيدة - رفح',
      dangerLevel: 'high',
      isActive: true,
      area: {
        type: 'Polygon',
        coordinates: [
          [
            [34.24, 31.24],
            [34.26, 31.24],
            [34.26, 31.23],
            [34.24, 31.23],
            [34.24, 31.24],
          ],
        ],
      },
    },
    {
      id: 'zone-003',
      description: 'أنقاض مبانٍ غير مستقرة - خان يونس',
      dangerLevel: 'medium',
      isActive: true,
      area: {
        type: 'Polygon',
        coordinates: [
          [
            [34.3, 31.35],
            [34.31, 31.35],
            [34.31, 31.34],
            [34.3, 31.34],
            [34.3, 31.35],
          ],
        ],
      },
    },
  ]
}
