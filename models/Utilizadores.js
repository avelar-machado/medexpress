const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Utilizadores = sequelize.define('Utilizadores', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  endereco: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },  
}, {
  timestamps: false, // Desativa os campos createdAt e updatedAt
});


module.exports = Utilizadores;
