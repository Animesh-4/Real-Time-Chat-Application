import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  socket = null;
  
  connect(token) {
    if (this.socket?.connected) return;
    
    this.socket = io(SOCKET_URL, {
      auth: { token }
    });
    
    return new Promise((resolve, reject) => {
      this.socket.on('connect', () => {
        console.log('Connected to server');
        resolve();
      });
      
      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        reject(error);
      });
    });
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
  
  // Room methods
  joinRoom(roomId) {
    this.socket?.emit('joinRoom', roomId);
  }
  
  leaveRoom(roomId) {
    this.socket?.emit('leaveRoom', roomId);
  }
  
  // Message methods
  sendMessage(messageData) {
    this.socket?.emit('sendMessage', messageData);
  }
  
  // Typing methods
  startTyping(roomId) {
    this.socket?.emit('typing', { roomId });
  }
  
  stopTyping(roomId) {
    this.socket?.emit('stopTyping', { roomId });
  }
  
  // Event listeners
  onNewMessage(callback) {
    this.socket?.on('newMessage', callback);
  }
  
  onUserOnline(callback) {
    this.socket?.on('userOnline', callback);
  }
  
  onUserOffline(callback) {
    this.socket?.on('userOffline', callback);
  }
  
  onUserTyping(callback) {
    this.socket?.on('userTyping', callback);
  }
  
  onUserStoppedTyping(callback) {
    this.socket?.on('userStoppedTyping', callback);
  }
  
  onOnlineUsers(callback) {
    this.socket?.on('onlineUsers', callback);
  }
  
  onError(callback) {
    this.socket?.on('error', callback);
  }
  
  // Remove listeners
  removeAllListeners() {
    this.socket?.removeAllListeners();
  }
}

export default new SocketService();