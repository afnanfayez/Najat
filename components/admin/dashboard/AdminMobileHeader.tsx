'use client'

import { Menu } from 'lucide-react'
import Image from 'next/image'

interface AdminMobileHeaderProps {
  onMenuOpen: () => void
  className?: string
}

export default function AdminMobileHeader({
  onMenuOpen,
  className = '',
}: AdminMobileHeaderProps) {
  return (
    <div
      className={`mb-5 flex w-full items-center justify-between border-b border-[#e8eef5] py-3 lg:hidden ${className}`}
    >
      <button
        type="button"
        onClick={onMenuOpen}
        className="cursor-pointer border-none bg-transparent p-0 text-[#2196F3]"
        aria-label="فتح القائمة"
      >
        <Menu size={32} />
      </button>

      <div className="relative h-10 w-10 shrink-0">
        <Image
          src="/assets/Logo2.png"
          alt="شعار نجاة"
          fill
          sizes="40px"
          className="object-contain"
          priority
        />
      </div>
    </div>
  )
}
