'use client'

import type { ReactNode } from 'react'
import {
  CALENDAR_MONTH,
  CALENDAR_WEEKDAYS,
  WORKING_TIME_SLOTS,
} from './setupConstants'
import { SETUP_BLUE, SETUP_FONT, SETUP_CARD_CLASS, SETUP_CARD_SHADOW } from './setupStyles'

interface WorkingDaysSectionProps {
  selectedDates: number[]
  selectedTimes: string[]
  onToggleDate: (day: number) => void
  onToggleTime: (time: string) => void
}

/** مايو 2026 — يبدأ يوم 1 الجمعة */
function buildMay2026Days(): (number | null)[] {
  const daysInMonth = 31
  const cells: (number | null)[] = []
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

function cardShell(children: ReactNode) {
  return (
    <div
      className={`${SETUP_CARD_CLASS} flex h-full flex-col`}
      style={{ boxShadow: SETUP_CARD_SHADOW }}
      dir="rtl"
    >
      {children}
    </div>
  )
}

function CalendarCard({
  selectedDates,
  onToggleDate,
}: {
  selectedDates: number[]
  onToggleDate: (day: number) => void
}) {
  const days = buildMay2026Days()

  return cardShell(
    <>
      <div className="mb-4 shrink-0 text-right">
        <h3
          className="text-base font-bold text-[#1e293b]"
          style={{ fontFamily: SETUP_FONT }}
        >
          أيام العمل
        </h3>
        <p
          className="mt-1 text-sm font-bold text-[#64748B]"
          style={{ fontFamily: SETUP_FONT }}
        >
          {CALENDAR_MONTH.label}
        </p>
      </div>

      <div className="grid flex-1 grid-cols-7 content-start gap-x-0.5 gap-y-1 text-center sm:gap-x-1 sm:gap-y-2">
        {CALENDAR_WEEKDAYS.map((d, i) => (
          <span
            key={`${d}-${i}`}
            className="py-1 text-[10px] font-bold text-[#94A3B8] sm:text-xs"
            style={{ fontFamily: SETUP_FONT }}
          >
            {d}
          </span>
        ))}
        {days.map((day, i) =>
          day === null ? (
            <span key={`e-${i}`} />
          ) : (
            <button
              key={day}
              type="button"
              onClick={() => onToggleDate(day)}
              className="mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all sm:h-9 sm:w-9 sm:text-sm"
              style={{
                fontFamily: SETUP_FONT,
                background: selectedDates.includes(day) ? '#E3F2FD' : 'transparent',
                color: selectedDates.includes(day) ? SETUP_BLUE : '#CBD5E1',
              }}
            >
              {day}
            </button>
          ),
        )}
      </div>
    </>,
  )
}

function TimeSlotsCard({
  selectedTimes,
  onToggleTime,
}: {
  selectedTimes: string[]
  onToggleTime: (time: string) => void
}) {
  return cardShell(
    <>
      <h3
        className="mb-4 shrink-0 text-right text-base font-bold text-[#1e293b]"
        style={{ fontFamily: SETUP_FONT }}
      >
        ساعات العمل
      </h3>
      <ul className="flex-1" dir="rtl">
        {WORKING_TIME_SLOTS.map((time, index) => {
          const active = selectedTimes.includes(time)
          return (
            <li
              key={time}
              className="w-full"
              style={{
                borderBottom:
                  index < WORKING_TIME_SLOTS.length - 1
                    ? '1px solid #E8EEF5'
                    : 'none',
              }}
            >
              <button
                type="button"
                onClick={() => onToggleTime(time)}
                className="block w-full py-3 pr-1 text-right transition-colors"
              >
                <span
                  className="inline-block text-base font-bold"
                  style={{
                    fontFamily: SETUP_FONT,
                    color: active ? SETUP_BLUE : '#334155',
                  }}
                >
                  {time}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </>,
  )
}

export default function WorkingDaysSection({
  selectedDates,
  selectedTimes,
  onToggleDate,
  onToggleTime,
}: WorkingDaysSectionProps) {
  return (
    <div className="grid w-full grid-cols-1 items-stretch gap-4 md:grid-cols-2" dir="rtl">
      <CalendarCard selectedDates={selectedDates} onToggleDate={onToggleDate} />
      <TimeSlotsCard selectedTimes={selectedTimes} onToggleTime={onToggleTime} />
    </div>
  )
}
