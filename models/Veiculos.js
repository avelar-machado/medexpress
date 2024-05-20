const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Motoristas = require('./Motoristas');

const Veiculos = sequelize.define('Veiculos', {
  matricula: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  tipo_veiculo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  velocidade_media_km: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  preco_base_km: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  factor_fiabilidade: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  localizacao_x: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  localizacao_y: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  fk_motorista: {
    type: DataTypes.STRING,
    references: {
      model: Motoristas,
      key: 'email_motorista',
    },
  },
}, {
  timestamps: false, // Desativa os campos createdAt e updatedAt
});

module.exports = Veiculos;
