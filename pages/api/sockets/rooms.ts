const { Server } = require("socket.io");

const SocketHandler = (req: any, res: any) => {
  if (res.socket.server.io) {
    // Existing connection
    res.socket.server.io.once('connection', (socket: any) => {
        socket.on('room-change', () => {
            socket.broadcast.emit('update-room')
        })
      })
  } else {
    // New connection
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.once('connection', (socket: any) => {
        socket.on('room-change', () => {
            socket.broadcast.emit('update-room')
        })
    })
  }
  res.end()
}

export default SocketHandler