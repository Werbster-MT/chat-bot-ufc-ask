// models/LoginModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('student', 'admin'),
    defaultValue: 'student',
  },
  createdAt: {
   field: 'created_at',
   type: DataTypes.DATE,
   allowNull: false,
   defaultValue: DataTypes.NOW,
  },
   updatedAt: {
   field: 'updated_at',
   type: DataTypes.DATE,
   allowNull: false,
   defaultValue: DataTypes.NOW,
}
}, {
  tableName: "users",
  timestamps: false,
});

module.exports = User;
