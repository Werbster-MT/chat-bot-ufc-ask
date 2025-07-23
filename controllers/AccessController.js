require("dotenv").config(); // Carregar as variáveis de ambiente

const { User } = require("../models/UserModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto"); // para gerar o código

class AccessController {
  index(req, res) {
    const action_type = req.query.action_type || ""; // Pega o tipo da query string, ou um valor vazio
    res.render("manage_access", { title: "Primeiro Acesso", message: null, type: null, action_type: action_type });
  }

  async sendCode(req, res) {
    try {
      const { email , action_type } = req.body;
      console.log(email);
      console.log(action_type);
      // Verificar se o email já existe no banco de dados
      const user = await User.findOne({ where: { email } });

      // Se o usuário for encontrado e for "primeiro acesso", redireciona para o login
      if (user && action_type == "access") {
        return res.render("login", {
          title: "Login",
          message: "Este email já está cadastrado. Faça login.",
          type: "error",
        });
      }

      // Se for "esqueci minha senha" ou "primeiro acesso" (para um novo usuário), gera o código
      const code = this.generateCode();
      req.session.userAccess = { email, code, action_type };

      // Enviar o código por email
      await this.sendEmail(email, code);

      // Renderiza a página de código enviado
      return res.render("code_access", { title: "Código de Acesso", message: null, type: null });
    } catch (error) {
      console.error("Erro no envio do código:", error);
      res.render("manage_access", { message: "Erro ao tentar enviar o código.", type: "error" , action_type: action_type});
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
    const { action_type } = req.session.userAccess || {};
    console.log(req.session.userAccess);
    console.log(action_type);
    const endpoint = action_type == 'password' ? '/update-password' : '/save-user';
    const title = action_type == 'password' ? 'Redefinir Senha' : 'Cadastrar Conta';
    res.render("access_form", { message: null, type: null, endpoint: endpoint , title: title});
  }

  saveUser(req, res) {
    const { code, password01, password02 } = req.body;
    const { email, code: storedCode, action_type } = req.session.userAccess || {};
    const endpoint = action_type == 'password' ? '/update-password' : '/save-user';
    const title = action_type == 'password' ? 'Redefinir Senha' : 'Cadastrar Conta';

    if (!email || code !== storedCode) {
      return res.render("access_form", { message: "Código inválido ou expirado.", type: "error", endpoint: endpoint, title: title });
    }

    if (password01 !== password02) {
      return res.render("access_form", { message: "Senhas não coincidem.", type: "error", endpoint: endpoint, title: title });
    }

    // Criptografar a senha e salvar o usuário
    const hashedPassword = bcrypt.hashSync(password01, 10);
    User.create({
      email,
      password: hashedPassword,
      name: email.split("@")[0],
    }).then(() => {
      delete req.session.userAccess;
      return res.render("login", { title: "Login", message: "Conta criada com sucesso. Faça o login.", type: "success"}); // Redireciona para a página de login
    });
  }

  logout(req, res) {
    req.session.destroy(() => {
      res.redirect("/");
    });
  }
}

module.exports = new AccessController();
