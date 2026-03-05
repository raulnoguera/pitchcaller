import 'dotenv/config'
import http from 'http'
import { Server } from 'socket.io'
import { registerRoomHandlers } from './handlers/roomHandlers'
import { registerPitchHandlers } from './handlers/pitchHandlers'

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*'

const httpServer = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }))
    return
  }
  res.writeHead(404)
  res.end()
})

const io = new Server(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
  pingInterval: 25000,
  pingTimeout: 10000,
})

io.on('connection', (socket) => {
  console.log(`[+] Connected: ${socket.id}`)
  registerRoomHandlers(io, socket)
  registerPitchHandlers(io, socket)
})

httpServer.listen(PORT, () => {
  console.log(`PitchCaller server running on http://localhost:${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/health`)
})
