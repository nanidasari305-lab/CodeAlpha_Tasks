const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`New client connected: ${socket.id}`);

        // Join room
        socket.on('join-room', (roomId, userId, userName) => {
            console.log(`User ${userName} (${userId}) joined room: ${roomId}`);
            socket.join(roomId);

            // Notify others in the room
            socket.to(roomId).emit('user-connected', userId, userName, socket.id);

            // Forward WebRTC signals
            socket.on('offer', (payload) => {
                io.to(payload.target).emit('offer', payload);
            });

            socket.on('answer', (payload) => {
                io.to(payload.target).emit('answer', payload);
            });

            socket.on('ice-candidate', (payload) => {
                io.to(payload.target).emit('ice-candidate', payload);
            });

            // Chat feature
            socket.on('send-message', (message) => {
                io.to(roomId).emit('receive-message', message);
            });

            // Whiteboard sync
            socket.on('drawing', (data) => {
                socket.to(roomId).emit('drawing', data);
            });

            // Disconnect
            socket.on('disconnect', () => {
                console.log(`Client disconnected: ${socket.id}`);
                socket.to(roomId).emit('user-disconnected', userId, socket.id);
            });
        });
    });
};

const getIo = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

module.exports = { initSocket, getIo };
