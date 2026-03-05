# PitchCaller

App móvil de béisbol — el manager envía señales de lanzamiento al pitcher/catcher en tiempo real mediante Text-to-Speech (TTS). Comunicación por Socket.io, compatible con auriculares Bluetooth.

## Stack

### App móvil
- **Framework:** Expo SDK 55 + Expo Router (file-based routing)
- **UI:** React Native + NativeWind v4 (Tailwind para RN)
- **Estado:** Zustand
- **Comunicación:** Socket.io-client
- **TTS:** expo-speech (bilingüe EN/ES)
- **Lenguaje:** TypeScript

### Backend
- **Runtime:** Node.js + TypeScript
- **WebSocket:** Socket.io
- **Ubicación:** `server/`

## Estructura del proyecto

```
pitchcaller/
├── app/                        # Rutas (Expo Router file-based)
│   ├── _layout.tsx             # Layout principal
│   ├── index.tsx               # Pantalla de inicio
│   ├── pitcher.tsx             # Vista pitcher (recibe señales)
│   ├── team.tsx                # Gestión de equipo
│   └── report.tsx              # Reporte de lanzamientos
├── src/
│   ├── lib/
│   │   ├── pitches.ts          # Tipos de lanzamiento + colores
│   │   └── ttsTemplates.ts     # buildAnnouncement() — templates TTS bilingüe
│   ├── store/
│   │   └── appStore.ts         # Estado global (Zustand)
│   ├── components/
│   │   ├── manager/            # Componentes del manager
│   │   ├── player/             # Componentes del pitcher/catcher
│   │   └── ui/                 # Componentes UI reutilizables
│   └── hooks/
│       └── useSpeech.ts        # Hook para TTS via expo-speech
├── server/                     # Backend Socket.io
│   ├── src/
│   │   ├── index.ts            # Entry point del servidor
│   │   ├── roomManager.ts      # Gestión de salas (rooms)
│   │   └── handlers/           # Event handlers de Socket.io
│   ├── package.json
│   └── tsconfig.json
├── assets/                     # Iconos y splash screen
├── app.json                    # Configuración Expo
├── babel.config.js
├── metro.config.js
├── tailwind.config.js          # Config NativeWind
└── tsconfig.json
```

## Flujo de uso

1. **Manager** crea una sala desde la app
2. **Pitcher/Catcher** se une a la sala con un código
3. Manager selecciona el tipo de lanzamiento
4. La señal se envía por Socket.io al dispositivo del pitcher
5. **expo-speech** anuncia el lanzamiento por TTS (funciona con auriculares Bluetooth/cable)

## Setup

### App móvil
```bash
# Instalar dependencias (requiere --legacy-peer-deps por NativeWind v4)
npm install --legacy-peer-deps

# Configurar variables de entorno
cp .env.example .env.local
# EXPO_PUBLIC_SERVER_URL=http://TU_IP:3001

# Ejecutar
npx expo start
```

### Backend
```bash
cd server
npm install
npm run dev    # Inicia el servidor en puerto 3001
```

## Variables de entorno

```
EXPO_PUBLIC_SERVER_URL=http://TU_IP_LOCAL:3001
```
