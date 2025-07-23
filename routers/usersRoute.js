// routers/loginRoute.js

const { Router } = require("express");
const router = Router();
const userController = require("../controllers/UserController");

// Renderiza a página de login
router.get("/perfil", (req, res) => {
  userController.index(req, res);
});

// Salva o user e senha no sistema e renderiza para a página de login
router.post("/rename-user", (req, res) => {
  userController.renameUser(req, res);
});

// Salva o user e senha no sistema e renderiza para a página de login
router.post("/delete-user", (req, res) => {
  userController.deleteUser(req, res);
});

module.exports = router;