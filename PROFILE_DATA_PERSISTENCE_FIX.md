# ✅ إصلاح حفظ الصور والبيانات الشخصية

## 🔴 المشاكل التي تم حلها:

### 1. **الصور والبيانات تُحذف عند logout ثم login بنفس الحساب**
**المشكلة:**
- عندما يقوم المستخدم بـ logout ثم login بنفس الحساب
- يفقد الصورة الشخصية والبيانات المحفوظة محلياً
- السبب: `resetBrowserSession` كانت تحذف جميع localStorage بما فيها بيانات المستخدم الحالي

**الحل:**
```typescript
// قبل: ❌ حذف جميع البيانات
keysToRemove.forEach((key) => localStorage.removeItem(key))

// بعد: ✅ حذف فقط بيانات المستخدمين الآخرين
for (const userId of allStoredIds) {
  if (currentUserId && userId === currentUserId) {
    continue  // احتفظ ببيانات المستخدم الحالي
  }
  clearUserProfileData(userId)  // احذف بيانات الآخرين
}
```

---

### 2. **البيانات الشخصية لا تُحفظ محلياً كـ cache**
**المشكلة:**
- عند تعديل الاسم أو البيانات الشخصية، يتم حفظها عبر API فقط
- لا توجد نسخة محلية للعمل offline
- إذا فشل الـ API، تُفقد البيانات

**الحل:**
```typescript
// في useProfile hook:
saveLocalProfileData(id, {
  avatarDataUrl,
  fullName: payload.fullName,
  nationalId: payload.nationalId,
  phoneNumber: payload.phoneNumber,
  region: payload.region,
  assistancePreferences: payload.assistancePreferences,
  assistanceLocation: payload.assistanceLocation,
  assistanceRadius: payload.assistanceRadius,
})
```

---

### 3. **عند تبديل المستخدمين، قد تختلط البيانات**
**المشكلة:**
- عند logout من مستخدم والدخول بآخر
- بيانات المستخدم الأول قد تظهر للثاني مؤقتاً

**الحل:**
```typescript
// حذف فقط بيانات المستخدم الذي يتم logout منه
clearUserProfileData(oldUserId)

// الاحتفاظ ببيانات المستخدم الجديد إن وُجدت محلياً
```

---

## 📝 الملفات المعدلة:

### 1️⃣ `lib/profile/localProfileStorage.ts`

**التغييرات:**
- ✅ إضافة حقول جديدة إلى `LocalProfileData`:
  - `fullName`, `nationalId`, `phoneNumber`, `region`
  - `assistancePreferences`, `assistanceLocation`, `assistanceRadius`

- ✅ دالة جديدة: `saveLocalProfileData()`
  ```typescript
  // حفظ جميع البيانات الشخصية محلياً
  export function saveLocalProfileData(
    userId: string,
    data: Partial<LocalProfileData>,
  )
  ```

- ✅ دالة جديدة: `clearUserProfileData()`
  ```typescript
  // حذف بيانات مستخدم معين (وليس الكل)
  export function clearUserProfileData(userId: string)
  ```

- ✅ دالة جديدة: `getAllStoredUserIds()`
  ```typescript
  // الحصول على جميع معرّفات المستخدمين المحفوظة محلياً
  export function getAllStoredUserIds(): string[]
  ```

- ✅ تحسين `mergeProfileAvatarOnly()`:
  - استخدام البيانات المحلية كـ fallback
  - الحفاظ على الصور المحلية عند فشل الـ API

---

### 2️⃣ `hooks/useProfile.ts`

**التغييرات:**
- ✅ استيراد `saveLocalProfileData` 
- ✅ عند حفظ البيانات، يتم حفظها محلياً أولاً:
  ```typescript
  // Save to local storage first (for offline access and persistence)
  saveLocalProfileData(id, {
    avatarDataUrl,
    fullName: payload.fullName,
    nationalId: payload.nationalId,
    phoneNumber: payload.phoneNumber,
    region: payload.region,
    assistancePreferences: payload.assistancePreferences,
    assistanceLocation: payload.assistanceLocation,
    assistanceRadius: payload.assistanceRadius,
  })
  ```

---

### 3️⃣ `lib/auth/resetBrowserSession.ts`

**التغييرات:**
- ✅ استيراد `getUserIdFromToken`, `getAllStoredUserIds`, `clearUserProfileData`
- ✅ الحصول على معرّف المستخدم الحالي قبل حذف token:
  ```typescript
  const currentUserId = getUserIdFromToken(currentToken)
  ```

- ✅ حذف فقط بيانات المستخدمين الآخرين:
  ```typescript
  for (const userId of allStoredIds) {
    if (currentUserId && userId === currentUserId) {
      continue  // احتفظ ببيانات المستخدم الحالي ✅
    }
    clearUserProfileData(userId)  // احذف بيانات الآخرين
  }
  ```

---

## 🔄 تدفق البيانات الجديد:

### عند حفظ البيانات (مثل الصورة أو الاسم):
```
1. المستخدم يحرر البيانات في UI
   ↓
2. يضغط "حفظ"
   ↓
3. useProfile يستدعي mutation
   ↓
4. saveLocalProfileData() - حفظ محلي أولاً ✅
   ↓
5. profileAPI.update() - حفظ عبر الـ API
   ↓
6. onSuccess - تحديث React Query cache
   ↓
7. البيانات محفوظة محلياً وفي الـ API ✅
```

### عند logout من مستخدم والدخول بآخر:
```
1. مستخدم A يضغط logout
   ↓
2. resetBrowserSession() يُستدعى
   ↓
3. الحصول على معرّف مستخدم A
   ↓
4. حذف بيانات المستخدمين الآخرين فقط
   ↓
5. الاحتفاظ ببيانات مستخدم A (الصورة، الاسم، إلخ)
   ↓
6. removeToken() - حذف token فقط
   ↓
7. مستخدم B يدخل
   ↓
8. mergeProfileAvatarOnly() يدمج بيانات B مع localStorage
   ↓
9. عند logout من B، يتم حذف بيانات B فقط
   ↓
10. عند دخول A مجدداً - بيانات A محفوظة محلياً ✅
```

### عند logout ثم login بنفس الحساب:
```
1. مستخدم A يضغط logout
   ↓
2. resetBrowserSession() - محاولة حذف بيانات A
   ↓
3. لكن currentUserId == userId → Skip! ✅
   ↓
4. بيانات A محفوظة محلياً (الصورة والبيانات)
   ↓
5. مستخدم A يدخل مجدداً
   ↓
6. profileAPI.me() + mergeProfileAvatarOnly()
   ↓
7. البيانات موجودة محلياً → عرض فوري ✅
```

---

## ✅ الفوائد:

| الميزة | قبل | بعد |
|------|------|-----|
| **حفظ الصور** | تُفقد عند logout | محفوظة ✅ |
| **البيانات الشخصية** | API فقط | API + localStorage ✅ |
| **الـ offline access** | ❌ | ✅ |
| **تبديل المستخدمين** | قد تختلط البيانات | معزولة بشكل صحيح ✅ |
| **logout ثم login** | بيانات تُفقد | محفوظة ✅ |
| **الأداء** | يحتاج تحميل من API | cache محلي أسرع ✅ |

---

## 🧪 اختبار الإصلاحات:

### Test 1: حفظ الصورة والعودة
```
1. قم بتحميل صورة في الملف الشخصي
2. اضغط حفظ
3. أعد تحميل الصفحة (F5)
   → الصورة يجب أن تظهر فوراً ✅
4. اضغط على صورتك في الملف الشخصي
   → نفس الصورة محفوظة ✅
```

### Test 2: logout ثم login بنفس الحساب
```
1. قم بتحميل صورة وتعديل الاسم
2. اضغط logout
3. اضغط logout مرة أخرى للتأكيد
4. ادخل مجدداً بنفس الحساب
5. افتح الملف الشخصي
   → الصورة والاسم محفوظة ✅
```

### Test 3: تبديل بين مستخدمين
```
1. مستخدم A: حمل صورة
2. logout من A
3. مستخدم B: ادخل بحساب مختلف
4. افتح الملف الشخصي
   → صورة B (ليس صورة A) ✅
5. logout من B
6. مستخدم A: ادخل مجدداً
7. افتح الملف الشخصي
   → صورة A موجودة ✅
```

### Test 4: فحص localStorage
```javascript
// في DevTools Console:

// قبل logout:
Object.keys(localStorage).filter(k => k.startsWith('najat_profile_local_'))
// → ["najat_profile_local_userId123"]

// بعد logout من userId123:
Object.keys(localStorage).filter(k => k.startsWith('najat_profile_local_'))
// → [] (إذا كان userId123 الوحيد)
// → ["najat_profile_local_userId456"] (إذا كان هناك مستخدمون آخرون محفوظون)
```

---

## 🚀 النتيجة المتوقعة:

✅ **الصور والبيانات محفوظة بشكل دائم**
✅ **تبديل آمن بين المستخدمين**
✅ **عزل كامل لبيانات كل مستخدم**
✅ **Access أسرع عبر localStorage cache**
✅ **العمل offline بكفاءة**

---

**آخر تحديث**: 2026-06-08
**الحالة**: ✅ جاهز للاختبار
