// routers/dashboardRoute.js

const { Router } = require("express");
const router = Router();
const dashboardController = require("../controllers/DashboardController");
const { userRoles } = require("../models/UserModel");

// Importando o middleware de verificação de papel
const checkRole = require("../middleware/checkRole");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Salva arquivos em /uploads

// Verifique se o usuário é 'admin' para acessar o dashboard
router.get("/dashboard", checkRole(userRoles.ADMIN), (req, res) => {
  dashboardController.index(req, res);
});

router.post(
  "/addDocument",
  checkRole(userRoles.ADMIN),
  upload.single('documentFile'), // processa o campo de arquivo e os campos de texto
  (req, res) => {
    dashboardController.addSource(req, res);
  }
);

router.post("/delete/by-source", checkRole(userRoles.ADMIN), (req, res) => {
  dashboardController.deleteBySource(req, res);
});

router.get("/list-sources", checkRole(userRoles.ADMIN), (req, res) => {
  dashboardController.listSources(req, res);
});

router.get("/count-documents", checkRole(userRoles.ADMIN), (req, res) => {
  dashboardController.countDocuments(req, res);
});

module.exports = router;