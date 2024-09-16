'use client';

import { io, Socket } from 'socket.io-client';
let socket: Socket | null = null;

export const initializeSocket = (userId: string): Socket => {
    if (!socket) {
        socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || '', {
            query: { user_id: userId }
        });
    }
    return socket;
};

export const getSocket = (): Socket | null => {
    return socket;
};

export const closeSocket = (): void => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
