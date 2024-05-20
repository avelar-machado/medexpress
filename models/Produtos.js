const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Utilizadores = require('./Utilizadores');

const Produtos = sequelize.define('Produtos', {
  codigo_produto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  origem: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  preco: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  quantidade_em_estoque: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  email_farmacia: {
    type: DataTypes.STRING,
    references: {
      model: Utilizadores,
      key: 'email',
    },
  },
}, {
  timestamps: false, // Desativa os campos createdAt e updatedAt
});

module.exports = Produtos;
