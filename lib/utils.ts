import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Resolves an image URL by prepending the API base origin if the URL is a
 * relative server path (e.g. "/uploads/..."). Blob URLs and full absolute
 * URLs are returned as-is.
 */
export function resolveImageUrl(url: string | null | undefined): string {
  if (!url) return ''
  if (url.startsWith('blob:') || url.startsWith('data:') || url.startsWith('http')) {
    return url
  }
  const apiBase =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v\d+\/?$/, '').replace(/\/$/, '') ||
    (typeof window !== 'undefined' ? window.location.origin : '')
  return `${apiBase}${url.startsWith('/') ? '' : '/'}${url}`
}
