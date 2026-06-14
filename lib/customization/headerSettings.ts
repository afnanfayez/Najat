'use client'

import { useState, useEffect } from 'react'

export interface HeaderStyleConfig {
  titleText: string
  detailText: string
  fontFamily: string
  titleColor: string
  titleFontSize: string
  titleFontWeight: string
  detailColor: string
  detailFontSize: string
  detailFontWeight: string
}

export interface PageHeaderSettings {
  health: HeaderStyleConfig
  aid: HeaderStyleConfig
  guide: HeaderStyleConfig
}

export const DEFAULT_HEADER_SETTINGS: PageHeaderSettings = {
  health: {
    titleText: "الخدمات الصحية",
    detailText: "ابحث عن أقرب مراكز الرعاية الصحية وتأكد من توفر الأدوية في الوقت الفعلي",
    fontFamily: "'Cairo', sans-serif",
    titleColor: "#1a2d4a",
    titleFontSize: "clamp(22px, 3vw, 42px)",
    titleFontWeight: "700",
    detailColor: "#000000",
    detailFontSize: "15px",
    detailFontWeight: "500",
  },
  aid: {
    titleText: "المساعدات الإنسانية",
    detailText: "احصل على الدعم الضروري بسرعة وسهولة خلال الأزمات",
    fontFamily: "'Cairo', sans-serif",
    titleColor: "#1a2d4a",
    titleFontSize: "clamp(22px, 3vw, 42px)",
    titleFontWeight: "700",
    detailColor: "#000000",
    detailFontSize: "15px",
    detailFontWeight: "500",
  },
  guide: {
    titleText: "دليلك الصحي في أوقات الحاجة",
    detailText: "نقدم لك إرشادات موثوقة للإسعافات الأولية والتوعية الصحية والدعم النفسي لضمان سلامتك وسلامة عائلتك في جميع الظروف.",
    fontFamily: "'Cairo', sans-serif",
    titleColor: "#1a2d4a",
    titleFontSize: "clamp(22px, 3vw, 42px)",
    titleFontWeight: "700",
    detailColor: "#000000",
    detailFontSize: "15px",
    detailFontWeight: "500",
  },
}

export function getHeaderSettings(): PageHeaderSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_HEADER_SETTINGS
  }
  const stored = localStorage.getItem('najat_header_settings')
  if (stored) {
    try {
      return { ...DEFAULT_HEADER_SETTINGS, ...JSON.parse(stored) }
    } catch (e) {
      console.error('Error parsing header settings', e)
    }
  }
  return DEFAULT_HEADER_SETTINGS
}

export function useHeaderSettings() {
  const [settings, setSettings] = useState<PageHeaderSettings>(DEFAULT_HEADER_SETTINGS)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('najat_header_settings')
      if (stored) {
        try {
          setSettings({ ...DEFAULT_HEADER_SETTINGS, ...JSON.parse(stored) })
        } catch (e) {
          console.error(e)
        }
      }
      setIsLoaded(true)
    }
  }, [])

  const updateSettings = (newSettings: PageHeaderSettings) => {
    setSettings(newSettings)
    if (typeof window !== 'undefined') {
      localStorage.setItem('najat_header_settings', JSON.stringify(newSettings))
      window.dispatchEvent(new Event('najat_header_settings_changed'))
    }
  }

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('najat_header_settings')
      if (stored) {
        try {
          setSettings({ ...DEFAULT_HEADER_SETTINGS, ...JSON.parse(stored) })
        } catch (e) {
          console.error(e)
        }
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('najat_header_settings_changed', handleStorageChange)
      window.addEventListener('storage', handleStorageChange)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('najat_header_settings_changed', handleStorageChange)
        window.removeEventListener('storage', handleStorageChange)
      }
    }
  }, [])

  return { settings, updateSettings, isLoaded }
}
