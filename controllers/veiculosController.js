const Joi = require('joi');
const Veiculos = require('../models/Veiculos');


// Controlador para criar um novo veículo
const createVeiculo = async (req, res) => {
  try {
    const veiculo = await Veiculos.create(req.body);
    res.status(201).json(veiculo);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar o veículo' });
  }
};

// Controlador para obter detalhes de um veículo
const getVeiculo = async (req, res) => {
  try {
    const veiculo = await Veiculos.findByPk(req.params.id);
    if (veiculo) {
      res.json(veiculo);
    } else {
      res.status(404).json({ error: 'Veículo não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter detalhes do veículo' });
  }
};

// Controlador para atualizar um veículo
const updateVeiculo = async (req, res) => {
  try {
    const veiculo = await Veiculos.findByPk(req.params.id);
    if (veiculo) {
      // Valide os dados da requisição
      const { error } = createVeiculoSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      await veiculo.update(req.body);
      res.json(veiculo);
    } else {
      res.status(404).json({ error: 'Veículo não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar o veículo' });
  }
};

// Controlador para excluir um veículo
const deleteVeiculo = async (req, res) => {
  try {
    const veiculo = await Veiculos.findByPk(req.params.id);
    if (veiculo) {
      await veiculo.destroy();
      res.json({ message: 'Veículo excluído com sucesso' });
    } else {
      res.status(404).json({ error: 'Veículo não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir o veículo' });
  }
};

// Controlador para buscar todos os veículos
const getAllVeiculos = async (req, res) => {
  try {
    const veiculos = await Veiculos.findAll();
    res.json(veiculos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar veículos' });
  }
};

module.exports = {
  createVeiculo,
  getVeiculo,
  updateVeiculo,
  deleteVeiculo,
  getAllVeiculos,
};
