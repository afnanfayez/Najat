import { toast } from 'sonner'

const NO_INTERNET_MESSAGE =
  'لا يوجد اتصال بالإنترنت. تحقق من الاتصال وحاول مرة أخرى.'

export function showNoInternetToast() {
  toast.error(NO_INTERNET_MESSAGE, {
    id: 'no-internet-action',
    position: 'top-center',
  })
}

export function showRegisterOfflineToast() {
  toast.error(NO_INTERNET_MESSAGE, {
    id: 'no-internet-action',
    position: 'top-center',
  })
}

export function showForgotOfflineToast() {
  toast.error(NO_INTERNET_MESSAGE, {
    id: 'no-internet-action',
    position: 'top-center',
  })
}
