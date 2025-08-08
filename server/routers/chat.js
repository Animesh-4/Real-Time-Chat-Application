const express = require('express');
const { 
  getRooms, 
  getMessages, 
  createRoom, 
  joinRoom, 
  getOnlineUsers 
} = require('../controllers/chatController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All chat routes require authentication
router.use(authenticateToken);

router.get('/rooms', getRooms);
router.post('/rooms', createRoom);
router.post('/rooms/:roomId/join', joinRoom);
router.get('/rooms/:roomId/messages', getMessages);
router.get('/users/online', getOnlineUsers);

module.exports = router;