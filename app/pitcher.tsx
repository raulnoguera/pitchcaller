import React, { useState } from 'react'
import {
  View, Text, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform,
} from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAppStore, TEAM_COLORS } from '../src/store/appStore'

interface Props {
  isChanging?: boolean
}

export default function PitcherScreen() {
  const router = useRouter()
  const { team, pitcher: currentPitcher, language, setPitcher } = useAppStore()
  const isChanging = !!currentPitcher

  const [name, setName] = useState('')

  const color = team ? TEAM_COLORS[team] : '#ef4444'

  function handleConfirm() {
    if (!name.trim()) return
    setPitcher(name.trim())
    router.replace('/')
  }

  const labels = {
    en: {
      title: isChanging ? 'Change Pitcher' : 'Register Pitcher',
      subtitle: isChanging
        ? `Replacing: ${currentPitcher}`
        : 'Who is taking the mound?',
      placeholder: 'Pitcher name...',
      confirm: isChanging ? 'CHANGE PITCHER' : 'START GAME',
      back: 'Back',
    },
    es: {
      title: isChanging ? 'Cambiar Pitcher' : 'Registrar Pitcher',
      subtitle: isChanging
        ? `Reemplazando: ${currentPitcher}`
        : '¿Quién va al montículo?',
      placeholder: 'Nombre del pitcher...',
      confirm: isChanging ? 'CAMBIAR PITCHER' : 'INICIAR JUEGO',
      back: 'Atrás',
    },
  }[language]

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0f1e' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={{ flex: 1, padding: 24, justifyContent: 'space-between' }}>

          {/* Header */}
          <View>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 24 }}>
              <Text style={{ color: '#6b7280', fontSize: 15 }}>← {labels.back}</Text>
            </TouchableOpacity>

            {/* Team badge */}
            {team && (
              <View style={{
                alignSelf: 'center',
                backgroundColor: `${color}22`,
                borderWidth: 2, borderColor: color,
                borderRadius: 20,
                paddingHorizontal: 20, paddingVertical: 8,
                marginBottom: 28,
              }}>
                <Text style={{ color, fontSize: 16, fontWeight: '900', letterSpacing: 1 }}>
                  {team.toUpperCase()}
                </Text>
              </View>
            )}

            <Text style={{ color: '#ffffff', fontSize: 28, fontWeight: '900', textAlign: 'center', marginBottom: 8 }}>
              {labels.title}
            </Text>
            <Text style={{ color: '#6b7280', fontSize: 14, textAlign: 'center', marginBottom: 36 }}>
              {labels.subtitle}
            </Text>

            {/* Name input */}
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={labels.placeholder}
              placeholderTextColor="#374151"
              autoFocus
              autoCapitalize="words"
              returnKeyType="done"
              onSubmitEditing={handleConfirm}
              style={{
                backgroundColor: '#111827',
                borderWidth: 2,
                borderColor: name.trim() ? color : '#1f2937',
                borderRadius: 16,
                padding: 20,
                color: '#ffffff',
                fontSize: 22,
                fontWeight: '700',
                textAlign: 'center',
              }}
            />
          </View>

          {/* Confirm button */}
          <TouchableOpacity
            onPress={handleConfirm}
            disabled={!name.trim()}
            activeOpacity={0.85}
            style={{
              paddingVertical: 22,
              borderRadius: 16,
              backgroundColor: name.trim() ? color : '#1f2937',
              alignItems: 'center',
              shadowColor: name.trim() ? color : 'transparent',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.45,
              shadowRadius: 14,
              elevation: name.trim() ? 10 : 0,
            }}
          >
            <Text style={{ color: name.trim() ? '#000' : '#374151', fontSize: 18, fontWeight: '900', letterSpacing: 1 }}>
              {labels.confirm}
            </Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
