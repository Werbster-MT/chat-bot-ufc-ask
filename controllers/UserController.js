const { User } = require("../models/UserModel");

class UserController {
  index(req, res) {
    const user = req.session.user;
    const chatResponse = req.session.chatResponse || null;
    const chats = req.session.chats || []; // Pega o histórico de chats da sessão
    res.render("user_perfil", {
      message: null,
      type: null,
      title: "Meu Perfil",
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      response: chatResponse,
      chats: chats,
    });
  }

  async renameUser(req, res) {
    try {
      const { newUserName } = req.body;
      const email = req.session.user.email;
      const user = req.session.user;
      const chatResponse = req.session.chatResponse || null;
      const chats = req.session.chats || []; // Pega o histórico de chats da sessão

      // Validação do novo nome de usuário
      const userDB = await User.findOne({ where: { email } });

      if (!newUserName || !userDB) {
        return res.render("user_perfil", {
          message: "Nome de usuário inválido.",
          type: "error",
          title: "Perfil",
          userName: req.session.user.name,
          userRole: req.session.user.role,
          userEmail: email,
          user: user,
          chatResponse: chatResponse,
          chats: chats
        });
      }

      // Atualiza o nome do usuário na sessão
      req.session.user.name = newUserName;
      
      // Atualiza o novo nome no banco
      await User.update({ name: newUserName }, { where: { email } });

      return res.render("user_perfil", {
        message: "Nome de usuário atualizado com sucesso.",
        type: "success",
        title: "Perfil",
        userName: newUserName,
        userEmail: req.session.user.email,
        userRole: req.session.user.role,
        user: user,
        chatResponse: chatResponse,
        chats: chats
      });
    } catch (error) {
      const user = req.session.user;
      const chatResponse = req.session.chatResponse || null;
      const chats = req.session.chats || [];
      console.error("Erro ao renomear usuário:", error);
      return res.render("user_perfil", {
        message: "Erro ao renomear usuário. Tente novamente.",
        type: "error",
        title: "Perfil",
        userName: req.session.user.name,
        userEmail: req.session.user.email,
        userRole: req.session.user.role,
        user: user,
        chatResponse: chatResponse,
        chats: chats
      });
    }
  }

  async deleteUser(req, res) {
    try {
      // Aqui, pode-se excluir o usuário da sessão ou fazer uma lógica para excluir do banco de dados
      const email = req.session.user.email;

      // Validação do novo nome de usuário
      const userDB = await User.findOne({ where: { email } });
      if (!userDB) {
        throw new Error('Usuário não encontrado no banco!');;
      }

      userDB.destroy();

      req.session.destroy((err) => {
        if (err) {
         throw new Error('Erro ao deletar a session!')
        }

        // Redireciona para a página inicial após a exclusão
        return res.redirect("/");
      });
    } catch (error) {
      const user = req.session.user;
      const chatResponse = req.session.chatResponse || null;
      const chats = req.session.chats || [];
      console.error("Erro ao excluir usuário:", error);
      return res.render("user_perfil", {
        message: "Erro ao excluir usuário. Tente novamente.",
        type: "error",
        title: "Perfil",
        userName: req.session.user.name,
        userEmail: req.session.user.email,
        userRole: req.session.user.role,
        user: user,
        chatResponse: chatResponse,
        chats: chats
      });
    }
  }
}

module.exports = new UserController();
