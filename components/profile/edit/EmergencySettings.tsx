'use client'

import React, { useEffect, useState } from 'react'
import { Edit2, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  saveEmergencySettings,
  type EmergencyContact,
} from '@/lib/profile/localProfileStorage'
import { useProfile } from '@/hooks/useProfile'

function newContact(): EmergencyContact {
  return {
    id: crypto.randomUUID(),
    name: '',
    phone: '',
  }
}

export default function EmergencySettings() {
  const { profile, saveProfile } = useProfile()
  const [contacts, setContacts] = useState<EmergencyContact[]>([])
  const [sosMessage, setSosMessage] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)

  // Load data from profile (server-side profile_store.json via API) — works on any device/browser
  useEffect(() => {
    if (!profile) return
    // Only initialize once to avoid overwriting user edits on re-renders
    if (initialized) return

    const serverContacts = (profile as any).emergencyContacts as EmergencyContact[] | null
    const serverSos = (profile as any).sosMessage as string | null

    setContacts(
      serverContacts?.length
        ? serverContacts
        : [{ id: crypto.randomUUID(), name: '', phone: '' }],
    )
    setSosMessage(serverSos ?? '')
    setInitialized(true)
  }, [profile, initialized])


  const handleSave = async () => {
    if (!profile?.id) return
    const cleaned = contacts.filter(
      (c) => c.name.trim() || c.phone.trim(),
    )
    // Also save to localStorage as a fast local cache
    saveEmergencySettings(profile.id, {
      contacts: cleaned,
      sosMessage: sosMessage.trim(),
    })
    
    try {
      await saveProfile({
        emergencyContacts: cleaned,
        sosMessage: sosMessage.trim(),
      })
      toast.success('تم حفظ إعدادات الطوارئ')
      setEditingId(null)
    } catch {
      toast.error('حدث خطأ أثناء مزامنة إعدادات الطوارئ مع الخادم')
    }
  }


  const updateContact = (
    id: string,
    field: keyof EmergencyContact,
    value: string,
  ) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    )
  }

  return (
    <div className="bg-red-50/50 rounded-xl shadow-sm border border-red-100 p-6 relative overflow-hidden">
      <div className="flex justify-start items-center gap-2 mb-6">
        <h3 className="text-lg font-bold text-red-500">إعدادات الطوارئ</h3>
        <div className="w-6 h-6 rounded-full border-2 border-red-500 flex items-center justify-center text-red-500 font-bold text-xs shrink-0">
          !
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h4 className="text-sm font-bold text-slate-800 text-right">
          أرقام الاتصال السريع
        </h4>

        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="bg-white rounded-xl p-3 border border-red-100"
          >
            {editingId === contact.id ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={contact.name}
                  onChange={(e) =>
                    updateContact(contact.id, 'name', e.target.value)
                  }
                  placeholder="الاسم (مثال: محمد — الأب)"
                  className="w-full border border-red-100 rounded-lg px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
                <input
                  type="tel"
                  value={contact.phone}
                  onChange={(e) =>
                    updateContact(contact.id, 'phone', e.target.value)
                  }
                  placeholder="05xxxxxxxx"
                  dir="ltr"
                  className="w-full border border-red-100 rounded-lg px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="text-blue-500 text-xs font-bold self-end"
                >
                  تم
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-500 shrink-0">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="font-bold text-slate-800 text-sm">
                      {contact.name.trim() || 'جهة اتصال'}
                    </span>
                    <span
                      className="text-slate-500 text-xs"
                      dir="ltr"
                    >
                      {contact.phone.trim() || '—'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingId(contact.id)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="تعديل"
                  >
                    <Edit2 size={16} />
                  </button>
                  {contacts.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setContacts((prev) =>
                          prev.filter((c) => c.id !== contact.id),
                        )
                      }
                      className="text-red-400 hover:text-red-600 transition-colors"
                      aria-label="حذف"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => {
            const c = newContact()
            setContacts((prev) => [...prev, c])
            setEditingId(c.id)
          }}
          className="w-full py-3 border-2 border-dashed border-red-300 hover:bg-red-50 rounded-xl font-bold text-red-500 transition-colors flex justify-center items-center gap-2"
        >
          <Plus size={16} />
          إضافة جهة اتصال جديدة
        </button>

        <div className="mt-2">
          <h4 className="text-sm font-bold text-slate-800 text-right mb-2">
            رسالة SOS مخصصة
          </h4>
          <textarea
            className="w-full h-24 bg-white border border-red-100 rounded-xl p-4 text-right text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 resize-none text-slate-800"
            placeholder="أنا في حالة طوارئ، موقعي الحالي مرفق..."
            value={sosMessage}
            onChange={(e) => setSosMessage(e.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl transition-colors"
        >
          حفظ إعدادات الطوارئ
        </button>
      </div>
    </div>
  )
}
