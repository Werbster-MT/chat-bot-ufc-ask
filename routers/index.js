const routerLogin = require("./loginRoute");
const routerDashboard = require("./dashboardRoute");
const componentesRoutes = require('./componentsRoute');
const studentsRoutes = require('./studentsRoute');
const usersRoutes = require('./usersRoute');


module.exports = (app) => {
    app.use(routerLogin);
    app.use(routerDashboard);
    app.use('/components', componentesRoutes);
    app.use(studentsRoutes);
    app.use(usersRoutes);
    // adicione outros routers aqui conforme forem criados
};
