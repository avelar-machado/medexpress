const Joi = require('joi');
const Viagens = require('../models/Viagens');

// Esquema de validação para criação de viagem
const createViagemSchema = Joi.object({
  id_cliente: Joi.string().required(),
  matricula_veiculo: Joi.string().required(),
  coordenadas_origem_x: Joi.number().required(),
  coordenadas_origem_y: Joi.number().required(),
  coordenadas_destino_x: Joi.number().required(),
  coordenadas_destino_y: Joi.number().required(),
});

// Controlador para criar uma nova viagem
const createViagem = async (req, res) => {
  try {
    const {
      id_cliente,
      matricula_veiculo,
      coordenadas_origem_x,
      coordenadas_origem_y,
      coordenadas_destino_x,
      coordenadas_destino_y,
      tempo_estimado,
    } = req.body;

    // Valide os dados da requisição
    const { error } = createViagemSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Realize o cálculo de custo da viagem
    const tarifaBase = 5;
    const tarifaPorKm = 2;
    const distancia = calcularDistancia(
      coordenadas_origem_x,
      coordenadas_origem_y,
      coordenadas_destino_x,
      coordenadas_destino_y
    );
    const custoViagem = tarifaBase + tarifaPorKm * distancia;

    const newViagem = await Viagens.create({
      id_cliente,
      matricula_veiculo,
      coordenadas_origem_x,
      coordenadas_origem_y,
      coordenadas_destino_x,
      coordenadas_destino_y,
      custo_estimado: custoViagem,
      tempo_estimado,
    });
    res.status(201).json({ message: 'Viagem criada com sucesso' });
  } catch (error) {
    console.error('Erro ao criar viagem:', error);
    res.status(500).json({ message: 'Erro ao criar viagem' });
  }
};

// Controlador para obter informações de uma viagem
const getViagem = async (req, res) => {
  try {
    const viagemId = req.params.id;
    const viagem = await Viagens.findByPk(viagemId);
    if (viagem) {
      res.status(200).json(viagem);
    } else {
      res.status(404).json({ message: 'Viagem não encontrada' });
    }
  } catch (error) {
    console.error('Erro ao obter viagem:', error);
    res.status(500).json({ message: 'Erro ao obter viagem' });
  }
};

// Controlador para atualizar informações de uma viagem
const updateViagem = async (req, res) => {
  try {
    const viagemId = req.params.id;
    const {
      id_cliente,
      matricula_veiculo,
      coordenadas_origem_x,
      coordenadas_origem_y,
      coordenadas_destino_x,
      coordenadas_destino_y,
      custo_real,
      tempo_estimado,
      tempo_real,
    } = req.body;

    // Valide os dados da requisição
    const { error } = createViagemSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Realize o cálculo de custo da viagem
    const tarifaBase = 5;
    const tarifaPorKm = 2;
    const distancia = calcularDistancia(
      coordenadas_origem_x,
      coordenadas_origem_y,
      coordenadas_destino_x,
      coordenadas_destino_y
    );
    const custoViagem = tarifaBase + tarifaPorKm * distancia;

    const viagem = await Viagens.findByPk(viagemId);
    if (viagem) {
      await viagem.update({
        id_cliente,
        matricula_veiculo,
        coordenadas_origem_x,
        coordenadas_origem_y,
        coordenadas_destino_x,
        coordenadas_destino_y,
        custo_estimado: custoViagem,
        custo_real,
        tempo_estimado,
        tempo_real,
      });
      res.status(200).json({ message: 'Viagem atualizada com sucesso' });
    } else {
      res.status(404).json({ message: 'Viagem não encontrada' });
    }
  } catch (error) {
    console.error('Erro ao atualizar viagem:', error);
    res.status(500).json({ message: 'Erro ao atualizar viagem' });
  }
};

// Controlador para excluir uma viagem
const deleteViagem = async (req, res) => {
  try {
    const viagemId = req.params.id;
    const viagem = await Viagens.findByPk(viagemId);
    if (viagem) {
      await viagem.destroy();
      res.status(200).json({ message: 'Viagem excluída com sucesso' });
    } else {
      res.status(404).json({ message: 'Viagem não encontrada' });
    }
  } catch (error) {
    console.error('Erro ao excluir viagem:', error);
    res.status(500).json({ message: 'Erro ao excluir viagem' });
  }
};

module.exports = {
  createViagem,
  getViagem,
  updateViagem,
  deleteViagem,
};
