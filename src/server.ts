import net, { Socket } from 'node:net';
import MessageController from './message-controller';

class Server extends MessageController {
    create(port: string) {
        const server = net.createServer(socket => {
            this.broadcast(socket);
        });
        server.listen(port, () => {
            console.log('Server started on', server.address());
            console.log('Mode:', process.env.DEV ? 'DEV' : 'PROD');
        });
    }
    private broadcast(socket: Socket) {
        console.log('Client connected');

        const sendData = (response: string) => {
            socket.write(response);
        };
        this.on('message', sendData);

        socket.on('data', request => {
            this.sendMessage(request);
        });

        socket.on('close', () => {
            console.log('Client disconected');
            this.sendMessage(Buffer.from(JSON.stringify({ message: 'Client disconected' }), 'utf8'));
            this.off('message', sendData);
            socket.end();
        });
    }
}

export default Server;
