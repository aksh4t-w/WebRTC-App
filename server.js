const express = require('express');
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const {v4: uuidV4} = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get('/text', (req, res) => {
    res.redirect(`/text/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', {roomId: req.params.room})
})

app.get('/text/:chatRoom', (req, res) => {
    res.render('chatRoom', {roomId: req.params.chatRoom})
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        // console.log(roomId, userId);
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)
    
        socket.on('disconnect', ()=> {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })

    socket.on('chat', data => {
        io.sockets.emit('chat', data)
    })

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);
    })
})

server.listen(3000)
