const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuração do banco de dados
const sequelize = new Sequelize({
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;
