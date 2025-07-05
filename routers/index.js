const routerLogin = require("./loginRoute");
const routerApi = require("./apiRoute");
const routerDashboard = require("./dashboardRoute");
const componentesRoutes = require('./componentsRoute');


module.exports = (app) => {
    app.use(routerLogin);
    app.use("/api", routerApi);
    app.use(routerDashboard);
    app.use('/components', componentesRoutes);
    // adicione outros routers aqui conforme forem criados
};
