'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Minus, Check } from 'lucide-react'
import CustomCheckbox from '../shared/CustomCheckbox'

const STORAGE_KEY = 'assistance_preferences'

type Preferences = {
  food: boolean
  medicine: boolean
  water: boolean
  clothes: boolean
  health: boolean
  transport: boolean
}

type StoredData = {
  preferences: Preferences
  location: string
  radius: string
}

const DEFAULT_PREFERENCES: Preferences = {
  food: false,
  medicine: false,
  water: false,
  clothes: false,
  health: false,
  transport: false,
}

function loadFromStorage(): StoredData {
  if (typeof window === 'undefined') {
    return { preferences: DEFAULT_PREFERENCES, location: '', radius: '5' }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { preferences: DEFAULT_PREFERENCES, location: '', radius: '5' }
    return JSON.parse(raw) as StoredData
  } catch {
    return { preferences: DEFAULT_PREFERENCES, location: '', radius: '5' }
  }
}

export default function AssistancePreferences() {
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES)
  const [location, setLocation] = useState('')
  const [radius, setRadius] = useState('5')
  const [saved, setSaved] = useState(false)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const stored = loadFromStorage()
    setPreferences(stored.preferences)
    setLocation(stored.location)
    setRadius(stored.radius)
  }, [])

  const persist = (next: StoredData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setSaved(true)
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => setSaved(false), 2000)
  }

  const togglePreference = (key: keyof Preferences) => {
    setPreferences(prev => {
      const next = { ...prev, [key]: !prev[key] }
      persist({ preferences: next, location, radius })
      return next
    })
  }

  const handleLocationChange = (val: string) => {
    setLocation(val)
    persist({ preferences, location: val, radius })
  }

  const handleIncrementRadius = () => {
    const next = String(parseInt(radius || '0') + 1)
    setRadius(next)
    persist({ preferences, location, radius: next })
  }

  const handleDecrementRadius = () => {
    const next = String(Math.max(0, parseInt(radius || '0') - 1))
    setRadius(next)
    persist({ preferences, location, radius: next })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-slate-800">تفضيلات المساعدات</h3>
          <span className="text-blue-500">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </span>
        </div>
        {saved ? (
          <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
            <Check size={12} />
            تم الحفظ
          </span>
        ) : (
          <span className="bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1.5 rounded-full">
            يُحفظ تلقائياً
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <CustomCheckbox label="غذاء" sublabel="طرود غذائية" checked={preferences.food} onChange={() => togglePreference('food')} />
        <CustomCheckbox label="دواء" sublabel="احتياجات طبية" checked={preferences.medicine} onChange={() => togglePreference('medicine')} />
        <CustomCheckbox label="ماء" sublabel="مياه صالحة للشرب" checked={preferences.water} onChange={() => togglePreference('water')} />
        <CustomCheckbox label="ملابس" sublabel="كسوة شتوية/صيفية" checked={preferences.clothes} onChange={() => togglePreference('clothes')} />
        <CustomCheckbox label="صحة" sublabel="كشوفات طبية" checked={preferences.health} onChange={() => togglePreference('health')} />
        <CustomCheckbox label="نقل" sublabel="توصيل للمراكز" checked={preferences.transport} onChange={() => togglePreference('transport')} />
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full text-right">
          <label className="text-sm font-bold text-slate-800 mb-2 block">الموقع الحالي</label>
          <input
            type="text"
            value={location}
            onChange={(e) => handleLocationChange(e.target.value)}
            placeholder="حدد موقعك الحالي"
            className="w-full bg-blue-50/50 border border-blue-100 rounded-lg py-3 px-4 text-right text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div className="w-full md:w-32">
          <label className="text-sm font-bold text-slate-800 mb-2 block text-center">نطاق البحث (كم)</label>
          <div className="flex items-center justify-between bg-blue-50/50 border border-blue-100 rounded-lg p-1">
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center text-blue-500 hover:bg-blue-100 rounded-md transition-colors"
              onClick={handleDecrementRadius}
            >
              <Minus size={16} />
            </button>
            <span className="font-bold text-slate-800">{radius}</span>
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center text-blue-500 hover:bg-blue-100 rounded-md transition-colors"
              onClick={handleIncrementRadius}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
