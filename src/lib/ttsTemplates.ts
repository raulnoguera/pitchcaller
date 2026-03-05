import {
  PitchCall,
  Language,
  PITCH_LABELS,
  VERTICAL_LABELS,
  HORIZONTAL_LABELS,
} from './pitches'

export function buildAnnouncement(call: PitchCall, lang: Language): string {
  const pitch = PITCH_LABELS[call.pitch][lang]
  const vertical = VERTICAL_LABELS[call.location.vertical][lang]
  const horizontal = HORIZONTAL_LABELS[call.location.horizontal][lang]

  // Format: "Fastball. High, Outside." / "Recta. Alto, Afuera."
  return `${pitch}. ${vertical}, ${horizontal}.`
}

// TTS locale code per language
export function getTTSLocale(lang: Language): string {
  return lang === 'en' ? 'en-US' : 'es-US'
}
