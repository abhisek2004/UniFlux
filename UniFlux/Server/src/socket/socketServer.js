import { Server } from 'socket.io';
import http from 'http';
import app from '../server.js';

// Create HTTP server
const httpServer = http.createServer(app);

// Initialize Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Vite default port
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });

  // Handle custom events for real-time updates
  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room: ${room}`);
  });

  socket.on('leave-room', (room) => {
    socket.leave(room);
    console.log(`Socket ${socket.id} left room: ${room}`);
  });
});

// Function to emit updates to all connected clients
const emitUpdate = (event, data) => {
  io.emit(event, data);
};

// Function to emit updates to specific room
const emitUpdateToRoom = (room, event, data) => {
  io.to(room).emit(event, data);
};

export { io, httpServer, emitUpdate, emitUpdateToRoom };