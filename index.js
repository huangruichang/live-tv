
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 3000
const { createWriteStream, unlinkSync } = require('fs')

server.listen(port)

app.use(express.static(__dirname + '/public'))

const filePath = __dirname + '/stream/test.mp4'

// clear
try {
  unlinkSync(filePath)
} catch (ignore) {}

const writeStream = createWriteStream(filePath)

io.on('connection', (socket) => {
  socket.on('stream.push', (data) => {
    console.log('streaming...')
    writeStream.write(data)

  })
})

console.log('server listening: 3000...')
