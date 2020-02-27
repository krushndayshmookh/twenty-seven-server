exports = module.exports = function(io) {
  io.on('connection', function(socket) {
    console.log('Client connected.')

    socket.on('disconnect', () => {
      console.log('Client disconnected.')
    })

    socket.on('msg', data => {
      console.log(data)
      socket.broadcast.emit('msg', data)
    })
  })
}
