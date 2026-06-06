'use client'

function buildChartPath(
  values: number[],
  width: number,
  height: number,
  padding: number
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

interface AdminReportsLineChartProps {
  labels: string[]
  values: number[]
  ariaLabel: string
  heightClass?: string
}

export default function AdminReportsLineChart({
  labels,
  values,
  ariaLabel,
  heightClass = 'h-[120px] sm:h-[140px]',
}: AdminReportsLineChartProps) {
  const width = 560
  const height = 120
  const padding = 12
  const linePath = buildChartPath(values, width, height, padding)
  const areaPath = `${linePath} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`

  return (
    <div className="w-full min-w-0 overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height + 24}`}
        className={`w-full ${heightClass}`}
        preserveAspectRatio="xMidYMid meet"
        aria-label={ariaLabel}
      >
        <defs>
          <linearGradient id="reportsChartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2196F3" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#2196F3" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#reportsChartFill)" />
        <path
          d={linePath}
          fill="none"
          stroke="#2196F3"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {labels.map((label, index) => {
          const stepX = (width - padding * 2) / (values.length - 1)
          const x = padding + index * stepX
          return (
            <text
              key={label}
              x={x}
              y={height + 16}
              textAnchor="middle"
              className="fill-[#94A3B8] text-[9px] font-medium sm:text-[10px]"
            >
              {label}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
