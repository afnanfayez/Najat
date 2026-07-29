import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data } = await supabase.rpc('admin_reports_dashboard')
  const text = `Najat — System Report\nGenerated: ${new Date().toISOString()}\n\n${JSON.stringify(data, null, 2)}\n`
  return new Response(text, {
    headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="najat-report.pdf"' },
  })
}
