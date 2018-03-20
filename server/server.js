const path      = require('path');
const http      = require('http');
const express   = require('express');
const socketIO  = require('socket.io');

const publicPath = path.join(__dirname, '../public');

const port = process.env.PORT || 3000;
let app = express();
// express().listen() chama o  .createServer() de http
let server = http.createServer(app); //tudo isso para poder incorp. socket io...
let io = socketIO(server); //return websocket server

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user is now connected');
    
    socket.on('createMessage', (newMessage) => {
        let {from, text} = newMessage;
        let createdAt = new Date().getTime();
        //usamos io ao inves de socket pq io emite a todos conectados ao contrario de socket
        io.emit('newMessage', {from, text, createdAt});

    });

    socket.on('disconnect', () => {
        console.log('User got disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
