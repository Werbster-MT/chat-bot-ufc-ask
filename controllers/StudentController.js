const ApiService = require("../services/ApiService");


class StudentHomeController {
  index(req, res) {
    const user = req.session.user;
    const chatResponse = req.session.chatResponse || null;
    const chats = req.session.chats || []; // Pega o histórico de chats da sessão
    res.render("student_home", {
      message: null,
      type: null,
      title: "Home Estudante",
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      response: chatResponse,
      chats: chats,
    });
  }

  // Usando arrow function para garantir o contexto correto de 'this'
  getChatName = (userQuestion) => {
    if (!userQuestion) {
      return ""; // Caso não haja pergunta, retornar string vazia
    }

    let chatName = "";
    let limit = userQuestion.length >= 20 ? 17 : userQuestion.length;

    for (let i = 0; i < limit; i++) {
      chatName += userQuestion[i];
    }

    if (limit == 17) {
      chatName += "...";
    }

    return chatName;
  };

  // Função para gerar um ID único para cada chat
  generateChatId() {
    return `${new Date().getTime()}${Math.floor(Math.random() * 1000)}`;
  }

  async createChat(req, res) {
    try {
      const { userQuery } = req.body;
      const token = req.session.token;
      const user = req.session.user;

      if (!userQuery || !token) {
        return res.render("student_home", {
          message: "Pergunta ou token ausente.",
          type: "error",
          title: "Home Estudante",
          userName: user.name,
          userEmail: user.email,
          userRole: user.role,
          chatName: null,
          chats: req.session.chats || [],
        });
      }

      // Send the question to API
      const method = "POST";
      const endpoint = "/ask";
      const body = {
        question: userQuery,
      };
      const response = await ApiService.consumirApi(
        method,
        endpoint,
        body,
        token
      );

      // Verificar se a resposta é válida
      if (!response || response.sucesso === false) {
        throw new Error("Erro ao obter resposta da API");
      }

      // Gera um ID único para o novo chat
      const chatId = new StudentHomeController().generateChatId();
      const chatName = new StudentHomeController().getChatName(userQuery);

      // Armazena o novo chat na sessão
      const { marked } = await import('marked');
      response.answer = marked(response.answer);
      const newChat = {
        id: chatId,
        name: chatName,
        history: [
          {
            question: userQuery,
            answer: response.answer || "Resposta não encontrada",
          },
        ],
      };

      req.session.chats = req.session.chats || [];
      req.session.chats.push(newChat); // Adiciona o novo chat ao histórico

      // Return the response
      res.render("chat_box", {
        message: null,
        type: null,
        response: response,
        title: "Home Estudante - Chatbox",
        userName: user.name,
        userEmail: user.email,
        userRole: user.role,
        chat: newChat,
        chats: req.session.chats,
      });
    } catch (error) {
      const user = req.session.user;
      console.error("Erro ao enviar a pergunta:", error);
      res.render("student_home", {
        message: "Erro interno. Tente novamente.",
        type: "error",
        title: "Home Estudante",
        userName: user.name,
        userEmail: user.email,
        userRole: user.role,
        response: null,
        chatName: null,
        chats: req.session.chats,
      });
    }
  }

  async ask(req, res) {
    try {
      const { userQuery, chat_id } = req.body;
      const token = req.session.token;

      // Verifica se a pergunta ou token estão ausentes
      if (!userQuery || !token || !chat_id) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Pergunta, token ou chat_id ausente.",
        });
      }

      // Enviar a pergunta para a API
      const method = "POST";
      const endpoint = "/ask";
      const body = { question: userQuery };
      const response = await ApiService.consumirApi(
        method,
        endpoint,
        body,
        token
      );

      // Verificar se a resposta é válida
      if (!response || response.sucesso === false) {
        throw new Error("Erro ao obter resposta da API");
      }

      // Buscar o chat armazenado na sessão pelo id
      const chat = req.session.chats.find((c) => c.id === chat_id);
      if (!chat) {
        throw new Error("Chat não encontrado");
      }

      // Adicionar a pergunta e resposta ao histórico do chat
      const { marked } = await import('marked');
      response.answer = marked(response.answer);
      chat.history.push({
        question: userQuery,
        answer: response.answer || "Resposta não encontrada",
      });

      // Atualiza a sessão com o chat modificado
      req.session.chats = req.session.chats;

      // Envia o JSON com a resposta para o frontend (sem renderizar página)
      return res.json({
        sucesso: true,
        question: userQuery,
        answer: response.answer || "Resposta não encontrada",
        chatId: chat.id,
      });
    } catch (error) {
      console.error("Erro ao enviar a pergunta:", error);
      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro interno ao processar a pergunta.",
      });
    }
  }

  getChat(req, res) {
    try {
      const { id } = req.params;
      const user = req.session.user;
      const chats = req.session.chats || [];

      const chat = chats.find((chat) => chat.id === id);

      if (!chat) {
        return res.status(404).render("student_home", {
          message: "Chat não encontrado.",
          type: "error",
          title: "Home Estudante",
          userName: user.name,
          userEmail: user.email,
          userRole: user.role,
          chats,
        });
      }

      res.render("chat_box", {
        message: null,
        type: null,
        title: "Home Estudante - Chatbox",
        userName: user.name,
        userEmail: user.email,
        userRole: user.role,
        chat: chat,
        chats,
      });
    } catch (error) {
      const user = req.session.user;
      console.error("Erro ao carregar o chat:", error);
      res.render("student_home", {
        message: "Erro interno ao carregar o chat.",
        type: "error",
        title: "Home Estudante",
        userName: user.name,
        userEmail: user.email,
        userRole: user.role,
        response: null,
        chatName: null,
        chats: req.session.chats || [],
      });
    }
  }

  deleteChats(req, res) {
    try {
      const user = req.session.user;

      // Limpa os chats da sessão
      req.session.chats = [];

      // Renderiza a página student_home sem erros e com os dados atualizados
      return res.render("student_home", {
        message: "Conversas apagadas com sucesso.",
        type: "success",
        title: "Home Estudante",
        userName: user.name,
        userEmail: user.email,
        userRole: user.role,
        response: null,
        chatName: null,
        chats: [],
      });
    } catch (error) {
      const user = req.session.user;
      console.error("Erro ao apagar conversas:", error);

      return res.render("student_home", {
        message: "Erro ao apagar conversas.",
        type: "error",
        title: "Home Estudante",
        userName: user.name,
        userEmail: user.email,
        userRole: user.role,
        response: null,
        chatName: null,
        chats: req.session.chats || [],
      });
    }
  }
}

module.exports = new StudentHomeController();
