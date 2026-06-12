/** إعدادات مركزية لتفعيل البيانات الوهمية في المشروع */

export const USE_MOCK_AID = process.env.NEXT_PUBLIC_USE_MOCK === '1'

export const USE_MOCK_HEALTH_FACILITIES =
  process.env.NEXT_PUBLIC_USE_MOCK === '1'

// Admin sections — set NEXT_PUBLIC_ADMIN_*_MOCK=1 to force mock for that section.
// Default is real API (flag is false). Sections without a backend endpoint
// have their flag forced to true via .env until the backend adds the endpoint.

export const USE_MOCK_ADMIN_ALERTS =
  process.env.NEXT_PUBLIC_ADMIN_ALERTS_MOCK === '1'

export const USE_MOCK_ADMIN_DASHBOARD =
  process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_MOCK === '1'

export const USE_MOCK_ADMIN_USERS =
  process.env.NEXT_PUBLIC_ADMIN_USERS_MOCK === '1'

export const USE_MOCK_ADMIN_HEALTH =
  process.env.NEXT_PUBLIC_ADMIN_HEALTH_MOCK === '1'

export const USE_MOCK_ADMIN_AID =
  process.env.NEXT_PUBLIC_ADMIN_AID_MOCK === '1'

export const USE_MOCK_ADMIN_MAPS =
  process.env.NEXT_PUBLIC_ADMIN_MAPS_MOCK === '1'

export const USE_MOCK_ADMIN_DATA =
  process.env.NEXT_PUBLIC_ADMIN_DATA_MOCK === '1'

export const USE_MOCK_ADMIN_AUDIT =
  process.env.NEXT_PUBLIC_ADMIN_AUDIT_MOCK === '1'

export const USE_MOCK_ADMIN_COMMUNICATION =
  process.env.NEXT_PUBLIC_ADMIN_COMMUNICATION_MOCK === '1'

export const USE_MOCK_ADMIN_REPORTS =
  process.env.NEXT_PUBLIC_ADMIN_REPORTS_MOCK === '1'

export const USE_MOCK_ADMIN_SECURITY =
  process.env.NEXT_PUBLIC_ADMIN_SECURITY_MOCK === '1'
