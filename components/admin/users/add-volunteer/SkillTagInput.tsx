'use client'

import { useRef, useState } from 'react'
import { X } from 'lucide-react'
import { FORM_BLUE, FORM_FONT, FORM_INPUT_BG } from './types'

interface Props {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

export default function SkillTagInput({
  tags,
  onChange,
  placeholder = 'اكتب مهارة واضغط Enter...',
}: Props) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function addTag(raw: string) {
    const tag = raw.trim()
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag])
    }
    setInput('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',' || e.key === '،') {
      e.preventDefault()
      addTag(input)
    } else if (e.key === 'Backspace' && input === '' && tags.length > 0) {
      onChange(tags.slice(0, -1))
    }
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag))
  }

  return (
    <div
      className="flex min-h-[44px] w-full cursor-text flex-wrap gap-2 rounded-xl px-3 py-2"
      style={{ background: FORM_INPUT_BG, fontFamily: FORM_FONT }}
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-sm font-semibold"
          style={{ background: `${FORM_BLUE}20`, color: FORM_BLUE }}
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="opacity-60 hover:opacity-100"
            aria-label={`إزالة ${tag}`}
          >
            <X size={12} strokeWidth={2.5} />
          </button>
        </span>
      ))}

      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => { if (input.trim()) addTag(input) }}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="min-w-[140px] flex-1 bg-transparent text-right text-sm outline-none"
        style={{ fontFamily: FORM_FONT, color: '#334155' }}
        dir="rtl"
      />
    </div>
  )
}
