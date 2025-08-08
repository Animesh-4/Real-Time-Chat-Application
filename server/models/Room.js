const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Room = sequelize.define('Room', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50]
      }
    },
    description: {
      type: DataTypes.TEXT
    },
    isPrivate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    maxUsers: {
      type: DataTypes.INTEGER,
      defaultValue: 100
    }
  }, {
    timestamps: true
  });

  Room.associate = (models) => {
    Room.hasMany(models.Message, { foreignKey: 'roomId' });
    Room.belongsToMany(models.User, { through: 'UserRooms', foreignKey: 'roomId' });
  };

  return Room;
};