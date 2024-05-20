const express = require('express');
const router = express.Router();

// Importe os controladores necessários
const utilizadoresController = require('../controllers/utilizadoresController');
const produtosController = require('../controllers/produtosController'); // Importa o controlador de produtos

// Rotas para Utilizadores
router.post('/utilizadores', utilizadoresController.createUtilizador);
router.post('/utilizadores/login', utilizadoresController.getUtilizador);
router.put('/utilizadores/:email', utilizadoresController.updateUtilizador);
router.delete('/utilizadores/:email', utilizadoresController.deleteUtilizador);
router.get('/utilizadores/:email', utilizadoresController.getUtilizadorByEmail);

// Rotas para Produtos
router.post('/produtos', produtosController.createProduto);
router.get('/produtos/:id', produtosController.getProduto);
router.get('/produtosPorNome/:nome', produtosController.getProdutosPorNome);
router.get('/produtosPorFarmacia/:email', produtosController.getProdutosPorFarmacia); // Nova rota para obter produtos por farmácia
router.put('/produtos/:id', produtosController.updateProduto);
router.delete('/produtos/:id', produtosController.deleteProduto);

module.exports = router;
