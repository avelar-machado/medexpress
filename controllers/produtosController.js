const Joi = require('joi');
const Produtos = require('../models/Produtos');
const Utilizadores = require('../models/Utilizadores');
const { Op } = require('sequelize');

// Esquema de validação para criação de produto
const createProdutoSchema = Joi.object({
  nome: Joi.string().required(),
  origem: Joi.string().required(),
  descricao: Joi.string().required(),
  preco: Joi.number().required(),
  quantidade_em_estoque: Joi.number().required(),
  email_farmacia: Joi.string().email().required(),
});


// Controlador para criar um novo produto
const createProduto = async (req, res) => {
  try {
    // Extraia os dados necessários da requisição
    const {
      nome,
      origem,
      descricao,
      preco,
      quantidade_em_estoque,
      email_farmacia,
    } = req.body;

    // Valide os dados da requisição
    const { error } = createProdutoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Crie um novo produto
    const newProduto = await Produtos.create({
      nome,
      origem,
      descricao,
      preco,
      quantidade_em_estoque,
      email_farmacia,
    });

    res.status(201).json({ message: 'Produto criado com sucesso' });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ message: 'Erro ao criar produto' });
  }
};

// Controlador para obter informações de um produto
const getProduto = async (req, res) => {
  try {
    const produtoId = req.params.id;
    const produto = await Produtos.findByPk(produtoId);

    if (produto) {
      res.status(200).json(produto);
    } else {
      res.status(404).json({ message: 'Produto não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao obter produto:', error);
    res.status(500).json({ message: 'Erro ao obter produto' });
  }
};

// Controlador para atualizar informações de um produto
const updateProduto = async (req, res) => {
  try {
    const produtoId = req.params.id;
    const {
      nome,
      origem,
      descricao,
      preco,
      quantidade_em_estoque,
      email_farmacia,
    } = req.body;

    // Valide os dados da requisição
    const { error } = createProdutoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const produto = await Produtos.findByPk(produtoId);
    if (produto) {
      await produto.update({
        nome,
        origem,
        descricao,
        preco,
        quantidade_em_estoque,
        email_farmacia,
      });

      res.status(200).json({ message: 'Produto atualizado com sucesso' });
    } else {
      res.status(404).json({ message: 'Produto não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ message: 'Erro ao atualizar produto' });
  }
};

// Controlador para excluir um produto
const deleteProduto = async (req, res) => {
  try {
    const produtoId = req.params.id;
    const produto = await Produtos.findByPk(produtoId);
    if (produto) {
      await produto.destroy();
      res.status(200).json({ message: 'Produto excluído com sucesso' });
    } else {
      res.status(404).json({ message: 'Produto não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    res.status(500).json({ message: 'Erro ao excluir produto' });
  }
};

// Controlador para obter produtos por nome com informações do utilizador
const getProdutosPorNome = async (req, res) => {
  try {
    const { nome } = req.params;

    // Verifique se o nome está definido antes de chamá-lo em toString
    if (nome) {
      const produtos = await Produtos.findAll({
        where: {
          nome: {
            [Op.like]: `%${nome}%`,
          },
        },
      });

      // Mapeia os produtos e obtém as informações do utilizador para cada um
      const produtosComUtilizador = await Promise.all(
        produtos.map(async (produto) => {
          const utilizador = await Utilizadores.findOne({
            where: { email: produto.email_farmacia },
            attributes: ['nome', 'endereco'],
          });

          // Retorna o produto com as informações do utilizador
          return {
            ...produto.toJSON(),
            utilizador,
          };
        })
      );

      res.status(200).json(produtosComUtilizador);
    } else {
      // Trate o caso em que o nome não está definido
      res.status(400).json({ message: 'Nome não fornecido' });
    }
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ message: 'Erro ao buscar produtos' });
  }
};

const getProdutosPorFarmacia = async (req, res) => {
  try {
    const { email } = req.params;

    const produtos = await Produtos.findAll({
      where: { email_farmacia: email },
    });

    res.status(200).json(produtos);
  } catch (error) {
    console.error('Erro ao buscar produtos por farmácia:', error);
    res.status(500).json({ message: 'Erro ao buscar produtos por farmácia' });
  }
};


module.exports = {
  createProduto,
  getProduto,
  getProdutosPorNome,
  getProdutosPorFarmacia, // Adiciona a função de controle para obter produtos por farmácia
  updateProduto,
  deleteProduto,
};
