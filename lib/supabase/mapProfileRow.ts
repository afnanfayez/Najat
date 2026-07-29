import type { UserProfile } from '@/schemas/userProfile'

/** Maps a snake_case `profiles` table row to the camelCase UserProfile the app expects. */
export function mapProfileRow(row: Record<string, unknown>, fallbackEmail = ''): UserProfile {
  return {
    id: row.id as string,
    email: (row.email as string) ?? fallbackEmail,
    fullName: (row.full_name as string) ?? '',
    role: (row.role as UserProfile['role']) ?? 'resident',
    phoneNumber: row.phone_number as UserProfile['phoneNumber'],
    gender: row.gender as UserProfile['gender'],
    ageGroup: row.age_group as UserProfile['ageGroup'],
    maritalStatus: row.marital_status as UserProfile['maritalStatus'],
    healthStatus: row.health_status as UserProfile['healthStatus'],
    nationalId: row.national_id as UserProfile['nationalId'],
    housingStatus: row.housing_status as UserProfile['housingStatus'],
    familyMembersCount: row.family_members_count as UserProfile['familyMembersCount'],
    femalesCount: row.females_count as UserProfile['femalesCount'],
    malesCount: row.males_count as UserProfile['malesCount'],
    region: row.region as UserProfile['region'],
    isVerified: row.is_verified as UserProfile['isVerified'],
    isActive: row.is_active as UserProfile['isActive'],
    avatarUrl: row.avatar_url as UserProfile['avatarUrl'],
    assistancePreferences: row.assistance_preferences as UserProfile['assistancePreferences'],
    assistanceLocation: row.assistance_location as UserProfile['assistanceLocation'],
    assistanceRadius: row.assistance_radius as UserProfile['assistanceRadius'],
    emergencyContacts: row.emergency_contacts as UserProfile['emergencyContacts'],
    sosMessage: row.sos_message as UserProfile['sosMessage'],
    bloodType: row.blood_type as UserProfile['bloodType'],
  }
}
