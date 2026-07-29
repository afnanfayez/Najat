import { createClient } from '@/lib/supabase/server'
import { envelope, errorEnvelope } from '@/lib/api-handlers/envelope'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('admin_system_stats')
  if (error) return errorEnvelope(error.message, 500)
  return envelope(data)
}
