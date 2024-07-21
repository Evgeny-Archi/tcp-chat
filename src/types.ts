export enum Type {
    Init = 'init',
    Greeting = 'greeting',
    Message = 'message',
}

export interface Request {
    type: Type;
    message: string;
}
