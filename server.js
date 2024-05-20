const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());

// Importe seus modelos aqui
const Utilizadores = require('./models/Utilizadores');
const Produtos = require('./models/Produtos');

// Sincronize os modelos com o banco de dados
db.sync()
  .then(() => {
    console.log('Tabelas criadas com sucesso!');
  })
  .catch((error) => {
    console.error('Erro ao criar tabelas:', error);
  });


// Importe suas rotas aqui
const routes = require('./routes/routes');

// Registre as rotas usando app.use()
app.use('/', routes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
