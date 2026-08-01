import type { NextRequest } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/serviceRole'
import { envelope, errorEnvelope } from '@/lib/api-handlers/envelope'
import { toCamelCase } from '@/lib/api-handlers/caseMapping'

export async function GET(req: NextRequest) {
  try {
    const supabase = createServiceRoleClient()
    const { searchParams } = req.nextUrl
    const region = searchParams.get('region')

    let query = supabase
      .from('profiles')
      .select('id, full_name, email, phone_number, role, region, gender, is_active, is_verified, created_at')
      .eq('role', 'volunteer')
      .eq('is_active', true)
      .is('deleted_at', null)

    if (region && region !== 'all') {
      query = query.ilike('region', `%${region}%`)
    }

    const { data, error } = await query.order('created_at', { ascending: false }).limit(50)

    if (error) {
      return errorEnvelope(error.message, 500)
    }

    const volunteers = (data ?? []).map((row) => ({
      ...toCamelCase(row),
      name: row.full_name || row.email,
      fullName: row.full_name || row.email,
      phoneNumber: row.phone_number,
      status: 'active',
    }))

    return envelope(volunteers)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return errorEnvelope(message, 500)
  }
}
