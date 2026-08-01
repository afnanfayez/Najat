import type { Article } from '@/schemas/healthGuide'

function encodeBinaryString(str: string): Uint8Array {
  const bytes = new Uint8Array(str.length)
  for (let i = 0; i < str.length; i += 1) {
    bytes[i] = str.charCodeAt(i) & 0xff
  }
  return bytes
}

function concatUint8Arrays(arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((acc, curr) => acc + curr.length, 0)
  const result = new Uint8Array(totalLength)
  let offset = 0
  for (const arr of arrays) {
    result.set(arr, offset)
    offset += arr.length
  }
  return result
}

function buildImagePdf(canvas: HTMLCanvasElement): Blob {
  const imgData = canvas.toDataURL('image/jpeg', 0.92)
  const base64Data = imgData.replace(/^data:image\/jpeg;base64,/, '')
  const binaryJpeg = atob(base64Data)
  const jpegBytes = encodeBinaryString(binaryJpeg)

  const pdfW = 595.28 // A4 width in points
  const pdfH = Math.max(841.89, Math.round((canvas.height / canvas.width) * pdfW))

  const parts: Uint8Array[] = []
  parts.push(encodeBinaryString('%PDF-1.4\n'))

  const offsets: number[] = [0]
  let currentOffset = parts[0].length

  const appendObj = (objNum: number, contentBytes: Uint8Array) => {
    offsets.push(currentOffset)
    const header = encodeBinaryString(`${objNum} 0 obj\n`)
    const footer = encodeBinaryString('\nendobj\n')
    const fullObj = concatUint8Arrays([header, contentBytes, footer])
    parts.push(fullObj)
    currentOffset += fullObj.length
  }

  // 1: Catalog
  appendObj(1, encodeBinaryString('<< /Type /Catalog /Pages 2 0 R >>'))
  // 2: Pages
  appendObj(2, encodeBinaryString('<< /Type /Pages /Kids [3 0 R] /Count 1 >>'))
  // 3: Page
  appendObj(
    3,
    encodeBinaryString(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pdfW} ${pdfH}] /Resources << /XObject << /Img1 4 0 R >> >> /Contents 5 0 R >>`,
    ),
  )

  // 4: Image XObject
  const imgStreamHeader = encodeBinaryString(
    `<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`,
  )
  const imgStreamFooter = encodeBinaryString('\nendstream')
  appendObj(4, concatUint8Arrays([imgStreamHeader, jpegBytes, imgStreamFooter]))

  // 5: Contents
  const drawCmd = `q ${pdfW} 0 0 ${pdfH} 0 0 cm /Img1 Do Q`
  appendObj(
    5,
    encodeBinaryString(
      `<< /Length ${drawCmd.length} >>\nstream\n${drawCmd}\nendstream`,
    ),
  )

  // Xref
  const startXref = currentOffset
  let xrefStr = `xref\n0 6\n0000000000 65535 f \n`
  for (let i = 1; i <= 5; i += 1) {
    xrefStr += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`
  }
  xrefStr += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF`
  parts.push(encodeBinaryString(xrefStr))

  const finalPdf = concatUint8Arrays(parts)
  return new Blob([finalPdf.buffer as ArrayBuffer], { type: 'application/pdf' })
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.trim().split(/\s+/)
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  }
  if (currentLine) lines.push(currentLine)
  return lines.length > 0 ? lines : ['']
}

export function downloadArticlePdf(article: Article): void {
  try {
    const width = 800
    const padding = 40
    const contentWidth = width - padding * 2

    // First pass: measure text height using temporary canvas
    const tempCanvas = document.createElement('canvas')
    const tempCtx = tempCanvas.getContext('2d')
    if (!tempCtx) return

    tempCtx.font = "bold 24px 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif"
    const titleLines = wrapText(tempCtx, article.title, contentWidth)

    tempCtx.font = "600 16px 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif"
    const paragraphs = article.content.split(/\n\n+/).filter(Boolean)
    const wrappedParagraphs: string[][] = paragraphs.map((p) =>
      wrapText(tempCtx, p.replace(/\n/g, ' '), contentWidth),
    )

    let totalHeight = 180 + titleLines.length * 34 // Header & Title
    wrappedParagraphs.forEach((lines) => {
      totalHeight += lines.length * 28 + 18
    })
    totalHeight += 80 // Footer

    totalHeight = Math.max(1050, totalHeight)

    // Second pass: render high-DPI canvas
    const scale = 2
    const canvas = document.createElement('canvas')
    canvas.width = width * scale
    canvas.height = totalHeight * scale

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.scale(scale, scale)

    // Background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, totalHeight)

    // Header
    ctx.direction = 'rtl'
    ctx.textAlign = 'right'

    ctx.fillStyle = '#0F172A'
    ctx.font = "900 24px 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif"
    ctx.fillText('💚 منصة نجاة | Najat', width - padding, 54)

    ctx.fillStyle = '#0284C7'
    ctx.font = "700 13px 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif"
    ctx.textAlign = 'left'
    ctx.fillText('الدليل الصحي والتوعية', padding, 50)

    // Blue Line under header
    ctx.fillStyle = '#2496FF'
    ctx.fillRect(padding, 72, contentWidth, 3)

    // Title
    ctx.direction = 'rtl'
    ctx.textAlign = 'right'
    ctx.fillStyle = '#0F172A'
    ctx.font = "900 26px 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif"

    let currentY = 115
    titleLines.forEach((line) => {
      ctx.fillText(line, width - padding, currentY)
      currentY += 34
    })

    // Meta line
    currentY += 6
    ctx.fillStyle = '#64748B'
    ctx.font = "700 13px 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif"
    const metaText = `⏱️ وقت القراءة: ${article.readTime}${
      article.authorName ? `  •  ✍️ الكاتب: ${article.authorName}` : ''
    }${article.category ? `  •  🏷️ التصنيف: ${article.category}` : ''}`
    ctx.fillText(metaText, width - padding, currentY)

    currentY += 16
    ctx.strokeStyle = '#CBD5E1'
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(padding, currentY)
    ctx.lineTo(width - padding, currentY)
    ctx.stroke()
    ctx.setLineDash([])

    // Content paragraphs
    currentY += 32
    ctx.fillStyle = '#334155'
    ctx.font = "600 16px 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif"

    wrappedParagraphs.forEach((lines) => {
      lines.forEach((line) => {
        ctx.fillText(line, width - padding, currentY)
        currentY += 28
      })
      currentY += 14
    })

    // Footer
    currentY = Math.max(currentY + 20, totalHeight - 40)
    ctx.strokeStyle = '#E2E8F0'
    ctx.beginPath()
    ctx.moveTo(padding, currentY - 16)
    ctx.lineTo(width - padding, currentY - 16)
    ctx.stroke()

    ctx.fillStyle = '#94A3B8'
    ctx.font = "700 12px 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif"
    ctx.textAlign = 'center'
    ctx.fillText(
      'تم تنزيل هذا المقال من منصة نجاة للخدمات الإنسانية والطوارئ في غزة - جميع الحقوق محفوظة © 2026',
      width / 2,
      currentY,
    )

    // Build PDF & trigger direct file download
    const pdfBlob = buildImagePdf(canvas)
    const filename = `${article.title.replace(/[\\/:*?"<>|]+/g, '-').slice(0, 80) || 'article'}.pdf`
    const downloadUrl = URL.createObjectURL(pdfBlob)
    const a = document.createElement('a')
    a.href = downloadUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(downloadUrl)
  } catch (e) {
    console.error('PDF download error:', e)
  }
}
