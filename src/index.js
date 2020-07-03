const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/user')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

io.on('connection', (socket)=> {

  socket.on('generate', (callback) => {
    const user = getUser(socket.id)
    const userslist = getUsersInRoom(user.room)
    if(userslist.length <= 4)
    {
      return callback('not enough players to generate')
    }

    // 0 is the dealer
    // 1 is the cop
    // 2 is the vice
    const numlist = []
    
    userslist.map(user => {
      let random =  Math.floor(Math.random() * Math.floor(userslist.length));
      while(numlist.includes(random)) {
        random =  Math.floor(Math.random() * Math.floor(userslist.length))
      }
              user.type = random
      numlist.push(random)
        
      })

    socket.join(user.room)
    io.to(user.room).emit('roomData', {
      room: user.room,
      users:userslist
  })      
  
  })

    socket.on('join', (options, callback) => {
          
        const {error, user} = addUser({id: socket.id, ...options})

        if(error) {
            console.log("error")
              return callback(error)
          } 
          socket.join(user.room)
          io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })          
          // joining a specific socket room
         // socket.emit('message', generateMessage('Welcome','Admin'))
          //socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined!`, 'Admin'))
        //  io.to(user.room).emit('roomData', {
        //      room: user.room,
        //      users: getUsersInRoom(user.room)
        //  })
          callback()
      })


      socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if(user) {
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
    }
    })


})

server.listen(port, () => {
    console.log(`Server is up on port ${port}! `)
})