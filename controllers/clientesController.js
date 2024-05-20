const Joi = require('joi');
const Clientes = require('../models/Clientes');

// Esquema de validação para criação de cliente
const createClienteSchema = Joi.object({
  email_cliente: Joi.string().required(),
  localizacao_x: Joi.number().required(),
  localizacao_y: Joi.number().required(),
});

// Controlador para criar um novo cliente
const createCliente = async (req, res) => {
  try {
    const { email_cliente } = req.body;

    const newCliente = await Clientes.create({
      email_cliente,
    });
    res.status(201).json({ message: 'Cliente criado com sucesso' });
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({ message: 'Erro ao criar cliente' });
  }
};

// Controlador para obter informações de um cliente
const getCliente = async (req, res) => {
  try {
    const clienteId = req.params.id;
    const cliente = await Clientes.findByPk(clienteId);
    if (cliente) {
      res.status(200).json(cliente);
    } else {
      res.status(404).json({ message: 'Cliente não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao obter cliente:', error);
    res.status(500).json({ message: 'Erro ao obter cliente' });
  }
};

// Controlador para atualizar informações de um cliente
const updateCliente = async (req, res) => {
  try {
    const clienteId = req.params.id;
    const { email_cliente, localizacao_x, localizacao_y } = req.body;

    const cliente = await Clientes.findByPk(clienteId);
    if (cliente) {
      await cliente.update({
        email_cliente,
        localizacao_x,
        localizacao_y,
      });
      res.status(200).json({ message: 'Cliente atualizado com sucesso' });
    } else {
      res.status(404).json({ message: 'Cliente não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ message: 'Erro ao atualizar cliente' });
  }
};

// Controlador para excluir um cliente
const deleteCliente = async (req, res) => {
  try {
    const clienteId = req.params.id;
    const cliente = await Clientes.findByPk(clienteId);
    if (cliente) {
      await cliente.destroy();
      res.status(200).json({ message: 'Cliente excluído com sucesso' });
    } else {
      res.status(404).json({ message: 'Cliente não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    res.status(500).json({ message: 'Erro ao excluir cliente' });
  }
};

module.exports = {
  createCliente,
  getCliente,
  updateCliente,
  deleteCliente,
};
