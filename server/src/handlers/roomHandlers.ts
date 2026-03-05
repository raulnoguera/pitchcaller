import { Server, Socket } from 'socket.io'
import { createRoom, joinRoom, leaveRoom, getRoster, getRoomByCode } from '../roomManager'

export function registerRoomHandlers(io: Server, socket: Socket): void {
  // Manager creates a game room
  socket.on('create-room', () => {
    const room = createRoom(socket.id)
    socket.join(room.code)
    socket.emit('room-created', {
      code: room.code,
      roster: getRoster(room),
    })
    console.log(`[Room ${room.code}] Created by manager ${socket.id}`)
  })

  // Pitcher or Catcher joins a room
  socket.on('join-room', ({ code, role }: { code: string; role: 'pitcher' | 'catcher' }) => {
    if (!code || !role) {
      socket.emit('room-error', { code: 'INVALID_PAYLOAD', message: 'Code and role are required' })
      return
    }

    const result = joinRoom(code, socket.id, role)
    if (!result.success) {
      socket.emit('room-error', {
        code: result.error,
        message: result.error === 'ROOM_NOT_FOUND'
          ? 'Game not found. Check the code and try again.'
          : 'That role is already taken in this game.',
      })
      return
    }

    socket.join(code)

    const roster = getRoster(result.room)

    // Confirm to the joining player
    socket.emit('room-joined', { code, role, roster })

    // Notify the whole room (including manager)
    io.to(code).emit('player-joined', { role, roster })

    console.log(`[Room ${code}] ${role} joined (${socket.id})`)
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    const result = leaveRoom(socket.id)
    if (!result) return

    const { room, role } = result
    console.log(`[Room ${room.code}] ${role} disconnected (${socket.id})`)

    if (role === 'manager') {
      // Room is dissolved — notify remaining players
      io.to(room.code).emit('player-left', {
        role,
        message: 'Manager disconnected. Game ended.',
      })
    } else {
      const roster = getRoster(room)
      io.to(room.code).emit('player-left', { role, roster })
    }
  })
}
