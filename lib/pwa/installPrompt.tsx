import React from 'react'
import { Download } from 'lucide-react'
import { toast } from 'sonner'

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

type WindowWithDeferredPrompt = Window & {
  deferredNajatPrompt?: BeforeInstallPromptEvent
}

const DISMISSED_KEY = 'najat-install-dismissed'
const DISMISSED_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000 // 30 days

export function isDismissed(): boolean {
  if (process.env.NODE_ENV !== 'production') {
    return false
  }
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(DISMISSED_KEY) : null
    if (!raw) return false
    const { dismissedAt } = JSON.parse(raw) as { dismissedAt: number }
    return Date.now() - dismissedAt < DISMISSED_EXPIRY_MS
  } catch {
    return false
  }
}

export function setDismissed(): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(DISMISSED_KEY, JSON.stringify({ dismissedAt: Date.now() }))
    }
  } catch {
    // ignore — storage may be unavailable
  }
}

export function showInstallToast(event: BeforeInstallPromptEvent | null) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return

  const canPrompt = Boolean(event)

  toast.custom(
    (toastId) => (
      <div className="install-prompt-card">
        <div className="install-prompt-card__icon">
          <Download size={20} />
        </div>

        <div className="install-prompt-card__text">
          <div className="install-prompt-card__title">
            تثبيت تطبيق نجاة على جهازك
          </div>
          <div className="install-prompt-card__subtitle">
            {canPrompt
              ? 'ثبّت التطبيق على جهازك لاستخدام أسرع والوصول للخدمات حتى بدون إنترنت.'
              : 'ثبّت التطبيق من قائمة المتصفح لاستخدام أسرع والوصول للخدمات حتى بدون إنترنت.'}
          </div>
        </div>

        <div className="install-prompt-card__actions">
          <button
            type="button"
            className="install-prompt-card__install-btn"
            onClick={async () => {
              toast.dismiss(toastId)
              const activePrompt =
                event ||
                (typeof window !== 'undefined'
                  ? (window as WindowWithDeferredPrompt).deferredNajatPrompt
                  : null)

              if (!activePrompt) {
                return
              }

              try {
                await activePrompt.prompt()
                await activePrompt.userChoice
              } catch (err) {
                console.error('[PWA Install] Failed to prompt:', err)
              }
            }}
          >
            تثبيت
          </button>
          <button
            type="button"
            className="install-prompt-card__skip-btn"
            onClick={() => {
              setDismissed()
              toast.dismiss(toastId)
            }}
          >
            تخطي
          </button>
        </div>
      </div>
    ),
    {
      id: 'install-prompt',
      duration: 120000,
      position: 'top-center',
      unstyled: true,
      closeButton: false,
      className: 'install-prompt-toast',
      classNames: {
        toast: 'install-prompt-toast',
        content: 'install-prompt-content',
      },
    },
  )
}
