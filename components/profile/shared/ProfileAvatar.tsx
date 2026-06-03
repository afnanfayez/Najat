'use client'

import Image from 'next/image'
import { DEFAULT_PROFILE_IMAGE } from '@/lib/profile/constants'

type ProfileAvatarProps = {
  src?: string | null
  alt?: string
  size: number
  className?: string
  borderClassName?: string
}

export default function ProfileAvatar({
  src,
  alt = 'صورة الملف الشخصي',
  size,
  className = '',
  borderClassName = 'border-4 border-white',
}: ProfileAvatarProps) {
  const imageSrc = src?.trim() ? src : DEFAULT_PROFILE_IMAGE
  const isLocalSrc =
    imageSrc.startsWith('data:') || imageSrc.startsWith('blob:')

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full ${borderClassName} ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={imageSrc}
        alt={alt}
        fill
        unoptimized={isLocalSrc}
        className="object-cover"
        sizes={`${size}px`}
      />
    </div>
  )
}
