import ProfileContent from '@/components/profile/ProfileContent'

export const metadata = {
  title: 'الملف الشخصي - نجاة',
  description: 'الملف الشخصي للمستخدم',
}

export default function ProfilePage() {
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
      <ProfileContent />
    </div>
  )
}
