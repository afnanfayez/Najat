/**
 * Najat's backend (Railway) has permanently expired, so the app runs entirely on
 * local mock data by default — see README.md → "Mock Data Mode" for details.
 * To reconnect a real backend later: set NEXT_PUBLIC_USE_MOCK_DATA=false and a
 * valid NEXT_PUBLIC_BASE_URL / NEXT_PUBLIC_API_V1_ROOT, then rebuild.
 */
export function isMockMode(): boolean {
  return process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false'
}
