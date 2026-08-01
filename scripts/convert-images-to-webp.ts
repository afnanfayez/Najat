/**
 * One-off: convert the 35 generated facility/article images from PNG to WebP
 * (quality 82 — ~80-90% smaller, no visible loss for photo/illustration
 * content), re-upload to the same Supabase Storage bucket/path with a
 * .webp extension, update each DB row's `image` column to the new URL, and
 * delete the old heavier .png object so nothing orphaned lingers in Storage.
 *
 * Run with:
 *   npx tsx --env-file=.env scripts/convert-images-to-webp.ts
 */
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import fs from 'node:fs'
import path from 'node:path'
import { createServiceRoleClient } from '../lib/supabase/serviceRole'
import { IMAGE_RECORDS } from './image-records-data'

const execFileAsync = promisify(execFile)
const supabase = createServiceRoleClient()
const LOCAL_DIR = path.join(__dirname, '..', 'generated_images')
const WEBP_QUALITY = 82

async function convertToWebp(pngPath: string, webpPath: string): Promise<void> {
  await execFileAsync('cwebp', ['-q', String(WEBP_QUALITY), pngPath, '-o', webpPath])
}

async function main() {
  let ok = 0
  let failed = 0
  let totalBefore = 0
  let totalAfter = 0

  for (const record of IMAGE_RECORDS) {
    const pngPath = path.join(LOCAL_DIR, record.suggestedFilename)
    const webpFilename = record.suggestedFilename.replace(/\.png$/i, '.webp')
    const webpPath = path.join(LOCAL_DIR, webpFilename)
    const newStoragePath = record.storagePath.replace(/\.png$/i, '.webp')

    if (!fs.existsSync(pngPath)) {
      console.error(`[MISSING] ${record.matchValue}: no local file at ${pngPath}`)
      failed++
      continue
    }

    try {
      await convertToWebp(pngPath, webpPath)

      const beforeSize = fs.statSync(pngPath).size
      const afterSize = fs.statSync(webpPath).size
      totalBefore += beforeSize
      totalAfter += afterSize

      const fileBuffer = fs.readFileSync(webpPath)
      const { error: uploadErr } = await supabase.storage
        .from(record.bucket)
        .upload(newStoragePath, fileBuffer, { contentType: 'image/webp', upsert: true })
      if (uploadErr) throw new Error(`upload: ${uploadErr.message}`)

      const { data: publicUrlData } = supabase.storage
        .from(record.bucket)
        .getPublicUrl(newStoragePath)

      const { error: updateErr } = await supabase
        .from(record.table)
        .update({ image: publicUrlData.publicUrl })
        .eq(record.matchColumn, record.matchValue)
      if (updateErr) throw new Error(`db update: ${updateErr.message}`)

      // Best-effort — old .png object no longer referenced by any row.
      await supabase.storage.from(record.bucket).remove([record.storagePath])

      const pct = (100 * (1 - afterSize / beforeSize)).toFixed(0)
      console.log(
        `[OK] ${record.matchValue}: ${(beforeSize / 1024).toFixed(0)}KB -> ${(afterSize / 1024).toFixed(0)}KB (-${pct}%)`,
      )
      ok++
    } catch (err) {
      console.error(`[FAIL] ${record.matchValue}: ${err instanceof Error ? err.message : err}`)
      failed++
    }
  }

  console.log(
    `\nDone. ${ok} converted, ${failed} failed. Total: ${(totalBefore / 1048576).toFixed(1)}MB -> ${(totalAfter / 1048576).toFixed(1)}MB (-${(100 * (1 - totalAfter / totalBefore)).toFixed(0)}%)`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
