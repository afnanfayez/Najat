'use client'

interface InformationAccuracyProps {
  percentage: number
}

export default function InformationAccuracy({ percentage }: InformationAccuracyProps) {
  const scaleMarks = [0, 25, 50, 75, 100]

  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2
          className="text-right text-base font-bold text-[#1E293B] sm:text-lg"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          دقة المعلومات
        </h2>
        <span
          className="text-lg font-bold text-[#2196F3]"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          {percentage}%
        </span>
      </div>

      <div className="relative h-3 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
        <div
          className="absolute top-0 right-0 h-full rounded-full bg-[#2196F3] transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-[#94A3B8]">
        {scaleMarks.map((mark) => (
          <span key={mark}>{mark}%</span>
        ))}
      </div>
    </div>
  )
}
