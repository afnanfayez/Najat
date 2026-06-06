/** إعدادات مركزية لتفعيل البيانات الوهمية في المشروع */

export const USE_MOCK_AID = process.env.NEXT_PUBLIC_USE_MOCK === '1'

export const USE_MOCK_HEALTH_FACILITIES =
  process.env.NEXT_PUBLIC_USE_MOCK === '1'

/** عند فشل API الصحة، استخدم البيانات الوهمية كاحتياط */
export const USE_MOCK_HEALTH_API_FALLBACK =
  process.env.NEXT_PUBLIC_HEALTH_MOCK === '1'

export const USE_MOCK_ADMIN_ALERTS =
  process.env.NEXT_PUBLIC_ADMIN_ALERTS_API !== '1'

export const USE_MOCK_ADMIN_DASHBOARD =
  process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_API !== '1'

export const USE_MOCK_ADMIN_USERS =
  process.env.NEXT_PUBLIC_ADMIN_USERS_API !== '1'

export const USE_MOCK_ADMIN_HEALTH =
  process.env.NEXT_PUBLIC_ADMIN_HEALTH_API !== '1'

export const USE_MOCK_ADMIN_AID =
  process.env.NEXT_PUBLIC_ADMIN_AID_API !== '1'

export const USE_MOCK_ADMIN_MAPS =
  process.env.NEXT_PUBLIC_ADMIN_MAPS_API !== '1'

export const USE_MOCK_ADMIN_DATA =
  process.env.NEXT_PUBLIC_ADMIN_DATA_API !== '1'
