'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      username: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 30]
        }
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      avatar: {
        type: Sequelize.STRING,
        defaultValue: 'https://via.placeholder.com/100'
      },
      isOnline: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
    lastSeen: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    role: {
        type: Sequelize.ENUM('user', 'moderator', 'admin'),
        defaultValue: 'user'
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    },
    emailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
    });

    // Add indexes for better performance
    await queryInterface.addIndex('Users', ['email']);
    await queryInterface.addIndex('Users', ['username']);
    await queryInterface.addIndex('Users', ['isOnline']);
    },
    down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
    }
};