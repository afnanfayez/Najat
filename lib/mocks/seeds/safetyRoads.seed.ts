import type { SafeRoadDto } from '@/schemas/safetyApi'

export function seedSafeRoads(): SafeRoadDto[] {
  return [
    {
      id: 'road-001',
      name: 'الطريق الساحلي الآمن',
      description: 'ممر إجلاء آمن يمتد من مدينة غزة إلى دير البلح',
      isActive: true,
      path: {
        type: 'LineString',
        coordinates: [
          [34.45, 31.52],
          [34.4, 31.47],
          [34.35, 31.42],
        ],
      },
    },
    {
      id: 'road-002',
      name: 'طريق صلاح الدين الجنوبي',
      description: 'ممر آمن بين خان يونس ورفح',
      isActive: true,
      path: {
        type: 'LineString',
        coordinates: [
          [34.31, 31.34],
          [34.28, 31.31],
          [34.25, 31.29],
        ],
      },
    },
  ]
}
