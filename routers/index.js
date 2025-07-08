const routerLogin = require("./loginRoute");
const routerDashboard = require("./dashboardRoute");
const componentesRoutes = require('./componentsRoute');
const studentsRoutes = require('./studentsRoute');


module.exports = (app) => {
    app.use(routerLogin);
    app.use(routerDashboard);
    app.use('/components', componentesRoutes);
    app.use(studentsRoutes);
    // adicione outros routers aqui conforme forem criados
};
