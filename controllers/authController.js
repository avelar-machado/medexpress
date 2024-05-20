require('dotenv').config();
const Utilizadores = require('../models/Utilizadores');

const loginUtilizador = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verifique se o utilizador existe
    const utilizador = await Utilizadores.findOne({
      where: { email: email }
    });

    if (!utilizador) {
      return res.status(404).json({ message: 'Utilizador não encontrado.' });
    }

    // Verifique se a senha está correta
    const isPasswordValid = utilizador.password;
    if (!(isPasswordValid === password)) {
      return res.status(401).json({ message: 'Senha inválida.' });
    }

    // Gere um token de autenticação
    const token = utilizador.tipo;

    // Envie uma resposta com o token de autenticação
    res.status(200).json({ token });
  } catch (error) {
    console.error('Erro ao autenticar o utilizador:', error);
    return res.status(500).json({ message: 'Erro ao autenticar o utilizador.' });
  }
};

module.exports = {
  loginUtilizador,
};
