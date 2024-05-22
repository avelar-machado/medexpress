// models/Reservation.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reservation = sequelize.define('Reservation', {
  pharmacyEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  items: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  clientEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: false, // Desativa os campos createdAt e updatedAt
});

module.exports = Reservation;
