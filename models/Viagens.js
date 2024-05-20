const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Clientes = require('./Clientes');
const Motoristas = require('./Motoristas');
const Veiculos = require('./Veiculos');

const Viagens = sequelize.define('Viagens', {
  id_viagem: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email_cliente: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Clientes,
      key: 'email_cliente',
    },
  },
  matricula_veiculo: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Veiculos,
      key: 'matricula',
    },
  },
  coordenadas_origem_x: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  coordenadas_origem_y: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  coordenadas_destino_x: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  coordenadas_destino_y: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  custo_estimado: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  custo_real: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  tempo_estimado: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  tempo_real: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  timestamps: false, // Desativa os campos createdAt e updatedAt
});

module.exports = Viagens;
