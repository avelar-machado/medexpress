const Reservation = require('../models/Reservation');
const { Op } = require('sequelize');

const createReservation = async (req, res) => {
  try {
    const { pharmacyEmail, items, total, clientEmail } = req.body;
    const reservation = await Reservation.create({
      pharmacyEmail,
      items,
      total,
      clientEmail,
    });
    res.status(201).json({ message: 'Reserva criada com sucesso' });
  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    res.status(500).json({ message: 'Erro ao criar reserva' });
  }
};

const getReservationsByClient = async (req, res) => {
  try {
    const { clientEmail } = req.params;
    const reservations = await Reservation.findAll({ where: { clientEmail } });
    res.json(reservations);
  } catch (error) {
    console.error('Erro ao buscar reservas do cliente:', error);
    res.status(500).json({ message: 'Erro ao buscar reservas do cliente' });
  }
};

module.exports = {
    createReservation,
    getReservationsByClient,
  };
