import { createServiceRoleClient } from '../lib/supabase/serviceRole'
import fs from 'fs'

const supabase = createServiceRoleClient()

export interface RecordImageMapping {
  id: string // e.g. 'hosp-001'
  table: string
  matchColumn: string // 'name' or 'title_ar'
  matchValue: string
  bucket: string
  storagePath: string
  suggestedFilename: string
}

export async function processRecordImage(
  item: RecordImageMapping,
  localFilePath: string
): Promise<boolean> {
  const { table, matchColumn, matchValue, bucket, storagePath } = item

  try {
    // 1. Check if record already has non-null image
    const { data: existing, error: fetchErr } = await supabase
      .from(table)
      .select('image')
      .eq(matchColumn, matchValue)
      .single()

    if (fetchErr) {
      console.error(`[FETCH ERROR] ${table} (${matchValue}): ${fetchErr.message}`)
      return false
    }

    if (existing && existing.image) {
      console.log(`[SKIP] ${table} (${matchValue}) already has image: ${existing.image}`)
      return true
    }

    if (!fs.existsSync(localFilePath)) {
      console.error(`[FILE NOT FOUND] ${localFilePath}`)
      return false
    }

    const fileBuffer = fs.readFileSync(localFilePath)
    const contentType = localFilePath.endsWith('.png') ? 'image/png' : 'image/jpeg'

    // 2. Upload to Supabase Storage bucket
    const { error: uploadErr } = await supabase.storage
      .from(bucket)
      .upload(storagePath, fileBuffer, {
        contentType,
        upsert: true,
      })

    if (uploadErr) {
      console.error(`[UPLOAD ERROR] ${table} (${matchValue}): ${uploadErr.message}`)
      return false
    }

    // 3. Get public URL
    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(storagePath)
    const publicUrl = publicUrlData.publicUrl

    // 4. Update database row
    const { error: updateErr } = await supabase
      .from(table)
      .update({ image: publicUrl })
      .eq(matchColumn, matchValue)

    if (updateErr) {
      console.error(`[DB UPDATE ERROR] ${table} (${matchValue}): ${updateErr.message}`)
      return false
    }

    console.log(`[SUCCESS] ${table} (${matchValue}) -> ${publicUrl}`)
    return true
  } catch (err: any) {
    console.error(`[EXCEPTIONAL ERROR] ${table} (${matchValue}): ${err?.message || err}`)
    return false
  }
}
