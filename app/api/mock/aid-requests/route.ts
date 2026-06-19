import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data', 'mock_aid_requests.json')

const DEFAULT_AID_REQUESTS = [
  {
    id: 'req-1',
    aidPointId: '1',
    userId: 'user-1',
    status: 'pending',
    notes: 'بحاجة ماسة لحليب أطفال وحفاضات مقاس 4',
    requestedSupplies: ['أدوية ومستلزمات', 'مواد غذائية'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    husbandName: 'أحمد سعيد المصري',
    wifeName: 'فاطمة عمر المصري',
    phoneNumber: '0599123456',
    currentLocation: 'دير البلح - قرب مدرسة المنفلوطي',
    femaleChildrenCount: 3,
    maleChildrenCount: 2,
    aidOrganizationName: 'الهلال الأحمر الفلسطيني'
  },
  {
    id: 'req-2',
    aidPointId: '1',
    userId: 'user-2',
    status: 'approved',
    notes: 'العائلة نازحة من شمال غزة ولديها طفل مريض بالسكري بحاجة لإنسولين',
    requestedSupplies: ['أدوية'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    husbandName: 'محمود عبد الله خليل',
    wifeName: 'منى يوسف خليل',
    phoneNumber: '0592223344',
    currentLocation: 'رفح - تل السلطان',
    femaleChildrenCount: 1,
    maleChildrenCount: 3,
    aidOrganizationName: 'منظمة الصحة العالمية'
  },
  {
    id: 'req-3',
    aidPointId: '2',
    userId: 'user-3',
    status: 'rejected',
    notes: 'تم رفض الطلب لتكرار التقديم خلال نفس الأسبوع للاستفادة من سلتين غذائيتين',
    requestedSupplies: ['مواد غذائية'],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    husbandName: 'سليمان خالد حمدان',
    wifeName: 'عبير جابر حمدان',
    phoneNumber: '0595556677',
    currentLocation: 'خان يونس - معسكر خان يونس',
    femaleChildrenCount: 4,
    maleChildrenCount: 0,
    aidOrganizationName: 'جمعية البر - حي التفاح'
  },
  {
    id: 'req-4',
    aidPointId: '3',
    userId: 'user-4',
    status: 'fulfilled',
    notes: 'تم تسليم السلة الغذائية والمياه المعقمة بنجاح',
    requestedSupplies: ['مواد غذائية', 'مياه صالحة للشرب'],
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    husbandName: 'ياسر محمد رضوان',
    wifeName: 'خلود علي رضوان',
    phoneNumber: '0597778899',
    currentLocation: 'النصيرات - مخيم 2',
    femaleChildrenCount: 2,
    maleChildrenCount: 2,
    aidOrganizationName: 'مركز الإغاثة - خان يونس'
  }
]

async function readDb() {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf-8')
    return JSON.parse(raw)
  } catch {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true })
    await fs.writeFile(DB_PATH, JSON.stringify(DEFAULT_AID_REQUESTS, null, 2), 'utf-8')
    return DEFAULT_AID_REQUESTS
  }
}

async function writeDb(data: any) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true })
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

export async function GET() {
  const requests = await readDb()
  return NextResponse.json(requests)
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, status } = body
    if (!id || !status) {
      return NextResponse.json({ message: 'معطيات غير مكتملة' }, { status: 400 })
    }
    
    const requests = await readDb()
    const idx = requests.findIndex((r: any) => r.id === id)
    if (idx === -1) {
      return NextResponse.json({ message: 'الطلب غير موجود' }, { status: 404 })
    }
    
    requests[idx].status = status
    requests[idx].updatedAt = new Date().toISOString()
    
    await writeDb(requests)
    return NextResponse.json(requests[idx])
  } catch (err) {
    console.error('Aid requests PUT error:', err)
    return NextResponse.json({ message: 'خطأ في معالجة الطلب' }, { status: 500 })
  }
}
