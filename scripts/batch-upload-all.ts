import path from 'path'
import fs from 'fs'
import { IMAGE_RECORDS } from './image-records-data'
import { processRecordImage } from './upload-and-update-images'

async function runBatch() {
  console.log(`Starting batch processing of ${IMAGE_RECORDS.length} records...`)
  const baseDir = path.resolve(process.cwd(), 'generated_images')

  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true })
  }

  let successCount = 0
  let skipCount = 0
  let failCount = 0

  const results: Array<{ id: string; name: string; category: string; status: string; detail?: string }> = []

  for (let i = 0; i < IMAGE_RECORDS.length; i++) {
    const record = IMAGE_RECORDS[i]
    const localFilePath = path.join(baseDir, record.suggestedFilename)

    console.log(`\n[${i + 1}/${IMAGE_RECORDS.length}] ${record.category} - ${record.matchValue} (${record.id})`)

    if (!fs.existsSync(localFilePath)) {
      console.log(`  -> File not found at ${localFilePath}`)
      results.push({ id: record.id, name: record.matchValue, category: record.category, status: 'MISSING_FILE', detail: localFilePath })
      failCount++
      continue
    }

    const success = await processRecordImage(record, localFilePath)
    if (success) {
      successCount++
      results.push({ id: record.id, name: record.matchValue, category: record.category, status: 'SUCCESS' })
    } else {
      failCount++
      results.push({ id: record.id, name: record.matchValue, category: record.category, status: 'FAILED' })
    }
  }

  console.log('\n========================================')
  console.log(`SUMMARY: Total: ${IMAGE_RECORDS.length} | Success: ${successCount} | Failed/Missing: ${failCount}`)
  console.log('========================================\n')

  return results
}

runBatch().catch(console.error)
