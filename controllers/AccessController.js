require("dotenv").config(); // Carregar as variáveis de ambiente

const { User } = require("../models/UserModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto"); // para gerar o código

class AccessController {
  index(req, res) {
    const type = req.query.type || ""; // Pega o tipo da query string, ou um valor vazio
    res.render("manage_access", { error: null, type: type });
  }

  async sendCode(req, res) {
    try {
      const { email , type } = req.body;

      // Verificar se o email já existe no banco de dados
      const user = await User.findOne({ where: { email } });

      // Se o usuário for encontrado e for "primeiro acesso", redireciona para o login
      if (user && type == "access") {
        return res.render("login", {
          error: "Este email já está cadastrado. Faça login.",
        });
      }

      // Se for "esqueci minha senha" ou "primeiro acesso" (para um novo usuário), gera o código
      const code = this.generateCode();
      req.session.userAccess = { email, code, type };

      // Enviar o código por email
      await this.sendEmail(email, code);

      // Renderiza a página de código enviado
      return res.render("code_access", { error: null });
    } catch (error) {
      console.error("Erro no envio do código:", error);
      res.render("manage_access", { error: "Erro ao tentar enviar o código." });
    }
  }

  generateCode() {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const code = array[0] % 100000000;
    return code.toString().padStart(8, "0"); // Código de 8 dígitos
  }

  sendEmail(userEmail, userCode) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: userEmail,
      subject: "Código de Primeiro Acesso",
      text: `Seu código de primeiro acesso é: ${userCode}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Erro ao enviar o email:", error);
      } else {
        console.log("Email enviado:", info.response);
      }
    });
  }

  signIn(req, res) {
    const { email, code: storedCode, type } = req.session.userAccess || {};
    const endpoint = type == 'password' ? '/update-password' : '/save-user';
    const title = type == 'password' ? 'Redefinir Senha' : 'Cadastrar Conta';
    res.render("access_form", { error: null, endpoint: endpoint , title: title});
  }

  saveUser(req, res) {
    const { code, password01, password02 } = req.body;
    const { email, code: storedCode, type } = req.session.userAccess || {};
    const endpoint = type == 'password' ? '/update-password' : '/save-user';
    const title = type == 'password' ? 'Redefinir Senha' : 'Cadastrar Conta';

    if (!email || code !== storedCode) {
      return res.render("access_form", { error: "Código inválido ou expirado.",  endpoint: endpoint, title: title });
    }

    if (password01 !== password02) {
      return res.render("access_form", { error: "Senhas não coincidem.",  endpoint: endpoint, title: title });
    }

    // Criptografar a senha e salvar o usuário
    const hashedPassword = bcrypt.hashSync(password01, 10);
    User.create({
      email,
      password: hashedPassword,
      name: email.split("@")[0],
    }).then(() => {
      delete req.session.userAccess;
      return res.render("login", { error: "Conta criada com sucesso. Faça o login."}); // Redireciona para a página de login
    });
  }

  logout(req, res) {
    req.session.destroy(() => {
      res.redirect("/");
    });
  }
}

module.exports = new AccessController();
