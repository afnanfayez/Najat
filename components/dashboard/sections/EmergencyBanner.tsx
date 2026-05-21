'use client'

interface EmergencyBannerProps {
  isMobile: boolean
  onClick?: () => void
}

export default function EmergencyBanner({ isMobile, onClick }: EmergencyBannerProps) {
  return (
    <div
      className="emergency-banner"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
      style={{
        background: 'linear-gradient(135deg, #F44336, #D32F2F)',
        borderRadius: '20px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(244,67,54,0.3)',
        cursor: 'pointer',
        height: '120px',
        width: '100%',
        flexShrink: 0,
        transition: 'transform 0.3s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.01)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <div
        style={{
          position: 'absolute',
          width: isMobile ? '280px' : '420px',
          height: isMobile ? '280px' : '420px',
          borderRadius: '50%',
          background: '#FFFFFF4D',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 0,
          transition: 'all 0.3s ease',
        }}
      >
        <div
          style={{
            width: isMobile ? '200px' : '320px',
            height: isMobile ? '200px' : '320px',
            borderRadius: '50%',
            background: '#FFFFFF99',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}
        >
          <div
            style={{
              width: isMobile ? '120px' : '200px',
              height: isMobile ? '120px' : '200px',
              borderRadius: '50%',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 40px rgba(0,0,0,0.05)',
              transition: 'all 0.3s ease',
            }}
          >
            <h2
              className="emergency-title"
              style={{
                color: '#F44336',
                fontSize: isMobile ? '1.5rem' : '3.2rem',
                fontWeight: 900,
                margin: 0,
                zIndex: 2,
                fontFamily: "'Cairo', sans-serif",
                transition: 'all 0.3s ease',
              }}
            >
              الطوارئ
            </h2>
          </div>
        </div>
      </div>
    </div>
  )
}
