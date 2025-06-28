const routerLogin = require("./loginRoute");
const routerApi = require("./apiRoute");
const routerDashboard = require("./dashboardRoute");

module.exports = (app) => {
    app.use(routerLogin);
    app.use("/api", routerApi);
    app.use(routerDashboard);
    // adicione outros routers aqui conforme forem criados
};
