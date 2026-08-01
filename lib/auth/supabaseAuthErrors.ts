import type { AuthError } from '@supabase/supabase-js'

/** Maps a Supabase Auth error to an Arabic message for the login/register/verify UI. */
export function mapSupabaseAuthError(error: AuthError | { message?: string; code?: string; status?: number }): string {
  const code = 'code' in error ? error.code : undefined
  const message = (error.message ?? '').toLowerCase()
  const status = 'status' in error ? error.status : undefined

  if (code === 'invalid_credentials' || message.includes('invalid login credentials')) {
    return 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
  }
  if (code === 'user_already_exists' || message.includes('already registered')) {
    return 'البريد الإلكتروني مستخدم بالفعل'
  }
  if (code === 'email_not_confirmed' || message.includes('email not confirmed')) {
    return 'يرجى تأكيد بريدك الإلكتروني أولاً'
  }
  if (code === 'weak_password' || message.includes('password should be')) {
    return 'كلمة المرور ضعيفة جداً'
  }
  if (code === 'validation_failed' || message.includes('signup requires a valid password')) {
    return 'يرجى إدخال كلمة مرور صالحة لإنشاء الحساب'
  }
  if (
    code === 'over_email_send_rate_limit' ||
    code === 'over_request_rate_limit' ||
    status === 429
  ) {
    return 'محاولات كثيرة جداً، يرجى المحاولة لاحقاً'
  }
  if (code === 'otp_expired' || message.includes('expired')) {
    return 'الرمز غير صحيح أو منتهي الصلاحية'
  }
  if (code === 'otp_disabled' || message.includes('token') || message.includes('otp')) {
    return 'الرمز غير صحيح، يرجى المحاولة مرة أخرى'
  }
  if (code === 'user_not_found' || message.includes('user not found')) {
    return 'لا يوجد حساب مرتبط بهذا البريد الإلكتروني'
  }

  return error.message || 'حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى'
}
