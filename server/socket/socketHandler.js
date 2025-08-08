const jwt = require('jsonwebtoken');
const { User, Message, Room } = require('../models');

const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return next(new Error('Authentication error'));
    }

    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
};

const handleConnection = (io) => {
  const connectedUsers = new Map();

  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    console.log(`User ${socket.user.username} connected`);
    
    // Store user connection
    connectedUsers.set(socket.user.id, {
      socketId: socket.id,
      user: socket.user
    });

    // Update user online status
    socket.user.update({ isOnline: true, lastSeen: new Date() });

    // Broadcast user online status
    socket.broadcast.emit('userOnline', {
      userId: socket.user.id,
      username: socket.user.username,
      avatar: socket.user.avatar
    });

    // Handle joining rooms
    socket.on('joinRoom', async (roomId) => {
      try {
        const room = await Room.findByPk(roomId);
        if (room) {
          socket.join(roomId);
          socket.to(roomId).emit('userJoinedRoom', {
            userId: socket.user.id,
            username: socket.user.username,
            roomId
          });
        }
      } catch (error) {
        socket.emit('error', 'Failed to join room');
      }
    });

    // Handle leaving rooms
    socket.on('leaveRoom', (roomId) => {
      socket.leave(roomId);
      socket.to(roomId).emit('userLeftRoom', {
        userId: socket.user.id,
        username: socket.user.username,
        roomId
      });
    });

    // Handle sending messages
    socket.on('sendMessage', async (data) => {
      try {
        const { roomId, content, type = 'text' } = data;

        const message = await Message.create({
          content,
          type,
          userId: socket.user.id,
          roomId
        });

        const messageWithUser = await Message.findByPk(message.id, {
          include: [
            {
              model: User,
              attributes: ['id', 'username', 'avatar']
            }
          ]
        });

        // Send message to room
        io.to(roomId).emit('newMessage', messageWithUser);
        
        // Update room timestamp
        await Room.update(
          { updatedAt: new Date() },
          { where: { id: roomId } }
        );

      } catch (error) {
        socket.emit('error', 'Failed to send message');
      }
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
      socket.to(data.roomId).emit('userTyping', {
        userId: socket.user.id,
        username: socket.user.username,
        roomId: data.roomId
      });
    });

    socket.on('stopTyping', (data) => {
      socket.to(data.roomId).emit('userStoppedTyping', {
        userId: socket.user.id,
        roomId: data.roomId
      });
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log(`User ${socket.user.username} disconnected`);
      
      // Update user offline status
      await socket.user.update({ 
        isOnline: false, 
        lastSeen: new Date() 
      });

      // Remove from connected users
      connectedUsers.delete(socket.user.id);

      // Broadcast user offline status
      socket.broadcast.emit('userOffline', {
        userId: socket.user.id
      });
    });

    // Send current online users
    const onlineUsers = Array.from(connectedUsers.values()).map(conn => ({
      id: conn.user.id,
      username: conn.user.username,
      avatar: conn.user.avatar
    }));
    
    socket.emit('onlineUsers', onlineUsers);
  });
};

module.exports = { handleConnection };