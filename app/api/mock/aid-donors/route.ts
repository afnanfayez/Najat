import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { ADMIN_AID_DONOR_DETAILS } from '@/lib/mocks/adminAidMockData'

const DB_PATH = path.join(process.cwd(), 'data', 'mock_aid_donors.json')

async function readDb() {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf-8')
    return JSON.parse(raw)
  } catch {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true })
    await fs.writeFile(DB_PATH, JSON.stringify(ADMIN_AID_DONOR_DETAILS, null, 2), 'utf-8')
    return ADMIN_AID_DONOR_DETAILS
  }
}

async function writeDb(data: any) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true })
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const donors = await readDb()
  
  if (id) {
    const donor = donors.find((d: any) => d.id === id)
    if (!donor) return NextResponse.json({ message: 'المانح غير موجود' }, { status: 404 })
    return NextResponse.json(donor)
  }
  return NextResponse.json(donors)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const donors = await readDb()
    
    const newDonor = {
      ...body,
      id: body.id ? body.id : `donor-${Date.now()}`
    }
    
    donors.push(newDonor)
    await writeDb(donors)
    return NextResponse.json(newDonor)
  } catch (err) {
    console.error('Donors POST error:', err)
    return NextResponse.json({ message: 'خطأ في معالجة الطلب' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const donors = await readDb()
    const idx = donors.findIndex((d: any) => d.id === body.id)
    
    if (idx === -1) {
      return NextResponse.json({ message: 'غير موجود' }, { status: 404 })
    }
    
    donors[idx] = body
    await writeDb(donors)
    return NextResponse.json(body)
  } catch (err) {
    console.error('Donors PUT error:', err)
    return NextResponse.json({ message: 'خطأ في معالجة الطلب' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ message: 'معرف غير صالح' }, { status: 400 })
  
  const donors = await readDb()
  const filtered = donors.filter((d: any) => d.id !== id)
  await writeDb(filtered)
  return NextResponse.json({ success: true })
}
