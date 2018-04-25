const path      = require('path');
const http      = require('http');
const express   = require('express');
const socketIO  = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation')
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname, '../public');

const port = process.env.PORT || 3000;
let app = express();
// express().listen() chama o  .createServer() de http
let server = http.createServer(app); //tudo isso para poder incorp. socket io...
let io = socketIO(server); //return websocket server
let users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user is now connected');

    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required.');
        }
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        //criar 2 evts: socket.emit {from: Admin, text: Welcome to the chat app}
        //socket.broadcast.emit {from: Admin, text: New user joined}
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
        callback(); 
    });

    
    socket.on('createMessage', (newMessage, callback) => {
        let user = users.getUser(socket.id);

        if(user && isRealString(newMessage.text)){
        let {text} = newMessage;
        //usamos io ao inves de socket pq io emite a todos conectados ao contrario de socket
        io.to(user.room).emit('newMessage', generateMessage(user.name, text));}
        callback();
        //ele emite para todos menos este socket que lança o broadcast
        // socket.broadcast.emit('newMessage', {from, text, createdAt});

    });

    socket.on('createLocationMessage', (coords) => {
        let user = users.getUser(socket.id);
        if(user){
        io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });

    socket.on('disconnect', () => {
        let user = users.removeUser(socket.id);

        if(user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
        }
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
