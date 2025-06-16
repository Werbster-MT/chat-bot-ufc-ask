// routers/loginRoute.js

const { Router } = require("express");
const router = Router();
const loginController = require("../controllers/LoginController");

router.get("/", (req, res) => {
  loginController.index(req, res);
});

router.post("/", (req, res) => {
  loginController.authenticate(req, res);
});

router.get("/logout", (req, res) => {
  loginController.logout(req, res);
});

module.exports = router;