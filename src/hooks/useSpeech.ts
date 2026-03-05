import { useCallback } from 'react'
import * as Speech from 'expo-speech'
import { useAppStore } from '../store/appStore'
import { buildAnnouncement, getTTSLocale } from '../lib/ttsTemplates'
import { PitchCall } from '../lib/pitches'

export function useSpeech() {
  const language = useAppStore((s) => s.language)

  const announce = useCallback(
    async (call: PitchCall) => {
      const text = buildAnnouncement(call, language)
      const locale = getTTSLocale(language)

      // Stop any ongoing speech before playing the new one
      const isSpeaking = await Speech.isSpeakingAsync()
      if (isSpeaking) {
        Speech.stop()
      }

      Speech.speak(text, {
        language: locale,
        rate: 0.85,
        pitch: 1.0,
      })
    },
    [language]
  )

  return { announce }
}
