const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Definindo o modelo de Usuário
const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('student', 'admin'),
    defaultValue: 'student',
  },
}, {
  timestamps: true, // Cria createdAt e updatedAt automaticamente
});

module.exports = User;
