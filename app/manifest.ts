import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'منصة نجاة للطوارئ',
    short_name: 'نجاة',
    description: 'منصة نجاة للخدمات الإنسانية والطوارئ - تطبيق تسجيل الدخول والتسجيل للطوارئ',
    start_url: '/login',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#2496FF',
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
        src: '/assets/najat-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
