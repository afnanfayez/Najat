import React from 'react'
import { Download } from 'lucide-react'
import { toast } from 'sonner'

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function showInstallToast(
  event: BeforeInstallPromptEvent,
  onDismiss: () => void,
) {
  toast.custom(
    (toastId) => (
      <div className="install-prompt-card">
        <div className="install-prompt-card__icon">
          <Download size={20} />
        </div>

        <div className="install-prompt-card__text">
          <div className="install-prompt-card__title">تنزيل تطبيق نجاة</div>
          <div className="install-prompt-card__subtitle">
            ثبّت التطبيق لاستخدام أسرع وبدون إنترنت.
          </div>
        </div>

        <div className="install-prompt-card__actions">
          <button
            type="button"
            className="install-prompt-card__install-btn"
            onClick={async () => {
              toast.dismiss(toastId)
              await event.prompt()
              await event.userChoice
            }}
          >
            تثبيت الآن
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
