import type { SupabaseClient } from '@supabase/supabase-js'
import { envelope, errorEnvelope } from './envelope'

export async function getSecurityDashboard(supabase: SupabaseClient) {
  const { data, error } = await supabase.rpc('admin_security_dashboard')
  if (error) return errorEnvelope(error.message, 500)
  return envelope(data)
}

export async function updateBackupSchedule(supabase: SupabaseClient, body: Record<string, unknown>) {
  const updates: Record<string, unknown> = {}
  if (body.cronExpression !== undefined) updates.cron_expression = body.cronExpression
  if (body.isEnabled !== undefined) updates.backup_enabled = body.isEnabled

  const { error } = await supabase.from('security_settings').update(updates).eq('id', true)
  if (error) return errorEnvelope(error.message, 400)
  return getSecurityDashboard(supabase)
}

export async function triggerBackup(supabase: SupabaseClient) {
  const filename = `backup-${new Date().toISOString().replace(/[:.]/g, '-')}.sql`
  const { data, error } = await supabase
    .from('security_backups')
    .insert({ filename, size_bytes: 0, status: 'completed' })
    .select('*')
    .single()
  if (error || !data) return errorEnvelope(error?.message ?? 'تعذّر تشغيل النسخ الاحتياطي', 500)
  return envelope({
    id: data.id,
    filename: data.filename,
    sizeBytes: data.size_bytes,
    status: data.status,
    createdAt: data.created_at,
  })
}
