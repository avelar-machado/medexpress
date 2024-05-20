const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Utilizadores = require('./Utilizadores');

const Clientes = sequelize.define('Clientes', {
  email_cliente: {
    type: DataTypes.STRING,
    primaryKey: true,
    references: {
      model: Utilizadores,
      key: 'email',
    },
  },
  localizacao_x: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  localizacao_y: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
}, {
  timestamps: false, // Desativa os campos createdAt e updatedAt
});

module.exports = Clientes;
