import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { ADMIN_HEALTH_FACILITIES } from '@/lib/mocks/adminHealthMockData'
import { mapFacilityToSetupForm } from '@/components/admin/health/data/facilitySetupMapper'

const DB_PATH = path.join(process.cwd(), 'data', 'mock_health_facilities.json')
const FORMS_DB_PATH = path.join(process.cwd(), 'data', 'mock_health_facility_forms.json')

async function readDb() {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf-8')
    return JSON.parse(raw)
  } catch {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true })
    await fs.writeFile(DB_PATH, JSON.stringify(ADMIN_HEALTH_FACILITIES, null, 2), 'utf-8')
    return ADMIN_HEALTH_FACILITIES
  }
}

async function readFormsDb() {
  try {
    const raw = await fs.readFile(FORMS_DB_PATH, 'utf-8')
    return JSON.parse(raw)
  } catch {
    const defaultForms: Record<string, any> = {}
    ADMIN_HEALTH_FACILITIES.forEach(f => {
      defaultForms[f.id] = mapFacilityToSetupForm(f)
    })
    await fs.mkdir(path.dirname(FORMS_DB_PATH), { recursive: true })
    await fs.writeFile(FORMS_DB_PATH, JSON.stringify(defaultForms, null, 2), 'utf-8')
    return defaultForms
  }
}

async function writeDb(data: any) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true })
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

async function writeFormsDb(data: any) {
  await fs.mkdir(path.dirname(FORMS_DB_PATH), { recursive: true })
  await fs.writeFile(FORMS_DB_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  
  const facilities = await readDb()
  const forms = await readFormsDb()
  
  if (id) {
    const form = forms[id] || mapFacilityToSetupForm(facilities.find((f: any) => f.id === id))
    if (!form) {
      return NextResponse.json({ message: 'المنشأة غير موجودة' }, { status: 404 })
    }
    return NextResponse.json(form)
  }
  
  const activeNow = facilities.filter((f: any) => f.status === 'open' && f.isOpen).length
  const underMaintenance = facilities.filter((f: any) => f.status === 'maintenance').length
  
  return NextResponse.json({
    facilities,
    stats: {
      totalFacilities: facilities.length,
      activeNow,
      underMaintenance
    }
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { form, facilityType } = body
    
    const facilities = await readDb()
    const forms = await readFormsDb()
    
    const id = `mock-${Date.now()}`
    
    const newFacility = {
      id,
      name: form.name,
      address: form.address,
      imageUrl: form.images?.[0]?.url || '/assets/health1.jpg',
      isOpen: form.operatingStatus === 'open',
      phone: form.phone,
      region: form.region || 'central',
      status: form.operatingStatus || 'open',
      workloadPercent: 0,
      facilityType: facilityType || 'hospital',
    }
    
    form.id = id
    
    facilities.unshift(newFacility)
    forms[id] = form
    
    await writeDb(facilities)
    await writeFormsDb(forms)
    
    return NextResponse.json(newFacility)
  } catch (err) {
    console.error('Facilities POST error:', err)
    return NextResponse.json({ message: 'خطأ في معالجة الطلب' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, form, facilityType, status } = body
    
    const facilities = await readDb()
    const forms = await readFormsDb()
    
    const idx = facilities.findIndex((f: any) => f.id === id)
    if (idx === -1) {
      return NextResponse.json({ message: 'المنشأة غير موجودة' }, { status: 404 })
    }
    
    if (status) {
      facilities[idx].status = status
      facilities[idx].isOpen = status !== 'closed'
      if (forms[id]) {
        forms[id].operatingStatus = status
      }
    } else {
      facilities[idx] = {
        ...facilities[idx],
        name: form.name,
        address: form.address,
        imageUrl: form.images?.[0]?.url || facilities[idx].imageUrl,
        isOpen: form.operatingStatus === 'open',
        phone: form.phone,
        region: form.region || facilities[idx].region,
        status: form.operatingStatus || facilities[idx].status,
        facilityType: facilityType || facilities[idx].facilityType || 'hospital',
      }
      forms[id] = form
    }
    
    await writeDb(facilities)
    await writeFormsDb(forms)
    
    return NextResponse.json(facilities[idx])
  } catch (err) {
    console.error('Facilities PUT error:', err)
    return NextResponse.json({ message: 'خطأ في معالجة الطلب' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ message: 'معرف غير صالح' }, { status: 400 })
  }
  
  const facilities = await readDb()
  const forms = await readFormsDb()
  
  const filteredFacilities = facilities.filter((f: any) => f.id !== id)
  delete forms[id]
  
  await writeDb(filteredFacilities)
  await writeFormsDb(forms)
  
  return NextResponse.json({ success: true })
}
