const { Sequelize } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(
  config[process.env.NODE_ENV || 'development']
);

const models = {
  User: require('./User')(sequelize),
  Message: require('./Message')(sequelize),
  Room: require('./Room')(sequelize)
};

// Setup associations
Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;