require("dotenv").config(); // Carregar as variáveis de ambiente

const {User, userRoles} = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { response } = require("express");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;
const EXPIRE = process.env.JWT_EXPIRE || "30m";
const ALG = process.env.JWT_ALG || "HS256";

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
      res.status(500).render("login", {
        error: "Erro interno ao tentar autenticar. Tente novamente.",
      });
    }
  }

  forgotPassword(req, res) {
    res.render("forgot_password", { error: null });
  }

  async updatePassword(req, res) {
    const { code, password01, password02 } = req.body;
    const { email, code: storedCode } = req.session.userAccess || {};

    const endpoint = "/update-password";
    const title = "Redefinir Senha";

    try {
      // 1. Verificação de senhas
      if (!email || code !== storedCode) {
        return res.render("access_form", {
          error: "Código inválido ou expirado.",
          endpoint: endpoint,
          title: title,
        });
      }

      if (password01 !== password02) {
        return res.render("access_form", {
          error: "Senhas não coincidem.",
          endpoint: endpoint,
          title: title,
        });
      }

      // 2. Verifica se o usuário existe
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.render("access_form", {
          error: "Usuário não encontrado.",
          endpoint: endpoint,
          title: title,
        });
      }

      // 3. Gera o hash da nova senha
      const hashedPassword = await bcrypt.hash(password01, 10);

      // 4. Atualiza a senha no banco de dados
      await User.update({ password: hashedPassword }, { where: { email } });
      delete req.session.userAccess;

      // 5. Redireciona com sucesso
      return res.render("login", {
        error: "Senha atualizada com sucesso. Faça o login.",
      });
    } catch (err) {
      console.error("Erro ao atualizar a senha:", err);
      return res.render("access_form", {
        error: "Erro interno. Tente novamente.",
        endpoint: endpoint,
        title: title,
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
