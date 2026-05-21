'use client'

interface ResponseTimeChartProps {
  data: { day: string; value: number }[]
}

function buildChartPath(
  values: number[],
  width: number,
  height: number,
  padding: number,
): string {
  const min = Math.min(...values) - 4
  const max = Math.max(...values) + 4
  const range = max - min || 1
  const stepX = (width - padding * 2) / (values.length - 1)

  const points = values.map((value, index) => {
    const x = padding + index * stepX
    const y = padding + (1 - (value - min) / range) * (height - padding * 2)
    return { x, y }
  })

  let path = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1]
    const curr = points[i]
    const cx = (prev.x + curr.x) / 2
    path += ` C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`
  }
  return path
}

export default function ResponseTimeChart({ data }: ResponseTimeChartProps) {
  const values = data.map((item) => item.value)
  const width = 560
  const height = 180
  const padding = 16
  const linePath = buildChartPath(values, width, height, padding)
  const areaPath = `${linePath} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`

  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h2
          className="text-right text-base font-bold text-[#1E293B] sm:text-lg"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          متوسط وقت الاستجابة
        </h2>
        <span className="shrink-0 rounded-full bg-[#FFF3E0] px-3 py-1 text-xs font-semibold text-[#FF9800]">
          الأسبوع الحالي
        </span>
      </div>

      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height + 28}`}
          className="h-auto w-full"
          preserveAspectRatio="xMidYMid meet"
          aria-label="مخطط متوسط وقت الاستجابة"
        >
          <defs>
            <linearGradient id="adminChartFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2196F3" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2196F3" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#adminChartFill)" />
          <path
            d={linePath}
            fill="none"
            stroke="#2196F3"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {data.map((item, index) => {
            const stepX = (width - padding * 2) / (values.length - 1)
            const x = padding + index * stepX
            return (
              <text
                key={item.day}
                x={x}
                y={height + 18}
                textAnchor="middle"
                className="fill-[#94A3B8] text-[11px] font-medium"
              >
                {item.day}
              </text>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
