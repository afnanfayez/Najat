import EmergencyContent from '@/components/emergency/EmergencyContent'

export const metadata = {
  title: 'الطوارئ - نجاة',
  description: 'مركز طوارئ المواطن',
}

export default function EmergencyPage() {
  return (
    <div
      className="content-body custom-scrollbar relative"
      style={{
        flex: 1,
        padding: '15px 35px',
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        minHeight: 0,
        background: 'linear-gradient(to bottom, #f0f7ff, #ffffff)', // Light blue to white gradient as seen in design
      }}
    >
      <EmergencyContent />
    </div>
  )
}
