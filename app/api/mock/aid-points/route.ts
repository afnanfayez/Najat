import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { ADMIN_AID_DISTRIBUTION_POINTS } from '@/lib/mocks/adminAidMockData'

const DB_PATH = path.join(process.cwd(), 'data', 'mock_aid_points.json')

async function readDb() {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf-8')
    return JSON.parse(raw)
  } catch {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true })
    await fs.writeFile(DB_PATH, JSON.stringify(ADMIN_AID_DISTRIBUTION_POINTS, null, 2), 'utf-8')
    return ADMIN_AID_DISTRIBUTION_POINTS
  }
}

async function writeDb(data: any) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true })
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const points = await readDb()
  
  if (id) {
    const point = points.find((p: any) => p.id === id)
    if (!point) return NextResponse.json({ message: 'نقطة التوزيع غير موجودة' }, { status: 404 })
    return NextResponse.json(point)
  }
  return NextResponse.json(points)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const points = await readDb()
    
    const newPoint = {
      ...body,
      id: body.id && !body.id.startsWith('new-') ? body.id : `point-${Date.now()}`
    }
    
    points.push(newPoint)
    await writeDb(points)
    return NextResponse.json(newPoint)
  } catch (err) {
    console.error('Points POST error:', err)
    return NextResponse.json({ message: 'خطأ في معالجة الطلب' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const points = await readDb()
    const idx = points.findIndex((p: any) => p.id === body.id)
    
    if (idx === -1) {
      return NextResponse.json({ message: 'غير موجود' }, { status: 404 })
    }
    
    points[idx] = body
    await writeDb(points)
    return NextResponse.json(body)
  } catch (err) {
    console.error('Points PUT error:', err)
    return NextResponse.json({ message: 'خطأ في معالجة الطلب' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ message: 'معرف غير صالح' }, { status: 400 })
  
  const points = await readDb()
  const filtered = points.filter((p: any) => p.id !== id)
  await writeDb(filtered)
  return NextResponse.json({ success: true })
}
