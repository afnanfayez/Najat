import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { ADMIN_HEALTH_MEDICAL_CONTENT } from '@/lib/mocks/adminHealthMockData'

const DB_PATH = path.join(process.cwd(), 'data', 'mock_medical_content.json')

async function readDb() {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf-8')
    return JSON.parse(raw)
  } catch {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true })
    await fs.writeFile(DB_PATH, JSON.stringify(ADMIN_HEALTH_MEDICAL_CONTENT, null, 2), 'utf-8')
    return ADMIN_HEALTH_MEDICAL_CONTENT
  }
}

async function writeDb(data: any) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true })
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const search = searchParams.get('search')?.toLowerCase() || ''
  const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : null
  
  const items = await readDb()
  
  if (id) {
    const item = items.find((i: any) => i.id === id)
    if (!item) {
      return NextResponse.json({ message: 'المحتوى غير موجود' }, { status: 404 })
    }
    return NextResponse.json(item)
  }
  
  let filtered = items
  if (search) {
    filtered = items.filter((i: any) => 
      i.title.toLowerCase().includes(search) || 
      i.author.toLowerCase().includes(search)
    )
  }
  
  if (limit) {
    filtered = filtered.slice(0, limit)
  }
  
  return NextResponse.json({ items: filtered })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const items = await readDb()
    
    const newItem = {
      id: `content-${Date.now()}`,
      author: body.author ?? 'مسؤول نجاة',
      date: new Date().toLocaleDateString('ar-EG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      title: body.title,
      category: body.category,
      body: body.body,
      references: body.references ?? '',
      description: body.description,
      status: body.status ?? 'draft',
      thumbnailUrl: body.thumbnailUrl ?? '/assets/artical.png',
    }
    
    items.unshift(newItem)
    await writeDb(items)
    
    return NextResponse.json(newItem)
  } catch (err) {
    console.error('Content POST error:', err)
    return NextResponse.json({ message: 'خطأ في معالجة الطلب' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, ...data } = body
    
    const items = await readDb()
    const idx = items.findIndex((i: any) => i.id === id)
    if (idx === -1) {
      return NextResponse.json({ message: 'المحتوى غير موجود' }, { status: 404 })
    }
    
    items[idx] = {
      ...items[idx],
      ...data,
      references: data.references ?? items[idx].references,
    }
    
    await writeDb(items)
    return NextResponse.json(items[idx])
  } catch (err) {
    console.error('Content PUT error:', err)
    return NextResponse.json({ message: 'خطأ في معالجة الطلب' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ message: 'معرف غير صالح' }, { status: 400 })
  }
  
  const items = await readDb()
  const filtered = items.filter((i: any) => i.id !== id)
  
  await writeDb(filtered)
  return NextResponse.json({ success: true })
}
