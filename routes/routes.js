const express = require('express');
const router = express.Router();

// Importe os controladores necessários
const utilizadoresController = require('../controllers/utilizadoresController');
const produtosController = require('../controllers/produtosController');
const reservationController = require('../controllers/reservationController');

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

// Rotas para Reservas
router.post('/reservations', reservationController.createReservation);
router.get('/reservations/:clientEmail', reservationController.getReservationsByClient);


module.exports = router;
