// routers/dashboardRoute.js

const { Router } = require("express");
const router = Router();
const dashboardController = require("../controllers/DashboardController");

router.get("/dashboard", (req, res) => {
  dashboardController.index(req, res);
});

module.exports = router;