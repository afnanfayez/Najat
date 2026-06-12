import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'منصة نجاة للطوارئ',
    short_name: 'نجاة',
    description: 'منصة نجاة للخدمات الإنسانية والطوارئ - تطبيق تسجيل الدخول والتسجيل للطوارئ',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#2496FF',
    theme_color: '#2496FF',
    categories: ['medical', 'utilities'],
    icons: [
      {
        src: '/assets/najat-icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/assets/najat-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/assets/najat-icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'طوارئ',
        short_name: 'طوارئ',
        url: '/emergency',
        icons: [{ src: '/assets/najat-icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'المستشفيات',
        short_name: 'مستشفيات',
        url: '/hospitals',
        icons: [{ src: '/assets/najat-icon-192.png', sizes: '192x192' }],
      },
    ],
  }
}
