import React, { useState } from 'react'
import {
  View, Text, TouchableOpacity, ScrollView, Modal,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, Redirect } from 'expo-router'
import { useAppStore, Language, TEAM_COLORS } from '../src/store/appStore'
import { useSpeech } from '../src/hooks/useSpeech'
import {
  PitchType, PitchLocation,
  ALL_PITCHES, VERTICAL_ZONES, HORIZONTAL_ZONES,
  PITCH_LABELS, VERTICAL_LABELS, HORIZONTAL_LABELS, PITCH_COLORS,
} from '../src/lib/pitches'

export default function PitchCallerScreen() {
  const router = useRouter()
  const { language, setLanguage, pitchHistory, addPitch, team, pitcher } = useAppStore()
  const { announce } = useSpeech()

  const [selectedPitch, setSelectedPitch]     = useState<PitchType | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<PitchLocation | null>(null)
  const [showConfirm, setShowConfirm]         = useState(false)
  const [lastCalled, setLastCalled]           = useState<{ pitch: PitchType; location: PitchLocation } | null>(null)

  // Redirect to setup if no team/pitcher selected
  if (!team) return <Redirect href="/team" />
  if (!pitcher) return <Redirect href="/pitcher" />

  const teamColor = TEAM_COLORS[team]
  const canCall = selectedPitch !== null && selectedLocation !== null

  function handleCallPitch() {
    if (!canCall) return
    setShowConfirm(true)
  }

  function handleConfirm() {
    if (!canCall) return
    const call = { pitch: selectedPitch!, location: selectedLocation! }
    announce(call)
    addPitch(call)
    setLastCalled(call)
    setShowConfirm(false)
    setSelectedPitch(null)
    setSelectedLocation(null)
  }

  const t = {
    en: {
      selectPitch: 'SELECT PITCH',
      selectZone:  'SELECT ZONE',
      call:        'CALL PITCH',
      lastCall:    'LAST CALL',
      history:     'HISTORY',
      changePitcher: 'Change Pitcher',
      changeTeam:  'Change Team',
    },
    es: {
      selectPitch: 'SELECCIONAR LANZAMIENTO',
      selectZone:  'SELECCIONAR ZONA',
      call:        'ENVIAR',
      lastCall:    'ÚLTIMO ENVÍO',
      history:     'HISTORIAL',
      changePitcher: 'Cambiar Pitcher',
      changeTeam:  'Cambiar Equipo',
    },
  }[language]

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0f1e' }}>
      <ScrollView
        contentContainerStyle={{ padding: 18, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 22 }}>⚾</Text>
            <Text style={{ color: '#fff', fontSize: 17, fontWeight: '900', letterSpacing: 2 }}>
              PITCH CALLER
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => router.push('/report')}
              style={{
                paddingHorizontal: 10, paddingVertical: 6,
                borderRadius: 16, borderWidth: 2,
                borderColor: '#374151', backgroundColor: '#111827',
              }}
            >
              <Text style={{ color: '#9ca3af', fontWeight: '800', fontSize: 13 }}>📊</Text>
            </TouchableOpacity>
            {(['en', 'es'] as Language[]).map((lang) => (
              <TouchableOpacity
                key={lang}
                onPress={() => setLanguage(lang)}
                style={{
                  paddingHorizontal: 12, paddingVertical: 6,
                  borderRadius: 16, borderWidth: 2,
                  borderColor: language === lang ? '#f59e0b' : '#374151',
                  backgroundColor: language === lang ? '#f59e0b22' : 'transparent',
                }}
              >
                <Text style={{ color: language === lang ? '#f59e0b' : '#6b7280', fontWeight: '800', fontSize: 11 }}>
                  {lang.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Team + Pitcher bar */}
        <View style={{
          backgroundColor: '#111827',
          borderRadius: 14,
          borderWidth: 2,
          borderColor: `${teamColor}55`,
          padding: 14,
          marginBottom: 18,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}>
          {/* Team badge */}
          <View style={{
            backgroundColor: `${teamColor}22`,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: teamColor,
            paddingHorizontal: 12,
            paddingVertical: 6,
          }}>
            <Text style={{ color: teamColor, fontSize: 13, fontWeight: '900', letterSpacing: 1 }}>
              {team?.toUpperCase()}
            </Text>
          </View>

          {/* Pitcher */}
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#6b7280', fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>
              {language === 'en' ? 'Pitcher' : 'Lanzador'}
            </Text>
            <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '800', marginTop: 1 }}>
              {pitcher}
            </Text>
          </View>

          {/* Change pitcher button */}
          <TouchableOpacity
            onPress={() => router.push('/pitcher')}
            style={{
              backgroundColor: '#1f2937',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#374151',
              paddingHorizontal: 12,
              paddingVertical: 8,
            }}
          >
            <Text style={{ color: '#9ca3af', fontSize: 12, fontWeight: '700' }}>
              🔄 {t.changePitcher}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Last called pitch banner */}
        {lastCalled && (
          <View style={{
            backgroundColor: `${PITCH_COLORS[lastCalled.pitch]}18`,
            borderWidth: 1,
            borderColor: `${PITCH_COLORS[lastCalled.pitch]}55`,
            borderRadius: 14,
            padding: 14,
            marginBottom: 18,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: PITCH_COLORS[lastCalled.pitch] }} />
            <View>
              <Text style={{ color: '#6b7280', fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>
                {t.lastCall}
              </Text>
              <Text style={{ color: PITCH_COLORS[lastCalled.pitch], fontSize: 18, fontWeight: '900', marginTop: 1 }}>
                {PITCH_LABELS[lastCalled.pitch][language].toUpperCase()}
              </Text>
              <Text style={{ color: '#9ca3af', fontSize: 13, marginTop: 1 }}>
                {VERTICAL_LABELS[lastCalled.location.vertical][language]} · {HORIZONTAL_LABELS[lastCalled.location.horizontal][language]}
              </Text>
            </View>
          </View>
        )}

        {/* Pitch selection */}
        <Text style={{ color: '#6b7280', fontSize: 10, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
          {t.selectPitch}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
          {ALL_PITCHES.map((pitch) => {
            const isSelected = selectedPitch === pitch
            const color = PITCH_COLORS[pitch]
            return (
              <TouchableOpacity
                key={pitch}
                onPress={() => setSelectedPitch(pitch)}
                activeOpacity={0.75}
                style={{
                  width: '47.5%',
                  paddingVertical: 16,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: isSelected ? color : '#1f2937',
                  backgroundColor: isSelected ? `${color}22` : '#111827',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: isSelected ? color : '#9ca3af', fontSize: 16, fontWeight: isSelected ? '900' : '600' }}>
                  {PITCH_LABELS[pitch][language]}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        {/* Location grid */}
        <Text style={{ color: '#6b7280', fontSize: 10, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
          {t.selectZone}
        </Text>
        <View style={{ flexDirection: 'row', marginBottom: 4, paddingLeft: 52 }}>
          {HORIZONTAL_ZONES.map((hz) => (
            <Text key={hz} style={{ flex: 1, color: '#4b5563', fontSize: 10, fontWeight: '700', textAlign: 'center', textTransform: 'uppercase' }}>
              {HORIZONTAL_LABELS[hz][language]}
            </Text>
          ))}
        </View>
        {VERTICAL_ZONES.map((vz) => (
          <View key={vz} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <Text style={{ width: 48, color: '#4b5563', fontSize: 10, fontWeight: '700', textAlign: 'center', textTransform: 'uppercase' }}>
              {VERTICAL_LABELS[vz][language]}
            </Text>
            {HORIZONTAL_ZONES.map((hz) => {
              const isSelected = selectedLocation?.vertical === vz && selectedLocation?.horizontal === hz
              return (
                <TouchableOpacity
                  key={hz}
                  onPress={() => setSelectedLocation({ vertical: vz, horizontal: hz })}
                  activeOpacity={0.75}
                  style={{
                    flex: 1, marginHorizontal: 3, paddingVertical: 18,
                    borderRadius: 10, borderWidth: 2,
                    borderColor: isSelected ? '#f59e0b' : '#1f2937',
                    backgroundColor: isSelected ? '#f59e0b22' : '#111827',
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <View style={{
                    width: isSelected ? 10 : 6, height: isSelected ? 10 : 6,
                    borderRadius: 5, backgroundColor: isSelected ? '#f59e0b' : '#374151',
                  }} />
                </TouchableOpacity>
              )
            })}
          </View>
        ))}

        {/* CALL button */}
        <TouchableOpacity
          onPress={handleCallPitch}
          disabled={!canCall}
          activeOpacity={0.85}
          style={{
            marginTop: 28, paddingVertical: 22, borderRadius: 16,
            backgroundColor: canCall ? '#ef4444' : '#1f2937',
            alignItems: 'center',
            shadowColor: canCall ? '#ef4444' : 'transparent',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.45, shadowRadius: 14,
            elevation: canCall ? 10 : 0,
          }}
        >
          <Text style={{ color: canCall ? '#fff' : '#374151', fontSize: 22, fontWeight: '900', letterSpacing: 3 }}>
            {t.call}
          </Text>
        </TouchableOpacity>

        {/* History */}
        {pitchHistory.length > 0 && (
          <View style={{ marginTop: 28 }}>
            <Text style={{ color: '#4b5563', fontSize: 10, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
              {t.history}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {pitchHistory.slice(0, 8).map((call, i) => (
                  <View key={i} style={{
                    backgroundColor: '#111827', borderRadius: 10,
                    paddingHorizontal: 12, paddingVertical: 10,
                    borderWidth: 1, borderColor: '#1f2937', minWidth: 80,
                  }}>
                    <Text style={{ color: PITCH_COLORS[call.pitch], fontSize: 13, fontWeight: '800' }}>
                      {PITCH_LABELS[call.pitch][language]}
                    </Text>
                    <Text style={{ color: '#6b7280', fontSize: 10, marginTop: 2 }}>
                      {VERTICAL_LABELS[call.location.vertical][language]}
                    </Text>
                    <Text style={{ color: '#6b7280', fontSize: 10 }}>
                      {HORIZONTAL_LABELS[call.location.horizontal][language]}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Change team link */}
        <TouchableOpacity
          onPress={() => router.push('/team')}
          style={{ marginTop: 24, alignItems: 'center' }}
        >
          <Text style={{ color: '#374151', fontSize: 13 }}>
            ⇄ {t.changeTeam}
          </Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Confirm Modal */}
      {showConfirm && selectedPitch && selectedLocation && (
        <Modal visible={showConfirm} transparent animationType="slide" statusBarTranslucent>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' }}>
            <View style={{
              backgroundColor: '#111827',
              borderTopLeftRadius: 28, borderTopRightRadius: 28,
              padding: 28, paddingBottom: 48,
              borderTopWidth: 2, borderTopColor: PITCH_COLORS[selectedPitch],
            }}>
              {/* Pitcher line */}
              <Text style={{ color: '#6b7280', fontSize: 11, textAlign: 'center', marginBottom: 4 }}>
                {pitcher}  ·  {team}
              </Text>
              <Text style={{ color: '#6b7280', fontSize: 11, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 20 }}>
                Confirm Pitch
              </Text>

              <Text style={{ color: PITCH_COLORS[selectedPitch], fontSize: 44, fontWeight: '900', textAlign: 'center', letterSpacing: 1 }}>
                {PITCH_LABELS[selectedPitch].en.toUpperCase()}
              </Text>
              <Text style={{ color: '#e5e7eb', fontSize: 20, fontWeight: '600', textAlign: 'center', marginTop: 6 }}>
                {VERTICAL_LABELS[selectedLocation.vertical].en} · {HORIZONTAL_LABELS[selectedLocation.horizontal].en}
              </Text>
              <Text style={{ color: '#6b7280', fontSize: 22, fontWeight: '700', textAlign: 'center', marginTop: 14 }}>
                {PITCH_LABELS[selectedPitch].es.toUpperCase()}
              </Text>
              <Text style={{ color: '#6b7280', fontSize: 15, textAlign: 'center', marginTop: 3 }}>
                {VERTICAL_LABELS[selectedLocation.vertical].es} · {HORIZONTAL_LABELS[selectedLocation.horizontal].es}
              </Text>

              <View style={{ flexDirection: 'row', gap: 12, marginTop: 32 }}>
                <TouchableOpacity
                  onPress={() => setShowConfirm(false)}
                  style={{ flex: 1, paddingVertical: 16, borderRadius: 14, borderWidth: 2, borderColor: '#374151', alignItems: 'center' }}
                >
                  <Text style={{ color: '#9ca3af', fontSize: 16, fontWeight: '700' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleConfirm}
                  style={{ flex: 2, paddingVertical: 16, borderRadius: 14, backgroundColor: PITCH_COLORS[selectedPitch], alignItems: 'center' }}
                >
                  <Text style={{ color: '#000', fontSize: 18, fontWeight: '900', letterSpacing: 1 }}>
                    {language === 'en' ? 'CALL PITCH' : 'ENVIAR'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  )
}
