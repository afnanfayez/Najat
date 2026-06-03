export const AUTH_SESSION_CHANGED = 'najat:auth-session-changed'

export function notifyAuthSessionChanged() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(AUTH_SESSION_CHANGED))
}
