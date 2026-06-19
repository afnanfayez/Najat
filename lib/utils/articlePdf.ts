import type { Article } from '@/schemas/healthGuide'

function toPdfHex(value: string): string {
  const bytes: number[] = [0xfe, 0xff]
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i)
    bytes.push((code >> 8) & 0xff, code & 0xff)
  }
  return bytes.map((byte) => byte.toString(16).padStart(2, '0')).join('').toUpperCase()
}

function chunkLine(value: string, maxLength = 70): string[] {
  const words = value.trim().split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let line = ''

  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (next.length > maxLength && line) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }

  if (line) lines.push(line)
  return lines.length ? lines : ['']
}

function buildArticlePdf(article: Article): Blob {
  const lines = [
    article.title,
    `وقت القراءة: ${article.readTime}${article.authorName ? ` | الكاتب: ${article.authorName}` : ''}`,
    '',
    ...article.content
      .split(/\n\n+/)
      .flatMap((paragraph) => [...chunkLine(paragraph), '']),
  ]

  const linesPerPage = 42
  const pages: string[][] = []
  for (let i = 0; i < lines.length; i += linesPerPage) {
    pages.push(lines.slice(i, i + linesPerPage))
  }

  const objects: string[] = []
  objects.push('<< /Type /Catalog /Pages 2 0 R >>')

  const pageObjectIds = pages.map((_, index) => 4 + index * 2)
  objects.push(
    `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pages.length} >>`,
  )
  objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')

  pages.forEach((pageLines, index) => {
    const pageObjectId = 4 + index * 2
    const contentObjectId = pageObjectId + 1
    const commands = [
      'BT',
      '/F1 13 Tf',
      '50 792 Td',
      '16 TL',
      ...pageLines.map((line, lineIndex) => {
        const font = lineIndex === 0 && index === 0 ? '/F1 18 Tf ' : ''
        return `${font}<${toPdfHex(line)}> Tj T*`
      }),
      'ET',
    ].join('\n')

    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentObjectId} 0 R >>`,
    )
    objects.push(`<< /Length ${commands.length} >>\nstream\n${commands}\nendstream`)
  })

  let pdf = '%PDF-1.4\n'
  const offsets = [0]
  objects.forEach((object, index) => {
    offsets.push(pdf.length)
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`
  })
  const xrefOffset = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`
  })
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`

  return new Blob([pdf], { type: 'application/pdf' })
}

export function downloadArticlePdf(article: Article): void {
  const filename = `${article.title.replace(/[\\/:*?"<>|]+/g, '-').slice(0, 80) || 'article'}.pdf`
  const url = URL.createObjectURL(buildArticlePdf(article))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
