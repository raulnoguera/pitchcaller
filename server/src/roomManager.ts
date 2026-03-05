export type Role = 'manager' | 'pitcher' | 'catcher'

export interface Room {
  code: string
  manager: string      // socket.id
  pitcher: string | null
  catcher: string | null
  createdAt: number
}

export interface RosterSnapshot {
  managerConnected: boolean
  pitcherConnected: boolean
  catcherConnected: boolean
}

// In-memory room registry
const rooms = new Map<string, Room>()

// Map socket.id → room code (for cleanup on disconnect)
const socketToRoom = new Map<string, string>()

function generateCode(): string {
  let code: string
  do {
    code = String(Math.floor(1000 + Math.random() * 9000))
  } while (rooms.has(code))
  return code
}

export function createRoom(socketId: string): Room {
  const code = generateCode()
  const room: Room = {
    code,
    manager: socketId,
    pitcher: null,
    catcher: null,
    createdAt: Date.now(),
  }
  rooms.set(code, room)
  socketToRoom.set(socketId, code)
  return room
}

export function joinRoom(
  code: string,
  socketId: string,
  role: 'pitcher' | 'catcher'
): { success: true; room: Room } | { success: false; error: string } {
  const room = rooms.get(code)
  if (!room) return { success: false, error: 'ROOM_NOT_FOUND' }

  if (role === 'pitcher' && room.pitcher !== null) {
    return { success: false, error: 'ROLE_TAKEN' }
  }
  if (role === 'catcher' && room.catcher !== null) {
    return { success: false, error: 'ROLE_TAKEN' }
  }

  if (role === 'pitcher') room.pitcher = socketId
  else room.catcher = socketId

  socketToRoom.set(socketId, code)
  return { success: true, room }
}

export function getRoomByCode(code: string): Room | undefined {
  return rooms.get(code)
}

export function getRoomBySocket(socketId: string): Room | undefined {
  const code = socketToRoom.get(socketId)
  if (!code) return undefined
  return rooms.get(code)
}

export function getRoleInRoom(room: Room, socketId: string): Role | null {
  if (room.manager === socketId) return 'manager'
  if (room.pitcher === socketId) return 'pitcher'
  if (room.catcher === socketId) return 'catcher'
  return null
}

export function leaveRoom(socketId: string): { room: Room; role: Role } | null {
  const room = getRoomBySocket(socketId)
  if (!room) return null

  const role = getRoleInRoom(room, socketId)
  if (!role) return null

  if (role === 'manager') {
    // Manager left — dissolve the room
    rooms.delete(room.code)
  } else if (role === 'pitcher') {
    room.pitcher = null
  } else if (role === 'catcher') {
    room.catcher = null
  }

  socketToRoom.delete(socketId)
  return { room, role }
}

export function getRoster(room: Room): RosterSnapshot {
  return {
    managerConnected: room.manager !== null,
    pitcherConnected: room.pitcher !== null,
    catcherConnected: room.catcher !== null,
  }
}
