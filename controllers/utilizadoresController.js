const Utilizadores = require('../models/Utilizadores');
const { Op } = require('sequelize');

// Controlador para criar um novo utilizador
const createUtilizador = async (req, res) => {
    try {
        const { nome, email, password, endereco, tipo } = req.body;

        // Verifique se o usuário já está registrado
        const existingUtilizador = await Utilizadores.findOne({
            where: { email: email }
        });
        if (existingUtilizador) {
            return res.status(400).json({ message: 'O utilizador já está criado.' });
        }

        // Realize a validação dos campos
        if (!nome || !email || !password || !endereco) {
            return res.status(400).json({ message: 'Por favor, preencha todos os campos obrigatórios' });
        }

        const newUtilizador = await Utilizadores.create({
            nome,
            email,
            password,
            endereco,
            tipo,
        });
        res.status(201).json({ message: 'Utilizador criado com sucesso' });
    } catch (error) {
        console.error('Erro ao criar utilizador:', error);
        res.status(500).json({ message: 'Erro ao criar utilizador' });
    }
};

// Controlador para obter informações de um utilizador por email e senha
const getUtilizador = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Utilizadores.findOne({ where: { email, password } });

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'Utilizador não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao obter utilizador:', error);
        res.status(500).json({ message: 'Erro ao obter utilizador' });
    }
};


// Controlador para atualizar informações de um utilizador
const updateUtilizador = async (req, res) => {
    try {
        const userId = req.params.id;
        const { nome, email, password, endereco } = req.body;
        const user = await Utilizadores.findByPk(userId);
        if (user) {
            await user.update({
                nome,
                email,
                password,
                endereco,
            });
            res.status(200).json({ message: 'Utilizador atualizado com sucesso' });
        } else {
            res.status(404).json({ message: 'Utilizador não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao atualizar utilizador:', error);
        res.status(500).json({ message: 'Erro ao atualizar utilizador' });
    }
};

// Controlador para excluir um utilizador
const deleteUtilizador = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await Utilizadores.findByPk(userId);
        if (user) {
            await user.destroy();
            res.status(200).json({ message: 'Utilizador excluído com sucesso' });
        } else {
            res.status(404).json({ message: 'Utilizador não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao excluir utilizador:', error);
        res.status(500).json({ message: 'Erro ao excluir utilizador' });
    }
};

// Controlador para obter um utilizador por email
const getUtilizadorByEmail = async (req, res) => {
    try {
      const { email } = req.params;
  
      // Verifique se email está definido antes de chamá-lo em toString
      if (email) {
        const utilizador = await Utilizadores.findOne({
          where: {
            email: {
              [Op.eq]: email,
            },
          },
        });
  
        if (utilizador) {
          res.status(200).json(utilizador);
        } else {
          res.status(404).json({ message: 'Utilizador não encontrado' });
        }
      } else {
        // Trate o caso em que email não está definido
        res.status(400).json({ message: 'Email não fornecido' });
      }
    } catch (error) {
      console.error('Erro ao obter utilizador por email:', error);
      res.status(500).json({ message: 'Erro ao obter utilizador por email' });
    }
  };
  
  module.exports = {
    createUtilizador,
    getUtilizador,
    updateUtilizador,
    deleteUtilizador,
    getUtilizadorByEmail,
  };