const { createServer } = require('http')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer(handle)
  
  const io = require('socket.io')(server)
  
  server.listen(8080)
  
  const rooms = {}
  
  io.on('connection', (socket) => {
    let interval
    
    socket.on('join', (room) => {
      socket.join(room)
      if (rooms[room]) {
        clearInterval(rooms[room].interval)
      }
      
      rooms[room] = {
        'vector': {
          'x': 1,
          'y': 1
        },
        'ball': {
          'x': 250,
          'y': 250
        },
        'paddle1': {
          'x': 20,
          'y': 250
        },
        'paddle2': {
          'x': 480,
          'y': 250
        },
        'interval': setInterval(() => {
          rooms[room].ball.x += rooms[room].vector.x
          rooms[room].ball.y += rooms[room].vector.y
          
          if (rooms[room].vector.x > 0 && rooms[room].ball.x + 15 >= 500) {
            clearInterval(rooms[room].interval)
          }
          if (rooms[room].vector.y > 0 && rooms[room].ball.y + 15 >= 500) {
            rooms[room].vector.y *= -1
          }
          if (rooms[room].vector.x < 0 && rooms[room].ball.x - 15 <= 0) {
            clearInterval(rooms[room].interval)
          }
          if (rooms[room].vector.y < 0 && rooms[room].ball.y - 15 <= 0) {
            rooms[room].vector.y *= -1
          }
          if (rooms[room].vector.x < 0 && rooms[room].ball.x - 15 <= rooms[room].paddle1.x + 5 && rooms[room].ball.x - 15 >= rooms[room].paddle1.x - 5 && rooms[room].ball.y <= rooms[room].paddle1.y + 25 && rooms[room].ball.y >= rooms[room].paddle1.y - 25) {
            rooms[room].vector.x *= -1
          }
          if (rooms[room].vector.x > 0 && rooms[room].ball.x + 15 >= rooms[room].paddle2.x - 5 && rooms[room].ball.x + 15 <= rooms[room].paddle2.x + 5 && rooms[room].ball.y <= rooms[room].paddle2.y + 25 && rooms[room].ball.y >= rooms[room].paddle2.y - 25) {
            rooms[room].vector.x *= -1
          }
          
          io.to(room).emit('ball', rooms[room].ball)
        }, 5)
      }
      
      socket.on('paddle1', (data) => {
        rooms[room].paddle1.y = Math.min(475, Math.max(25, data.y))
        io.to(room).emit('paddle1', rooms[room].paddle1)
      })
      
      socket.on('paddle2', (data) => {
        rooms[room].paddle2.y = Math.min(475, Math.max(25, data.y))
        io.to(room).emit('paddle2', rooms[room].paddle2)
      })
      
      socket.on('disconnect', () => {
        clearInterval(rooms[room].interval)
      })
    })
  })
})
