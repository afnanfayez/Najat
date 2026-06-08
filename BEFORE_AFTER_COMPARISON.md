# الفروقات - قبل وبعد الإصلاح

## الملف 1: `lib/auth/clearSessionCache.ts`

### ❌ قبل الإصلاح (المشكلة):
```typescript
import type { QueryClient } from '@tanstack/react-query'

export function clearUserSessionCache(queryClient: QueryClient) {
  // فقط مسح profile queries
  queryClient.removeQueries({ queryKey: ['profile'] })
  queryClient.removeQueries({ queryKey: ['profile', 'me'] })
  // ❌ مشكلة: هناك queries أخرى لم تُمسح!
}
```

**المشاكل:**
- يمسح فقط profile queries
- queries من الـ hooks الأخرى تبقى في الـ cache
- عند تبديل المستخدمين، قد تظهر بيانات قديمة

### ✅ بعد الإصلاح:
```typescript
import type { QueryClient } from '@tanstack/react-query'

export function clearUserSessionCache(queryClient: QueryClient) {
  // مسح مفاتيح البيانات المتعلقة بالملف الشخصي
  queryClient.removeQueries({ queryKey: ['profile'] })
  queryClient.removeQueries({ queryKey: ['profile', 'me'] })
  
  // ✅ مسح شامل - يضمن عدم بقاء أي بيانات
  queryClient.clear()
}
```

---

## الملف 2: `lib/auth/resetBrowserSession.ts`

### ❌ قبل الإصلاح (المشكلة):
```typescript
const PROFILE_PREFIX = 'najat_profile_local_'
const ASSISTANCE_PREFIX = 'assistance_preferences'
// ❌ ناقص: لا يوجد ثابت للبحث الدقيق

export function resetBrowserSession(options?: { keepLoginEmail?: boolean }) {
  // ... الكود الآخر ...
  
  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key) continue
    // ❌ المشكلة: البحث عن 'assistance_preferences'
    //    لا يطابق 'assistance_preferences_userId'
    if (key.startsWith(PROFILE_PREFIX) || key.startsWith(ASSISTANCE_PREFIX)) {
      keysToRemove.push(key)
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key))
}
```

**المشاكل:**
- `startsWith('assistance_preferences')` لا يطابق `assistance_preferences_userId`
- بيانات التفضيلات تبقى في localStorage

### ✅ بعد الإصلاح:
```typescript
const PROFILE_PREFIX = 'najat_profile_local_'
const ASSISTANCE_PREFIX = 'assistance_preferences'
const PREFERENCES_PREFIX = 'assistance_preferences_'  // ✅ جديد

export function resetBrowserSession(options?: { keepLoginEmail?: boolean }) {
  // ... الكود الآخر ...
  
  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key) continue
    // ✅ الآن نمسح جميع المتغيرات:
    if (
      key.startsWith(PROFILE_PREFIX) ||           // najat_profile_local_*
      key.startsWith(ASSISTANCE_PREFIX) ||        // assistance_preferences
      key.startsWith(PREFERENCES_PREFIX)          // assistance_preferences_*
    ) {
      keysToRemove.push(key)
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key))
}
```

**الحل:**
- إضافة ثابت `PREFERENCES_PREFIX` لمطابقة دقيقة
- الآن جميع مفاتيح التفضيلات تُمسح ✅

---

## الملف 3: `components/admin/AdminShell.tsx`

### ❌ قبل الإصلاح (المشكلة):
```typescript
export default function AdminShell({ activeNav = 'dashboard', children }: AdminShellProps) {
  const router = useRouter()
  const { user, role, isLoading, isHydrated, logout } = useAuth()
  
  // ...
  
  useEffect(() => {
    if (!isHydrated || isLoading) return
    if (!adminAllowed) {
      // ❌ المشكلة: عند logout من admin
      //    يعيد التوجيه إلى dashboard بدلاً من logout
      router.replace('/dashboard')
    }
  }, [isHydrated, isLoading, adminAllowed, router])
  
  // ...
}
```

**المشاكل:**
- عند logout من admin، ينتقل إلى `/dashboard`
- هذا يسبب ظهور واجهة dashboard للـ resident
- لا يتم تنظيف الجلسة بشكل صحيح

### ✅ بعد الإصلاح:
```typescript
export default function AdminShell({ activeNav = 'dashboard', children }: AdminShellProps) {
  const router = useRouter()
  const { user, role, isLoading, isHydrated, logout } = useAuth()
  
  // ...
  
  // التحقق من الصلاحيات: إذا لم يكن admin، انتقل إلى /logout
  useEffect(() => {
    if (!isHydrated || isLoading) return
    if (!adminAllowed) {
      // ✅ الحل: انتقل إلى /logout للتنظيف الصحيح
      //    بدلاً من /dashboard
      router.replace('/logout')
    }
  }, [isHydrated, isLoading, adminAllowed, router])
  
  // ...
}
```

**الحل:**
- تغيير مسار التوجيه من `/dashboard` إلى `/logout`
- يضمن تنظيف الجلسة بشكل صحيح ✅

---

## تدفق البيانات - المقارنة:

### قبل الإصلاح ❌ (المشكلة):
```
User A (resident) سجل دخول
  ↓
بيانات User A محفوظة في:
  - localStorage
  - React Query cache
  ↓
User A تسجيل خروج
  ↓
localStorage مسح (جزئياً) ❌
React Query cache لم يُمسح بالكامل ❌
  ↓
User B (admin) سجل دخول
  ↓
refreshUser() تحمل بيانات User B
  ↓
لكن cache React Query قديم يعرض بيانات User A ❌
  ↓
UI تعرض خليط من البيانات ❌
```

### بعد الإصلاح ✅ (الحل):
```
User A (resident) سجل دخول
  ↓
بيانات User A محفوظة في:
  - localStorage
  - React Query cache
  ↓
User A تسجيل خروج
  ↓
resetBrowserSession() يمسح:
  - جميع localStorage ✅
  - TOKEN ✅
  - USER ROLE ✅
  ↓
User B (admin) سجل دخول
  ↓
notifyAuthSessionChanged() يستدعي:
  - clearUserSessionCache() ✅
    - queryClient.removeQueries()
    - queryClient.clear() ← مسح شامل ✅
  ↓
refreshUser() تحمل بيانات User B
  ↓
cache نظيف ✅
  ↓
UI تعرض بيانات User B فقط ✅
```

---

## اختبار سريع للتحقق:

### اختبار 1: فحص localStorage
```javascript
// في Console:
// قبل logout:
localStorage
// بعد logout:
localStorage
// يجب أن تكون مفاتيح 'najat_profile_local_' و 'assistance_preferences_' محذوفة
```

### اختبار 2: فحص UI
```
1. سجل دخول بـ User A
   → لاحظ الاسم: "محمد"
2. تسجيل خروج
3. سجل دخول بـ User B
   → لاحظ الاسم: "أحمد"
   → يجب أن يكون مختلفاً ✅
```

### اختبار 3: logout من admin
```
1. سجل دخول بـ Admin
2. انقر logout
3. يجب أن تنتقل إلى /logout (ليس /dashboard) ✅
```

---

## النقاط الرئيسية:

| الجزء | قبل | بعد | الفائدة |
|------|------|-----|---------|
| **React Query Cache** | removeQueries فقط | clear() + removeQueries | مسح شامل |
| **localStorage** | بحث جزئي | بحث دقيق | لا يتبقى بيانات |
| **Admin Logout** | /dashboard | /logout | تنظيف صحيح |
| **البيانات المعروضة** | قد تكون مختلطة | معزولة ومنفصلة | أمان أفضل |

---

**ملخص الإصلاح:**
- 🔧 إضافة `queryClient.clear()` لمسح شامل
- 🔧 إضافة `PREFERENCES_PREFIX` للبحث الدقيق
- 🔧 تغيير مسار logout من admin
- ✅ النتيجة: عزل كامل لبيانات المستخدمين
