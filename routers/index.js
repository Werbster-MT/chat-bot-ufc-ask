const routerLogin = require("./loginRoute");
const routerApi = require("./apiRoute");

module.exports = (app) => {
    app.use(routerLogin);
    app.use("/api", routerApi);
}