import React, { useState, useMemo } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useAppStore, TEAMS, TEAM_COLORS, Team } from '../src/store/appStore'
import { ALL_PITCHES, PITCH_LABELS, PITCH_COLORS } from '../src/lib/pitches'
import type { PitchType } from '../src/lib/pitches'

export default function ReportScreen() {
  const router = useRouter()
  const { allPitchHistory, language, clearAllHistory } = useAppStore()
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)

  const teamsWithData = useMemo(() => {
    const teams = new Set(allPitchHistory.map((r) => r.team))
    return TEAMS.filter((t) => teams.has(t))
  }, [allPitchHistory])

  const activeTeam: Team | null =
    selectedTeam && teamsWithData.includes(selectedTeam)
      ? selectedTeam
      : (teamsWithData[0] ?? null)

  const pitcherStats = useMemo(() => {
    if (!activeTeam) return []
    const records = allPitchHistory.filter((r) => r.team === activeTeam)
    const pitcherMap = new Map<string, Record<PitchType, number>>()

    for (const record of records) {
      if (!pitcherMap.has(record.pitcher)) {
        pitcherMap.set(record.pitcher, {} as Record<PitchType, number>)
      }
      const counts = pitcherMap.get(record.pitcher)!
      counts[record.pitch] = (counts[record.pitch] || 0) + 1
    }

    return Array.from(pitcherMap.entries())
      .map(([pitcher, byPitch]) => ({
        pitcher,
        total: Object.values(byPitch).reduce((a, b) => a + b, 0),
        byPitch,
      }))
      .sort((a, b) => b.total - a.total)
  }, [allPitchHistory, activeTeam])

  const t = {
    en: {
      title:    'REPORT',
      back:     'Back',
      noData:   'No pitches recorded yet.\nCall some pitches to see stats here!',
      pitches:  'pitches',
      clearAll: 'Clear All',
      confirmClear: 'Delete all pitch history?',
      yes: 'Delete',
      cancel: 'Cancel',
    },
    es: {
      title:    'REPORTE',
      back:     'Atrás',
      noData:   'Aún no hay lanzamientos registrados.\n¡Envía lanzamientos para ver estadísticas!',
      pitches:  'lanzamientos',
      clearAll: 'Borrar Todo',
      confirmClear: '¿Borrar todo el historial de lanzamientos?',
      yes: 'Borrar',
      cancel: 'Cancelar',
    },
  }[language]

  function handleClearAll() {
    Alert.alert(
      t.confirmClear,
      undefined,
      [
        { text: t.cancel, style: 'cancel' },
        { text: t.yes, style: 'destructive', onPress: clearAllHistory },
      ]
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0f1e' }}>
      <ScrollView
        contentContainerStyle={{ padding: 18, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{
          flexDirection: 'row', alignItems: 'center',
          marginBottom: 20,
        }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
            <Text style={{ color: '#6b7280', fontSize: 22 }}>←</Text>
          </TouchableOpacity>
          <Text style={{
            color: '#fff', fontSize: 17, fontWeight: '900',
            letterSpacing: 2, flex: 1,
          }}>
            📊 {t.title}
          </Text>
          {allPitchHistory.length > 0 && (
            <TouchableOpacity
              onPress={handleClearAll}
              style={{
                paddingHorizontal: 12, paddingVertical: 6,
                borderRadius: 12, borderWidth: 1, borderColor: '#374151',
              }}
            >
              <Text style={{ color: '#6b7280', fontSize: 11, fontWeight: '700' }}>
                {t.clearAll}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Empty state */}
        {teamsWithData.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 80, gap: 16 }}>
            <Text style={{ fontSize: 56 }}>⚾</Text>
            <Text style={{
              color: '#4b5563', fontSize: 14, textAlign: 'center', lineHeight: 22,
            }}>
              {t.noData}
            </Text>
          </View>
        ) : (
          <>
            {/* Team tabs */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 20 }}
              contentContainerStyle={{ gap: 8 }}
            >
              {teamsWithData.map((team) => {
                const color = TEAM_COLORS[team]
                const isActive = team === activeTeam
                return (
                  <TouchableOpacity
                    key={team}
                    onPress={() => setSelectedTeam(team)}
                    style={{
                      paddingHorizontal: 16, paddingVertical: 10,
                      borderRadius: 20, borderWidth: 2,
                      borderColor: isActive ? color : '#374151',
                      backgroundColor: isActive ? `${color}22` : '#111827',
                    }}
                  >
                    <Text style={{
                      color: isActive ? color : '#6b7280',
                      fontWeight: '800', fontSize: 13,
                    }}>
                      {team}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </ScrollView>

            {/* Pitcher cards */}
            <View style={{ gap: 12 }}>
              {pitcherStats.map(({ pitcher, total, byPitch }) => {
                const teamColor = TEAM_COLORS[activeTeam!]
                const sortedPitches = ALL_PITCHES
                  .filter((p) => byPitch[p] > 0)
                  .sort((a, b) => (byPitch[b] || 0) - (byPitch[a] || 0))

                return (
                  <View
                    key={pitcher}
                    style={{
                      backgroundColor: '#111827',
                      borderRadius: 16, borderWidth: 2,
                      borderColor: `${teamColor}44`,
                      padding: 16,
                    }}
                  >
                    {/* Pitcher header */}
                    <View style={{
                      flexDirection: 'row', alignItems: 'center',
                      marginBottom: 14,
                    }}>
                      <View style={{
                        backgroundColor: `${teamColor}22`,
                        borderRadius: 8, borderWidth: 1, borderColor: teamColor,
                        paddingHorizontal: 10, paddingVertical: 4,
                        marginRight: 10,
                      }}>
                        <Text style={{
                          color: teamColor, fontSize: 11, fontWeight: '900',
                        }}>
                          {activeTeam}
                        </Text>
                      </View>
                      <Text style={{
                        color: '#ffffff', fontSize: 15, fontWeight: '800', flex: 1,
                      }}>
                        {pitcher}
                      </Text>
                      <Text style={{ color: '#6b7280', fontSize: 12 }}>
                        {total} {t.pitches}
                      </Text>
                    </View>

                    {/* Pitch breakdown */}
                    <View style={{ gap: 8 }}>
                      {sortedPitches.map((pitch) => {
                        const count = byPitch[pitch] || 0
                        const pct = total > 0 ? count / total : 0
                        const color = PITCH_COLORS[pitch]
                        return (
                          <View key={pitch}>
                            <View style={{
                              flexDirection: 'row', alignItems: 'center',
                              marginBottom: 4,
                            }}>
                              <View style={{
                                width: 8, height: 8, borderRadius: 4,
                                backgroundColor: color, marginRight: 8,
                              }} />
                              <Text style={{
                                color: '#d1d5db', fontSize: 12,
                                fontWeight: '600', flex: 1,
                              }}>
                                {PITCH_LABELS[pitch][language]}
                              </Text>
                              <Text style={{
                                color: color, fontSize: 13, fontWeight: '900',
                                marginRight: 4,
                              }}>
                                {count}
                              </Text>
                              <Text style={{ color: '#4b5563', fontSize: 10 }}>
                                {Math.round(pct * 100)}%
                              </Text>
                            </View>
                            {/* Bar */}
                            <View style={{
                              height: 4, backgroundColor: '#1f2937',
                              borderRadius: 2, marginLeft: 16,
                            }}>
                              <View style={{
                                height: 4, borderRadius: 2,
                                backgroundColor: color,
                                width: `${Math.round(pct * 100)}%`,
                              }} />
                            </View>
                          </View>
                        )
                      })}
                    </View>
                  </View>
                )
              })}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
