import path from 'path'
import fs from 'fs'
import { IMAGE_RECORDS } from './image-records-data'
import { processRecordImage } from './upload-and-update-images'

const args = process.argv.slice(2)
if (args.length < 2) {
  console.error('Usage: npx tsx scripts/process-single-generated-image.ts <recordIdOrIndex> <sourceImagePath>')
  process.exit(1)
}

const [recordKey, sourceImagePath] = args

async function run() {
  const record = IMAGE_RECORDS.find((r, idx) => r.id === recordKey || idx.toString() === recordKey || r.suggestedFilename === recordKey)
  if (!record) {
    console.error(`Record not found for key: ${recordKey}`)
    process.exit(1)
  }

  if (!fs.existsSync(sourceImagePath)) {
    console.error(`Source image file does not exist: ${sourceImagePath}`)
    process.exit(1)
  }

  const destDir = path.resolve(process.cwd(), 'generated_images')
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }

  const destFilePath = path.join(destDir, record.suggestedFilename)
  fs.copyFileSync(sourceImagePath, destFilePath)
  console.log(`Copied ${sourceImagePath} -> ${destFilePath}`)

  const ok = await processRecordImage(record, destFilePath)
  if (!ok) {
    console.error(`Failed to process image for record ${record.id} (${record.matchValue})`)
    process.exit(1)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
