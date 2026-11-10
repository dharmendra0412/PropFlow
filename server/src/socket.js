let ioInstance = null;

export const initSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Join user or property specific rooms
    socket.on('join_user', (userId) => {
      if (userId) {
        socket.join(`user:${userId}`);
        console.log(`[Socket] ${socket.id} joined user room: user:${userId}`);
      }
    });

    socket.on('join_property', (propertyId) => {
      if (propertyId) {
        socket.join(`property:${propertyId}`);
        console.log(`[Socket] ${socket.id} joined property room: property:${propertyId}`);
      }
    });

    socket.on('join_ticket', (ticketId) => {
      if (ticketId) {
        socket.join(`ticket:${ticketId}`);
        console.log(`[Socket] ${socket.id} joined ticket room: ticket:${ticketId}`);
      }
    });

    socket.on('leave_ticket', (ticketId) => {
      if (ticketId) {
        socket.leave(`ticket:${ticketId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });
};

export const getIO = () => {
  return ioInstance;
};

export const broadcast = (event, payload) => {
  if (ioInstance) {
    ioInstance.emit(event, payload);
  }
};

export const emitToRoom = (room, event, payload) => {
  if (ioInstance) {
    ioInstance.to(room).emit(event, payload);
  }
};
