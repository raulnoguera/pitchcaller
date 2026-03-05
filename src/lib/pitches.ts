export type PitchType =
  | 'fastball'
  | 'curveball'
  | 'slider'
  | 'changeup'
  | 'sinker'
  | 'cutter'
  | 'splitter'
  | 'two_seam'

export type VerticalZone = 'high' | 'middle' | 'low'
export type HorizontalZone = 'inside' | 'center' | 'outside'
export type Language = 'en' | 'es'

export interface PitchLocation {
  vertical: VerticalZone
  horizontal: HorizontalZone
}

export interface PitchCall {
  pitch: PitchType
  location: PitchLocation
}

export interface PitchRecord extends PitchCall {
  team: string
  pitcher: string
  timestamp: number
}

export const PITCH_LABELS: Record<PitchType, { en: string; es: string }> = {
  fastball: { en: 'Fastball', es: 'Recta' },
  curveball: { en: 'Curveball', es: 'Curva' },
  slider: { en: 'Slider', es: 'Slider' },
  changeup: { en: 'Changeup', es: 'Cambio' },
  sinker: { en: 'Sinker', es: 'Sinker' },
  cutter: { en: 'Cutter', es: 'Cortada' },
  splitter: { en: 'Splitter', es: 'Splitter' },
  two_seam: { en: 'Two-Seam', es: '2 Costuras' },
}

export const VERTICAL_LABELS: Record<VerticalZone, { en: string; es: string }> = {
  high: { en: 'High', es: 'Alto' },
  middle: { en: 'Middle', es: 'Centro' },
  low: { en: 'Low', es: 'Bajo' },
}

export const HORIZONTAL_LABELS: Record<HorizontalZone, { en: string; es: string }> = {
  inside: { en: 'Inside', es: 'Adentro' },
  center: { en: 'Center', es: 'Centro' },
  outside: { en: 'Outside', es: 'Afuera' },
}

// Color for each pitch type (used in PitchGrid and PitchDisplay)
export const PITCH_COLORS: Record<PitchType, string> = {
  fastball: '#ef4444',
  curveball: '#3b82f6',
  slider: '#a855f7',
  changeup: '#22c55e',
  sinker: '#f97316',
  cutter: '#eab308',
  splitter: '#06b6d4',
  two_seam: '#ec4899',
}

export const ALL_PITCHES: PitchType[] = [
  'fastball', 'curveball', 'slider', 'changeup',
  'sinker', 'cutter', 'splitter', 'two_seam',
]

export const VERTICAL_ZONES: VerticalZone[] = ['high', 'middle', 'low']
export const HORIZONTAL_ZONES: HorizontalZone[] = ['inside', 'center', 'outside']
