'use client'

interface AdminCommunicationCircularProgressProps {
  value: number
  size?: number
  strokeWidth?: number
}

export default function AdminCommunicationCircularProgress({
  value,
  size = 72,
  strokeWidth = 6,
}: AdminCommunicationCircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0 -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E3F2FD"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#2196F3"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[#2196F3]"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        {value}%
      </div>
    </div>
  )
}
