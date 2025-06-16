const User = require("../models/LoginModel");

class DashboardController {
  index(req, res) {
    res.render("login", { error: null });
  }
}

module.exports = new LoginController();
