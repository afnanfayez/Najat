import ProfileEditContent from '@/components/profile/ProfileEditContent'

export const metadata = {
  title: 'تعديل الملف الشخصي - نجاة',
  description: 'تعديل الملف الشخصي للمستخدم',
}

export default function ProfileEditPage() {
  return (
    <div
      className="content-body custom-scrollbar"
      style={{
        flex: 1,
        padding: '15px 35px',
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        minHeight: 0,
      }}
    >
      <ProfileEditContent />
    </div>
  )
}
