const { createServer } = require('http')
const next = require('next')
const GameServer = require('./GameServer')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer(handle)

  const io = require('socket.io')(server)
  const gameServer = new GameServer(io)
  gameServer.start()

  server.listen(process.env.PORT || 3000)
})
