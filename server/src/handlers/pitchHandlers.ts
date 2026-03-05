import { Server, Socket } from 'socket.io'
import { getRoomByCode, getRoleInRoom } from '../roomManager'

export interface PitchLocation {
  vertical: 'high' | 'middle' | 'low'
  horizontal: 'inside' | 'center' | 'outside'
}

export interface CallPitchPayload {
  code: string
  pitch: string
  location: PitchLocation
}

const VALID_PITCHES = [
  'fastball', 'curveball', 'slider', 'changeup',
  'sinker', 'cutter', 'splitter', 'two_seam',
]

export function registerPitchHandlers(io: Server, socket: Socket): void {
  socket.on('call-pitch', (payload: CallPitchPayload) => {
    const { code, pitch, location } = payload

    // Validate payload shape
    if (!code || !pitch || !location?.vertical || !location?.horizontal) {
      socket.emit('room-error', { code: 'INVALID_PAYLOAD', message: 'Invalid pitch payload.' })
      return
    }

    if (!VALID_PITCHES.includes(pitch)) {
      socket.emit('room-error', { code: 'INVALID_PITCH', message: 'Unknown pitch type.' })
      return
    }

    const room = getRoomByCode(code)
    if (!room) {
      socket.emit('room-error', { code: 'ROOM_NOT_FOUND', message: 'Game not found.' })
      return
    }

    // Only the manager can call pitches
    const role = getRoleInRoom(room, socket.id)
    if (role !== 'manager') {
      socket.emit('room-error', { code: 'NOT_AUTHORIZED', message: 'Only the manager can call pitches.' })
      return
    }

    // Broadcast to all players in the room (including manager for confirmation)
    io.to(code).emit('pitch-called', {
      pitch,
      location,
      calledAt: Date.now(),
    })

    console.log(`[Room ${code}] Pitch called: ${pitch} → ${location.vertical}/${location.horizontal}`)
  })
}
