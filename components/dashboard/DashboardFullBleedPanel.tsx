'use client'

export default function DashboardFullBleedPanel({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="custom-scrollbar"
      style={{
        flex: 1,
        padding: '24px 32px',
        overflowY: 'hidden',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        background: '#fff',
        minHeight: 0,
      }}
    >
      {children}
    </div>
  )
}
