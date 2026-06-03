export const ADMIN_AID_BLUE = '#2196F3'
export const ADMIN_AID_LIGHT_BLUE = '#E3F2FD'
export const ADMIN_AID_INPUT_BG = '#2196F31A'
export const ADMIN_AID_FONT = "'Cairo', sans-serif"

export const ADMIN_AID_LABEL_STYLE = {
  fontFamily: ADMIN_AID_FONT,
  fontWeight: 700,
  fontSize: '14px',
  color: '#1e293b',
} as const

export const ADMIN_AID_CARD_SHADOW = '0 2px 12px rgba(0,0,0,0.04)'

export {
  ADMIN_AID_BLUE as SETUP_BLUE,
  ADMIN_AID_FONT as SETUP_FONT,
  ADMIN_AID_INPUT_BG as SETUP_INPUT_BG,
  ADMIN_AID_LABEL_STYLE as SETUP_LABEL_STYLE,
  ADMIN_AID_CARD_SHADOW as SETUP_CARD_SHADOW,
} from '../adminAidStyles'

export const SETUP_CARD_CLASS =
  'rounded-2xl border border-[#E8EEF5] bg-white p-4 sm:p-5'

export const SETUP_SECTION_TITLE = {
  fontFamily: "'Cairo', sans-serif",
  fontWeight: 700,
  fontSize: '16px',
  color: '#1e293b',
  margin: 0,
  textAlign: 'right' as const,
}

export const SETUP_INPUT_CLASS =
  'h-11 w-full rounded-xl border-none pr-3 text-right text-sm shadow-none focus-visible:ring-0'
