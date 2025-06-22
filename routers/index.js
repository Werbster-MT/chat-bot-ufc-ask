const routerLogin = require("./loginRoute");
const routerDashboard = require("./dashboardRoute");

module.exports = (app) => {
    app.use(routerLogin);
    app.use(routerDashboard);
    // adicione outros routers aqui conforme forem criados
};
