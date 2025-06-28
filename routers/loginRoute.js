// routers/loginRoute.js

const { Router } = require("express");
const router = Router();
const loginController = require("../controllers/LoginController");
const accessController = require("../controllers/AccessController");

// Renderiza a página de login
router.get("/", (req, res) => {
  loginController.index(req, res);
});

// Autentica o usuario 
router.post("/", (req, res) => {
  loginController.authenticate(req, res);
});

// Renderiza a página de controle de acesso
router.get("/manage-access", (req, res) => {
  console.log(req.query)
  accessController.index(req, res);
});

// Envia o Código para o usuário e renderiza a paágina de código enviado
router.post("/send-code", (req, res) => {
  accessController.sendCode(req, res);
});

// Renderiza a página de cadastro de conta
router.post("/sign-in", (req, res) => {
  accessController.signIn(req, res);
});

// Salva o user e senha no sistema e renderiza para a página de login
router.post("/save-user", (req, res) => {
  accessController.saveUser(req, res);
});

// Atualizar a senha de um user já cadastrado
router.post("/update-password", (req, res) => {
  loginController.updatePassword(req, res);
});

// Sai do sistema e volta para a página de login
router.get("/logout", (req, res) => {
  loginController.logout(req, res);
});

module.exports = router;