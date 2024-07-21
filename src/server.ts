import net, { Socket } from 'node:net';
import MessageController from './message-controller';
import { Type, Request } from './types';

class Server extends MessageController {
    private name: string;
    constructor() {
        super();
        this.name = '';
    }
    create(port: string) {
        const server = net.createServer(socket => {
            this.broadcast(socket);
        });
        server.listen(port, () => {
            console.log('Server started on', server.address());
            console.log('Mode:', process.env.DEV ? 'DEV' : 'PROD');
        });
        process.on('SIGINT', () => {
            console.log('\nServer shut down');
            server.removeAllListeners();
            process.exitCode = 1;
            process.exit();
        });
    }
    private broadcast(socket: Socket) {
        console.log('Client connected');
        this.on('message', message => {
            socket.write(message);
        });

        socket.on('data', request => {
            const json: Request = JSON.parse(request.toString());
            if (json.type === Type.Init) {
                // write to file
                const json = JSON.stringify({
                    type: Type.Init,
                    message: 'connected',
                });
                socket.write(Buffer.from(json));
            }

            if (json.type === Type.Greeting) {
                const json = JSON.parse(request.toString());
                this.name = json.message;

                this.sendMessage(
                    Buffer.from(JSON.stringify({ type: Type.Greeting, message: `[${this.name}] connected` }))
                );
            }

            if (json.type === Type.Message) {
                const json = JSON.parse(request.toString());
                this.sendMessage(Buffer.from(JSON.stringify({ type: Type.Message, message: json.message })));
            }
        });

        socket.on('close', () => {
            console.log('Client disconected');
            this.sendMessage(Buffer.from(JSON.stringify({ message: `${this.name} has quit` }), 'utf8'));
            socket.end();
        });
    }
}

export default Server;
