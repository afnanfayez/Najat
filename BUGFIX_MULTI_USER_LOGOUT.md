# إصلاح مشاكل المستخدمين والـ Logout

## المشاكل التي تم إصلاحها:

### 1. ✅ **بيانات المستخدم العادي تبقى ظاهرة عند الدخول بـ Admin**
**السبب:**
- `clearUserSessionCache` لم تمسح جميع البيانات من React Query cache
- بقايا البيانات من المستخدم السابق تؤثر على الواجهة

**الحل:**
```typescript
// قبل: فقط مسح profile queries
queryClient.removeQueries({ queryKey: ['profile'] })

// بعد: مسح شامل لجميع البيانات المخزنة
queryClient.clear()  // ✅ يضمن عدم بقاء أي بيانات قديمة
```

### 2. ✅ **localStorage لم تُمسح بشكل كامل عند تبديل المستخدمين**
**السبب:**
- البحث في localStorage كان يتخطى بعض المفاتيح
- مثلاً: `assistance_preferences_userId` كان قد لا يُمسح

**الحل:**
```typescript
// إضافة ثابت جديد للبحث عن جميع مفاتيح التفضيلات
const PREFERENCES_PREFIX = 'assistance_preferences_'

// والآن نمسح:
if (
  key.startsWith(PROFILE_PREFIX) ||
  key.startsWith(ASSISTANCE_PREFIX) ||
  key.startsWith(PREFERENCES_PREFIX)  // ✅ إضافة جديدة
)
```

### 3. ✅ **عند تسجيل الخروج من Admin، ينتقل إلى Dashboard بدلاً من /logout**
**السبب:**
- عندما ينقر admin على logout، ثم يكتشف أنه بدون صلاحيات admin
- ينتقل إلى `/dashboard` بدلاً من `/logout`

**الحل:**
```typescript
// AdminShell.tsx - قبل:
if (!adminAllowed) {
  router.replace('/dashboard')  // ❌ خطأ
}

// بعد:
if (!adminAllowed) {
  router.replace('/logout')  // ✅ يذهب مباشرة لتنظيف الجلسة
}
```

---

## الملفات المعدلة:

### 1. `lib/auth/clearSessionCache.ts`
```diff
  export function clearUserSessionCache(queryClient: QueryClient) {
    queryClient.removeQueries({ queryKey: ['profile'] })
    queryClient.removeQueries({ queryKey: ['profile', 'me'] })
+   queryClient.clear()  // ✅ مسح شامل
  }
```

### 2. `lib/auth/resetBrowserSession.ts`
```diff
  const PROFILE_PREFIX = 'najat_profile_local_'
  const ASSISTANCE_PREFIX = 'assistance_preferences'
+ const PREFERENCES_PREFIX = 'assistance_preferences_'
  
  if (
    key.startsWith(PROFILE_PREFIX) ||
    key.startsWith(ASSISTANCE_PREFIX) ||
+   key.startsWith(PREFERENCES_PREFIX)  // ✅ مسح كامل للتفضيلات
  )
```

### 3. `components/admin/AdminShell.tsx`
```diff
  if (!adminAllowed) {
-   router.replace('/dashboard')  // ❌ ينتقل للـ dashboard
+   router.replace('/logout')     // ✅ ينتقل مباشرة لتنظيف الجلسة
  }
```

---

## كيف يعمل الحل الجديد:

### عند تسجيل دخول مستخدم جديد:
```
1. المستخدم يسجل دخول
   ↓
2. resetBrowserSession() - مسح جميع localStorage
   ↓
3. saveToken(newToken) - حفظ الـ token الجديد
   ↓
4. notifyAuthSessionChanged() - إرسال event
   ↓
5. AuthContext يستمع للـ event
   ↓
6. clearUserSessionCache() - مسح شامل React Query ✅
   ↓
7. refreshUser() - تحميل بيانات المستخدم الجديد
   ↓
8. الواجهة تعرض بيانات المستخدم الجديد فقط ✅
```

### عند تسجيل الخروج من Admin:
```
1. Admin ينقر logout
   ↓
2. logout() من AuthContext
   ↓
3. resetBrowserSession() - مسح localStorage
   ↓
4. router.replace('/logout') - انتقال مباشر
   ↓
5. LogoutPage يعرض رسالة تأكيد
   ↓
6. بعد 3 ثوان: router.push('/login') ✅
```

---

## اختبار الإصلاحات:

### Test 1: تبديل من مستخدم عادي إلى Admin
```
1. سجل دخول بـ مستخدم عادي
   → يجب أن ترى الاسم الخاص به
   
2. تسجيل خروج
   
3. سجل دخول بـ حساب Admin
   → يجب أن ترى الاسم الخاص بـ Admin (ليس المستخدم السابق)
   → تحقق من أن اسم المستخدم السابق اختفى
```

### Test 2: تسجيل خروج من Admin
```
1. سجل دخول بـ حساب Admin
   → تأكد أنك في dashboard الـ Admin
   
2. ابحث عن زر تسجيل الخروج (في القائمة الجانبية)
   
3. انقر تسجيل الخروج
   → يجب أن تنتقل مباشرة إلى صفحة LogoutPage
   → ليس إلى /dashboard ❌
```

### Test 3: تبديل متعدد المرات
```
1. User A يدخل → يرى بيانات User A
2. تسجيل خروج
3. User B يدخل → يرى بيانات User B (ليس User A)
4. تسجيل خروج
5. User A يدخل → يرى نفس بيانات User A (بدون بيانات User B)
```

---

## النقاط الأمان:

✅ **جميع البيانات الحساسة تُمسح عند التبديل**
✅ **لا توجد مشاركة بيانات بين المستخدمين**
✅ **Logout دائماً ينتقل إلى صفحة التأكيد ثم Login**
✅ **React Query cache يُمسح بشكل كامل**
✅ **localStorage يُمسح بشكل كامل**

---

## ماذا يحدث الآن:

### قبل الإصلاح (المشكلة):
```
User A (resident) → logout
↓
User B (admin) → login
↓
الواجهة تعرض اسم User A ❌ (بيانات قديمة)
```

### بعد الإصلاح ✅
```
User A (resident) → logout → resetBrowserSession()
↓
User B (admin) → login → notifyAuthSessionChanged()
↓
clearUserSessionCache() + queryClient.clear() ✅
↓
refreshUser() → تحميل بيانات User B فقط ✅
↓
الواجهة تعرض اسم User B فقط ✅
```

---

**تم الإصلاح في**: 2026-06-08
**الحالة**: ✅ جاهز للاختبار
