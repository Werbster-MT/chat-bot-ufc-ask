require("dotenv").config(); // Carregar as variáveis de ambiente

const {User, userRoles} = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;
const EXPIRE = process.env.JWT_EXPIRE || "30m";
const ALG = process.env.JWT_ALG;

class LoginController {
  index(req, res) {
    res.render("login", { title: "Login", message: null, type: null });
  }

  async authenticate(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user && user == null) {
        return res.render("login", { title: 'Login', message: "Usuário ou Senha incorretos.", type: "error" });
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword && validPassword !== null) {
        return res.render("login", { title: 'Login', message: "Usuário ou Senha incorretos.", type: "error" });
      }

      // Gerar token JWT
      const token = jwt.sign(
        {
          sub: user.name,
          email: user.email,
          role: user.role,
        },
        SECRET,
        { algorithm: ALG, expiresIn: EXPIRE, noTimestamp: true }
      );

      // Salvar na sessão
      req.session.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
      req.session.token = token;

      console.log("Token JWT:", req.session.token);

      // Redirect to each HomePage according to the user
      req.session.chatResponse = null;
      let homePage = user.role == userRoles.ESTUDANTE ? "/studentHomePage" : "/dashboard";
      res.redirect(homePage);

    } catch (error) {
      console.error("Erro na autenticação:", error);
      res.render("login", {
        title: "Login",
        message: "Erro interno ao tentar autenticar. Tente novamente.",
        type: "error"
      });
    }
  }

  forgotPassword(req, res) {
    res.render("forgot_password", { title: "Esqueci Minha Senha", message: null, type: null });
  }

  async updatePassword(req, res) {
    const { code, password01, password02 } = req.body;
    const { email, code: storedCode } = req.session.userAccess || {};

    const endpoint = "/update-password";
    const title = "Redefinir Senha";

    try {
      // 1. Verificação de Código
      if (!email || code !== storedCode) {
        
        return res.render("access_form", {
          endpoint: endpoint,
          title: title,
          message: "Código inválido ou expirado.",
          type: "error"
        });
      }

      // 2. Verificação de senhas
      if (password01 !== password02) {
        return res.render("access_form", {
          endpoint: endpoint,
          title: title,
          message: "Senhas não coincidem.",
          type: "error",
        });
      }

      // 2. Verificação de Usuário 
      const user = await User.findOne({ where: { email } });
      if (!user) {
        
        return res.render("access_form", {
          endpoint: endpoint,
          title: title,
          message: "Usuário não encontrado.",
          type: "error",
        });
      }

      // 3. Gera o hash da nova senha
      const hashedPassword = await bcrypt.hash(password01, 10);

      // 4. Atualiza a senha no banco de dados
      await User.update({ password: hashedPassword }, { where: { email } });
      delete req.session.userAccess;

      // 5. Redireciona com sucesso
      return res.render("login", {
        title: "Login",
        message: "Senha atualizada com sucesso!",
        type: "success"
      });
    } catch (err) {
      console.error("Erro ao atualizar a senha:", err);
      return res.render("access_form", {
        endpoint: endpoint,
        title: title,
        message: "Erro interno ao atualizar a senha. Tente novamente.",
        type: "error"
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
