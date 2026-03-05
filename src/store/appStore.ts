import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { PitchCall, PitchRecord } from '../lib/pitches'

export type Language = 'en' | 'es'

export const TEAMS = [
  'Halcones',
  'Jurassic',
  'Prospect',
  'Criollos',
  'Atleticos',
  'Vikingos',
  'Trabuco',
] as const

export type Team = typeof TEAMS[number]

export const TEAM_COLORS: Record<Team, string> = {
  Halcones:  '#f59e0b',
  Jurassic:  '#22c55e',
  Prospect:  '#3b82f6',
  Criollos:  '#ef4444',
  Atleticos: '#a855f7',
  Vikingos:  '#06b6d4',
  Trabuco:   '#f97316',
}

interface AppState {
  language:        Language
  team:            Team | null
  pitcher:         string
  pitchHistory:    PitchCall[]
  allPitchHistory: PitchRecord[]

  setLanguage:     (lang: Language) => void
  setTeam:         (team: Team) => void
  setPitcher:      (name: string) => void
  addPitch:        (call: PitchCall) => void
  clearHistory:    () => void
  clearAllHistory: () => void
  resetGame:       () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language:        'en',
      team:            null,
      pitcher:         '',
      pitchHistory:    [],
      allPitchHistory: [],

      setLanguage: (language) => set({ language }),
      setTeam:     (team)     => set({ team, pitchHistory: [] }),
      setPitcher:  (pitcher)  => set({ pitcher }),

      addPitch: (call) =>
        set((state) => {
          const record: PitchRecord = {
            ...call,
            team:      state.team ?? '',
            pitcher:   state.pitcher,
            timestamp: Date.now(),
          }
          return {
            pitchHistory:    [call, ...state.pitchHistory].slice(0, 20),
            allPitchHistory: [record, ...state.allPitchHistory].slice(0, 500),
          }
        }),

      clearHistory:    () => set({ pitchHistory: [] }),
      clearAllHistory: () => set({ allPitchHistory: [] }),
      resetGame:       () => set({ team: null, pitcher: '', pitchHistory: [] }),
    }),
    {
      name:    'pitchcaller-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        allPitchHistory: state.allPitchHistory,
        language:        state.language,
      }),
    }
  )
)
