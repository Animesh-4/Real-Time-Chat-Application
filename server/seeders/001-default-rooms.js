'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, create a default admin user
    const adminUserId = uuidv4();
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await queryInterface.bulkInsert('Users', [{
      id: adminUserId,
      username: 'admin',
      email: 'admin@chatapp.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    // Create default rooms
    const rooms = [
      {
        id: uuidv4(),
        name: 'General',
        description: 'General discussion for everyone',
        isPrivate: false,
        maxUsers: 100,
        createdBy: adminUserId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Random',
        description: 'Random conversations and off-topic discussions',
        isPrivate: false,
        maxUsers: 50,
        createdBy: adminUserId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Tech Talk',
        description: 'Discussions about technology, programming, and development',
        isPrivate: false,
        maxUsers: 75,
        createdBy: adminUserId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Announcements',
        description: 'Important announcements and updates',
        isPrivate: false,
        maxUsers: 200,
        createdBy: adminUserId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('Rooms', rooms);

    // Add admin to all rooms
    const userRooms = rooms.map(room => ({
      id: uuidv4(),
      userId: adminUserId,
      roomId: room.id,
      role: 'admin',
      joinedAt: new Date(),
      lastReadAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('UserRooms', userRooms);

    // Add welcome messages
    const welcomeMessages = [
      {
        id: uuidv4(),
        content: 'Welcome to the General chat room! This is where everyone can chat about anything.',
        type: 'system',
        userId: adminUserId,
        roomId: rooms[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        content: 'Welcome to Random! Feel free to share anything that comes to mind.',
        type: 'system',
        userId: adminUserId,
        roomId: rooms[1].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        content: 'Welcome to Tech Talk! Share your programming knowledge and ask technical questions here.',
        type: 'system',
        userId: adminUserId,
        roomId: rooms[2].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        content: 'This is the Announcements channel. Important updates will be posted here.',
        type: 'system',
        userId: adminUserId,
        roomId: rooms[3].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('Messages', welcomeMessages);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Messages', null, {});
    await queryInterface.bulkDelete('UserRooms', null, {});
    await queryInterface.bulkDelete('Rooms', null, {});
    await queryInterface.bulkDelete('Users', { username: 'admin' }, {});
  }
};