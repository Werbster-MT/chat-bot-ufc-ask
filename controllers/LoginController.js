const User = require("../models/LoginModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "segredo_super_secreto";

class LoginController {
  index(req, res) {
    res.render("login", { error: null });
  }

  async authenticate(req, res) {
    try {
       const { email, password } = req.body;
       const user = await User.findOne({ where: { email } });

        if (!user && user !== null) {
          return res.render("login", { error: "Usuário não encontrado." });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword && validPassword !== null) {
          return res.render("login", { error: "Senha incorreta." });
        }

        // Gerar token JWT
        const token = jwt.sign(
          {
            sub: user.id,
            email: user.email,
            role: user.role
          },
          SECRET,
          { expiresIn: "1h" }
        );

        // Salvar na sessão
        req.session.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        };
        req.session.token = token;

      console.log("Login efetuado:", req.session.user);
      console.log("Token JWT:", req.session.token);

      res.redirect("/dashboard");
    } catch(error) {
    console.error("Erro na autenticação:", error);
    res.status(500).render("login", {
      error: "Erro interno ao tentar autenticar. Tente novamente."
    });
  }
}

  logout(req, res) {
    req.session.destroy(() => {
      res.redirect("/");
    });
  }
}

module.exports = new LoginController();
