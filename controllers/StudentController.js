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
      const user = req.session.user;

      if (!userQuery) {
        return res.render("student_home", {
          message: "A pergunta não pode estar vazia.",
          type: "error",
          title: "Home Estudante",
          userName: user.name,
          userEmail: user.email,
          userRole: user.role,
          chats: req.session.chats || [],
        });
      }

      const chatId = new StudentHomeController().generateChatId();
      const chatName = new StudentHomeController().getChatName(userQuery);

      // Cria o chat com um placeholder para a resposta da IA
      const newChat = {
        id: chatId,
        name: chatName,
        history: [
          {
            question: userQuery,
            answer: "...", // Placeholder inicial
          },
        ],
        needsInitialAnswer: true, // Flag para buscar a resposta inicial
      };

      if (!req.session.chats) {
        req.session.chats = [];
      }
      req.session.chats.push(newChat);

      // Redireciona para a página de chat
      res.redirect(`/chat/${chatId}`);
    } catch (error) {
      const user = req.session.user;
      console.error("Erro ao criar o chat:", error);
      res.render("student_home", {
        message: "Erro interno. Tente novamente.",
        type: "error",
        title: "Home Estudante",
        userName: user.name,
        userEmail: user.email,
        userRole: user.role,
        response: null,
        chats: req.session.chats || [],
      });
    }
  }

  async ask(req, res) {
    try {
      const { userQuery, chat_id } = req.body;
      const token = req.session.token;

      if (!userQuery || !token || !chat_id) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Pergunta, token ou chat_id ausente.",
        });
      }

      const method = "POST";
      const endpoint = "/ask";
      const body = { question: userQuery };
      const response = await ApiService.consumirApi(method, endpoint, body, token);

      if (!response || response.sucesso === false) {
        throw new Error("Erro ao obter resposta da API");
      }

      const chat = req.session.chats.find((c) => c.id === chat_id);
      if (!chat) {
        throw new Error("Chat não encontrado");
      }

      const { marked } = await import('marked');
      const formattedAnswer = marked(response.answer || "Resposta não encontrada");

      if (chat.needsInitialAnswer) {
        // Se for a primeira pergunta, atualiza a resposta
        chat.history[0].answer = formattedAnswer;
        chat.needsInitialAnswer = false; // Remove a flag
      } else {
        // Para perguntas subsequentes, adiciona ao histórico
        chat.history.push({
          question: userQuery,
          answer: formattedAnswer,
        });
      }

      req.session.save(); // Garante que a sessão seja salva

      return res.json({
        sucesso: true,
        question: userQuery,
        answer: formattedAnswer,
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