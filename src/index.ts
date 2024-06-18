import Server from './server';

const server = new Server();

server.create(process.env.PORT || '0');
