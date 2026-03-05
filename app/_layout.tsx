import 'react-native-gesture-handler'
import '../global.css'
import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Animated } from 'react-native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

function SplashView() {
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0f1e', alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{ opacity, alignItems: 'center' }}>

        {/* Logo — reemplazar con: source={require('../assets/asba-logo.png')} cuando el archivo exista */}
        <View style={{
          width: 200, height: 200, borderRadius: 100,
          backgroundColor: '#0d1f3c',
          borderWidth: 4, borderColor: '#c0392b',
          alignItems: 'center', justifyContent: 'center',
          marginBottom: 32,
        }}>
          <Text style={{ fontSize: 72 }}>⚾</Text>
          <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '900', letterSpacing: 2, marginTop: 4 }}>ASBA</Text>
        </View>

        {/* App name */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Text style={{ fontSize: 20 }}>⚾</Text>
          <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: '900', letterSpacing: 4 }}>
            PITCH CALLER
          </Text>
        </View>

        {/* Tagline */}
        <Text style={{ color: '#374151', fontSize: 11, letterSpacing: 1, marginBottom: 64 }}>
          ASBA · ANTOFAGASTA
        </Text>

        {/* Made by */}
        <View style={{ alignItems: 'center', gap: 4 }}>
          <Text style={{ color: '#4b5563', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' }}>
            Desarrollado por
          </Text>
          <Text style={{ color: '#f59e0b', fontSize: 16, fontWeight: '900', letterSpacing: 1 }}>
            indexart.cl
          </Text>
        </View>

      </Animated.View>
    </SafeAreaView>
  )
}

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#0a0f1e" />
      {showSplash ? (
        <SplashView />
      ) : (
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#0a0f1e' },
            animation: 'slide_from_right',
          }}
        />
      )}
    </SafeAreaProvider>
  )
}
