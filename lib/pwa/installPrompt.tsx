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

export function showInstallToast(
  event: BeforeInstallPromptEvent | null,
  onDismiss: () => void,
) {
  const canPrompt = Boolean(event)

  toast.custom(
    (toastId) => (
      <div className="install-prompt-card">
        <div className="install-prompt-card__icon">
          <Download size={20} />
        </div>

        <div className="install-prompt-card__text">
          <div className="install-prompt-card__title">
            إضافة نجاة للشاشة الرئيسية
          </div>
          <div className="install-prompt-card__subtitle">
            {canPrompt
              ? 'ثبّت التطبيق لاستخدام أسرع من الجوال.'
              : 'من قائمة المتصفح اختر إضافة إلى الشاشة الرئيسية.'}
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
                onDismiss()
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
            {canPrompt ? 'تثبيت الآن' : 'حسناً'}
          </button>
          <button
            type="button"
            className="install-prompt-card__skip-btn"
            onClick={() => {
              toast.dismiss(toastId)
              onDismiss()
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
