const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  port: '3306',
  username: 'root',
  password: '',
  database: 'dbmedexpress',
});

module.exports = sequelize;
