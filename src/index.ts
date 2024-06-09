'use strict';
import * as net from 'node:net';

const server = net.createServer(socket => {
    socket.on('data', data => {
        socket.write(data);
    });
    socket.on('close', () => {
        socket.end();
    });
});

server.on('connection', socket => {
    console.log('client connected', process.pid);
});

server.listen(60300, () => {
    console.log('Listen 60300');
});
