/**
 * One-off seed script — loads the existing mock/fixture data into the real
 * Supabase tables so the app isn't empty on first real run. See
 * docs/BACKEND_API_SPEC.md migration plan, Phase 5.
 *
 * Run with:
 *   npx tsx --env-file=.env.local scripts/seed-supabase.ts
 *
 * Safe to re-run: users are looked up by email if they already exist, and
 * every other table is only ever appended to (no dedup) — don't run this
 * against a database that already has real user-generated data beyond seeds.
 */

import { createServiceRoleClient } from '@/lib/supabase/serviceRole'
import { seedUsers } from '@/lib/mocks/seeds/users.seed'
import { seedHospitals } from '@/lib/mocks/seeds/hospitals.seed'
import { seedPharmacies } from '@/lib/mocks/seeds/pharmacies.seed'
import { seedLabs } from '@/lib/mocks/seeds/labs.seed'
import { seedClinics } from '@/lib/mocks/seeds/clinics.seed'
import { seedDentalClinics } from '@/lib/mocks/seeds/dentalClinics.seed'
import { seedAid } from '@/lib/mocks/seeds/aid.seed'
import { seedArticles } from '@/lib/mocks/seeds/articles.seed'
import { seedSafetyZones } from '@/lib/mocks/seeds/safetyZones.seed'
import { seedSafeRoads } from '@/lib/mocks/seeds/safetyRoads.seed'
import { seedResourcePoints } from '@/lib/mocks/seeds/safetyResourcePoints.seed'
import { seedAuditReports } from '@/lib/mocks/seeds/auditReports.seed'
import { seedDataSyncRequests } from '@/lib/mocks/seeds/dataSyncRequests.seed'
import mockAidDonors from '../data/mock_aid_donors.json'
import mockAidPoints from '../data/mock_aid_points.json'

type GeoJsonGeometry =
  | { type: 'Point'; coordinates: [number, number] }
  | { type: 'LineString'; coordinates: [number, number][] }
  | { type: 'Polygon'; coordinates: [number, number][][] }

/** GeoJSON -> WKT text. Postgres/PostGIS casts text -> geography automatically. */
function geoJsonToWkt(geo: GeoJsonGeometry): string {
  const pair = ([lng, lat]: [number, number]) => `${lng} ${lat}`
  if (geo.type === 'Point') return `POINT(${pair(geo.coordinates)})`
  if (geo.type === 'LineString') return `LINESTRING(${geo.coordinates.map(pair).join(', ')})`
  if (geo.type === 'Polygon') return `POLYGON((${geo.coordinates[0].map(pair).join(', ')}))`
  throw new Error(`Unsupported geometry type: ${(geo as { type: string }).type}`)
}

const supabase = createServiceRoleClient()

async function seedUsersAndProfiles(): Promise<Map<string, string>> {
  console.log('\n== Users ==')
  const mockIdToRealId = new Map<string, string>()

  for (const u of seedUsers()) {
    let userId: string | null = null

    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
    })

    if (error) {
      // Re-runnable: if the user already exists, look up their id via profiles.
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', u.email)
        .maybeSingle()
      if (existing) {
        userId = existing.id
        console.log(`  = ${u.email} (already exists)`)
      } else {
        console.error(`  ! ${u.email}: ${error.message}`)
        continue
      }
    } else {
      userId = data.user!.id
    }

    if (!userId) continue
    mockIdToRealId.set(u.id, userId)

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: u.fullName,
        role: u.role,
        is_verified: u.isVerified ?? false,
        is_active: u.isActive ?? true,
        phone_number: u.phoneNumber ?? null,
        gender: u.gender ?? null,
        age_group: u.ageGroup ?? null,
        marital_status: u.maritalStatus ?? null,
        health_status: u.healthStatus ?? null,
        housing_status: u.housingStatus ?? null,
        region: u.region ?? null,
        family_members_count: u.familyMembersCount ?? null,
        females_count: u.femalesCount ?? null,
        males_count: u.malesCount ?? null,
      })
      .eq('id', userId)

    if (updateError) {
      console.error(`  ! profile update ${u.email}: ${updateError.message}`)
    } else {
      console.log(`  + ${u.email} (${u.role})`)
    }
  }

  return mockIdToRealId
}

async function seedHealthFacilities() {
  console.log('\n== Health facilities ==')

  const hospitals = seedHospitals().map((h) => ({
    name: h.name,
    address: h.address,
    contact_number: h.contactNumber,
    image: h.image,
    latitude: h.latitude,
    longitude: h.longitude,
    status: h.status,
    icu_capacity: h.icuCapacity,
    total_beds: h.totalBeds,
    emergency_level: h.emergencyLevel,
    working_doctors: h.workingDoctors,
    current_medications: h.currentMedications,
    working_hours: h.workingHours,
    working_days: h.workingDays,
    medical_supplies: h.medicalSupplies,
    healthcare_categories: h.healthcareCategories,
  }))
  const { error: hospError } = await supabase.from('hospitals').insert(hospitals)
  console.log(hospError ? `  ! hospitals: ${hospError.message}` : `  + hospitals: ${hospitals.length}`)

  const pharmacies = seedPharmacies().map((p) => ({
    name: p.name,
    address: p.address,
    contact_number: p.contactNumber,
    image: p.image,
    latitude: p.latitude,
    longitude: p.longitude,
    status: p.status,
    is_24_hours: p.is24Hours,
    delivery_available: p.deliveryAvailable,
    delivery_radius: p.deliveryRadius,
    current_medications: p.currentMedications,
    working_hours: p.workingHours,
    working_days: p.workingDays,
    medical_supplies: p.medicalSupplies,
    healthcare_categories: p.healthcareCategories,
  }))
  const { error: pharmError } = await supabase.from('pharmacies').insert(pharmacies)
  console.log(pharmError ? `  ! pharmacies: ${pharmError.message}` : `  + pharmacies: ${pharmacies.length}`)

  const labs = seedLabs().map((l) => ({
    name: l.name,
    address: l.address,
    contact_number: l.contactNumber,
    image: l.image,
    latitude: l.latitude,
    longitude: l.longitude,
    status: l.status,
    available_tests: l.availableTests,
    home_collection: l.homeCollection,
    iso_certified: l.isoCertified,
    current_medications: l.currentMedications,
    working_hours: l.workingHours,
    working_days: l.workingDays,
    medical_supplies: l.medicalSupplies,
    healthcare_categories: l.healthcareCategories,
  }))
  const { error: labError } = await supabase.from('labs').insert(labs)
  console.log(labError ? `  ! labs: ${labError.message}` : `  + labs: ${labs.length}`)

  const clinics = seedClinics().map((c) => ({
    name: c.name,
    address: c.address,
    contact_number: c.contactNumber,
    image: c.image,
    latitude: c.latitude,
    longitude: c.longitude,
    status: c.status,
    specialties: c.specialties,
    practitioners_count: c.practitionersCount,
    working_doctors: c.workingDoctors,
    current_medications: c.currentMedications,
    working_hours: c.workingHours,
    working_days: c.workingDays,
    medical_supplies: c.medicalSupplies,
    healthcare_categories: c.healthcareCategories,
  }))
  const { error: clinicError } = await supabase.from('clinics').insert(clinics)
  console.log(clinicError ? `  ! clinics: ${clinicError.message}` : `  + clinics: ${clinics.length}`)

  const dental = seedDentalClinics().map((d) => ({
    name: d.name,
    address: d.address,
    contact_number: d.contactNumber,
    image: d.image,
    latitude: d.latitude,
    longitude: d.longitude,
    status: d.status,
    dental_chairs: d.dentalChairs,
    implants_available: d.implantsAvailable,
    orthodontics_available: d.orthodonticsAvailable,
    available_tests: d.availableTests,
    working_doctors: d.workingDoctors,
    current_medications: d.currentMedications,
    working_hours: d.workingHours,
    working_days: d.workingDays,
    medical_supplies: d.medicalSupplies,
    healthcare_categories: d.healthcareCategories,
  }))
  const { error: dentalError } = await supabase.from('dental_clinics').insert(dental)
  console.log(dentalError ? `  ! dental_clinics: ${dentalError.message}` : `  + dental_clinics: ${dental.length}`)
}

async function seedAidPoints() {
  console.log('\n== Aid points ==')

  // Resident-facing aid points (schemas/aidApi.ts AidDto).
  const points = seedAid().map((a) => ({
    name: a.name,
    label: a.label,
    status: a.status,
    type: a.type,
    latitude: a.latitude,
    longitude: a.longitude,
    available_supplies: a.availableSupplies,
  }))

  // Admin "distribution point" extended records (data/mock_aid_points.json) —
  // folded into the same aid_points table per the migration plan Phase 1.
  const adminPoints = (mockAidPoints as Array<Record<string, unknown>>).map((p) => ({
    name: p.name,
    status: p.status,
    latitude: p.latitude,
    longitude: p.longitude,
    region: p.region,
    manager: p.manager,
    phone: p.phone,
    remaining: p.remaining,
    total: p.total,
    inventory: p.inventory,
    working_days: p.workingDays,
    start_time: p.startTime,
    end_time: p.endTime,
    target_groups: p.targetGroups,
  }))

  const { error: pointsError } = await supabase.from('aid_points').insert([...points, ...adminPoints])
  console.log(
    pointsError
      ? `  ! aid_points: ${pointsError.message}`
      : `  + aid_points: ${points.length + adminPoints.length} (${points.length} resident-facing + ${adminPoints.length} admin)`,
  )
}

async function seedAidDonors() {
  console.log('\n== Aid donors ==')
  const donors = (mockAidDonors as Array<Record<string, unknown>>).map((d) => ({
    name: d.name,
    subtitle: d.subtitle,
    total_amount: d.totalAmount,
    last_donation: d.lastDonation,
    donor_type: d.donorType,
    sector: d.sector,
    contact_person: d.contactPerson,
    email: d.email,
    phone: d.phone,
    website: d.website,
    country: d.country,
    partnership_status: d.partnershipStatus,
    agreement_start: normalizeDate(d.agreementStart as string),
    agreement_end: normalizeDate(d.agreementEnd as string),
    focus_areas: d.focusAreas,
    notes: d.notes,
    active: d.active,
  }))
  const { error: donorsError } = await supabase.from('aid_donors').insert(donors)
  console.log(donorsError ? `  ! aid_donors: ${donorsError.message}` : `  + aid_donors: ${donors.length}`)
}

/** "2022/01/01" -> "2022-01-01"; leaves already-ISO dates untouched. */
function normalizeDate(value: string | null | undefined): string | null {
  if (!value) return null
  return value.replaceAll('/', '-')
}

async function seedSafetyMap() {
  console.log('\n== Safety map ==')

  const zones = seedSafetyZones().map((z) => ({
    description: z.description,
    danger_level: z.dangerLevel,
    area: geoJsonToWkt(z.area as GeoJsonGeometry),
    is_active: z.isActive,
  }))
  const { error: zonesError } = await supabase.from('danger_zones').insert(zones)
  console.log(zonesError ? `  ! danger_zones: ${zonesError.message}` : `  + danger_zones: ${zones.length}`)

  const roads = seedSafeRoads().map((r) => ({
    name: r.name,
    description: r.description,
    path: geoJsonToWkt(r.path as GeoJsonGeometry),
    is_active: r.isActive,
  }))
  const { error: roadsError } = await supabase.from('safe_roads').insert(roads)
  console.log(roadsError ? `  ! safe_roads: ${roadsError.message}` : `  + safe_roads: ${roads.length}`)

  const points = seedResourcePoints().map((p) => ({
    name: p.name,
    type: p.type,
    location: geoJsonToWkt(p.location as GeoJsonGeometry),
    is_active: p.isActive,
  }))
  const { error: pointsError } = await supabase.from('resource_points').insert(points)
  console.log(pointsError ? `  ! resource_points: ${pointsError.message}` : `  + resource_points: ${points.length}`)
}

async function seedArticlesData(mockIdToRealId: Map<string, string>) {
  console.log('\n== Articles ==')

  // mockIdToRealId is only populated when the 'users' section ran in this same
  // process. When re-running just the 'articles' section standalone, fall back
  // to resolving the author by full_name against the real profiles table.
  const authorName = seedArticles()[0]?.author?.fullName
  let fallbackAuthorId: string | null = null
  if (mockIdToRealId.size === 0 && authorName) {
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('full_name', authorName)
      .maybeSingle()
    fallbackAuthorId = data?.id ?? null
  }

  const articles = seedArticles().map((a) => ({
    title_ar: a.titleAr,
    title_en: a.titleEn,
    content_ar: a.contentAr,
    content_en: a.contentEn,
    category: a.category,
    image: a.image,
    read_time: a.readTime,
    views_count: a.viewsCount,
    is_active: a.isActive,
    author_id: a.author ? (mockIdToRealId.get(a.author.id) ?? fallbackAuthorId) : null,
  }))
  const { error } = await supabase.from('articles').insert(articles)
  console.log(error ? `  ! articles: ${error.message}` : `  + articles: ${articles.length}`)
}

async function seedAdminData() {
  console.log('\n== Admin (audit / data-sync / alerts) ==')

  const audits = seedAuditReports().map((a) => ({
    facility_name: a.facilityName,
    issue_type: a.issueType,
    status: a.status,
    target_location: a.targetLocation,
    region: a.region,
    reporter: a.reporter,
    is_urgent: a.isUrgent,
  }))
  const { error: auditError } = await supabase.from('audit_reports').insert(audits)
  console.log(auditError ? `  ! audit_reports: ${auditError.message}` : `  + audit_reports: ${audits.length}`)

  const syncRequests = seedDataSyncRequests().map((s) => ({
    entity_name: s.entityName,
    action: s.action,
    description: s.description,
    area: s.area,
    status: s.status,
    review_notes: s.reviewNotes,
  }))
  const { error: syncError } = await supabase.from('data_sync_requests').insert(syncRequests)
  console.log(syncError ? `  ! data_sync_requests: ${syncError.message}` : `  + data_sync_requests: ${syncRequests.length}`)

  // No existing seed file for alerts (was 100% hardcoded client-side per
  // docs/BACKEND_API_SPEC.md §5) — a handful of representative rows so the
  // admin alerts dashboard isn't empty.
  const alerts = [
    {
      title: 'انقطاع الكهرباء عن مستشفى الشفاء',
      message: 'انقطعت الكهرباء عن قسم الطوارئ لمدة 20 دقيقة قبل تشغيل المولد الاحتياطي.',
      severity: 'critical',
      source: 'system',
      is_resolved: false,
    },
    {
      title: 'تأخر مزامنة بيانات نقاط الإغاثة',
      message: 'آخر مزامنة لبيانات نقاط توزيع الإغاثة كانت قبل أكثر من 6 ساعات.',
      severity: 'warning',
      source: 'sync',
      is_resolved: false,
    },
    {
      title: 'بلاغ نقص أدوية من صيدلية النور',
      message: 'أبلغ أحد المتطوعين عن نقص حاد في المضادات الحيوية.',
      severity: 'warning',
      source: 'user_report',
      is_resolved: true,
    },
  ]
  const { error: alertsError } = await supabase.from('alerts').insert(alerts)
  console.log(alertsError ? `  ! alerts: ${alertsError.message}` : `  + alerts: ${alerts.length}`)
}

const VERIFY_TABLES = [
  'profiles',
  'hospitals',
  'pharmacies',
  'labs',
  'clinics',
  'dental_clinics',
  'aid_points',
  'aid_requests',
  'aid_donors',
  'danger_zones',
  'safe_roads',
  'resource_points',
  'articles',
  'alerts',
  'audit_reports',
  'data_sync_requests',
  'security_settings',
  'communication_counters',
] as const

async function verifyRowCounts() {
  console.log('\n== Row counts (verification) ==')
  for (const table of VERIFY_TABLES) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true })
    console.log(error ? `  ! ${table}: ${error.message}` : `  ${table}: ${count}`)
  }
}

async function main() {
  // Optional: `npx tsx --env-file=.env.local scripts/seed-supabase.ts <section>`
  // re-runs just one section (users|facilities|aid|safety|articles|admin) —
  // useful for retrying a single section after fixing a data/schema issue
  // without re-inserting (and duplicating) everything else.
  const section = process.argv[2]
  let mockIdToRealId = new Map<string, string>()

  if (!section || section === 'users') mockIdToRealId = await seedUsersAndProfiles()
  if (!section || section === 'facilities') await seedHealthFacilities()
  if (!section || section === 'aid') await seedAidPoints()
  if (!section || section === 'aid-donors') await seedAidDonors()
  if (!section || section === 'safety') await seedSafetyMap()
  if (!section || section === 'articles') await seedArticlesData(mockIdToRealId)
  if (!section || section === 'admin') await seedAdminData()

  await verifyRowCounts()
  console.log('\nDone.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
