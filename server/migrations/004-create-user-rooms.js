'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserRooms', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      roomId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Rooms',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      role: {
        type: Sequelize.ENUM('member', 'moderator', 'admin'),
        defaultValue: 'member'
      },
      joinedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      lastReadAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      isMuted: {
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

    // Add unique constraint to prevent duplicate memberships
    await queryInterface.addConstraint('UserRooms', {
      fields: ['userId', 'roomId'],
      type: 'unique',
      name: 'unique_user_room'
    });

    // Add indexes
    await queryInterface.addIndex('UserRooms', ['userId']);
    await queryInterface.addIndex('UserRooms', ['roomId']);
    await queryInterface.addIndex('UserRooms', ['userId', 'roomId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserRooms');
  }
};