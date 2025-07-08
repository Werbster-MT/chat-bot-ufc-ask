// routers/dashboardRoute.js

const { Router } = require("express");
const router = Router();
const studentController = require("../controllers/StudentController");
const { userRoles } = require("../models/UserModel");

// Importando o middleware de verificação de papel
const checkRole = require("../middleware/checkRole");

// Verifique se o usuário é 'estudante' para acessar o Home Estudante
router.get("/studentHomePage", checkRole(userRoles.ESTUDANTE), (req, res) => {
  studentController.index(req, res);
});

// Verifique se o usuário é 'estudante' para acessar o chat
router.get("/chat/:id/", checkRole(userRoles.ESTUDANTE), (req, res) => {
  studentController.getChat(req, res);
});

router.post("/chatBox", checkRole(userRoles.ESTUDANTE), (req, res) => {
  studentController.createChat(req, res);
})

router.post("/ask", checkRole(userRoles.ESTUDANTE), (req, res) => {
  studentController.ask(req, res);
})

router.post("/deleteChats", checkRole(userRoles.ESTUDANTE), (req, res) => {
  studentController.deleteChats(req, res);
})

module.exports = router;