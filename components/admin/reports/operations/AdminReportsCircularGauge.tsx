'use client'

interface AdminReportsCircularGaugeProps {
  value: number
  color?: string
  trackColor?: string
  size?: number
  className?: string
}

export default function AdminReportsCircularGauge({
  value,
  color = '#2196F3',
  trackColor = '#E3F2FD',
  size = 96,
  className = '',
}: AdminReportsCircularGaugeProps) {
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0 -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center text-lg font-bold sm:text-xl"
        style={{ color, fontFamily: "'Cairo', sans-serif" }}
      >
        {value}%
      </div>
    </div>
  )
}
