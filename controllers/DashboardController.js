class DashboardController {
  index(req, res) {
    res.render("dashboard", { error: null });
  }
}

module.exports = new DashboardController();
