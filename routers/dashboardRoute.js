// routers/dashboardRoute.js

const { Router } = require("express");
const router = Router();
const dashboardController = require("../controllers/DashboardController");
const { userRoles } = require("../models/UserModel");

// Importando o middleware de verificação de papel
const checkRole = require("../middleware/checkRole");

// Verifique se o usuário é 'admin' para acessar o dashboard
router.get("/dashboard", checkRole(userRoles.ADMIN), (req, res) => {
  dashboardController.index(req, res);
});

module.exports = router;