const path      = require('path');
const http      = require('http');
const express   = require('express');
const socketIO  = require('socket.io');

const {generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');

const port = process.env.PORT || 3000;
let app = express();
// express().listen() chama o  .createServer() de http
let server = http.createServer(app); //tudo isso para poder incorp. socket io...
let io = socketIO(server); //return websocket server

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user is now connected');

    //criar 2 evts: socket.emit {from: Admin, text: Welcome to the chat app}
    //socket.broadcast.emit {from: Admin, text: New user joined}
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));
    
    socket.on('createMessage', (newMessage) => {
        let {from, text} = newMessage;
        //usamos io ao inves de socket pq io emite a todos conectados ao contrario de socket
        io.emit('newMessage', generateMessage(from, text));

        //ele emite para todos menos este socket que lança o broadcast
        // socket.broadcast.emit('newMessage', {from, text, createdAt});

    });

    socket.on('disconnect', () => {
        console.log('User got disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
