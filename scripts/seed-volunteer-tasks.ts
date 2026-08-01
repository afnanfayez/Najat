/**
 * Seed script to insert initial sample admin-assigned tasks for volunteers.
 * Run with:
 *   npx tsx --env-file=.env.local scripts/seed-volunteer-tasks.ts
 */

import { createServiceRoleClient } from '../lib/supabase/serviceRole'

const supabase = createServiceRoleClient()

async function main() {
  console.log('== Seeding Volunteer Tasks ==')

  // Find volunteer profiles
  const { data: volunteers, error: volErr } = await supabase
    .from('profiles')
    .select('id, email, full_name')
    .eq('role', 'volunteer')

  if (volErr) {
    console.error('Error fetching volunteer profiles:', volErr.message)
    process.exit(1)
  }

  if (!volunteers || volunteers.length === 0) {
    console.warn('No volunteer profiles found in profiles table.')
    process.exit(0)
  }

  console.log(`Found ${volunteers.length} volunteer profile(s):`)
  volunteers.forEach((v) => console.log(` - ${v.full_name} (${v.email}): ${v.id}`))

  const primaryVolunteer = volunteers.find((v) => v.email === 'volunteer@najat.ps') || volunteers[0]

  const sampleTasks = [
    {
      title: 'توزيع طرود غذائية طارئة',
      description: 'توزيع 50 طرد غذائي على العائلات المتضررة في حي الزيتون بالتنسيق مع لجنة الإغاثة المحلية.',
      volunteer_id: primaryVolunteer.id,
      priority: 'high',
      due_date: new Date().toISOString().split('T')[0],
      due_time: '03:00 م',
      status: 'pending',
    },
    {
      title: 'مرافقة حالات مرضية إلى مستشفى الشفاء',
      description: 'مرافقة مريض كلى وتسهيل دخوله إلى قسم الرعاية الطبية ومتابعة العلاج مع الطبيب المناوب.',
      volunteer_id: primaryVolunteer.id,
      priority: 'urgent',
      due_date: new Date().toISOString().split('T')[0],
      due_time: '05:30 م',
      status: 'in_progress',
    },
    {
      title: 'مسح ميداني للاحتياجات الطبية',
      description: 'حصر احتياجات الأدوية والمستلزمات الطبية في مركز الإيواء شمال القطاع.',
      volunteer_id: primaryVolunteer.id,
      priority: 'medium',
      due_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      due_time: '09:00 ص',
      status: 'pending',
    },
    {
      title: 'إيصال حقائب الإسعافات الأولية',
      description: 'تسليم حقائب إسعافية وأجهزة قياس الضغط لنقطة الطوارئ الميدانية في خان يونس.',
      volunteer_id: primaryVolunteer.id,
      priority: 'high',
      due_date: new Date().toISOString().split('T')[0],
      due_time: '11:00 ص',
      status: 'completed',
    },
    {
      title: 'دعم فريق الاستجابة في مخيم جباليا',
      description: 'المشاركة مع فريق الدفاع المدني والإغاثة في تقديم الدعم الميداني العاجل للأسر النازحة.',
      volunteer_id: primaryVolunteer.id,
      priority: 'urgent',
      due_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      due_time: '02:00 م',
      status: 'pending',
    },
  ]

  // Clear previous demo tasks assigned to this volunteer to avoid duplicate noise
  await supabase
    .from('communication_tasks')
    .delete()
    .eq('volunteer_id', primaryVolunteer.id)

  const { data: inserted, error: insertErr } = await supabase
    .from('communication_tasks')
    .insert(sampleTasks)
    .select('*')

  if (insertErr) {
    console.error('Error inserting communication tasks:', insertErr.message)
    process.exit(1)
  }

  console.log(`\nSuccessfully inserted ${inserted?.length ?? 0} tasks for volunteer ${primaryVolunteer.email}!`)
  console.log('Sample task IDs:')
  inserted?.forEach((t) => console.log(` - [${t.status}] ${t.title} (${t.id})`))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
