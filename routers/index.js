const routerLogin = require("./loginRoute");
module.exports = (app) => {
    app.use(routerLogin);
}