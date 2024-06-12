import * as net from 'node:net';

interface Data {
    name: string;
    text: string;
}

const server = net.createServer(socket => {
    socket.on('data', (data: Data) => {
        console.log(data);
        // const request = JSON.parse(data);
        // socket.write(request.text);
        // console.log('receive data: ', request);
    });
    socket.on('close', () => {
        socket.end();
    });
});

server.on('connection', () => {
    console.log('Client connected', process.pid);
});

const port = process.env.PORT || 0;
const isDEV = process.env.DEV;

server.listen(port, () => {
    console.log('Server started...');
    console.log('Mode:', isDEV ? 'DEV' : 'PROD');
    console.log('Address:', server.address());
});
