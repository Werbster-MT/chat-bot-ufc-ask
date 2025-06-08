const { Sequelize } = require('sequelize');

// Configuração do banco de dados
const sequelize = new Sequelize('ufc_ask', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // Desativa o log de SQL no console
});

module.exports = sequelize;
