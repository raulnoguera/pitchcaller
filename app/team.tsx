import React from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAppStore, TEAMS, TEAM_COLORS, Team, Language } from '../src/store/appStore'

const TEAM_EMOJIS: Record<Team, string> = {
  Halcones:  '🦅',
  Jurassic:  '🦕',
  Prospect:  '⭐',
  Criollos:  '🌟',
  Atleticos: '💪',
  Vikingos:  '⚔️',
  Trabuco:   '💣',
}

export default function TeamScreen() {
  const router = useRouter()
  const { language, setLanguage, setTeam } = useAppStore()

  function handleSelect(team: Team) {
    setTeam(team)
    router.push('/pitcher')
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0f1e' }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>

        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={{ fontSize: 26 }}>⚾</Text>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900', letterSpacing: 2 }}>
              PITCH CALLER
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {(['en', 'es'] as Language[]).map((lang) => (
              <TouchableOpacity
                key={lang}
                onPress={() => setLanguage(lang)}
                style={{
                  paddingHorizontal: 14, paddingVertical: 7,
                  borderRadius: 18, borderWidth: 2,
                  borderColor: language === lang ? '#f59e0b' : '#374151',
                  backgroundColor: language === lang ? '#f59e0b22' : 'transparent',
                }}
              >
                <Text style={{ color: language === lang ? '#f59e0b' : '#6b7280', fontWeight: '800', fontSize: 12 }}>
                  {lang.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Title */}
        <Text style={{ color: '#ffffff', fontSize: 26, fontWeight: '900', textAlign: 'center', marginBottom: 6 }}>
          {language === 'en' ? 'Select Team' : 'Seleccionar Equipo'}
        </Text>
        <Text style={{ color: '#6b7280', fontSize: 14, textAlign: 'center', marginBottom: 32 }}>
          {language === 'en' ? 'Which team are you managing today?' : '¿Qué equipo vas a dirigir hoy?'}
        </Text>

        {/* Teams grid */}
        <View style={{ gap: 12 }}>
          {TEAMS.map((team) => {
            const color = TEAM_COLORS[team]
            return (
              <TouchableOpacity
                key={team}
                onPress={() => handleSelect(team)}
                activeOpacity={0.8}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#111827',
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: `${color}55`,
                  paddingVertical: 20,
                  paddingHorizontal: 24,
                  gap: 16,
                }}
              >
                <View style={{
                  width: 48, height: 48, borderRadius: 24,
                  backgroundColor: `${color}22`,
                  borderWidth: 2, borderColor: color,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{ fontSize: 22 }}>{TEAM_EMOJIS[team]}</Text>
                </View>
                <Text style={{ color: '#ffffff', fontSize: 22, fontWeight: '800', flex: 1 }}>
                  {team}
                </Text>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color }} />
              </TouchableOpacity>
            )
          })}
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}
