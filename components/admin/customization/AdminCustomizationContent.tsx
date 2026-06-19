'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Save, RefreshCw, Eye, Settings } from 'lucide-react'
import AdminShell from '../AdminShell'
import {
  ADMIN_PAGE_TITLE_STYLE,
  ADMIN_PAGE_SUBTITLE_STYLE,
} from '../layout/adminLayoutStyles'
import {
  useHeaderSettings,
  DEFAULT_HEADER_SETTINGS,
  type PageHeaderSettings,
  type HeaderStyleConfig,
} from '@/lib/customization/headerSettings'

const FONTS = [
  { id: "'Cairo', sans-serif", label: 'خط القاهرة (Cairo)' },
  { id: "'Tajawal', sans-serif", label: 'خط تجول (Tajawal)' },
  { id: "'Almarai', sans-serif", label: 'خط المراعي (Almarai)' },
  { id: "'El Messiri', sans-serif", label: 'خط المسيري (El Messiri)' },
  { id: "'Amiri', serif", label: 'الخط الأميري (Amiri)' },
]

const FONT_WEIGHTS = [
  { id: '300', label: 'خفيف (300)' },
  { id: '400', label: 'عادي (400)' },
  { id: '500', label: 'متوسط (500)' },
  { id: '600', label: 'شبه عريض (600)' },
  { id: '700', label: 'عريض (700)' },
  { id: '800', label: 'عريض جداً (800)' },
  { id: '900', label: 'أسود (900)' },
]

export default function AdminCustomizationContent() {
  const { settings, updateSettings, isLoaded } = useHeaderSettings()
  const [activeTab, setActiveTab] = useState<'health' | 'aid' | 'guide'>('health')
  const [formState, setFormState] = useState<PageHeaderSettings>(DEFAULT_HEADER_SETTINGS)

  useEffect(() => {
    if (isLoaded) {
      setFormState(settings)
    }
  }, [settings, isLoaded])

  const currentConfig = formState[activeTab]

  const handleFieldChange = (field: keyof HeaderStyleConfig, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [field]: value,
      },
    }))
  }

  const handleSave = () => {
    updateSettings(formState)
    toast.success('تم حفظ إعدادات تخصيص الواجهة بنجاح', {
      position: 'top-center',
      style: { fontFamily: "'Cairo', sans-serif" },
    })
  }

  const handleReset = () => {
    setFormState(DEFAULT_HEADER_SETTINGS)
    updateSettings(DEFAULT_HEADER_SETTINGS)
    toast.success('تمت استعادة القيم الافتراضية بنجاح', {
      position: 'top-center',
      style: { fontFamily: "'Cairo', sans-serif" },
    })
  }

  if (!isLoaded) {
    return (
      <AdminShell activeNav="customization">
        <div className="flex h-64 items-center justify-center">
          <p className="text-slate-500 font-semibold">جاري تحميل إعدادات التخصيص...</p>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell activeNav="customization">
      {/* Load Google Fonts dynamically for previews */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Cairo:wght@200;300;400;500;600;700;800;900&family=El+Messiri:wght@400;500;600;700&family=Tajawal:wght@200;300;400;500;700;800;900&display=swap');
          `,
        }}
      />

      <header className="mb-8">
        <div className="flex w-full flex-col gap-4 text-right">
          <h1 style={ADMIN_PAGE_TITLE_STYLE}>تخصيص الواجهات الرئيسية</h1>
          <p style={{ ...ADMIN_PAGE_SUBTITLE_STYLE, marginTop: '4px', color: '#64748b' }}>
            قم بتعديل وتنسيق عناوين وتفاصيل الواجهات الرئيسية للمستفيدين (الخدمات الصحية، المساعدات، والدليل الصحي)
          </p>
        </div>
      </header>

      {/* Tabs */}
      <div className="mb-6 flex border-b border-slate-200 bg-white p-1 rounded-xl shadow-sm">
        <button
          onClick={() => setActiveTab('health')}
          className={`flex-1 py-3 text-center text-sm font-bold transition-all rounded-lg ${
            activeTab === 'health'
              ? 'bg-[#2196F3] text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          الخدمات الصحية
        </button>
        <button
          onClick={() => setActiveTab('aid')}
          className={`flex-1 py-3 text-center text-sm font-bold transition-all rounded-lg ${
            activeTab === 'aid'
              ? 'bg-[#2196F3] text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          المساعدات الإنسانية
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`flex-1 py-3 text-center text-sm font-bold transition-all rounded-lg ${
            activeTab === 'guide'
              ? 'bg-[#2196F3] text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          الدليل الصحي
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 text-right">
        {/* Editor Form */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md flex flex-col gap-5">
            <h3 className="text-lg font-bold text-[#1a2d4a] border-b pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Settings size={18} className="text-[#2196F3]" />
                لوحة إعدادات التنسيق
              </span>
            </h3>

            {/* Title Text */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700">العنوان الرئيسي</label>
              <input
                type="text"
                value={currentConfig.titleText}
                onChange={(e) => handleFieldChange('titleText', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#2196F3] text-sm font-semibold"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              />
            </div>

            {/* Detail Text */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700">التفصيل / الوصف المساعد</label>
              <textarea
                rows={3}
                value={currentConfig.detailText}
                onChange={(e) => handleFieldChange('detailText', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#2196F3] text-sm font-semibold resize-none"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              />
            </div>

            {/* Font Family Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700">نوع الخط</label>
              <select
                value={currentConfig.fontFamily}
                onChange={(e) => handleFieldChange('fontFamily', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#2196F3] text-sm font-semibold bg-white cursor-pointer"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                {FONTS.map((font) => (
                  <option key={font.id} value={font.id}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Title Styles */}
            <div className="border-t pt-4 mt-2">
              <h4 className="text-sm font-extrabold text-[#2196F3] mb-4">تنسيق العنوان الرئيسي</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Title Font Size */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-600">حجم الخط (Size)</label>
                  <input
                    type="text"
                    value={currentConfig.titleFontSize}
                    onChange={(e) => handleFieldChange('titleFontSize', e.target.value)}
                    placeholder="مثال: 32px"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#2196F3] text-xs font-bold"
                  />
                </div>

                {/* Title Font Weight */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-600">سمك الخط (Weight)</label>
                  <select
                    value={currentConfig.titleFontWeight}
                    onChange={(e) => handleFieldChange('titleFontWeight', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#2196F3] text-xs font-bold bg-white"
                  >
                    {FONT_WEIGHTS.map((weight) => (
                      <option key={weight.id} value={weight.id}>
                        {weight.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title Color */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-600">لون الخط (Color)</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={currentConfig.titleColor.startsWith('#') ? currentConfig.titleColor : '#1a2d4a'}
                      onChange={(e) => handleFieldChange('titleColor', e.target.value)}
                      className="w-10 h-8 p-0 border-0 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={currentConfig.titleColor}
                      onChange={(e) => handleFieldChange('titleColor', e.target.value)}
                      className="flex-1 px-3 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#2196F3] font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Subtitle / Detail Styles */}
            <div className="border-t pt-4 mt-2">
              <h4 className="text-sm font-extrabold text-[#F59E0B] mb-4">تنسيق التفصيل / الوصف</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Detail Font Size */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-600">حجم الخط (Size)</label>
                  <input
                    type="text"
                    value={currentConfig.detailFontSize}
                    onChange={(e) => handleFieldChange('detailFontSize', e.target.value)}
                    placeholder="مثال: 15px"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#2196F3] text-xs font-bold"
                  />
                </div>

                {/* Detail Font Weight */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-600">سمك الخط (Weight)</label>
                  <select
                    value={currentConfig.detailFontWeight}
                    onChange={(e) => handleFieldChange('detailFontWeight', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#2196F3] text-xs font-bold bg-white"
                  >
                    {FONT_WEIGHTS.map((weight) => (
                      <option key={weight.id} value={weight.id}>
                        {weight.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Detail Color */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-600">لون الخط (Color)</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={currentConfig.detailColor.startsWith('#') ? currentConfig.detailColor : '#000000'}
                      onChange={(e) => handleFieldChange('detailColor', e.target.value)}
                      className="w-10 h-8 p-0 border-0 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={currentConfig.detailColor}
                      onChange={(e) => handleFieldChange('detailColor', e.target.value)}
                      className="flex-1 px-3 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#2196F3] font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-6 py-3 rounded-xl transition-all shadow-sm"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              <RefreshCw size={18} />
              استعادة الافتراضي
            </button>

            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-[#2196F3] hover:bg-[#1976D2] text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              <Save size={18} />
              حفظ التعديلات
            </button>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="lg:col-span-5">
          <div className="sticky top-6 bg-slate-50 border border-slate-200 p-6 rounded-2xl shadow-inner flex flex-col gap-4">
            <h3 className="text-md font-extrabold text-slate-700 border-b border-slate-200 pb-3 flex items-center gap-2">
              <Eye size={18} className="text-[#F59E0B]" />
              معاينة حية وتفاعلية
            </h3>

            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm min-h-[160px] flex flex-col justify-center">
              <h2
                style={{
                  fontFamily: currentConfig.fontFamily,
                  fontWeight: Number(currentConfig.titleFontWeight),
                  fontSize: currentConfig.titleFontSize,
                  color: currentConfig.titleColor,
                  margin: '0 0 10px 0',
                  lineHeight: '1.2',
                }}
              >
                {currentConfig.titleText || 'عنوان فارغ'}
              </h2>
              <p
                style={{
                  fontFamily: currentConfig.fontFamily,
                  fontWeight: Number(currentConfig.detailFontWeight),
                  fontSize: currentConfig.detailFontSize,
                  color: currentConfig.detailColor,
                  margin: 0,
                  lineHeight: '1.6',
                }}
              >
                {currentConfig.detailText || 'تفاصيل فارغة'}
              </p>
            </div>

            <div className="text-xs text-slate-400 font-semibold leading-relaxed mt-2 p-3 bg-[#e2e8f0]/40 rounded-lg">
              👉 هذه معاينة دقيقة لما ستظهر عليه ترويسة الصفحة في لوحة المستفيدين. عند الضغط على زر "حفظ التعديلات"، سيتم تطبيق التغييرات فوراً.
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
