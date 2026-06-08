import type { QueryClient } from '@tanstack/react-query'

export function clearUserSessionCache(queryClient: QueryClient) {
  // مسح جميع مفاتيح البيانات المتعلقة بالملف الشخصي
  queryClient.removeQueries({ queryKey: ['profile'] })
  queryClient.removeQueries({ queryKey: ['profile', 'me'] })
  
  // مسح شامل لجميع الـ queries - يضمن عدم بقاء بيانات من مستخدم سابق
  queryClient.clear()
}
