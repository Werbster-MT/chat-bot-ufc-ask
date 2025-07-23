// middleware/checkRole.js
module.exports = function(requiredRole) {
  return (req, res, next) => {
    const userRole = req.session.user?.role;
    if (userRole == requiredRole) {
      return next();
    }
    res.status(403).send("Acesso negado");
  };
};
