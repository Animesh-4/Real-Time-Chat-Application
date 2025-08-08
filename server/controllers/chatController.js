const { Message, User, Room } = require('../models');
const { Op } = require('sequelize');

const getRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'avatar', 'isOnline'],
          through: { attributes: [] }
        }
      ],
      order: [['updatedAt', 'DESC']]
    });

    res.json({
      success: true,
      rooms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const messages = await Message.findAndCountAll({
      where: { roomId },
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'avatar']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      success: true,
      messages: messages.rows.reverse(),
      totalPages: Math.ceil(messages.count / limit),
      currentPage: parseInt(page),
      totalMessages: messages.count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const createRoom = async (req, res) => {
  try {
    const { name, description, isPrivate = false } = req.body;

    const room = await Room.create({
      name,
      description,
      isPrivate
    });

    // Add creator to room
    await room.addUser(req.user);

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    await room.addUser(req.user);

    res.json({
      success: true,
      message: 'Joined room successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const getOnlineUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { isOnline: true },
      attributes: ['id', 'username', 'avatar', 'isOnline', 'lastSeen']
    });

    res.json({
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getRooms,
  getMessages,
  createRoom,
  joinRoom,
  getOnlineUsers
};